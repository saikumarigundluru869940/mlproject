from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models  # noqa: F401  (registers the tables)
from database import Base, engine
from routes_auth import router as auth_router
from routes_docs import router as docs_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PDF Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(docs_router)