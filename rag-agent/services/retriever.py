from config.dependencies import db
from config.settings import TOP_K_RESULTS


def retrieve_documents(query: str, k: int = TOP_K_RESULTS) -> list:
    """
    Perform similarity search against ChromaDB and return
    the top-k most relevant document chunks.
    """
    results = db.similarity_search(query, k=k)
    # print(results[1].metadata)
    return results
