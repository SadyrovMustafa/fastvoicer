from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_workspace, job_service
from app.models.db_models import Workspace
from app.models.schemas import HistoryResponse, JobResponse

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=HistoryResponse)
async def get_history(
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
) -> HistoryResponse:
    jobs = job_service.list_jobs(db, workspace.id)
    normalized_jobs = []
    speed_map = {"slow": 0.8, "normal": 1.0, "fast": 1.2}
    for job in jobs:
        if isinstance(job.get("speed"), str):
            normalized_jobs.append({**job, "speed": speed_map.get(job["speed"], 1.0)})
        else:
            normalized_jobs.append(job)
    items = [JobResponse(**job) for job in normalized_jobs]
    total_characters = job_service.total_characters(db, workspace.id)
    return HistoryResponse(items=items, total_characters=total_characters)
