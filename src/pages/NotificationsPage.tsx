import { Link } from "react-router-dom";
import { Bell, Plane, UtensilsCrossed } from "lucide-react";
import { dishes, getPlace } from "../data";
import { actions, useAppState } from "../store/appStore";
import { useI18n } from "../i18n";
import { EmptyState, PageTitle } from "../components/ui/Section";
import { cn } from "../lib/cn";

interface Reminder { id: string; to: string; title: string; text: string; icon: typeof Bell }

/** In-app reminders only: derived from trips, the food list and the journal. */
export function NotificationsPage() {
  const { m, fill } = useI18n();
  const { trips, foodWanted, journal, readNotifications, notifications } = useAppState((s) => s);
  const today = new Date().toISOString().slice(0, 10);

  const reminders: Reminder[] = [
    ...(notifications.tripReminders
      ? trips.filter((t) => t.startDate >= today).map((t) => ({ id: `trip-${t.id}`, to: `/trips/${t.id}`, icon: Plane, title: m.notifications.tripTitle, text: fill(m.notifications.tripText, { title: t.title, date: t.startDate }) }))
      : []),
    ...foodWanted.slice(0, 3).flatMap((id) => {
      const dish = dishes.find((d) => d.id === id);
      return dish ? [{ id: `food-${id}`, to: "/food", icon: UtensilsCrossed, title: m.notifications.foodTitle, text: fill(m.notifications.foodText, { name: dish.name, place: dish.where }) }] : [];
    }),
    ...(notifications.journalReminders
      ? journal.slice(0, 2).map((j) => ({ id: `journal-${j.id}`, to: "/travels", icon: Bell, title: m.notifications.journalTitle, text: fill(m.notifications.journalText, { place: getPlace(j.placeId)?.name ?? "" }) }))
      : []),
  ];

  return (
    <div>
      <PageTitle title={m.notifications.title} />
      <p className="mb-4 text-sm text-muted-foreground">{m.notifications.note}</p>
      {reminders.length === 0 && <EmptyState>{m.notifications.empty}</EmptyState>}
      <ul className="space-y-3">
        {reminders.map(({ id, to, title, text, icon: Icon }) => (
          <li key={id}>
            <Link to={to} onClick={() => actions.markNotificationRead(id)} className={cn("flex gap-3 rounded-3xl bg-card p-4 shadow-soft", readNotifications.includes(id) && "opacity-60")}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"><Icon className="h-5 w-5" /></span>
              <span>
                <span className="block font-semibold">{title}</span>
                <span className="text-sm text-muted-foreground">{text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
