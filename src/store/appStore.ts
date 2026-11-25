import { useSyncExternalStore } from "react";

const STORAGE_KEY = "travel-explorer:v1";

export type Lang = "en" | "ar";

export interface Trip {
  id: string;
  title: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  travellers: number;
  days: string[][]; // place ids for each day
}

export interface JournalEntry {
  id: string;
  placeId: string;
  caption: string;
  date: string;
}

export interface Review {
  id: string;
  rating: number;
  text: string;
  date: string;
}

export interface AppState {
  onboarded: boolean;
  country: string;
  name: string;
  lang: Lang;
  theme: "light" | "dark";
  saved: string[];
  visits: Record<string, { date: string; rating: number }>;
  notes: Record<string, string>;
  trips: Trip[];
  journal: JournalEntry[];
  foodWanted: string[];
  foodTried: string[];
  bio: string;
  interests: string[];
  reviews: Record<string, Review[]>;
  readNotifications: string[];
  notifications: { tripReminders: boolean; journalReminders: boolean };
  privacy: { preciseLocation: boolean; shareJournal: boolean; usageStats: boolean };
}

export const initialState: AppState = {
  onboarded: false,
  country: "IN",
  name: "",
  lang: "en",
  theme: "light",
  saved: [],
  visits: {},
  notes: {},
  trips: [],
  journal: [],
  foodWanted: [],
  foodTried: [],
  bio: "",
  interests: [],
  reviews: {},
  readNotifications: [],
  notifications: { tripReminders: false, journalReminders: false },
  privacy: { preciseLocation: false, shareJournal: false, usageStats: false },
};

let state: AppState = initialState;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as Partial<AppState>;
    state = {
      ...initialState,
      ...saved,
      privacy: { ...initialState.privacy, ...saved.privacy },
      notifications: { ...initialState.notifications, ...saved.notifications },
    };
  } catch {
    /* ignore corrupt storage */
  }
}

function setState(update: (current: AppState) => AppState) {
  load();
  state = update(state);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage may be full or blocked */
  }
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getState = () => {
  load();
  return state;
};

/** Read a slice of the app state; re-renders when the slice changes. */
export function useAppState<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(initialState),
  );
}

const newId = () => Math.random().toString(36).slice(2, 10);
const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

/** Fields that belong to one account. A new or different user starts from zero. */
const userData = (): Partial<AppState> => ({
  saved: [], visits: {}, notes: {}, trips: [], journal: [], foodWanted: [], foodTried: [],
  bio: "", interests: [], reviews: {}, readNotifications: [],
});

export const actions = {
  resetUserData: () => setState((s) => ({ ...s, ...userData() }) as AppState),
  update: (patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch })),
  toggleSaved: (placeId: string) => setState((s) => ({ ...s, saved: toggle(s.saved, placeId) })),
  setVisit: (placeId: string, visit: { date: string; rating: number } | null) =>
    setState((s) => {
      const visits = { ...s.visits };
      if (visit) visits[placeId] = visit;
      else delete visits[placeId];
      return { ...s, visits };
    }),
  setNote: (placeId: string, note: string) => setState((s) => ({ ...s, notes: { ...s.notes, [placeId]: note } })),
  toggleFoodWanted: (id: string) => setState((s) => ({ ...s, foodWanted: toggle(s.foodWanted, id) })),
  toggleFoodTried: (id: string) => setState((s) => ({ ...s, foodTried: toggle(s.foodTried, id) })),
  toggleInterest: (id: string) => setState((s) => ({ ...s, interests: toggle(s.interests, id) })),
  saveTrip: (trip: Omit<Trip, "id"> & { id?: string }) => {
    const id = trip.id ?? newId();
    setState((s) => ({
      ...s,
      trips: s.trips.some((t) => t.id === id)
        ? s.trips.map((t) => (t.id === id ? { ...trip, id } : t))
        : [...s.trips, { ...trip, id }],
    }));
    return id;
  },
  deleteTrip: (id: string) => setState((s) => ({ ...s, trips: s.trips.filter((t) => t.id !== id) })),
  addJournal: (entry: Omit<JournalEntry, "id">) =>
    setState((s) => ({ ...s, journal: [{ ...entry, id: newId() }, ...s.journal] })),
  deleteJournal: (id: string) => setState((s) => ({ ...s, journal: s.journal.filter((j) => j.id !== id) })),
  addReview: (placeId: string, review: Omit<Review, "id" | "date">) =>
    setState((s) => ({
      ...s,
      reviews: {
        ...s.reviews,
        [placeId]: [{ ...review, id: newId(), date: new Date().toISOString().slice(0, 10) }, ...(s.reviews[placeId] ?? [])],
      },
    })),
  deleteReview: (placeId: string, id: string) =>
    setState((s) => ({ ...s, reviews: { ...s.reviews, [placeId]: (s.reviews[placeId] ?? []).filter((r) => r.id !== id) } })),
  markNotificationRead: (id: string) =>
    setState((s) => (s.readNotifications.includes(id) ? s : { ...s, readNotifications: [...s.readNotifications, id] })),
};
