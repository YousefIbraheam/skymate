import { Link } from "react-router-dom";
import { ArrowRight, Compass, Image, Languages, Map, Plane, UtensilsCrossed } from "lucide-react";
import { destinations, placeCost, getDestination, places } from "../data";
import { useAppState } from "../store/appStore";
import { useI18n } from "../i18n";
import { Button } from "../components/ui/Button";
import { Photo } from "../components/ui/Photo";
import { Card } from "../components/ui/Section";
import { DestinationCard, PlaceCard } from "../components/ui/Cards";
import { useAuth } from "../hooks/useAuth";

const quickLinks = [
  { to: "/trips/new", key: "plan", icon: Plane },
  { to: "/explore", key: "explore", icon: Compass },
  { to: "/map", key: "map", icon: Map },
  { to: "/translator", key: "translate", icon: Languages },
  { to: "/food", key: "food", icon: UtensilsCrossed },
  { to: "/travels", key: "journal", icon: Image },
] as const;

export function HomePage() {
  const { m, fill } = useI18n();
  const { user } = useAuth();
  const state = useAppState((s) => s);
  const { name, country, visits, saved, trips, journal, interests } = state;

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? m.home.morning : hour < 18 ? m.home.afternoon : m.home.evening;
  const displayName = user?.name || name;
  const greeting = displayName ? fill(m.home.welcome, { name: displayName }) : timeGreeting;

  const inCountry = (destinationId: string) => getDestination(destinationId)?.country === country;
  const countryPlaces = places.filter((p) => inCountry(p.destinationId));
  const visitedCount = Object.keys(visits).filter((id) => countryPlaces.some((p) => p.id === id)).length;
  const progress = countryPlaces.length ? Math.round((visitedCount / countryPlaces.length) * 100) : 0;

  const suggestions = countryPlaces
    .filter((p) => !visits[p.id])
    .sort((a, b) => Number(interests.includes(b.category)) - Number(interests.includes(a.category)) || b.rating - a.rating)
    .slice(0, 3);
  const featured = destinations.filter((d) => d.country === country);
  const hero = featured[0] ?? destinations[0];

  const today = new Date().toISOString().slice(0, 10);
  const nextTrip = trips.filter((t) => t.startDate >= today).sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  const nextTripDestination = nextTrip ? getDestination(nextTrip.destinationId) : undefined;

  const stats = [
    { label: m.home.visited, value: Object.keys(visits).length },
    { label: m.home.bucket, value: saved.length },
    { label: m.home.planned, value: trips.length },
    { label: m.home.memories, value: journal.length },
  ];
  const xp = Object.keys(visits).length * 140;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] shadow-lift">
        <Photo src={hero.image} alt={hero.name} gradient={hero.gradient} className="h-72 w-full sm:h-80" />
        <div className="absolute inset-0 bg-scrim" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-on-image sm:p-8">
          <p className="text-xl font-medium sm:text-2xl">{greeting}</p>
          <h1 className="max-w-xl text-3xl font-semibold sm:text-5xl">{m.appName}</h1>
          <Button asChild variant="sun" className="mt-5">
            <Link to="/explore">
              {m.home.findNext} <ArrowRight className="rtl-flip" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl bg-card p-5 shadow-soft">
            <p className="font-display text-4xl font-semibold text-primary">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{m.home.nextTrip}</h2>
            <Link to="/trips" className="text-sm font-semibold text-teal">{m.home.allTrips}</Link>
          </div>
          {nextTrip && nextTripDestination ? (
            <Link to={`/trips/${nextTrip.id}`} className="mt-4 flex items-center gap-4">
              <Photo src={nextTripDestination.image} alt={nextTripDestination.name} gradient={nextTripDestination.gradient} className="h-20 w-20 rounded-2xl" />
              <div>
                <p className="font-semibold">{nextTrip.title}</p>
                <p className="text-sm text-muted-foreground">{nextTrip.startDate} → {nextTrip.endDate}</p>
              </div>
            </Link>
          ) : (
            <div className="mt-4 rounded-2xl bg-muted p-5 text-muted-foreground">
              <p>{m.home.noTrips}</p>
              <Button asChild className="mt-3"><Link to="/trips/new">{m.home.planTrip}</Link></Button>
            </div>
          )}
        </Card>
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-soft">
          <h2 className="font-display text-2xl font-semibold">{fill(m.home.level, { n: Math.floor(xp / 500) + 1 })}</h2>
          <p className="mt-1 text-sm">{fill(m.home.xp, { xp, pct: progress })}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-foreground/20">
            <div className="h-full rounded-full bg-sun" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-sm">{fill(m.home.progress, { done: visitedCount, total: countryPlaces.length })}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">{m.home.quick}</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {quickLinks.map(({ to, key, icon: Icon }) => (
            <Link key={to} to={to} className="flex flex-col items-center gap-2 rounded-3xl bg-card p-4 text-center text-sm font-medium shadow-soft transition-shadow hover:shadow-lift">
              <Icon className="h-6 w-6 text-teal" />
              {m.home.actions[key]}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">{m.home.forYou}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((place) => <PlaceCard key={place.id} place={place} />)}
        </div>
        {suggestions[0] && <p className="mt-3 text-xs text-muted-foreground">{placeCost(suggestions[0])} · {m.common.indicative}</p>}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">{m.home.featured}</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {featured.slice(0, 6).map((d) => <DestinationCard key={d.id} destination={d} />)}
        </div>
      </section>
    </div>
  );
}
