from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_workspace, job_service
from app.models.db_models import Workspace
from app.models.schemas import JobResponse

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: str,
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
) -> JobResponse:
    job = job_service.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    if job.get("workspace_id") != workspace.id:
        raise HTTPException(status_code=403, detail="Access denied for this job.")
    if isinstance(job.get("speed"), str):
        speed_map = {"slow": 0.8, "normal": 1.0, "fast": 1.2}
        job = {**job, "speed": speed_map.get(job["speed"], 1.0)}
    return JobResponse(**job)
