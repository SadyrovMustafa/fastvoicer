import {
  ApiKeyItem,
  AuthResponse,
  BillingSummary,
  GenerationResponse,
  HistoryItem,
  JobResponse,
  ReferralSummary,
  WorkspaceData,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function authHeaders() {
  if (typeof window === "undefined") return {} as Record<string, string>;
  const token = localStorage.getItem("vf_token");
  return token ? { Authorization: `Bearer ${token}` } : ({} as Record<string, string>);
}

export async function createGeneration(
  text: string,
  voice: string,
  speed: number,
) {
  const response = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ text, voice, speed }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to generate audio.");
  }

  return (await response.json()) as GenerationResponse;
}

export async function getJob(jobId: string) {
  const response = await fetch(`${API_BASE}/jobs/${jobId}`, { headers: { ...authHeaders() } });
  if (!response.ok) {
    throw new Error("Failed to fetch generation status.");
  }
  return (await response.json()) as JobResponse;
}

export async function getHistory() {
  const response = await fetch(`${API_BASE}/history`, { headers: { ...authHeaders() } });
  if (!response.ok) {
    throw new Error("Failed to fetch history.");
  }
  return (await response.json()) as { items: HistoryItem[]; total_characters: number };
}

export async function register(full_name: string, email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name, email, password }),
  });
  if (!response.ok) throw new Error("Registration failed.");
  return (await response.json()) as AuthResponse;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Login failed.");
  return (await response.json()) as AuthResponse;
}

export async function getBillingSummary() {
  const response = await fetch(`${API_BASE}/billing/summary`, { headers: { ...authHeaders() } });
  if (!response.ok) throw new Error("Failed to load billing summary.");
  return (await response.json()) as BillingSummary;
}

export async function createCheckout() {
  const response = await fetch(`${API_BASE}/billing/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to create checkout.");
  return (await response.json()) as { checkout_url: string };
}

export async function createPortalSession() {
  const response = await fetch(`${API_BASE}/billing/portal`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to open billing portal.");
  return (await response.json()) as { checkout_url: string };
}

export async function getReferralSummary() {
  const response = await fetch(`${API_BASE}/referrals/summary`, { headers: { ...authHeaders() } });
  if (!response.ok) throw new Error("Failed to load referral summary.");
  return (await response.json()) as ReferralSummary;
}

export async function getWorkspace() {
  const response = await fetch(`${API_BASE}/workspaces/current`, { headers: { ...authHeaders() } });
  if (!response.ok) throw new Error("Failed to load workspace.");
  return (await response.json()) as WorkspaceData;
}

export async function inviteMember(email: string, role: "admin" | "member" | "billing_admin") {
  const response = await fetch(`${API_BASE}/memberships/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ email, role }),
  });
  if (!response.ok) throw new Error("Failed to invite member.");
  return (await response.json()) as { status: string; message: string };
}

export async function createApiKey(name: string, scope = "tts:generate") {
  const response = await fetch(`${API_BASE}/api-keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name, scope }),
  });
  if (!response.ok) throw new Error("Failed to create API key.");
  return (await response.json()) as { id: number; name: string; key: string; scope: string; created_at: string };
}

export async function getApiKeys() {
  const response = await fetch(`${API_BASE}/api-keys`, { headers: { ...authHeaders() } });
  if (!response.ok) throw new Error("Failed to load API keys.");
  return (await response.json()) as ApiKeyItem[];
}

export async function revokeApiKey(keyId: number) {
  const response = await fetch(`${API_BASE}/api-keys/${keyId}/revoke`, {
    method: "POST",
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to revoke API key.");
}
