from pydantic import BaseModel
from typing import List, Tuple


class ChatResponse(BaseModel):
    question: str
    answer: str
    sources: List[Tuple[str, str]]
