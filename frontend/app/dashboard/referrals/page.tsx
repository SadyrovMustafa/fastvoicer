"use client";

import { useEffect, useState } from "react";
import { getReferralSummary } from "@/lib/api";
import { ReferralSummary } from "@/lib/types";

export default function ReferralsPage() {
  const [summary, setSummary] = useState<ReferralSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setSummary(await getReferralSummary());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load referrals.");
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold text-white">Referral Program</h1>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <p className="text-sm text-slate-300">Your referral code</p>
        <p className="mt-1 text-2xl font-semibold text-[#f4de63]">{summary?.code ?? "..."}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total referrals" value={summary?.total_referrals ?? 0} />
        <StatCard label="Approved" value={summary?.approved_referrals ?? 0} />
        <StatCard label="Pending" value={summary?.pending_referrals ?? 0} />
      </div>
      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <p className="text-sm text-slate-300">Total commission</p>
        <p className="text-2xl font-semibold text-white">${((summary?.total_commission ?? 0) / 100).toFixed(2)}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
