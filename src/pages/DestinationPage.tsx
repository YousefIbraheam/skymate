import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, Wallet } from "lucide-react";
import { bestMonths, dishesOf, facts, formatMoney, getCountry, getDestination, placesOf, wiki } from "../data";
import { useI18n } from "../i18n";
import { Flag } from "../components/ui/Flag";
import { Button } from "../components/ui/Button";
import { Photo } from "../components/ui/Photo";
import { Card, EmptyState } from "../components/ui/Section";
import { PlaceCard } from "../components/ui/Cards";
import { cn } from "../lib/cn";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function DestinationPage() {
  const { id = "" } = useParams();
  const { m } = useI18n();
  const destination = getDestination(id);
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  if (!destination) return <EmptyState>{m.destination.unavailable}</EmptyState>;

  const country = getCountry(destination.country);
  const stops = placesOf(destination.id);
  const dishes = dishesOf(destination.id);
  const info = facts[destination.id];
  const goodMonths = bestMonths[destination.id] ?? [];
  const history = wiki[destination.id];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] shadow-lift">
        <Photo src={destination.image} alt={destination.name} gradient={destination.gradient} className="h-80 w-full sm:h-[30rem]" />
        <div className="absolute inset-0 bg-scrim" />
        <Button asChild variant="glass" size="icon" className="absolute start-4 top-4 z-10">
          <Link to="/explore" aria-label={m.common.backToExplore}><ArrowLeft className="rtl-flip" /></Link>
        </Button>
        <div className="absolute inset-x-0 bottom-0 p-6 text-on-image sm:p-10">
          <p className="text-sm uppercase tracking-[0.2em]">{destination.region} {country && <Flag code={country.code} className="ms-1 align-middle" />}</p>
          <h1 className="text-5xl font-semibold sm:text-6xl">{destination.name}</h1>
          <p className="mt-1 text-lg">{destination.tagline}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <p className="text-lg leading-relaxed lg:col-span-2">{destination.description}</p>
        <div className="space-y-3 rounded-3xl bg-card p-5 shadow-soft">
          <p className="flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4 text-teal" /> {destination.bestTime}</p>
          <p className="flex items-center gap-2 text-sm"><Wallet className="h-4 w-4 text-teal" /> {m.destination.budget}: {formatMoney(destination.dailyBudget, destination.id)}</p>
          {info && <p className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-teal" /> {m.destination.duration}: {info.duration}</p>}
          <div className="flex flex-wrap gap-2">
            {destination.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{tag}</span>
            ))}
          </div>
          <Button asChild className="w-full"><Link to={`/trips/new?destination=${destination.id}`}>{m.destination.planTrip}</Link></Button>
        </div>
      </section>

      <section className="space-y-4 border-y py-6">
        <h2 className="text-2xl font-semibold">{m.destination.bestTime}</h2>
        <div aria-label="Select travel month" className="grid grid-cols-6 gap-2 sm:grid-cols-12">
          {monthNames.map((name, i) => (
            <button
              key={name}
              type="button"
              aria-pressed={month === i + 1}
              onClick={() => setMonth(i + 1)}
              className={cn(
                "rounded-xl px-1 py-2 text-xs font-semibold",
                goodMonths.includes(i + 1) ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground",
                month === i + 1 && "ring-2 ring-primary",
              )}
            >
              {name}
            </button>
          ))}
        </div>
        {info && <p className="text-sm text-muted-foreground">{info.climate} {info.summary}</p>}
        <p className="text-xs text-muted-foreground">{m.destination.bestTimeNote}</p>
      </section>

      {history && (
        <section>
          <h2 className="mb-3 text-2xl font-semibold">{m.destination.history}</h2>
          <p className="leading-relaxed text-muted-foreground">{history}</p>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-2xl font-semibold">{m.destination.activities}</h2>
        <div className="flex flex-wrap gap-2">
          {info?.activities.map((a) => <span key={a} className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">{a}</span>)}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline"><Link to={`/map?destination=${destination.id}`}>{m.destination.mapDirections}</Link></Button>
          <Button asChild variant="outline"><Link to="/food">{m.destination.foodSpots}</Link></Button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">{m.destination.placesToSee}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stops.map((p) => <PlaceCard key={p.id} place={p} />)}
        </div>
      </section>

      {dishes.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-semibold">{m.destination.dishes}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {dishes.map((d) => (
              <div key={d.id} className="flex gap-4 rounded-3xl bg-card p-3 shadow-soft">
                <Photo src={d.image} alt={d.name} className="h-20 w-20 shrink-0 rounded-2xl" />
                <div>
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm text-muted-foreground">{d.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Card><p className="text-sm text-muted-foreground">{m.destination.gemsNote}</p></Card>
    </div>
  );
}
