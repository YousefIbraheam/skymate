import { Link } from "react-router-dom";
import { countries, destinations, places } from "../data";
import { useAppState } from "../store/appStore";
import { useI18n } from "../i18n";
import { Flag } from "../components/ui/Flag";
import { DestinationCard } from "../components/ui/Cards";

export function RegionsPage() {
  const { m, fill } = useI18n();
  const visits = useAppState((s) => s.visits);
  return (
    <div className="space-y-10">
      <h1 className="mb-4 text-3xl font-semibold">{m.regions.title}</h1>
      {countries.map((country) => {
        const regions = [...new Set(destinations.filter((d) => d.country === country.code).map((d) => d.region))].sort();
        return (
          <section key={country.code} className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold"><Flag code={country.code} /> {country.name}</h2>
            {regions.map((region) => {
              const list = destinations.filter((d) => d.country === country.code && d.region === region);
              const regionPlaces = places.filter((p) => list.some((d) => d.id === p.destinationId));
              const count = regionPlaces.length;
              const visitedCount = regionPlaces.filter((p) => visits[p.id]).length;
              const pct = count ? Math.round((visitedCount / count) * 100) : 0;
              return (
                <div key={region}>
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="text-xl font-semibold">{region}</h3>
                    <span className="text-xs text-muted-foreground">{fill(m.regions.visitedProgress, { done: visitedCount, total: count })}</span>
                  </div>
                  <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((d) => <DestinationCard key={d.id} destination={d} />)}
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}
      <Link to="/explore" className="underline">{m.regions.search}</Link>
    </div>
  );
}
