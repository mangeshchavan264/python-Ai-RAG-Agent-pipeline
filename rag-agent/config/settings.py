from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_MODEL = "gemini-embedding-2"
EMBEDDING_DIMENSION = 1536
LLM_MODEL = "gemini-2.5-flash"
LLM_TEMPERATURE = 0.7
LLM_MAX_TOKENS = 500
CHROMA_DB_DIR = "./chroma_db_google"
PDF_PATH = "data/Employee_Handbook_Sample.pdf"
CHUNK_SIZE = 300
CHUNK_OVERLAP = 50
TOP_K_RESULTS = 10
