"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await login(email, password);
      localStorage.setItem("vf_token", response.access_token);
      router.push("/dashboard");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-2xl border border-white/10 bg-[#0f1526] p-8">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-300">Mock login UI for MVP flow.</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <input
              className="w-full rounded-lg bg-[#0a1020] p-3 text-white"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              type="password"
              className="w-full rounded-lg bg-[#0a1020] p-3 text-white"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              className="block w-full rounded-lg bg-brand-500 p-3 text-center font-semibold text-slate-950"
            >
              Sign in
            </button>
            <Link href="/register" className="block text-center text-xs text-slate-300 hover:text-white">
              No account? Create one
            </Link>
          </form>
        </div>
      </main>
    </div>
  );
}
