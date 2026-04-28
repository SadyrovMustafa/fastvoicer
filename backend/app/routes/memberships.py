from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_workspace
from app.models.db_models import Workspace
from app.models.schemas import InviteMemberRequest
from app.services.workspace_service import WorkspaceService

router = APIRouter(prefix="/memberships", tags=["memberships"])
workspace_service = WorkspaceService()


@router.post("/invite")
async def invite_member(
    payload: InviteMemberRequest,
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
) -> dict[str, str]:
    return workspace_service.invite_member(db, workspace, payload.email, payload.role)
