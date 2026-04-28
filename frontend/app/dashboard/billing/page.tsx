"use client";

import { useEffect, useState } from "react";
import { createCheckout, createPortalSession, getBillingSummary } from "@/lib/api";
import { BillingSummary } from "@/lib/types";

export default function BillingPage() {
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [error, setError] = useState("");

  async function loadSummary() {
    try {
      setSummary(await getBillingSummary());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load billing.");
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  async function startCheckout() {
    try {
      const response = await createCheckout();
      window.location.href = response.checkout_url;
    } catch {
      setError("Unable to start checkout.");
    }
  }

  async function openPortal() {
    try {
      const response = await createPortalSession();
      window.location.href = response.checkout_url;
    } catch {
      setError("Unable to open Stripe customer portal.");
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold text-white">Billing</h1>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <p className="text-sm text-slate-300">Current plan: {summary?.plan ?? "loading..."}</p>
        <p className="text-sm text-slate-300">Seats: {summary?.seats ?? "-"}</p>
        <p className="mt-2 text-lg font-semibold text-[#f4de63]">Unlimited usage enabled</p>
        <div className="mt-4 flex items-center gap-3">
          <button
            className="rounded-md bg-[#f4de63] px-4 py-2 font-semibold text-[#1e2229]"
            onClick={startCheckout}
          >
            Activate Unlimited plan
          </button>
          <button className="rounded-md border border-white/20 px-4 py-2 text-white" onClick={openPortal}>
            Open Billing Portal
          </button>
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <p className="mb-3 text-lg font-semibold text-white">Invoices</p>
        {summary?.invoices?.length ? (
          <div className="space-y-2">
            {summary.invoices.map((invoice) => (
              <div key={invoice.stripe_invoice_id} className="rounded-md bg-[#121922] p-3 text-sm text-slate-200">
                <p>{invoice.stripe_invoice_id}</p>
                <p>
                  {(invoice.amount / 100).toFixed(2)} {invoice.currency.toUpperCase()} - {invoice.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No invoices yet.</p>
        )}
      </div>
    </div>
  );
}
