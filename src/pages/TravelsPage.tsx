import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { getPlace, places } from "../data";
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
  const [placeId, setPlaceId] = useState(params.get("place") ?? places[0].id);
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!caption.trim()) return;
    actions.addJournal({ placeId, caption: caption.trim(), date });
    setCaption("");
  };

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
