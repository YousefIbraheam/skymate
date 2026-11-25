import { actions, useAppState } from "../store/appStore";
import { categories, countries } from "../data";
import { useI18n } from "../i18n";
import { Button } from "../components/ui/Button";
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

export function ProfilePage() {
  const { m } = useI18n();
  const s = useAppState((state) => state);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageTitle title={m.profile.title} />
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
            <Button key={c.id} size="sm" variant={s.interests.includes(c.id) ? "default" : "outline"} aria-pressed={s.interests.includes(c.id)} onClick={() => actions.toggleInterest(c.id)}>
              {c.emoji} {c.label}
            </Button>
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
    </div>
  );
}
