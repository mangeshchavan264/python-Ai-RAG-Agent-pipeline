"""
Local reranker using keyword overlap scoring.
No LLM calls — avoids burning rate limits on reranking.
Scores each chunk by how many question tokens it contains,
then returns the top_n highest-scored chunks.
"""
import re


def _tokenize(text: str) -> set:
    """Lowercase, strip punctuation, split into word tokens."""
    return set(re.findall(r'\b\w+\b', text.lower()))


def rerank_documents(question: str, documents: list, top_n: int = 3) -> list:
    """
    Score each document chunk by keyword overlap with the question
    and return the top_n most relevant chunks.
    """
    if not documents:
        return []

    question_tokens = _tokenize(question)

    scored = []
    for doc in documents:
        chunk_tokens = _tokenize(doc.page_content)
        # Jaccard-like overlap: shared tokens / question tokens
        if question_tokens:
            score = len(question_tokens & chunk_tokens) / len(question_tokens)
        else:
            score = 0.0
        scored.append((score, doc))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [doc for _, doc in scored[:top_n]]
