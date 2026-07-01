from config.dependencies import llm
from langchain_core.prompts import ChatPromptTemplate

REWRITE_PROMPT = ChatPromptTemplate.from_template("""You are a search optimization assistant.

Rewrite the user's question so it is better suited for semantic search over company documents.

Rules:
- Preserve the original meaning.
- Expand abbreviations if helpful.
- Use likely document terminology.
- Return ONLY the rewritten query, nothing else.

Question:
{question}
""")


def rewrite_query(question: str) -> str:
    chain = REWRITE_PROMPT | llm
    response = chain.invoke({"question": question})
    return response.content.strip()
