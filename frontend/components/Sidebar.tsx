"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/generate", label: "Generate" },
  { href: "/dashboard/history", label: "History" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/referrals", label: "Referrals" },
  { href: "/dashboard/team", label: "Team" },
  { href: "/dashboard/api-keys", label: "API Keys" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("vf_token");
    router.push("/login");
  }

  return (
    <aside className="w-full border-b border-white/10 bg-[#0f1823] p-4 md:min-h-screen md:w-56 md:border-b-0 md:border-r md:border-white/10">
      <div className="mb-8 text-3xl font-bold text-white">VocalFlow</div>
      <nav className="grid gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm transition ${
              pathname === link.href
                ? "bg-[#1a2634] text-white"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-6 w-full rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300 transition hover:bg-red-400/20"
      >
        Logout
      </button>
    </aside>
  );
}
