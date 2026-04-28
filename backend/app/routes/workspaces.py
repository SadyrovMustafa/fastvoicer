from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_workspace
from app.models.db_models import Workspace
from app.models.schemas import WorkspaceResponse
from app.services.workspace_service import WorkspaceService

router = APIRouter(prefix="/workspaces", tags=["workspaces"])
workspace_service = WorkspaceService()


@router.get("/current", response_model=WorkspaceResponse)
async def get_current_workspace_info(
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
) -> WorkspaceResponse:
    members = workspace_service.list_members(db, workspace.id)
    return WorkspaceResponse(
        id=workspace.id,
        name=workspace.name,
        plan=workspace.plan,
        seat_count=workspace.seat_count,
        members=members,
    )
