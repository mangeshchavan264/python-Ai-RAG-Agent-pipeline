from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router
from db_history import init_db, get_all_entries
from services.memory_service import clear_history

app = FastAPI(title="RAG Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


@app.get("/")
def get_root():
    return {"message": "AI is running..."}


@app.get("/history")
def history():
    return get_all_entries()


@app.post("/history/clear")
def clear_chat_memory():
    clear_history()
    return {"message": "Conversation memory cleared."}


app.include_router(router)

