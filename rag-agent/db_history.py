"""
Simple SQLite-based history store for chat Q&A entries.
"""
import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "history.db")


def _get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with _get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                question  TEXT    NOT NULL,
                answer    TEXT    NOT NULL,
                sources   TEXT    NOT NULL,
                created_at TEXT   NOT NULL
            )
        """)
        conn.commit()


def save_entry(question: str, answer: str, sources: list) -> int:
    with _get_conn() as conn:
        cur = conn.execute(
            "INSERT INTO chat_history (question, answer, sources, created_at) VALUES (?,?,?,?)",
            (question, answer, sources, datetime.utcnow().isoformat(timespec="seconds")),
        )
        conn.commit()
        return cur.lastrowid


def get_all_entries() -> list:
    with _get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM chat_history ORDER BY id DESC"
        ).fetchall()
    result = []
    for row in rows:
        result.append({
            "id": row["id"],
            "question": row["question"],
            "answer": row["answer"],
            "sources": json.loads(row["sources"]),
            "created_at": row["created_at"],
        })
    return result
