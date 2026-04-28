from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user, get_current_workspace, job_service, tts_service
from app.models.db_models import User, Workspace
from app.models.schemas import GenerateRequest, GenerateResponse
from fastapi import Depends

router = APIRouter(prefix="/generate", tags=["generate"])


@router.post("", response_model=GenerateResponse)
async def generate_audio(
    payload: GenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
) -> GenerateResponse:
    if len(payload.text) > 1000:
        raise HTTPException(status_code=400, detail="Text must be 1000 characters or fewer.")
    if payload.speed < 0.5 or payload.speed > 1.5:
        raise HTTPException(status_code=400, detail="Speed must be between 0.5 and 1.5.")

    job = job_service.create_job(
        db=db,
        workspace_id=workspace.id,
        user_id=current_user.id,
        text=payload.text,
        voice=payload.voice,
        speed=payload.speed,
    )
    tts_service.enqueue_mock_generation(job_id=job["job_id"])
    return GenerateResponse(job_id=job["job_id"], status=job["status"])
