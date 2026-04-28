from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_workspace
from app.models.db_models import Workspace
from app.models.schemas import ApiKeyListItem, ApiKeyResponse, CreateApiKeyRequest
from app.services.api_key_service import ApiKeyService

router = APIRouter(prefix="/api-keys", tags=["api-keys"])
api_key_service = ApiKeyService()


@router.post("", response_model=ApiKeyResponse)
async def create_api_key(
    payload: CreateApiKeyRequest,
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
) -> ApiKeyResponse:
    created = api_key_service.create_key(db, workspace.id, payload.name, payload.scope)
    return ApiKeyResponse(**created)


@router.get("", response_model=list[ApiKeyListItem])
async def list_api_keys(
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
) -> list[ApiKeyListItem]:
    keys = api_key_service.list_keys(db, workspace.id)
    return [
        ApiKeyListItem(
            id=item.id,
            name=item.name,
            key_prefix=item.key_prefix,
            scope=item.scope,
            revoked=item.revoked,
            last_used_at=item.last_used_at,
            created_at=item.created_at,
        )
        for item in keys
    ]


@router.post("/{key_id}/revoke")
async def revoke_api_key(
    key_id: int,
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
) -> dict[str, str]:
    revoked = api_key_service.revoke(db, workspace.id, key_id)
    if not revoked:
        raise HTTPException(status_code=404, detail="API key not found.")
    return {"status": "revoked"}
