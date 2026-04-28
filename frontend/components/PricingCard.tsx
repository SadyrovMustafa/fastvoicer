type PricingCardProps = {
  title: string;
  price: string;
  features: string[];
  popular?: boolean;
};

export function PricingCard({ title, price, features, popular }: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        popular ? "border-brand-500 bg-[#111a2e] shadow-glow" : "border-white/10 bg-[#0e1423]"
      }`}
    >
      <p className="text-sm text-slate-300">{title}</p>
      <p className="mt-3 text-4xl font-semibold text-white">{price}</p>
      <ul className="mt-6 space-y-2 text-sm text-slate-300">
        {features.map((feature) => (
          <li key={feature}>- {feature}</li>
        ))}
      </ul>
      <button className="mt-6 w-full rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
        Choose plan
      </button>
    </div>
  );
}
