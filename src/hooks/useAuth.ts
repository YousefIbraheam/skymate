import { useCallback, useMemo, useSyncExternalStore } from "react";
import { AUTH_EVENT, getStoredUserRaw, login, loginWithGoogle, logout, register, type User } from "../api/client";

const subscribe = (notify: () => void) => {
  window.addEventListener(AUTH_EVENT, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(AUTH_EVENT, notify);
    window.removeEventListener("storage", notify);
  };
};

/** Current user from the API layer (mock today, backend later). Shared across components. */
export function useAuth() {
  const raw = useSyncExternalStore(subscribe, getStoredUserRaw, () => null);
  const user = useMemo<User | null>(() => (raw ? (JSON.parse(raw) as User) : null), [raw]);

  const signIn = useCallback(async (email: string, password: string) => void (await login({ email, password })), []);
  const signUp = useCallback(
    async (name: string, email: string, password: string) => void (await register({ name, email, password })),
    [],
  );
  const signInWithGoogle = useCallback(async () => void (await loginWithGoogle()), []);
  const signOut = useCallback(async () => void (await logout()), []);

  return { user, signIn, signUp, signInWithGoogle, signOut };
}
