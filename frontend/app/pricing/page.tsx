import { Navbar } from "@/components/Navbar";
import { PricingCard } from "@/components/PricingCard";

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-semibold text-white">One simple unlimited plan</h1>
        <p className="mt-3 text-slate-300">No tiers, no usage caps, just full platform access.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-1">
          <PricingCard
            title="Unlimited"
            price="$49"
            popular
            features={[
              "Unlimited characters",
              "All voices and speed controls",
              "Billing dashboard and invoices",
              "Team workspace access",
              "API keys and public API",
            ]}
          />
        </div>
      </main>
    </div>
  );
}
