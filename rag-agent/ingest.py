from dotenv import load_dotenv
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import (
    ChatGoogleGenerativeAI,
    GoogleGenerativeAIEmbeddings,
)

from config.settings import (
    EMBEDDING_DIMENSION,
    EMBEDDING_MODEL,
    CHROMA_DB_DIR,
    PDF_PATH,
    CHUNK_SIZE,
    CHUNK_OVERLAP,
    GOOGLE_API_KEY,
)

load_dotenv()

reader = PyPDFLoader(PDF_PATH)
documents = reader.load()
# print(documents[0].metadata)

splitter = RecursiveCharacterTextSplitter(
    chunk_size=CHUNK_SIZE,
    chunk_overlap=CHUNK_OVERLAP,
)

chunks  = splitter.split_documents(documents)

embeddings = GoogleGenerativeAIEmbeddings(
    model=EMBEDDING_MODEL,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    output_dimensionality=EMBEDDING_DIMENSION,
)

vector_db = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory=CHROMA_DB_DIR,
)

print("Embeddings created successfully!")
