# Skymate (Travel Explorer) - frontend

React + TypeScript + Vite + Tailwind CSS v4. Frontend only: there is no backend in this repo.
All data that would come from a server is mock data, and every server call goes through one file: `src/api/client.ts`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Features

- Pages: onboarding, home, explore, regions, destination, place, trips (list, new, detail), map, my travels (journal), translator, food, notifications, profile, account (sign in / register), community.
- Language switch: English (US flag) and Arabic (Saudi flag), with right-to-left layout for Arabic. The choice is saved on the device.
- After sign in or register, the home page greets the user by name ("Welcome, Yousef" / "مرحبا يوسف").
- Mobile first: bottom navigation on phones, sidebar on desktop, works on tablet and PC.
- Dark theme, and data (saved places, trips, journal) kept in localStorage.

## Folder structure

```
src/
  api/          client.ts - the only place that talks to a backend (mock now)
  components/
    layout/     AppShell, language switch, navigation items
    ui/         Button, fields, cards, photo, flag, stars
  data/         mock content (JSON) + types + phrasebook
  hooks/        useAuth
  i18n/         en.ts, ar.ts, provider (language + direction)
  lib/          small helpers (class names, trip maths)
  pages/        one file per route
  store/        appStore.ts - app state saved in localStorage
  styles/       index.css - design tokens and Tailwind setup
```

## Connecting your backend

Open `src/api/client.ts`:

1. Set `USE_MOCK = false` and set `API_BASE_URL`.
2. Each function (`login`, `register`, `logout`, `listCommunitySpots`, `submitCommunitySpot`, `translate`) already has the call it would make. Match the paths and response shapes to your backend, or change them.

Saved places, trips and journal currently live in `src/store/appStore.ts` (localStorage). Move those to API calls the same way when your backend supports them.

## Adding the files to an existing repo

Do not delete the old repo. Copy this project's files in on a new branch, review, then merge. See the steps in the chat message that came with this repo.
