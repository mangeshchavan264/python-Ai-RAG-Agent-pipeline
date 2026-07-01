from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

from config.settings import (
    CHROMA_DB_DIR,
    EMBEDDING_MODEL,
    EMBEDDING_DIMENSION,
    GOOGLE_API_KEY,
    LLM_MODEL,
    LLM_TEMPERATURE,
    LLM_MAX_TOKENS,
    TOP_K_RESULTS,
)

load_dotenv()

# Embeddings must match ingest.py exactly, or similarity search is meaningless
# (different embedding spaces). ingest.py uses Google embeddings, so this does too.
embeddings = GoogleGenerativeAIEmbeddings(
    model=EMBEDDING_MODEL,
    google_api_key=GOOGLE_API_KEY,
    output_dimensionality=EMBEDDING_DIMENSION,
)

db = Chroma(
    persist_directory=CHROMA_DB_DIR,
    embedding_function=embeddings,
)

llm = ChatGoogleGenerativeAI(
    model=LLM_MODEL,
    google_api_key=GOOGLE_API_KEY,
    temperature=LLM_TEMPERATURE,
    max_output_tokens=LLM_MAX_TOKENS,
)


class InterviewRequest(BaseModel):
    question: str


class Interview:

    def get_response(self, question: str) -> dict:
        results = db.similarity_search(question, k=TOP_K_RESULTS)

        context = "\n\n".join(doc.page_content for doc in results)

        prompt = f"""
        You are an HR assistant.

        Answer ONLY using the context below.

        Context:
        {context}

        Question:
        {question}
        """

        answer = llm.invoke(prompt)

        sources = [
            {
                "file": doc.metadata.get("source"),
                "page": doc.metadata.get("page"),
            }
            for doc in results
        ]

        return {
            "question": question,
            "answer": answer.content,
            "sources": sources,
        }
