import { Link } from "react-router-dom";
import { countries, destinations, places } from "../data";
import { useI18n } from "../i18n";
import { Flag } from "../components/ui/Flag";
import { DestinationCard } from "../components/ui/Cards";

export function RegionsPage() {
  const { m, fill } = useI18n();
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
              const count = places.filter((p) => list.some((d) => d.id === p.destinationId)).length;
              return (
                <div key={region}>
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="text-xl font-semibold">{region}</h3>
                    <span className="text-xs text-muted-foreground">{fill(m.regions.places, { n: count })}</span>
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
