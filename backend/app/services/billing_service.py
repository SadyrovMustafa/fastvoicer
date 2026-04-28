import os

import stripe
from sqlalchemy.orm import Session

from app.models.db_models import BillingRecord, Workspace


class BillingService:
    def __init__(self) -> None:
        self.public_base_url = os.getenv("APP_PUBLIC_URL", "http://localhost:3000")
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
        self.price_id_unlimited = os.getenv("STRIPE_PRICE_ID_UNLIMITED", "")

    def _ensure_customer(self, db: Session, workspace: Workspace, email: str, name: str) -> str:
        if workspace.stripe_customer_id:
            return workspace.stripe_customer_id
        customer = stripe.Customer.create(email=email, name=name, metadata={"workspace_id": str(workspace.id)})
        workspace.stripe_customer_id = customer.id
        db.commit()
        db.refresh(workspace)
        return customer.id

    def create_checkout(self, db: Session, workspace: Workspace, email: str, name: str) -> str:
        if not self.price_id_unlimited:
            raise ValueError("STRIPE_PRICE_ID_UNLIMITED is not configured.")
        customer_id = self._ensure_customer(db, workspace, email, name)
        session = stripe.checkout.Session.create(
            mode="subscription",
            customer=customer_id,
            line_items=[{"price": self.price_id_unlimited, "quantity": 1}],
            success_url=f"{self.public_base_url}/dashboard/billing?checkout=success",
            cancel_url=f"{self.public_base_url}/dashboard/billing?checkout=cancel",
            metadata={"workspace_id": str(workspace.id)},
        )
        return session.url

    def list_invoices(self, db: Session, workspace_id: int) -> list[BillingRecord]:
        return (
            db.query(BillingRecord)
            .filter(BillingRecord.workspace_id == workspace_id)
            .order_by(BillingRecord.created_at.desc())
            .all()
        )

    def create_portal_session(self, db: Session, workspace: Workspace, email: str, name: str) -> str:
        customer_id = self._ensure_customer(db, workspace, email, name)
        portal_session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=f"{self.public_base_url}/dashboard/billing",
        )
        return portal_session.url

    def upsert_invoice(
        self,
        db: Session,
        workspace_id: int,
        stripe_invoice_id: str,
        amount: int,
        currency: str,
        status: str,
        hosted_invoice_url: str | None,
    ) -> None:
        existing = db.query(BillingRecord).filter(BillingRecord.stripe_invoice_id == stripe_invoice_id).first()
        if existing:
            existing.amount = amount
            existing.currency = currency
            existing.status = status
            existing.hosted_invoice_url = hosted_invoice_url
        else:
            db.add(
                BillingRecord(
                    workspace_id=workspace_id,
                    stripe_invoice_id=stripe_invoice_id,
                    amount=amount,
                    currency=currency,
                    status=status,
                    hosted_invoice_url=hosted_invoice_url,
                )
            )
        db.commit()
