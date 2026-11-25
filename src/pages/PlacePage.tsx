import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Clock, Info, Star, Trash2, Wallet } from "lucide-react";
import { categories, formatMoney, getDestination, getPlace } from "../data";
import { actions, useAppState } from "../store/appStore";
import { useI18n } from "../i18n";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/fields";
import { Photo } from "../components/ui/Photo";
import { Stars } from "../components/ui/Stars";
import { Card, EmptyState } from "../components/ui/Section";

export function PlacePage() {
  const { id = "" } = useParams();
  const { m } = useI18n();
  const place = getPlace(id);
  const visit = useAppState((s) => s.visits[id]);
  const saved = useAppState((s) => s.saved.includes(id));
  const savedNote = useAppState((s) => s.notes[id] ?? "");
  const allReviews = useAppState((s) => s.reviews[id]);
  const reviews = allReviews ?? [];
  const journal = useAppState((s) => s.journal);
  const memories = journal.filter((j) => j.placeId === id);
  const [note, setNote] = useState(savedNote);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  if (!place) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-3xl">{m.place.unavailable}</h1>
        <Link to="/explore" className="text-teal">{m.common.backToExplore}</Link>
      </div>
    );
  }
  const destination = getDestination(place.destinationId);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <Link to={`/destination/${place.destinationId}`} className="inline-flex h-11 items-center gap-2 text-sm font-semibold text-teal">
        <ArrowLeft className="h-4 w-4 rtl-flip" /> {destination?.name}
      </Link>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
            <Photo src={place.image} alt={place.name} className="aspect-[4/3] w-full" />
          </div>
        </div>
        <div className="space-y-5 lg:col-span-2">
          <p className="text-sm font-semibold text-teal">{categories.find((c) => c.id === place.category)?.label ?? place.category}</p>
          <h1 className="mt-1 text-4xl font-semibold">{place.name}</h1>
          <p className="text-muted-foreground">{place.description}</p>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-2xl bg-card p-3 shadow-soft"><Star className="mx-auto mb-1 h-4 w-4 fill-sun text-sun" />{place.rating.toFixed(1)}</div>
            <div className="rounded-2xl bg-card p-3 shadow-soft"><Clock className="mx-auto mb-1 h-4 w-4 text-teal" />{place.hours} h</div>
            <div className="rounded-2xl bg-card p-3 shadow-soft"><Wallet className="mx-auto mb-1 h-4 w-4 text-teal" />{formatMoney(place.cost, place.destinationId)}</div>
          </div>
          <p className="text-xs text-muted-foreground">{m.common.indicative}</p>
          <p className="flex gap-2 rounded-2xl bg-accent p-4 text-sm text-accent-foreground"><Info className="h-4 w-4 shrink-0" /> {place.tip}</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline"><Link to={`/map?destination=${place.destinationId}`}>{m.common.showOnMap}</Link></Button>
            <Button variant={saved ? "secondary" : "default"} onClick={() => actions.toggleSaved(place.id)}>
              <Bookmark className={saved ? "fill-sun text-sun" : ""} /> {saved ? m.place.saved : m.place.save}
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{m.place.visited}</h2>
          <Button size="sm" variant={visit ? "secondary" : "default"} onClick={() => actions.setVisit(place.id, visit ? null : { date: today, rating: 0 })}>
            {visit ? m.common.delete : m.place.visited}
          </Button>
        </div>
        {visit && (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label className="text-sm">
              {m.place.date}
              <Input type="date" className="mt-1 w-44" value={visit.date} onChange={(e) => actions.setVisit(place.id, { ...visit, date: e.target.value })} />
            </label>
            <div>
              <p className="text-sm">{m.place.yourRating}</p>
              <Stars label={m.place.yourRating} value={visit.rating} onChange={(rating) => actions.setVisit(place.id, { ...visit, rating })} />
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">{m.place.notes}</h2>
        <Textarea className="mt-3" placeholder={m.place.notesPlaceholder} value={note} onChange={(e) => setNote(e.target.value)} />
        <Button className="mt-3" onClick={() => actions.setNote(place.id, note)}>{m.place.saveNote}</Button>
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{m.place.memories}</h2>
          <Button asChild size="sm" variant="outline"><Link to={`/travels?place=${place.id}`}>{m.place.addMemory}</Link></Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {memories.map((j) => (
            <Link key={j.id} to="/travels" className="overflow-hidden rounded-lg bg-card p-3">
              <p className="mt-2 font-semibold">{j.caption}</p>
              <p className="text-sm text-muted-foreground">{j.date}</p>
            </Link>
          ))}
        </div>
      </section>

      <Card>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-2xl font-semibold">{m.place.reviews}</h2>
          <span className="text-sm text-muted-foreground">{reviews.length}</span>
        </div>
        <Stars label="Review rating" value={reviewRating} onChange={setReviewRating} />
        <Textarea aria-label="Review text" placeholder={m.place.reviewPlaceholder} value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
        <Button
          className="mt-3"
          disabled={!reviewText.trim()}
          onClick={() => {
            actions.addReview(place.id, { rating: reviewRating, text: reviewText.trim() });
            setReviewText("");
          }}
        >
          {m.place.postReview}
        </Button>
        <div className="mt-4 space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="flex gap-3 rounded-2xl bg-muted p-3">
              <div className="flex-1">
                <p className="text-sm font-semibold">{"★".repeat(r.rating)}<span className="ms-2 font-normal text-muted-foreground">{r.date}</span></p>
                <p className="text-sm">{r.text}</p>
              </div>
              <button type="button" aria-label={m.common.delete} onClick={() => actions.deleteReview(place.id, r.id)}><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
