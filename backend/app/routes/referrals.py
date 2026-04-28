from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.db_models import User
from app.models.schemas import ReferralSummaryResponse
from app.services.referral_service import ReferralService

router = APIRouter(prefix="/referrals", tags=["referrals"])
referral_service = ReferralService()


@router.get("/summary", response_model=ReferralSummaryResponse)
async def referral_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReferralSummaryResponse:
    summary = referral_service.get_summary(db, current_user)
    return ReferralSummaryResponse(**summary)
