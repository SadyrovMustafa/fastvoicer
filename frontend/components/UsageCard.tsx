type UsageCardProps = {
  used: number;
  limit: number;
  unlimited?: boolean;
};

export function UsageCard({ used, limit, unlimited = false }: UsageCardProps) {
  const progress = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">Character usage</p>
      <p className="mt-2 text-2xl font-semibold text-white">
        {unlimited ? "Unlimited" : `${used.toLocaleString()} / ${limit.toLocaleString()}`}
      </p>
      <div className="mt-3 h-2 rounded-full bg-[#2c3541]">
        <div
          className="h-full rounded-full bg-[#f4de63]"
          style={{ width: unlimited ? "100%" : `${progress}%` }}
        />
      </div>
    </div>
  );
}
