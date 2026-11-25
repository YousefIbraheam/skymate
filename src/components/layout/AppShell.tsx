import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Compass, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, Sun, X } from "lucide-react";
import { actions, useAppState } from "../../store/appStore";
import { useI18n } from "../../i18n";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { LanguageSwitch } from "./LanguageSwitch";
import { bottomNavPaths, isActive, navItems } from "./nav";
import { cn } from "../../lib/cn";

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { m, fill } = useI18n();
  const onboarded = useAppState((s) => s.onboarded);
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [query, setQuery] = useState("");
  const theme = useAppState((s) => s.theme);
  const [railOpen, setRailOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const swipeStart = useRef<number | null>(null);

  // Close the mobile menu after navigating, or with Escape.
  useEffect(() => setDrawerOpen(false), [pathname]);
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  // Auth gate: signed-out visitors only see the login / register screen.
  // After signing in, first-time users pick their country in onboarding.
  const publicPage = pathname === "/auth";
  useEffect(() => {
    if (!user && !publicPage) navigate("/auth", { replace: true });
    else if (user && !onboarded && pathname !== "/onboarding") navigate("/onboarding", { replace: true });
  }, [user, publicPage, onboarded, pathname, navigate]);

  // The header search box stays put while you browse. Typing opens Explore with the results;
  // opening a result keeps the text, and typing again searches again.
  useEffect(() => {
    if (pathname === "/explore") setQuery(params.get("q") ?? "");
  }, [pathname, params]);
  const onSearch = (value: string) => {
    setQuery(value);
    navigate(`/explore${value ? `?q=${encodeURIComponent(value)}` : ""}`, { replace: pathname === "/explore" });
  };

  // Apply the theme class on <html>.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (!user && !publicPage) return null; // redirecting to /auth
  if (pathname === "/onboarding" || publicPage) return <>{children}</>;

  return (
    <div className={cn("app-frame min-h-screen", railOpen && "rail-open")}>
      <div className="travel-contours" aria-hidden="true">
        <svg viewBox="0 0 1000 800" fill="none">
          <path d="M-100 240C180 20 270 420 590 140S1100 260 1200 40M-100 270C180 50 270 450 590 170S1100 290 1200 70M-100 300C180 80 270 480 590 200S1100 320 1200 100M-100 650C170 400 490 880 790 610S1100 520 1200 420" />
        </svg>
      </div>

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[1000] focus:rounded-full focus:bg-card focus:px-4 focus:py-2">
        {m.shell.skip}
      </a>

      {/* Desktop sidebar */}
      <aside
        id="desktop-navigation"
        aria-label="Desktop navigation"
        aria-hidden={!railOpen}
        inert={!railOpen}
        className={cn(
          "fixed inset-y-0 start-0 z-40 hidden w-64 flex-col overflow-y-auto bg-sidebar px-4 py-6 text-sidebar-foreground transition-transform duration-300 lg:flex",
          !railOpen && "-translate-x-full rtl:translate-x-full",
        )}
      >
        <Link to="/" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sun text-sun-foreground">
            <Compass className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold leading-tight">{m.appName}</span>
        </Link>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
          {navItems.map(({ to, key, icon: Icon }) => {
            const active = isActive(pathname, to);
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  "relative flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-colors",
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "text-sidebar-primary")} aria-hidden />
                <span>{m.nav[key]}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="rounded-2xl bg-sidebar-accent p-4 text-sm">
          <p className="font-display text-lg">{m.shell.offlineTitle}</p>
          <p className="mt-1 text-sidebar-foreground/75">{m.shell.offlineText}</p>
        </div>
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2 sm:px-6 lg:h-16 lg:flex-nowrap lg:py-0">
          <Button
            variant="outline"
            className="hidden shrink-0 lg:inline-flex"
            aria-label={railOpen ? m.shell.hide : m.shell.menu}
            aria-expanded={railOpen}
            aria-controls="desktop-navigation"
            onClick={() => setRailOpen((open) => !open)}
          >
            {railOpen ? <PanelLeftClose className="rtl-flip" /> : <PanelLeftOpen className="rtl-flip" />}
            {railOpen ? m.shell.hide : m.shell.menu}
          </Button>
          <Button
            variant="outline"
            className="shrink-0 gap-2 px-3 lg:hidden"
            aria-label={m.shell.menu}
            aria-expanded={drawerOpen}
            aria-controls="mobile-menu"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm">{m.shell.menu}</span>
          </Button>
          {user && (
            <p className="order-2 min-w-0 basis-full truncate font-display text-lg font-semibold lg:order-none lg:flex-none lg:basis-auto lg:text-xl">
              {fill(m.auth.welcome, { name: user.name })}
            </p>
          )}
          <label className="relative order-3 block w-full lg:order-none lg:w-80">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              aria-label={m.shell.searchLabel}
              placeholder={m.shell.search}
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              className="h-11 w-full rounded-full border bg-card ps-10 pe-4 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </label>
          <div className="order-1 ms-auto flex items-center gap-1 sm:gap-2 lg:order-none">
            <LanguageSwitch />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              aria-label={m.shell.toggleTheme}
              className="shrink-0"
              onClick={() => actions.update({ theme: theme === "dark" ? "light" : "dark" })}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
        {children}
      </main>

      {/* Mobile menu drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", !drawerOpen && "pointer-events-none")} aria-hidden={!drawerOpen}>
        <div className={cn("absolute inset-0 bg-black/30 transition-opacity duration-300", drawerOpen ? "opacity-100" : "opacity-0")} onClick={() => setDrawerOpen(false)} />
        <nav
          id="mobile-menu"
          aria-label={m.shell.menu}
          inert={!drawerOpen}
          // Swipe the panel toward its edge to close it (works in LTR and RTL).
          onTouchStart={(e) => { swipeStart.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (swipeStart.current === null) return;
            const dx = e.changedTouches[0].clientX - swipeStart.current;
            swipeStart.current = null;
            if (Math.abs(dx) > 60 && (dx < 0) === (document.documentElement.dir !== "rtl")) setDrawerOpen(false);
          }}
          className={cn(
            "absolute inset-y-0 start-0 flex w-64 max-w-[75%] flex-col gap-1 overflow-y-auto bg-sidebar px-4 py-5 text-sidebar-foreground shadow-lift transition-transform duration-300",
            !drawerOpen && "-translate-x-full rtl:translate-x-full",
          )}
        >
          <div className="mb-4 flex items-center justify-between px-1">
            <span className="font-display text-xl font-semibold">{m.shell.menu}</span>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent" aria-label={m.shell.hide} onClick={() => setDrawerOpen(false)}><X className="h-5 w-5" /></Button>
          </div>
          {navItems.map(({ to, key, icon: Icon }) => {
            const active = isActive(pathname, to);
            return (
              <NavLink
                key={to}
                to={to}
                className={cn("flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80")}
              >
                <Icon className={cn("h-5 w-5", active && "text-sidebar-primary")} aria-hidden />
                {m.nav[key]}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Mobile bottom bar */}
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {navItems
            .filter((item) => bottomNavPaths.includes(item.to))
            .map(({ to, key, icon: Icon }) => {
              const active = isActive(pathname, to);
              return (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={cn("relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium", active ? "text-primary" : "text-muted-foreground")}
                  >
                    {active && <span className="absolute top-0 h-1 w-8 rounded-full bg-sun" />}
                    <Icon className="h-5 w-5" aria-hidden />
                    {m.nav[key]}
                  </NavLink>
                </li>
              );
            })}
        </ul>
      </nav>
    </div>
  );
}
