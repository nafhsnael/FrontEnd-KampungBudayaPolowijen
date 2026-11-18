"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { blobAsset } from "@/lib/blob-assets";
import { saveAuthSession } from "@/lib/auth/session";
import { adminLogin } from "@/services/auth";

export default function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const session = await adminLogin(email, password);
      if (session.role !== "admin") {
        throw new Error("Akun ini tidak memiliki hak akses administrator.");
      }
      saveAuthSession(
        { accessToken: session.accessToken, role: "admin" },
        rememberMe
      );
      router.replace("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login admin gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#5a1f1d_0%,#4b1818_48%,#3b1615_100%)] px-5 py-8 text-stone-900">
      <section className="w-full max-w-[400px] -translate-y-1">
        <header className="mb-7 text-center">
          <Image
            src={blobAsset("/images/logok.png")}
            alt="Logo Kampung Budaya Polowijen"
            width={86}
            height={126}
            priority
            className="mx-auto h-[94px] w-[64px] object-contain opacity-90"
          />
          <h1 className="mt-1 text-[52px] leading-tight text-[#C99A43] drop-shadow-sm font-(--font-script)">
            Login Admin
          </h1>
        </header>

        {error && (
          <div role="alert" className="mb-3 rounded-lg border border-red-300/30 bg-[#7a3029]/90 px-3 py-2 text-center text-xs text-white">
            {error}
          </div>
        )}

        <div className="rounded-[18px] border border-white/5 bg-[linear-gradient(135deg,rgba(205,185,173,.30),rgba(238,222,210,.20))] px-10 py-7 shadow-[0_18px_40px_rgba(30,10,8,.18)] backdrop-blur-sm">
          <form onSubmit={handleSubmit} noValidate>
            <label className="relative block">
              <Mail size={15} className="absolute left-[13px] top-1/2 z-10 -translate-y-1/2 text-[#B7B3A9]" aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                autoComplete="email"
                className="h-11 w-full rounded-full border-0 bg-[#FFF8EC] pl-10 pr-4 text-xs text-stone-800 shadow-sm outline-none placeholder:text-[#B7B3A9] focus:ring-2 focus:ring-[#C99A43]/70"
              />
            </label>

            <label className="relative mt-3 block">
              <LockKeyhole size={15} className="absolute left-[13px] top-1/2 z-10 -translate-y-1/2 text-[#B7B3A9]" aria-hidden="true" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="h-11 w-full rounded-full border-0 bg-[#FFF8EC] pl-10 pr-4 text-xs text-stone-800 shadow-sm outline-none placeholder:text-[#B7B3A9] focus:ring-2 focus:ring-[#C99A43]/70"
              />
            </label>

            <div className="mt-3 flex items-center justify-between px-1 text-[9px] text-[#F0ECE6]">
              <label className="flex cursor-pointer items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-3 w-3 rounded-sm accent-[#C99A43]"
                />
                Ingat Saya
              </label>
              <span>Lupa Password</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mx-auto mt-5 flex h-9 w-[180px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#CFA94F,#C99A43)] text-xs font-bold text-white shadow-[0_5px_16px_rgba(70,31,19,.18)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
