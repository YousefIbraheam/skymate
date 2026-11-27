import { Award, Camera, Trash2 } from "lucide-react";
import { actions, useAppState } from "../store/appStore";
import { categories, countries, getDestination, getPlace } from "../data";
import { useI18n } from "../i18n";
import { Input, Select, Textarea } from "../components/ui/fields";
import { Card, PageTitle } from "../components/ui/Section";
import { LanguageSwitch } from "../components/layout/LanguageSwitch";
import { cn } from "../lib/cn";

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 py-2 text-sm">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-7 w-12 rounded-full transition-colors", checked ? "bg-primary" : "bg-muted")}
      >
        <span className={cn("absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-all", checked ? "start-[1.4rem]" : "start-0.5")} />
      </button>
    </label>
  );
}

function FilePick({ label, onPick }: { label: string; onPick: (dataUrl: string) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-accent">
      <Camera className="h-4 w-4" /> {label}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => typeof reader.result === "string" && onPick(reader.result);
          reader.readAsDataURL(file);
          e.target.value = "";
        }}
      />
    </label>
  );
}

export function ProfilePage() {
  const { m, fill } = useI18n();
  const s = useAppState((state) => state);

  const visitedPlaces = Object.keys(s.visits).map((id) => getPlace(id)).filter((p) => p != null);
  const visitedDestinations = [...new Set(visitedPlaces.map((p) => p.destinationId))];
  const cityCount = visitedDestinations.length;
  const countryCount = new Set(visitedDestinations.map((id) => getDestination(id)?.country)).size;
  const xp = Object.keys(s.visits).length * 140;

  const counters = [
    { label: m.profile.placesVisited, value: Object.keys(s.visits).length },
    { label: m.profile.memories, value: s.journal.length },
    { label: m.profile.dishesTried, value: s.foodTried.length },
    { label: m.profile.stops, value: s.trips.reduce((n, t) => n + t.days.flat().length, 0) },
    { label: m.profile.citiesLabel, value: cityCount },
    { label: m.profile.countriesLabel, value: countryCount },
  ];

  const byCategory = categories
    .map((c) => ({ ...c, count: visitedPlaces.filter((p) => p.category === c.id).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
  const maxCategory = byCategory[0]?.count ?? 1;

  const achievements: { key: keyof typeof m.profile.ach; value: number; target: number }[] = [
    { key: "firstFootprints", value: Object.keys(s.visits).length, target: 1 },
    { key: "gettingGoing", value: Object.keys(s.visits).length, target: 5 },
    { key: "seasoned", value: Object.keys(s.visits).length, target: 10 },
    { key: "cityCollector", value: cityCount, target: 3 },
    { key: "cityHopper", value: cityCount, target: 8 },
    { key: "acrossBorders", value: countryCount, target: 2 },
    { key: "continental", value: countryCount, target: 4 },
    { key: "memoryKeeper", value: s.journal.length, target: 1 },
    { key: "storyteller", value: s.journal.length, target: 5 },
    { key: "bucketFiller", value: s.saved.length, target: 5 },
    { key: "dreamList", value: s.saved.length, target: 15 },
    { key: "foodie", value: s.foodTried.length, target: 3 },
    { key: "foodAdventurer", value: s.foodTried.length, target: 10 },
    { key: "planner", value: s.trips.length, target: 1 },
  ];

  const clearData = () => {
    if (!window.confirm(m.profile.clearConfirm)) return;
    actions.clearAllData();
    window.location.reload();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageTitle title={m.profile.title} />

      <Card className="overflow-hidden p-0">
        <div
          className="h-32 w-full bg-gradient-to-br from-teal to-ocean bg-cover bg-center"
          style={s.cover ? { backgroundImage: `url(${s.cover})` } : undefined}
        />
        <div className="-mt-10 flex items-end gap-4 px-5">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-3xl font-bold text-primary-foreground ring-4 ring-card">
            {s.avatar ? <img src={s.avatar} alt="" className="h-full w-full object-cover" /> : (s.name || "T").slice(0, 1).toUpperCase()}
          </div>
          <div className="pb-1">
            <p className="text-xl font-semibold">{s.name || m.profile.name}</p>
            <p className="text-sm text-muted-foreground">{fill(m.home.level, { n: Math.floor(xp / 500) + 1 })} · {xp} XP</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 px-5 py-4">
          <FilePick label={m.profile.avatar} onPick={(url) => actions.update({ avatar: url })} />
          <FilePick label={m.profile.cover} onPick={(url) => actions.update({ cover: url })} />
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-xl font-semibold">{m.profile.analytics}</h2>
        <div className="grid grid-cols-3 gap-3">
          {counters.map((c) => (
            <div key={c.label} className="rounded-2xl bg-muted p-3 text-center">
              <p className="text-2xl font-semibold text-primary">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>
        {byCategory.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">{m.profile.byCategory}</p>
            {byCategory.map((c) => (
              <div key={c.id} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 truncate">{c.emoji} {c.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-teal" style={{ width: `${(c.count / maxCategory) * 100}%` }} />
                </div>
                <span className="w-6 text-end text-xs text-muted-foreground">{c.count}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold"><Award className="h-5 w-5 text-sun" /> {m.profile.achievements}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {achievements.map(({ key, value, target }) => {
            const [name, description] = m.profile.ach[key];
            const done = value >= target;
            return (
              <li key={key} className={cn("rounded-2xl p-3", done ? "bg-accent" : "bg-muted")}>
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                  <div className={cn("h-full rounded-full", done ? "bg-emerald-600" : "bg-sun")} style={{ width: `${Math.min(100, (value / target) * 100)}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="space-y-4">
        <label className="block text-sm font-medium">{m.profile.name}<Input className="mt-1" value={s.name} onChange={(e) => actions.update({ name: e.target.value })} /></label>
        <label className="block text-sm font-medium">{m.profile.bio}<Textarea className="mt-1" placeholder={m.profile.bioPlaceholder} value={s.bio} onChange={(e) => actions.update({ bio: e.target.value })} /></label>
        <label className="block text-sm font-medium">
          {m.profile.country}
          <Select className="mt-1 w-full" value={s.country} onChange={(e) => actions.update({ country: e.target.value })}>
            {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </Select>
        </label>
        <div>
          <p className="mb-2 text-sm font-medium">{m.shell.language}</p>
          <LanguageSwitch />
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-xl font-semibold">{m.profile.interests}</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={s.interests.includes(c.id)}
              onClick={() => actions.toggleInterest(c.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                s.interests.includes(c.id) ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent",
              )}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 text-xl font-semibold">{m.profile.appearance}</h2>
        <Toggle label={m.profile.dark} checked={s.theme === "dark"} onChange={(v) => actions.update({ theme: v ? "dark" : "light" })} />
        <h2 className="mb-1 mt-4 text-xl font-semibold">{m.profile.reminders}</h2>
        <Toggle label={m.profile.tripReminders} checked={s.notifications.tripReminders} onChange={(v) => actions.update({ notifications: { ...s.notifications, tripReminders: v } })} />
        <Toggle label={m.profile.journalReminders} checked={s.notifications.journalReminders} onChange={(v) => actions.update({ notifications: { ...s.notifications, journalReminders: v } })} />
        <h2 className="mb-1 mt-4 text-xl font-semibold">{m.profile.privacy}</h2>
        <Toggle label={m.profile.preciseLocation} checked={s.privacy.preciseLocation} onChange={(v) => actions.update({ privacy: { ...s.privacy, preciseLocation: v } })} />
        <Toggle label={m.profile.shareJournal} checked={s.privacy.shareJournal} onChange={(v) => actions.update({ privacy: { ...s.privacy, shareJournal: v } })} />
        <Toggle label={m.profile.usageStats} checked={s.privacy.usageStats} onChange={(v) => actions.update({ privacy: { ...s.privacy, usageStats: v } })} />
      </Card>

      <Card>
        <h2 className="mb-2 text-xl font-semibold">{m.profile.about}</h2>
        <p className="text-sm text-muted-foreground">{m.profile.aboutText}</p>
        <button
          type="button"
          onClick={clearData}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90"
        >
          <Trash2 className="h-4 w-4" /> {m.profile.clearData}
        </button>
      </Card>
    </div>
  );
}
