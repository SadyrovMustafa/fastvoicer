from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import job_service, tts_service
from app.models.schemas import GenerateRequest, GenerateResponse, HistoryResponse, JobResponse
from app.services.api_key_service import ApiKeyService

router = APIRouter(prefix="/v1", tags=["public-api"])
api_key_service = ApiKeyService()


def require_api_key(x_api_key: str | None, db: Session) -> int:
    if not x_api_key:
        raise HTTPException(status_code=401, detail="Missing API key.")
    record = api_key_service.resolve_key(db, x_api_key)
    if not record:
        raise HTTPException(status_code=401, detail="Invalid API key.")
    return record.workspace_id


@router.post("/generate", response_model=GenerateResponse)
async def public_generate(
    payload: GenerateRequest,
    x_api_key: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> GenerateResponse:
    workspace_id = require_api_key(x_api_key, db)
    job = job_service.create_job(db, workspace_id, 0, payload.text, payload.voice, payload.speed)
    tts_service.enqueue_mock_generation(job["job_id"])
    return GenerateResponse(job_id=job["job_id"], status=job["status"])


@router.get("/jobs/{job_id}", response_model=JobResponse)
async def public_job(
    job_id: str,
    x_api_key: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> JobResponse:
    workspace_id = require_api_key(x_api_key, db)
    job = job_service.get_job(db, job_id)
    if not job or job.get("workspace_id") != workspace_id:
        raise HTTPException(status_code=404, detail="Job not found.")
    return JobResponse(**job)


@router.get("/history", response_model=HistoryResponse)
async def public_history(
    x_api_key: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> HistoryResponse:
    workspace_id = require_api_key(x_api_key, db)
    jobs = job_service.list_jobs(db, workspace_id)
    total_characters = job_service.total_characters(db, workspace_id)
    return HistoryResponse(items=[JobResponse(**job) for job in jobs], total_characters=total_characters)
