export type VoiceOption = {
  id: string;
  name: string;
  accent: string;
  tone: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user_id: number;
  workspace_id: number;
};

export type GenerationResponse = {
  job_id: string;
  status: "queued" | "processing" | "completed";
};

export type BillingSummary = {
  plan: string;
  seats: number;
  invoices: {
    stripe_invoice_id: string;
    amount: number;
    currency: string;
    status: string;
    hosted_invoice_url?: string;
    created_at: string;
  }[];
};

export type ReferralSummary = {
  code: string;
  total_referrals: number;
  approved_referrals: number;
  pending_referrals: number;
  total_commission: number;
};

export type WorkspaceData = {
  id: number;
  name: string;
  plan: string;
  seat_count: number;
  members: {
    user_id: number;
    email: string;
    full_name: string;
    role: string;
  }[];
};

export type ApiKeyItem = {
  id: number;
  name: string;
  key_prefix: string;
  scope: string;
  revoked: boolean;
  last_used_at?: string;
  created_at: string;
};

export type JobResponse = {
  job_id: string;
  status: "queued" | "processing" | "completed" | "failed";
  text: string;
  voice: string;
  speed: number;
  created_at: string;
  audio_url?: string;
};

export type HistoryItem = {
  job_id: string;
  text: string;
  voice: string;
  speed: number;
  status: "queued" | "processing" | "completed" | "failed";
  created_at: string;
  audio_url?: string;
};
