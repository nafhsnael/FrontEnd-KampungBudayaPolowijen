"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveAuthSession } from "@/lib/auth/session";
import { adminLogin } from "@/services/auth";

export default function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Masukkan alamat email yang valid.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const session = await adminLogin(normalizedEmail, password);
      if (session.role !== "admin") {
        throw new Error("Akun ini tidak memiliki akses administrator.");
      }

      saveAuthSession(
        { accessToken: session.accessToken, role: "admin" },
        true
      );
      router.replace("/admin/dashboard");
    } catch (loginError: unknown) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Login admin gagal. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <label className="flex items-center gap-3 rounded-full bg-[#FDF8F2] px-4 py-2.5 text-[#5C362B] shadow-inner">
        <Mail size={18} aria-hidden="true" />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          autoComplete="email"
          className="w-full bg-transparent text-sm text-[#5C362B] outline-none placeholder:text-stone-500"
          aria-label="Email"
        />
      </label>

      <label className="flex items-center gap-3 rounded-full bg-[#FDF8F2] px-4 py-2.5 text-[#5C362B] shadow-inner">
        <Lock size={18} aria-hidden="true" />
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          className="w-full bg-transparent text-sm text-[#5C362B] outline-none placeholder:text-stone-500"
          aria-label="Password"
        />
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          className="shrink-0 text-[#5C362B]"
          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </label>

      <div className="flex items-center justify-between px-2 text-[11px] text-stone-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#C49A4A]" />
          <span>Ingat saya</span>
        </label>
        <button type="button" className="transition-colors hover:text-amber-300">
          Lupa password
        </button>
      </div>

      {error && (
        <p className="text-center text-xs text-amber-200" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-[#C49A4A] py-2.5 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Memproses..." : "Login"}
      </button>
    </form>
  );
}
