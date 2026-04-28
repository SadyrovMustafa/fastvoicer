import secrets

from sqlalchemy.orm import Session

from app.models.db_models import ReferralEvent, User


class ReferralService:
    def ensure_referral_code(self, db: Session, user: User) -> str:
        if user.referral_code:
            return user.referral_code
        user.referral_code = f"VF{secrets.token_hex(4).upper()}"
        db.commit()
        db.refresh(user)
        return user.referral_code

    def get_summary(self, db: Session, user: User) -> dict:
        code = self.ensure_referral_code(db, user)
        events = db.query(ReferralEvent).filter(ReferralEvent.referrer_user_id == user.id).all()
        approved = [event for event in events if event.status == "approved"]
        pending = [event for event in events if event.status == "pending"]
        total_commission = sum(event.commission_amount for event in approved)
        return {
            "code": code,
            "total_referrals": len(events),
            "approved_referrals": len(approved),
            "pending_referrals": len(pending),
            "total_commission": total_commission,
        }
