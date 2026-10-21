"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Loader2 } from "lucide-react";

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
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M21.6 12.23c0-.68-.06-1.34-.17-1.97H12v3.72h5.39a4.6 4.6 0 0 1-1.99 3.02v2.5h3.22c1.88-1.73 2.98-4.28 2.98-7.27Z"
      fill="currentColor"
    />
    <path
      d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.22-2.5c-.9.6-2.05.95-3.4.95-2.61 0-4.82-1.76-5.6-4.13H.72v2.6A10 10 0 0 0 12 22Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M6.4 19.87A6.02 6.02 0 0 1 5.8 17.2V14.6H2.7A10 10 0 0 0 2 12c0-1.62.39-3.15 1.08-4.5l3.05 2.37A6.06 6.06 0 0 1 6.4 12.1c0 .66.12 1.3.34 1.91l-.34 5.86Z"
      fill="currentColor"
      opacity="0.7"
    />
    <path
      d="M12 4.98c1.17 0 2.23.4 3.07 1.18l2.3-2.3A9.97 9.97 0 0 0 12 2a10 10 0 0 0-9.28 5.5l3.1 2.38A5.98 5.98 0 0 1 12 4.98Z"
      fill="currentColor"
      opacity="0.5"
    />
  </svg>
);

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onGoogleLogin }) => {
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    rememberMe: false,
  });
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
    <div className="w-full max-w-131.25 px-0 py-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-12 items-center justify-center overflow-hidden rounded-full bg-transparent">
            <Image
              src="/images/logo2.png"
              alt="Logo Kampung Budaya Polowijen"
              width={48}
              height={56}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="leading-none text-white">
            <div className="text-[11px] font-medium tracking-wide text-stone-300">
              Kampung Budaya
            </div>
            <div className="mt-1 text-2xl font-semibold text-white">
              Polowijen
            </div>
          </div>
        </div>

        <div className="space-y-2 text-white">
          <h1 className="text-4xl font-bold leading-tight text-[#C49A4A]">
            Selamat Datang
          </h1>
          <p className="text-[15px] font-medium leading-snug text-white">
            Di Kampung Budaya Polowijen
          </p>
          <p className="max-w-116.25 text-[15px] leading-snug text-stone-200">
            Jelajahi kekayaan budaya, temukan cerita di balik setiap karya, dan
            dukung UMKM lokal
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/40 bg-red-950/50 p-2.5 text-xs text-rose-300"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4A2920]">
              <Mail size={19} aria-hidden="true" />
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
              className="h-14 w-full rounded-full border border-transparent bg-[#FFFDF7] pl-14 pr-4 text-[15px] text-stone-800 placeholder:text-stone-500 focus:border-[#C49A4A] focus:outline-none"
            />
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4A2920]">
              <Lock size={19} aria-hidden="true" />
            </span>
            <input
              id="login-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="current-password"
              required
              className="h-14 w-full rounded-full border border-transparent bg-[#FFFDF7] pl-14 pr-4 text-[15px] text-stone-800 placeholder:text-stone-500 focus:border-[#C49A4A] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/90">
            <label
              htmlFor="login-remember-me"
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                id="login-remember-me"
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 accent-[#C49A4A]"
              />
              <span>Ingat saya</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-white/90 underline-offset-2 hover:text-white"
            >
              Lupa password
            </Link>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="flex h-15 w-full items-center justify-center gap-2 rounded-full bg-[#C49A4A] px-5 text-lg font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
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

          <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/25" />
          <span className="text-sm text-stone-200">atau masuk dengan</span>
          <div className="h-px flex-1 bg-white/25" />
        </div>

        <button
          id="login-google-btn"
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="flex h-15 w-full items-center justify-center gap-3 rounded-full bg-[#9B3D32] px-5 text-lg font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              <span>Menghubungkan...</span>
            </>
          ) : (
            <>
              <GoogleIcon className="h-5.5 w-5.5 shrink-0 text-white" />
              <span>Google</span>
            </>
          )}
        </button>

        <p className="text-center text-sm text-stone-200">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-[#C49A4A] underline underline-offset-2 hover:text-[#d8b56d]"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
