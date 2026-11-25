import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { categories, countries, destinations, dishes, getCountry, getDestination, places } from "../data";
import { useI18n } from "../i18n";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/fields";
import { DestinationCard, PlaceCard } from "../components/ui/Cards";
import { EmptyState } from "../components/ui/Section";

type Sort = "rating" | "cost" | "name";

export function ExplorePage() {
  const { m, lang } = useI18n();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const country = params.get("country") ?? "";
  const region = params.get("region") ?? "";
  const sort = (params.get("sort") ?? "rating") as Sort;

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "country") next.delete("region");
    setParams(next, { replace: true });
  };

  const regions = useMemo(
    () => [...new Set(destinations.filter((d) => !country || d.country === country).map((d) => d.region))].sort(),
    [country, lang],
  );
  useEffect(() => {
    setParams((prev) => {
      if (!prev.get("region")) return prev;
      const next = new URLSearchParams(prev);
      next.delete("region");
      return next;
    }, { replace: true });
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = query.trim().toLowerCase();
  const filteredDestinations = destinations.filter(
    (d) =>
      (!country || d.country === country) &&
      (!region || d.region === region) &&
      (!q || [d.name, d.region, d.tagline, ...d.tags].some((s) => s.toLowerCase().includes(q))),
  );
  const filteredPlaces = places
    .filter((p) => {
      const d = getDestination(p.destinationId);
      return (
        (!category || p.category === category) &&
        (!country || d?.country === country) &&
        (!region || d?.region === region) &&
        (!q || [p.name, p.description, p.category, d?.name ?? ""].some((s) => s.toLowerCase().includes(q)))
      );
    })
    .sort((a, b) => (sort === "rating" ? b.rating - a.rating : sort === "cost" ? a.cost - b.cost : a.name.localeCompare(b.name)))
    .slice(0, 30);
  const filteredDishes = q
    ? dishes.filter((d) => [d.name, d.description, d.where].some((s) => s.toLowerCase().includes(q))).slice(0, 4)
    : [];
  const hasFilters = Boolean(query || category || country || region);

  return (
    <div>
      <div aria-label="Categories" className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 py-1">
        <Button size="sm" variant={category ? "outline" : "default"} onClick={() => setParam("category", "")}>{m.common.all}</Button>
        {categories.map((c) => (
          <Button key={c.id} size="sm" variant={category === c.id ? "default" : "outline"} onClick={() => setParam("category", c.id)}>
            <span aria-hidden>{c.emoji}</span> {c.label}
          </Button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Select aria-label="Country filter" value={country} onChange={(e) => setParam("country", e.target.value)}>
          <option value="">{m.explore.allCountries}</option>
          {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
        </Select>
        <Select aria-label="Region filter" value={region} onChange={(e) => setParam("region", e.target.value)}>
          <option value="">{m.explore.allRegions}</option>
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </Select>
        <Select aria-label={m.explore.sort} value={sort} onChange={(e) => setParam("sort", e.target.value)}>
          <option value="rating">{m.explore.topRated}</option>
          <option value="cost">{m.explore.lowestCost}</option>
          <option value="name">{m.explore.nameAZ}</option>
        </Select>
        {hasFilters && (
          <Button variant="ghost" onClick={() => setParams({}, { replace: true })}>{m.explore.clear}</Button>
        )}
      </div>

      {filteredDestinations.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">{m.explore.destinations}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {filteredDestinations.slice(0, 9).map((d) => <DestinationCard key={d.id} destination={d} />)}
          </div>
        </section>
      )}

      {filteredDishes.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-2xl font-semibold">{m.explore.dishes}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredDishes.map((d) => (
              <Link key={d.id} to="/food" className="rounded-lg border bg-card p-4">
                <p className="font-semibold">{d.name}</p>
                <p className="text-sm text-muted-foreground">{d.where} · {getCountry(getDestination(d.destinationId)?.country ?? "")?.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">{m.explore.places}</h2>
        {filteredPlaces.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlaces.map((p) => <PlaceCard key={p.id} place={p} />)}
          </div>
        ) : (
          <EmptyState>{m.explore.nothing}</EmptyState>
        )}
      </section>
    </div>
  );
}
