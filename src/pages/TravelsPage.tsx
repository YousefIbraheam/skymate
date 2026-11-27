import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Star, Trash2 } from "lucide-react";
import { destinations, getDestination, getPlace, places } from "../data";
import { actions, useAppState } from "../store/appStore";
import { useI18n } from "../i18n";
import { Button } from "../components/ui/Button";
import { Input, Select, Textarea } from "../components/ui/fields";
import { Photo } from "../components/ui/Photo";
import { Card, EmptyState, PageTitle } from "../components/ui/Section";

export function TravelsPage() {
  const { m } = useI18n();
  const [params] = useSearchParams();
  const journal = useAppState((s) => s.journal);
  const visits = useAppState((s) => s.visits);
  const saved = useAppState((s) => s.saved);
  const customPlaces = useAppState((s) => s.customPlaces);
  const [placeId, setPlaceId] = useState(params.get("place") ?? places[0].id);
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [customName, setCustomName] = useState("");
  const [customDestination, setCustomDestination] = useState(destinations[0].id);
  const [customDate, setCustomDate] = useState(new Date().toISOString().slice(0, 10));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!caption.trim()) return;
    actions.addJournal({ placeId, caption: caption.trim(), date });
    setCaption("");
  };

  const submitCustom = (event: FormEvent) => {
    event.preventDefault();
    if (!customName.trim()) return;
    actions.addCustomPlace({ name: customName.trim(), destinationId: customDestination, date: customDate });
    setCustomName("");
  };

  const visitedPlaces = Object.keys(visits).map((id) => getPlace(id)).filter((p) => p != null);
  const visitedDestinations = [...new Set(visitedPlaces.map((p) => p.destinationId))];
  const cityCount = visitedDestinations.length;
  const regionCount = new Set(visitedDestinations.map((id) => getDestination(id)?.region)).size;
  const countryCount = new Set(visitedDestinations.map((id) => getDestination(id)?.country)).size;

  const stats = [
    { label: m.travels.stats.places, value: visitedPlaces.length + customPlaces.length },
    { label: m.travels.stats.cities, value: cityCount },
    { label: m.travels.stats.regions, value: regionCount },
    { label: m.travels.stats.countries, value: countryCount },
  ];

  const history = Object.entries(visits)
    .map(([id, visit]) => ({ place: getPlace(id), visit }))
    .filter((h) => h.place != null)
    .sort((a, b) => b.visit.date.localeCompare(a.visit.date));

  const miniList = (ids: string[], empty: string) =>
    ids.length ? (
      <ul className="space-y-2">
        {ids.map((id) => {
          const place = getPlace(id);
          return place ? (
            <li key={id}>
              <Link to={`/place/${id}`} className="flex items-center gap-3 rounded-2xl bg-muted p-2">
                <Photo src={place.image} alt={place.name} className="h-12 w-12 rounded-xl" />
                <span className="text-sm font-semibold">{place.name}</span>
              </Link>
            </li>
          ) : null;
        })}
      </ul>
    ) : (
      <p className="text-sm text-muted-foreground">{empty}</p>
    );

  return (
    <div className="space-y-8">
      <PageTitle title={m.travels.title} subtitle={m.travels.subtitle} />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl bg-card p-5 text-center shadow-soft">
            <p className="font-display text-4xl font-semibold text-primary">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      <Card>
        <h2 className="mb-3 text-xl font-semibold">{m.travels.history}</h2>
        {history.length === 0 && customPlaces.length === 0 ? (
          <p className="text-sm text-muted-foreground">{m.travels.emptyHistory}</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {history.map(({ place, visit }) => (
              <li key={place!.id}>
                <Link
                  to={`/place/${place!.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium hover:bg-accent"
                >
                  {place!.name}
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    {visit.date} <Star className="h-3 w-3 fill-current text-sun" /> {visit.rating}
                  </span>
                </Link>
              </li>
            ))}
            {customPlaces.map((p) => (
              <li key={p.id} className="group inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
                {p.name}
                <span className="text-xs text-muted-foreground">{getDestination(p.destinationId)?.name} · {p.date}</span>
                <button type="button" aria-label={m.common.delete} onClick={() => actions.deleteCustomPlace(p.id)} className="text-muted-foreground hover:text-foreground">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 text-xl font-semibold">{m.travels.addPlace}</h2>
        <form onSubmit={submitCustom} className="grid gap-3 sm:grid-cols-3">
          <Input aria-label={m.travels.placeName} placeholder={m.travels.placeNamePlaceholder} value={customName} onChange={(e) => setCustomName(e.target.value)} />
          <Select aria-label={m.travels.where} value={customDestination} onChange={(e) => setCustomDestination(e.target.value)}>
            {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Input type="date" aria-label={m.travels.when} value={customDate} onChange={(e) => setCustomDate(e.target.value)} />
          <Button type="submit" className="sm:col-span-3">{m.travels.addPlaceButton}</Button>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card><h2 className="mb-3 text-xl font-semibold">{m.travels.visited}</h2>{miniList(Object.keys(visits), m.travels.empty)}</Card>
        <Card><h2 className="mb-3 text-xl font-semibold">{m.travels.bucket}</h2>{miniList(saved, m.travels.emptyBucket)}</Card>
      </div>

      <Card>
        <h2 className="mb-3 text-xl font-semibold">{m.travels.add}</h2>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
          <Select aria-label={m.travels.place} value={placeId} onChange={(e) => setPlaceId(e.target.value)}>
            {places.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <Input type="date" aria-label={m.travels.date} value={date} onChange={(e) => setDate(e.target.value)} />
          <Textarea className="sm:col-span-2" placeholder={m.travels.caption} value={caption} onChange={(e) => setCaption(e.target.value)} />
          <Button type="submit" className="sm:col-span-2">{m.common.add}</Button>
        </form>
      </Card>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">{m.travels.journal}</h2>
        {journal.length === 0 && <EmptyState>{m.travels.empty}</EmptyState>}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {journal.map((entry) => {
            const place = getPlace(entry.placeId);
            return (
              <article key={entry.id} className="relative overflow-hidden rounded-3xl bg-card shadow-soft">
                <Photo src={place?.image} alt={place?.name ?? ""} className="aspect-[4/3] w-full" />
                <div className="p-4">
                  <p className="font-semibold">{place?.name}</p>
                  <p className="text-sm text-muted-foreground">{entry.date}</p>
                  <p className="mt-2 text-sm">{entry.caption}</p>
                </div>
                <Button variant="glass" size="icon" className="absolute end-3 top-3" aria-label={m.common.delete} onClick={() => actions.deleteJournal(entry.id)}>
                  <Trash2 />
                </Button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
