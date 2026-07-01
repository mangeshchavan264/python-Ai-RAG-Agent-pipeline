import os

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
    GoogleGenerativeAIEmbeddings,
)
from langchain_chroma import Chroma

from config.settings import (
    CHROMA_DB_DIR,
    EMBEDDING_DIMENSION,
    EMBEDDING_MODEL,
    LLM_MODEL,
    LLM_MAX_TOKENS,
    LLM_TEMPERATURE,
)

embeddings = GoogleGenerativeAIEmbeddings(
    model=EMBEDDING_MODEL,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    output_dimensionality=EMBEDDING_DIMENSION,
)

db = Chroma(
    persist_directory=CHROMA_DB_DIR,
    embedding_function=embeddings,
)

llm = ChatGoogleGenerativeAI(
    model=LLM_MODEL,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=LLM_TEMPERATURE,
    max_output_tokens=LLM_MAX_TOKENS,
)