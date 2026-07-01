def get_citation_context(sources):
    unique_sources = []
    seen = set()
    for src in sources:
        # print(src)
        key = (src["file"], src["page"])

        if key not in seen:
            seen.add(key)
            unique_sources.append(src)

    return unique_sources