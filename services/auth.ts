import type { UserRole } from "@/lib/auth/session";

type LoginResult = {
  accessToken: string;
  role: UserRole | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getRole(value: unknown): UserRole | null {
  if (!isRecord(value)) return null;

  const normalizedRole =
    typeof value.role === "string" ? value.role.toLowerCase() : "";

  if (normalizedRole === "admin" || normalizedRole === "user") {
    return normalizedRole;
  }

  return getRole(value.user);
}

export async function login(
  email: string,
  password: string
): Promise<LoginResult> {
  return parseLoginResponse(
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    )
  );
}

async function parseLoginResponse(
  response: Response,
  fallbackError = "Email atau password salah."
): Promise<LoginResult> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(fallbackError);
    }
    throw new Error("Respons login dari server tidak valid.");
  }

  if (!response.ok) {
    const message =
      isRecord(body) && typeof body.message === "string"
        ? body.message
        : fallbackError;
    throw new Error(message);
  }

  const payload = isRecord(body) ? body.data : null;
  const accessToken =
    isRecord(payload) && typeof payload.accessToken === "string"
      ? payload.accessToken
      : isRecord(body) && typeof body.accessToken === "string"
        ? body.accessToken
        : null;

  if (!accessToken) {
    throw new Error("Respons login tidak menyertakan access token.");
  }

  const role =
    getRole(payload) ??
    getRole(body);

  return { accessToken, role };
}
