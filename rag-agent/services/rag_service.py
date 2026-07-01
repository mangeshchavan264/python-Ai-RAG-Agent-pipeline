from config.dependencies import llm
from services.query_rewriter import rewrite_query
from services.retriever import retrieve_documents
from services.reranker import rerank_documents
from services.memory_service import get_messages, save_turn, print_chat
from services.citation_service import get_citation_context
from models.response import ChatResponse
from db_history import save_entry


def get_rag_response(question: str) -> ChatResponse:

    # Step 1 — rewrite the question for better retrieval
    rewritten_question = rewrite_query(question)
    # print(question)
    # print(rewritten_question)

    # Step 2 — retrieve top-k chunks from ChromaDB
    raw_results=retrieve_documents(rewritten_question)
    # print(raw_results[1].metadata)

    # Step 3 — rerank and keep the best 3
    results = rerank_documents(question, raw_results, top_n=3)

    # Step 4 — build messages with memory + context and call LLM
    context = "\n\n".join(doc.page_content for doc in results)
    # print("result: " + str(list(raw_results)))

    sources = []
    for doc in raw_results:
        if doc.metadata:
                sources.append({
                    "file": doc.metadata["source"],
                    "page": doc.metadata["page"] + 1
                })
    # print(sources)

    citation_context=get_citation_context(sources)
    print(set(citation_context))


    messages = get_messages(context, question)

    # print(messages)

    answer = llm.invoke(messages)

    # Step 5 — save this turn to conversation memory and print chat log
    save_turn(question, answer.content)
    # print_chat()

    # Step 6 — format sources
    # sources = [
    #     (f"Chunk number: {i}", f"Content: {chunk.page_content}")
    #     for i, chunk in enumerate(results, start=1)
    # ]

    # Step 7 — persist to SQLite history DB
    save_entry(question, answer.content, citation_context)

    return ChatResponse(
        question=question,
        answer=answer.content,
        sources=set(citation_context),
    )
