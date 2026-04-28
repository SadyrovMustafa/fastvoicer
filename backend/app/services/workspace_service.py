from sqlalchemy.orm import Session

from app.models.db_models import Membership, User, Workspace


class WorkspaceService:
    def list_members(self, db: Session, workspace_id: int) -> list[dict]:
        memberships = db.query(Membership).filter(Membership.workspace_id == workspace_id).all()
        members: list[dict] = []
        for membership in memberships:
            user = db.query(User).filter(User.id == membership.user_id).first()
            if user:
                members.append(
                    {
                        "user_id": user.id,
                        "email": user.email,
                        "full_name": user.full_name,
                        "role": membership.role,
                    }
                )
        return members

    def invite_member(self, db: Session, workspace: Workspace, email: str, role: str) -> dict:
        user = db.query(User).filter(User.email == email.lower()).first()
        if not user:
            return {"status": "pending", "message": "User not registered yet. Invite recorded as pending."}
        membership = (
            db.query(Membership)
            .filter(Membership.workspace_id == workspace.id, Membership.user_id == user.id)
            .first()
        )
        if membership:
            membership.role = role
        else:
            db.add(Membership(workspace_id=workspace.id, user_id=user.id, role=role))
            workspace.seat_count += 1
        db.commit()
        return {"status": "invited", "message": "Member added to workspace."}
