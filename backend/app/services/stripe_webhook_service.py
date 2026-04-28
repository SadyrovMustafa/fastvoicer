from sqlalchemy.orm import Session

from app.models.db_models import BillingRecord, Workspace


class StripeWebhookService:
    def process_invoice_paid(
        self,
        db: Session,
        workspace: Workspace,
        stripe_invoice_id: str,
        amount: int,
        currency: str,
        hosted_invoice_url: str | None,
    ) -> None:
        existing = db.query(BillingRecord).filter(BillingRecord.stripe_invoice_id == stripe_invoice_id).first()
        if existing:
            return
        record = BillingRecord(
            workspace_id=workspace.id,
            stripe_invoice_id=stripe_invoice_id,
            amount=amount,
            currency=currency,
            status="paid",
            hosted_invoice_url=hosted_invoice_url,
        )
        db.add(record)
        db.commit()
