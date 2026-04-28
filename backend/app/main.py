import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db import Base, engine
from app.models import db_models  # noqa: F401
from app.routes.api_keys import router as api_keys_router
from app.routes.auth import router as auth_router
from app.routes.billing import router as billing_router
from app.routes.generate import router as generate_router
from app.routes.history import router as history_router
from app.routes.jobs import router as jobs_router
from app.routes.memberships import router as memberships_router
from app.routes.public_api import router as public_api_router
from app.routes.referrals import router as referrals_router
from app.routes.workspaces import router as workspaces_router

app = FastAPI(title="VocalFlow API", version="0.1.0")
media_dir = Path("media")
media_dir.mkdir(exist_ok=True)
Base.metadata.create_all(bind=engine)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate_router)
app.include_router(jobs_router)
app.include_router(history_router)
app.include_router(auth_router)
app.include_router(billing_router)
app.include_router(referrals_router)
app.include_router(workspaces_router)
app.include_router(memberships_router)
app.include_router(api_keys_router)
app.include_router(public_api_router)
app.mount("/media", StaticFiles(directory=str(media_dir)), name="media")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
