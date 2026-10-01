"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

/**
 * Thin client wrapper for the login page.
 * Handles navigation side-effects (useRouter) while keeping
 * the parent page.tsx as a Server Component for metadata export.
 */
export default function LoginFormClient() {
  const router = useRouter();

  const handleSubmit = async (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message ?? "Email atau password salah.");
    }

    const { data: payload } = await res.json();

    // Simpan token (gunakan HttpOnly cookie via API route di production)
    if (data.rememberMe) {
      localStorage.setItem("accessToken", payload.accessToken);
    } else {
      sessionStorage.setItem("accessToken", payload.accessToken);
    }

    router.push("/dashboard");
  };

  const handleGoogleLogin = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/auth/google`,
      { method: "POST", headers: { "Content-Type": "application/json" } }
    );

    if (!res.ok) throw new Error("Login Google gagal.");
    const { data: payload } = await res.json();
    sessionStorage.setItem("accessToken", payload.accessToken);
    router.push("/dashboard");
  };

  return (
    <LoginForm onSubmit={handleSubmit} onGoogleLogin={handleGoogleLogin} />
  );
}