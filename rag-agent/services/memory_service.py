"""
Lightweight in-memory conversation buffer.

This is separate from db_history.py (which persists every Q&A to SQLite
permanently). This module just tracks the last few turns of *this* server
session, so /history/clear can mean something distinct from deleting
your permanent history log.
"""

MAX_TURNS = 6

_conversation: list[dict] = []


def add_turn(question: str, answer: str) -> None:
    _conversation.append({"question": question, "answer": answer})
    if len(_conversation) > MAX_TURNS:
        _conversation.pop(0)


def get_history() -> list[dict]:
    return list(_conversation)


def clear_history() -> None:
    _conversation.clear()
