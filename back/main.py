import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models  # noqa: F401
from database import Base, engine
from routes_auth import router as auth_router
from routes_docs import router as docs_router

load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PDF Chat API")

origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(docs_router)


@app.get("/")
def health():
    return {"status": "ok"}