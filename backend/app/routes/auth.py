from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user
from app.db import get_db
from app.models.db_models import Membership, User, Workspace
from app.models.schemas import AuthResponse, LoginRequest, RegisterRequest, UserProfile
from app.security import create_access_token, get_password_hash, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> AuthResponse:
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered.")

    user = User(
        email=payload.email.lower(),
        full_name=payload.full_name,
        password_hash=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    workspace = Workspace(name=f"{payload.full_name}'s Workspace", owner_id=user.id)
    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    membership = Membership(workspace_id=workspace.id, user_id=user.id, role="owner")
    db.add(membership)
    db.commit()

    token = create_access_token(str(user.id))
    return AuthResponse(access_token=token, user_id=user.id, workspace_id=workspace.id)


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    membership = db.query(Membership).filter(Membership.user_id == user.id).first()
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No workspace membership found.")
    token = create_access_token(str(user.id))
    return AuthResponse(access_token=token, user_id=user.id, workspace_id=membership.workspace_id)


@router.get("/me", response_model=UserProfile)
async def me(current_user: User = Depends(get_current_user)) -> UserProfile:
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        referral_code=current_user.referral_code,
    )
