from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    voice: str = Field(..., min_length=2, max_length=100)
    speed: float = Field(default=1.0, ge=0.5, le=1.5)


class GenerateResponse(BaseModel):
    job_id: str
    status: Literal["queued", "processing", "completed"]


class JobResponse(BaseModel):
    job_id: str
    status: Literal["queued", "processing", "completed", "failed"]
    text: str
    voice: str
    speed: float = Field(default=1.0, ge=0.5, le=1.5)
    created_at: datetime
    audio_url: Optional[str] = None


class HistoryResponse(BaseModel):
    items: list[JobResponse]
    total_characters: int


class RegisterRequest(BaseModel):
    email: str
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2, max_length=120)
    referral_code: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    workspace_id: int


class UserProfile(BaseModel):
    id: int
    email: str
    full_name: str
    referral_code: str | None = None


class BillingCheckoutResponse(BaseModel):
    checkout_url: str


class InvoiceItem(BaseModel):
    stripe_invoice_id: str
    amount: int
    currency: str
    status: str
    hosted_invoice_url: str | None = None
    created_at: datetime


class BillingSummaryResponse(BaseModel):
    plan: str
    seats: int
    invoices: list[InvoiceItem]


class ReferralSummaryResponse(BaseModel):
    code: str
    total_referrals: int
    approved_referrals: int
    pending_referrals: int
    total_commission: int


class CreateWorkspaceRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)


class InviteMemberRequest(BaseModel):
    email: str
    role: Literal["admin", "member", "billing_admin"] = "member"


class MembershipItem(BaseModel):
    user_id: int
    email: str
    full_name: str
    role: str


class WorkspaceResponse(BaseModel):
    id: int
    name: str
    plan: str
    seat_count: int
    members: list[MembershipItem]


class CreateApiKeyRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    scope: str = "tts:generate"


class ApiKeyResponse(BaseModel):
    id: int
    name: str
    key: str
    scope: str
    created_at: datetime


class ApiKeyListItem(BaseModel):
    id: int
    name: str
    key_prefix: str
    scope: str
    revoked: bool
    last_used_at: Optional[datetime] = None
    created_at: datetime
