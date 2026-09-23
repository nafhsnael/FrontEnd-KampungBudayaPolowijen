"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit?: (data: LoginFormState) => Promise<void>;
  onGoogleLogin?: () => Promise<void>;
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    aria-hidden="true"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onGoogleLogin }) => {
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit?.(form);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Login gagal. Coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await onGoogleLogin?.();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Login Google gagal. Coba lagi."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[410px] bg-[#2b140f]/75 px-6 py-7 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="space-y-5">
        <div className="flex items-center gap-3 pt-1">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border-[3px] border-[#dcb578] bg-white/80 shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),rgba(140,89,53,0.46))]" />
          </div>
          <div className="leading-none text-[#f6ebdf]">
            <div className="text-[15px] font-semibold tracking-wide">Kampung Budaya</div>
            <div className="mt-1 text-[14px] font-bold tracking-[0.08em]">POLOWIJEN</div>
          </div>
        </div>

        <div className="space-y-2 text-[#f4e7dc]">
          <h1 className="text-[28px] font-bold leading-[1.1] tracking-[-0.04em]">
            Selamat Datang
          </h1>
          <p className="text-[20px] font-semibold leading-[1.2] tracking-[-0.02em]">
            Di Kampung Budaya Polowijen
          </p>
          <p className="max-w-[320px] text-[13px] leading-5 text-[#ecddcd]">
            Jelajahi kekayaan budaya, temukan cerita di balik setiap karya, dan dukung UMKM lokal.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-900/40 px-4 py-2.5 text-xs text-red-100"
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#654b3d]">
              <Mail size={18} aria-hidden="true" />
            </span>
            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              autoComplete="email"
              required
              className="w-full rounded-2xl border border-[#f7efe9]/10 bg-[#f3ece8] py-3.5 pl-11 pr-4 text-[15px] text-[#3f2b25] placeholder:text-[#5b4139] focus:border-[#e3b96c] focus:outline-none"
            />
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#654b3d]">
              <Lock size={18} aria-hidden="true" />
            </span>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="current-password"
              required
              className="w-full rounded-2xl border border-[#f7efe9]/10 bg-[#f3ece8] py-3.5 pl-11 pr-11 text-[15px] text-[#3f2b25] placeholder:text-[#5b4139] focus:border-[#e3b96c] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#654b3d] transition-colors hover:text-[#2b140f]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-[12px] text-[#f1dfd0]">
            <label htmlFor="login-remember-me" className="flex cursor-pointer items-center gap-2">
              <input
                id="login-remember-me"
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 accent-[#d9a85c]"
              />
              <span>Ingat saya</span>
            </label>

            <Link href="/forgot-password" className="text-[#f0d8b5] underline decoration-from-font underline-offset-2 hover:text-[#fbe2bf]">
              Lupa password
            </Link>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#d9a85c] px-5 py-3.5 text-[18px] font-semibold text-[#2b140f] shadow-[0_10px_25px_rgba(155,94,41,0.45)] transition hover:bg-[#e1b268] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                <span>Memproses...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 pt-1">
          <div className="h-px flex-1 bg-[#b48a66]/70" />
          <span className="text-[12px] text-[#e8d7c8]">atau masuk dengan</span>
          <div className="h-px flex-1 bg-[#b48a66]/70" />
        </div>

        <button
          id="login-google-btn"
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-[#b75647] px-5 py-3.5 text-[18px] font-semibold text-white shadow-[0_10px_25px_rgba(99,30,22,0.45)] transition hover:bg-[#c25c4d] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              <span>Menghubungkan...</span>
            </>
          ) : (
            <>
              <GoogleIcon className="h-6 w-6 shrink-0" />
              <span>Google</span>
            </>
          )}
        </button>

        <p className="pb-1 text-center text-[12px] text-[#f1dfd0]">
          Belum punya akun? <Link href="/register" className="font-semibold text-[#f0d8b5] underline decoration-from-font underline-offset-2 hover:text-[#fbe2bf]">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
