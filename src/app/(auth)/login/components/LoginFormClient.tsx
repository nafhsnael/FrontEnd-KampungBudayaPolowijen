"use client";

import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import { saveAuthSession } from "@/lib/auth/session";
import { login } from "@/services/auth";

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
    const session = await login(data.email, data.password);
    const role = session.role ?? "user";
    saveAuthSession({ accessToken: session.accessToken, role }, data.rememberMe);
    router.replace(role === "admin" ? "/admin/dashboard" : "/dashboard");
  };

  const handleGoogleLogin = async () => {
    throw new Error("Login Google belum tersedia.");
  };

  return (
    <LoginForm onSubmit={handleSubmit} onGoogleLogin={handleGoogleLogin} />
  );
}