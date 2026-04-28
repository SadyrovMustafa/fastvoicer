import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b14]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          VocalFlow
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-300">
          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-white">
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-brand-400"
          >
            Start free
          </Link>
        </nav>
      </div>
    </header>
  );
}
