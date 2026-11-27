import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { approveCommunitySpot, listCommunitySpots, rejectCommunitySpot, seedSpotsAr, type CommunitySpot } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n";
import { Button } from "../components/ui/Button";
import { Card, EmptyState, PageTitle } from "../components/ui/Section";

/** Hidden moderation page (not in the nav): review pending community spots. */
export function AdminPage() {
  const { m, lang } = useI18n();
  const { user } = useAuth();
  const [pending, setPending] = useState<CommunitySpot[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = () => listCommunitySpots().then((all) => setPending(all.filter((s) => s.status === "pending")));
  useEffect(() => {
    refresh();
  }, []);

  if (!user) {
    return (
      <div className="space-y-6">
        <PageTitle title={m.admin.title} />
        <Card>
          <p className="text-sm text-muted-foreground">{m.admin.signInFirst}</p>
          <Link to="/auth" className="mt-3 inline-block text-sm font-semibold text-teal">
            {m.auth.signIn}
          </Link>
        </Card>
      </div>
    );
  }

  const moderate = async (id: string, action: "approve" | "reject") => {
    setBusy(id);
    if (action === "approve") await approveCommunitySpot(id);
    else await rejectCommunitySpot(id);
    setBusy(null);
    refresh();
  };

  return (
    <div className="space-y-6">
      <PageTitle title={m.admin.title} subtitle={m.admin.subtitle} />
      <Card>
        <p className="text-sm text-muted-foreground">{m.admin.demoNote}</p>
      </Card>
      <h2 className="text-xl font-semibold">{m.admin.pending}</h2>
      {pending.length === 0 && <EmptyState>{m.admin.empty}</EmptyState>}
      <div className="grid gap-4 sm:grid-cols-2">
        {pending.map((raw) => {
          const spot = lang === "ar" && seedSpotsAr[raw.id] ? { ...raw, ...seedSpotsAr[raw.id] } : raw;
          return (
            <article key={spot.id} className="rounded-3xl bg-card p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal">{spot.where}</p>
              <h3 className="mt-1 text-xl font-semibold">{spot.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{spot.text}</p>
              <p className="mt-3 text-xs text-muted-foreground">{spot.author}</p>
              <div className="mt-4 flex gap-2">
                <Button disabled={busy === spot.id} onClick={() => moderate(spot.id, "approve")}>
                  {m.admin.approve}
                </Button>
                <Button variant="outline" disabled={busy === spot.id} onClick={() => moderate(spot.id, "reject")}>
                  {m.admin.reject}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
