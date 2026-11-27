/**
 * The only file that talks to a backend.
 *
 * Everything here runs against local mock data so the frontend works on its own.
 * To connect a real backend: set USE_MOCK to false, set API_BASE_URL, and make
 * each function call `request()` with the endpoint your backend exposes.
 */
import { actions } from "../store/appStore";

const USE_MOCK = true;
const API_BASE_URL = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

/* ---------- Types ---------- */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CommunitySpot {
  id: string;
  name: string;
  where: string;
  text: string;
  author: string;
  status: "pending" | "approved";
}

/* ---------- Mock storage ---------- */

const USER_KEY = "skymate:user";
const SPOTS_KEY = "skymate:community";

const seedSpots: CommunitySpot[] = [
  { id: "s1", name: "Sunrise ghat", where: "Varanasi", text: "Take a boat at 5:30 for quiet light on the river.", author: "Mona", status: "approved" },
  { id: "s2", name: "Tea stall behind the fort", where: "Jaipur", text: "Best masala chai in town, cash only.", author: "Karim", status: "approved" },
];

/** Arabic text for the two seeded spots (user-submitted spots stay as written). */
export const seedSpotsAr: Record<string, Pick<CommunitySpot, "name" | "where" | "text" | "author">> = {
  s1: { name: "غاط الشروق", where: "فاراناسي", text: "اركب قارباً عند 5:30 لتستمتع بضوء هادئ على النهر.", author: "منى" },
  s2: { name: "كشك الشاي خلف الحصن", where: "جايبور", text: "أفضل شاي ماسالا في المدينة، الدفع نقداً فقط.", author: "كريم" },
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => window.localStorage.setItem(key, JSON.stringify(value));

/* ---------- Auth ---------- */

export function getCurrentUser(): User | null {
  return read<User | null>(USER_KEY, null);
}

/** Lets React re-render when the signed-in user changes (used by hooks/useAuth). */
export const AUTH_EVENT = "auth-changed";
export const getStoredUserRaw = () => window.localStorage.getItem(USER_KEY);
const emitAuthChange = () => window.dispatchEvent(new Event(AUTH_EVENT));

/** UI-only: mock "Continue with Google". The backend teammate replaces this with real OAuth. */
export async function loginWithGoogle(): Promise<User> {
  if (!USE_MOCK) return request<User>("/auth/google", { method: "POST" });
  await new Promise((r) => setTimeout(r, 500));
  const user: User = { id: crypto.randomUUID(), name: "Google User", email: "user@gmail.com" };
  write(USER_KEY, user);
  actions.update({ name: user.name });
  emitAuthChange();
  return user;
}

/** UI-only: pretend to email a 6-digit code. The backend sends the real email. */
export async function sendVerificationCode(email: string): Promise<void> {
  if (!USE_MOCK) return void (await request("/auth/send-code", { method: "POST", body: JSON.stringify({ email }) }));
  await new Promise((r) => setTimeout(r, 500));
}

/** UI-only: any 6-digit code passes in mock mode. */
export async function verifyCode(email: string, code: string): Promise<boolean> {
  if (!USE_MOCK) return (await request<{ ok: boolean }>("/auth/verify-code", { method: "POST", body: JSON.stringify({ email, code }) })).ok;
  await new Promise((r) => setTimeout(r, 400));
  return /^\d{6}$/.test(code);
}

/** UI-only: password reset starts with a code sent to the email. */
export async function requestPasswordReset(email: string): Promise<void> {
  if (!USE_MOCK) return void (await request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }));
  await new Promise((r) => setTimeout(r, 500));
}

export async function resetPassword(input: { email: string; code: string; password: string }): Promise<void> {
  if (!USE_MOCK) return void (await request("/auth/reset-password", { method: "POST", body: JSON.stringify(input) }));
  await new Promise((r) => setTimeout(r, 400));
}

export async function register(input: { name: string; email: string; password: string }): Promise<User> {
  if (!USE_MOCK) return request<User>("/auth/register", { method: "POST", body: JSON.stringify(input) });
  const user: User = { id: crypto.randomUUID(), name: input.name.trim(), email: input.email.trim() };
  write(USER_KEY, user);
  actions.resetUserData(); // a new account starts with zero saved places, trips and memories
  actions.update({ name: user.name });
  emitAuthChange();
  return user;
}

export async function login(input: { email: string; password: string }): Promise<User> {
  if (!USE_MOCK) return request<User>("/auth/login", { method: "POST", body: JSON.stringify(input) });
  const existing = getCurrentUser();
  const email = input.email.trim();
  const user: User = {
    id: existing?.id ?? crypto.randomUUID(),
    name: existing?.email === email ? existing.name : email.split("@")[0],
    email,
  };
  if (existing && existing.email !== email) actions.resetUserData(); // different person on this device
  write(USER_KEY, user);
  actions.update({ name: user.name });
  emitAuthChange();
  return user;
}

export async function logout(): Promise<void> {
  if (!USE_MOCK) await request("/auth/logout", { method: "POST" });
  window.localStorage.removeItem(USER_KEY);
  emitAuthChange();
}

/* ---------- Community ---------- */

export async function listCommunitySpots(): Promise<CommunitySpot[]> {
  if (!USE_MOCK) return request<CommunitySpot[]>("/community/spots");
  return read<CommunitySpot[]>(SPOTS_KEY, seedSpots);
}

export async function submitCommunitySpot(input: Pick<CommunitySpot, "name" | "where" | "text">): Promise<CommunitySpot> {
  if (!USE_MOCK) return request<CommunitySpot>("/community/spots", { method: "POST", body: JSON.stringify(input) });
  const spot: CommunitySpot = { ...input, id: crypto.randomUUID(), author: getCurrentUser()?.name ?? "You", status: "pending" };
  write(SPOTS_KEY, [spot, ...read<CommunitySpot[]>(SPOTS_KEY, seedSpots)]);
  return spot;
}

/** UI-only moderation: mark a pending spot approved. The backend teammate replaces this with a real endpoint. */
export async function approveCommunitySpot(id: string): Promise<void> {
  if (!USE_MOCK) return void (await request(`/community/spots/${id}/approve`, { method: "POST" }));
  await new Promise((r) => setTimeout(r, 200));
  write(SPOTS_KEY, read<CommunitySpot[]>(SPOTS_KEY, seedSpots).map((s) => (s.id === id ? { ...s, status: "approved" as const } : s)));
}

/** UI-only moderation: reject a pending spot (removes it from the list). */
export async function rejectCommunitySpot(id: string): Promise<void> {
  if (!USE_MOCK) return void (await request(`/community/spots/${id}`, { method: "DELETE" }));
  await new Promise((r) => setTimeout(r, 200));
  write(SPOTS_KEY, read<CommunitySpot[]>(SPOTS_KEY, seedSpots).filter((s) => s.id !== id));
}

/* ---------- Translation ---------- */

export async function translate(text: string, to: string): Promise<string> {
  if (!USE_MOCK) {
    const result = await request<{ text: string }>("/translate", { method: "POST", body: JSON.stringify({ text, to }) });
    return result.text;
  }
  return `[${to}] ${text}`; // placeholder until a translation service is connected
}
