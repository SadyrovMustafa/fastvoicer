from datetime import datetime

import os

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user, get_current_workspace
from app.models.db_models import User, Workspace
from app.models.schemas import (
    BillingCheckoutResponse,
    BillingSummaryResponse,
    InvoiceItem,
)
from app.services.billing_service import BillingService

router = APIRouter(prefix="/billing", tags=["billing"])
billing_service = BillingService()


@router.post("/checkout", response_model=BillingCheckoutResponse)
async def create_checkout(
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
    current_user: User = Depends(get_current_user),
) -> BillingCheckoutResponse:
    try:
        checkout_url = billing_service.create_checkout(db, workspace, current_user.email, current_user.full_name)
    except ValueError as config_error:
        raise HTTPException(status_code=500, detail=str(config_error)) from config_error
    except stripe.error.StripeError as stripe_error:
        raise HTTPException(status_code=502, detail=f"Stripe error: {stripe_error.user_message or 'checkout failed'}")
    return BillingCheckoutResponse(checkout_url=checkout_url)


@router.get("/summary", response_model=BillingSummaryResponse)
async def get_billing_summary(
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
) -> BillingSummaryResponse:
    invoices = billing_service.list_invoices(db, workspace.id)
    return BillingSummaryResponse(
        plan=workspace.plan,
        seats=workspace.seat_count,
        invoices=[
            InvoiceItem(
                stripe_invoice_id=invoice.stripe_invoice_id,
                amount=invoice.amount,
                currency=invoice.currency,
                status=invoice.status,
                hosted_invoice_url=invoice.hosted_invoice_url,
                created_at=invoice.created_at,
            )
            for invoice in invoices
        ],
    )


@router.post("/portal", response_model=BillingCheckoutResponse)
async def create_portal(
    db: Session = Depends(get_db),
    workspace: Workspace = Depends(get_current_workspace),
    current_user: User = Depends(get_current_user),
) -> BillingCheckoutResponse:
    try:
        portal_url = billing_service.create_portal_session(db, workspace, current_user.email, current_user.full_name)
    except stripe.error.StripeError as stripe_error:
        raise HTTPException(status_code=502, detail=f"Stripe error: {stripe_error.user_message or 'portal failed'}")
    return BillingCheckoutResponse(checkout_url=portal_url)


@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)) -> dict[str, str]:
    payload = await request.body()
    signature = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    if not webhook_secret:
        raise HTTPException(status_code=500, detail="STRIPE_WEBHOOK_SECRET is not configured.")
    if not signature:
        raise HTTPException(status_code=400, detail="Missing Stripe signature.")

    try:
        event = stripe.Webhook.construct_event(payload=payload, sig_header=signature, secret=webhook_secret)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid webhook payload.")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid webhook signature.")

    event_type = event.get("type", "")
    data_obj = event.get("data", {}).get("object", {})

    if event_type == "checkout.session.completed":
        customer_id = data_obj.get("customer")
        subscription_id = data_obj.get("subscription")
        if customer_id:
            workspace = db.query(Workspace).filter(Workspace.stripe_customer_id == customer_id).first()
            if workspace:
                workspace.plan = "unlimited"
                workspace.monthly_quota = 0
                workspace.stripe_subscription_id = subscription_id
                db.commit()

    if event_type in {"invoice.paid", "invoice.payment_failed"}:
        customer_id = data_obj.get("customer")
        workspace = db.query(Workspace).filter(Workspace.stripe_customer_id == customer_id).first()
        if workspace:
            billing_service.upsert_invoice(
                db=db,
                workspace_id=workspace.id,
                stripe_invoice_id=data_obj.get("id", ""),
                amount=data_obj.get("amount_due", 0),
                currency=(data_obj.get("currency", "usd") or "usd"),
                status=data_obj.get("status", "open"),
                hosted_invoice_url=data_obj.get("hosted_invoice_url"),
            )

    return {"status": "received"}
