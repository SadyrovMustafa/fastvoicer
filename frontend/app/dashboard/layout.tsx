"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("vf_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a121b] md:flex">
      <Sidebar />
      <main className="w-full p-4 md:p-6">
        <div className="mx-auto w-full max-w-6xl rounded-xl border border-white/10 bg-[#141d29] p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
