from pydantic import BaseModel

class InterviewRequest(BaseModel):
    chat_id: str
    question: str