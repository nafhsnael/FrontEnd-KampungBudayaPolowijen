export type UserRole = "admin" | "user";

export type AuthSession = {
  accessToken: string;
  role: UserRole;
};

const AUTH_KEYS = ["accessToken", "user_role", "user_email"] as const;
const AUTH_SESSION_EVENT = "auth-session-change";

function clearStoredAuthValues(): void {
  for (const storage of getStorages()) {
    for (const key of AUTH_KEYS) {
      storage.removeItem(key);
    }
  }
}

function notifyAuthSessionChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
  }
}

function getStorages(): Storage[] {
  if (typeof window === "undefined") return [];
  return [window.localStorage, window.sessionStorage];
}

export function saveAuthSession(
  session: AuthSession,
  rememberMe: boolean
): void {
  clearStoredAuthValues();

  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  storage.setItem("accessToken", session.accessToken);
  storage.setItem("user_role", session.role);
  notifyAuthSessionChange();
}

export function getAuthSession(): AuthSession | null {
  for (const storage of getStorages()) {
    const accessToken = storage.getItem("accessToken");
    const role = storage.getItem("user_role");

    if (
      accessToken &&
      (role === "admin" || role === "user")
    ) {
      return { accessToken, role };
    }
  }

  return null;
}

export function getAuthRole(): UserRole | null {
  return getAuthSession()?.role ?? null;
}

export function subscribeAuthSession(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(AUTH_SESSION_EVENT, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(AUTH_SESSION_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function clearAuthSession(): void {
  clearStoredAuthValues();
  notifyAuthSessionChange();
}
