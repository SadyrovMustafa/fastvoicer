import hashlib
import secrets
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.db_models import ApiKey


class ApiKeyService:
    def create_key(self, db: Session, workspace_id: int, name: str, scope: str) -> dict:
        raw = f"vf_{secrets.token_urlsafe(24)}"
        prefix = raw[:12]
        digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
        record = ApiKey(
            workspace_id=workspace_id,
            name=name,
            key_prefix=prefix,
            key_hash=digest,
            scope=scope,
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return {
            "id": record.id,
            "name": record.name,
            "key": raw,
            "scope": record.scope,
            "created_at": record.created_at,
        }

    def list_keys(self, db: Session, workspace_id: int) -> list[ApiKey]:
        return db.query(ApiKey).filter(ApiKey.workspace_id == workspace_id).order_by(ApiKey.created_at.desc()).all()

    def revoke(self, db: Session, workspace_id: int, key_id: int) -> bool:
        record = db.query(ApiKey).filter(ApiKey.workspace_id == workspace_id, ApiKey.id == key_id).first()
        if not record:
            return False
        record.revoked = True
        db.commit()
        return True

    def resolve_key(self, db: Session, raw_key: str) -> ApiKey | None:
        digest = hashlib.sha256(raw_key.encode("utf-8")).hexdigest()
        record = db.query(ApiKey).filter(ApiKey.key_hash == digest, ApiKey.revoked.is_(False)).first()
        if record:
            record.last_used_at = datetime.utcnow()
            db.commit()
        return record
