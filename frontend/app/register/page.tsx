"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await register(fullName, email, password);
      localStorage.setItem("vf_token", response.access_token);
      router.push("/dashboard");
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Registration failed.");
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-2xl border border-white/10 bg-[#0f1526] p-8">
          <h1 className="text-2xl font-semibold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-300">Mock signup UI for MVP flow.</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <input
              className="w-full rounded-lg bg-[#0a1020] p-3 text-white"
              placeholder="Full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
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
              Create account
            </button>
            <Link href="/login" className="block text-center text-xs text-slate-300 hover:text-white">
              Already have an account? Sign in
            </Link>
          </form>
        </div>
      </main>
    </div>
  );
}
