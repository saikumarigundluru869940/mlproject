import os

from dotenv import load_dotenv
from pypdf import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

CHUNK_SIZE = 800
OVERLAP = 150


def extract_chunks(path):
    """Return a list of (page_number, text) chunks."""
    chunks = []
    reader = PdfReader(str(path))
    for page_no, page in enumerate(reader.pages, start=1):
        text = " ".join((page.extract_text() or "").split())
        start = 0
        while start < len(text):
            piece = text[start:start + CHUNK_SIZE].strip()
            if len(piece) > 30:
                chunks.append((page_no, piece))
            start += CHUNK_SIZE - OVERLAP
    return chunks


def retrieve(chunks, question, k=4):
    texts = [t for _, t in chunks]
    try:
        matrix = TfidfVectorizer(stop_words="english").fit_transform(texts + [question])
    except ValueError:
        return chunks[:k]
    scores = cosine_similarity(matrix[-1], matrix[:-1]).ravel()
    best = scores.argsort()[::-1][:k]
    return [chunks[i] for i in best if scores[i] > 0]


def generate_answer(question, passages):
    if not passages:
        return "I couldn't find anything about that in this document."

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if api_key:
        try:
            import anthropic

            context = "\n\n".join(f"[Page {p}] {t}" for p, t in passages)
            client = anthropic.Anthropic(api_key=api_key)
            msg = client.messages.create(
                model="claude-sonnet-5-5",
                max_tokens=800,
                system=(
                    "Answer the question using only the document excerpts provided. "
                    "Mention page numbers like (page 3). If the answer is not in the "
                    "excerpts, say you could not find it in the document."
                ),
                messages=[{
                    "role": "user",
                    "content": f"Excerpts:\n{context}\n\nQuestion: {question}",
                }],
            )
            return msg.content[0].text
        except Exception:
            pass  # fall through to the simple answer below

    best_page, best_text = passages[0]
    return f"Most relevant part of the document (page {best_page}):\n\n{best_text}"