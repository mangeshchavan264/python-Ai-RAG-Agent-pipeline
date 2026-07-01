def build_prompt(context: str, question: str) -> str:
    return f"""You are an HR assistant.

Answer ONLY using the context below.

Context:
{context}

Question:
{question}
"""
