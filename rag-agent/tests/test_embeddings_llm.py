import traceback
from config.dependencies import embeddings, llm


def main():
    print("--- Embeddings test ---")
    try:
        vec = embeddings.embed_query("What is LangChain?")
        try:
            length = len(vec)
        except Exception:
            length = type(vec)
        print("Embedding result type/length:", length)
    except Exception as e:
        print("Embeddings call failed:")
        traceback.print_exc()

    print("\n--- LLM test ---")
    try:
        # Try a simple prompt; adaptor may accept a string or messages list
        resp = llm.invoke("Say hello from test")
        content = getattr(resp, "content", resp)
        print("LLM response:", content)
    except Exception as e:
        print("LLM call failed:")
        traceback.print_exc()


if __name__ == "__main__":
    main()
