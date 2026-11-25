import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { listCommunitySpots, submitCommunitySpot, type CommunitySpot } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/fields";
import { Card, EmptyState, PageTitle } from "../components/ui/Section";

export function CommunityPage() {
  const { m } = useI18n();
  const { user } = useAuth();
  const [spots, setSpots] = useState<CommunitySpot[]>([]);
  const [name, setName] = useState("");
  const [where, setWhere] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    listCommunitySpots().then(setSpots);
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const spot = await submitCommunitySpot({ name, where, text });
    setSpots((current) => [spot, ...current]);
    setName(""); setWhere(""); setText("");
  };

  return (
    <div className="space-y-6">
      <PageTitle title={m.community.title} subtitle={m.community.subtitle} />
      <Card>
        <h2 className="mb-3 text-xl font-semibold">{m.community.share}</h2>
        {user ? (
          <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
            <Input required placeholder={m.community.spotName} value={name} onChange={(e) => setName(e.target.value)} />
            <Input required placeholder={m.community.spotWhere} value={where} onChange={(e) => setWhere(e.target.value)} />
            <Textarea required className="sm:col-span-2" placeholder={m.community.spotText} value={text} onChange={(e) => setText(e.target.value)} />
            <Button type="submit" className="sm:col-span-2">{m.community.submit}</Button>
          </form>
        ) : (
          <Link to="/auth" className="text-sm font-semibold text-teal">{m.community.signInFirst}</Link>
        )}
      </Card>
      {spots.length === 0 && <EmptyState>{m.community.empty}</EmptyState>}
      <div className="grid gap-4 sm:grid-cols-2">
        {spots.map((spot) => (
          <article key={spot.id} className="rounded-3xl bg-card p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">{spot.where}</p>
            <h2 className="mt-1 text-xl font-semibold">{spot.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{spot.text}</p>
            <p className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>{spot.author}</span>
              <span>{spot.status === "approved" ? m.community.approved : m.community.pending}</span>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
