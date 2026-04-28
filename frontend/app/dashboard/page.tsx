import Link from "next/link";
import { UsageCard } from "@/components/UsageCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-2 text-slate-300">Create voice content fast and track your generation pipeline.</p>
      </div>
      <UsageCard used={18340} limit={100000} unlimited />
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/generate" className="rounded-lg border border-white/10 bg-[#1b2430] p-6 text-white">
          Generate new audio
        </Link>
        <Link href="/dashboard/history" className="rounded-lg border border-white/10 bg-[#1b2430] p-6 text-white">
          View audio history
        </Link>
        <Link href="/dashboard/billing" className="rounded-lg border border-white/10 bg-[#1b2430] p-6 text-white">
          Manage billing and invoices
        </Link>
        <Link href="/dashboard/api-keys" className="rounded-lg border border-white/10 bg-[#1b2430] p-6 text-white">
          Manage API keys
        </Link>
      </div>
    </div>
  );
}
