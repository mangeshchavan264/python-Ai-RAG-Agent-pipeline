import json

from fastapi import APIRouter
from pydantic import BaseModel

from query import Interview
from db_history import save_entry
from services.memory_service import add_turn

router = APIRouter()
interview = Interview()


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
def chat(request: ChatRequest):
    result = interview.get_response(request.question)

    save_entry(
        question=result["question"],
        answer=result["answer"],
        sources=json.dumps(result["sources"]),
    )
    add_turn(result["question"], result["answer"])

    return result
