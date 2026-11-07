import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pypdf import PdfReader
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Chunk, Document, User
from rag import extract_chunks, generate_answer, retrieve
from schemas import ChatRequest

router = APIRouter(prefix="/api", tags=["documents"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
MAX_BYTES = 20 * 1024 * 1024


def get_own_doc(db: Session, doc_id: int, user: User) -> Document:
    doc = db.get(Document, doc_id)
    if not doc or doc.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.post("/upload")
def upload(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    data = file.file.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File is larger than 20 MB")
    if not data.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="This is not a valid PDF")

    path = UPLOAD_DIR / f"{uuid.uuid4().hex}.pdf"
    path.write_bytes(data)

    try:
        chunks = extract_chunks(path)
    except Exception:
        path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="Could not read this PDF")
    if not chunks:
        path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="No text found (is it a scanned PDF?)")

    doc = Document(owner_id=user.id, name=Path(file.filename).name, filename=path.name)
    db.add(doc)
    db.flush()
    db.add_all([Chunk(document_id=doc.id, page=p, text=t) for p, t in chunks])
    db.commit()
    return {"id": doc.id, "name": doc.name}


@router.get("/documents")
def list_documents(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    docs = (
        db.query(Document)
        .filter(Document.owner_id == user.id)
        .order_by(Document.id.desc())
        .all()
    )
    return [{"id": d.id, "name": d.name} for d in docs]


# NEW: returns the full extracted text, page by page
@router.get("/documents/{doc_id}/text")
def get_text(doc_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    doc = get_own_doc(db, doc_id, user)
    reader = PdfReader(str(UPLOAD_DIR / doc.filename))
    pages = [
        {"page": i, "text": (p.extract_text() or "").strip()}
        for i, p in enumerate(reader.pages, start=1)
    ]
    return {"id": doc.id, "name": doc.name, "pages": pages}


@router.get("/documents/{doc_id}/file")
def get_file(doc_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    doc = get_own_doc(db, doc_id, user)
    return FileResponse(UPLOAD_DIR / doc.filename, media_type="application/pdf")


@router.delete("/documents/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    doc = get_own_doc(db, doc_id, user)
    (UPLOAD_DIR / doc.filename).unlink(missing_ok=True)
    db.query(Chunk).filter(Chunk.document_id == doc.id).delete()
    db.delete(doc)
    db.commit()
    return {"ok": True}


@router.post("/chat")
def chat(req: ChatRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    doc = get_own_doc(db, req.document_id, user)
    rows = db.query(Chunk).filter(Chunk.document_id == doc.id).all()
    passages = retrieve([(c.page, c.text) for c in rows], req.question)
    answer = generate_answer(req.question, passages)
    return {
        "answer": answer,
        "sources": [{"page": p, "text": t[:200]} for p, t in passages],
    }