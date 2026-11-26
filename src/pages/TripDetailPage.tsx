import { useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { formatMoney, placeCost, getDestination, getPlace, placesOf } from "../data";
import { actions, useAppState } from "../store/appStore";
import { useI18n } from "../i18n";
import { Select } from "../components/ui/fields";
import { Card, EmptyState, PageTitle } from "../components/ui/Section";
import { tripCostPerPerson } from "../lib/trips";

export function TripDetailPage() {
  const { id = "" } = useParams();
  const { m, fill } = useI18n();
  const trip = useAppState((s) => s.trips.find((t) => t.id === id));
  if (!trip) return <EmptyState>{m.trips.notFound}</EmptyState>;

  const destination = getDestination(trip.destinationId);
  const options = placesOf(trip.destinationId);
  const total = tripCostPerPerson(trip);

  const setDay = (index: number, placeIds: string[]) =>
    actions.saveTrip({ ...trip, days: trip.days.map((day, i) => (i === index ? placeIds : day)) });

  return (
    <div className="space-y-6">
      <PageTitle title={trip.title} subtitle={`${destination?.name} · ${trip.startDate} → ${trip.endDate} · ${trip.travellers} ${m.trips.travellers}`} />

      <Card>
        <p className="text-sm text-muted-foreground">{m.trips.estimate} ({m.common.perPerson})</p>
        <p className="font-display text-4xl font-semibold text-primary">{total === 0 ? "$0" : formatMoney(total, trip.destinationId)}</p>
        <p className="text-xs text-muted-foreground">{m.common.indicative}</p>
      </Card>

      {trip.days.map((day, index) => (
        <Card key={index}>
          <h2 className="mb-3 text-xl font-semibold">{fill(m.trips.day, { n: index + 1 })}</h2>
          {day.length === 0 && <p className="text-sm text-muted-foreground">{m.trips.noPlaces}</p>}
          <ul className="space-y-2">
            {day.map((placeId) => {
              const place = getPlace(placeId);
              return (
                <li key={placeId} className="flex items-center justify-between rounded-2xl bg-muted p-3">
                  <span className="font-semibold">{place?.name}</span>
                  <span className="flex items-center gap-3 text-sm text-muted-foreground">
                    {place && placeCost(place)}
                    <button type="button" aria-label={m.trips.remove} onClick={() => setDay(index, day.filter((p) => p !== placeId))}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
          <Select
            aria-label={m.trips.addPlace}
            className="mt-3 w-full"
            value=""
            onChange={(e) => e.target.value && setDay(index, [...day, e.target.value])}
          >
            <option value="">+ {m.trips.addPlace}</option>
            {options.filter((p) => !day.includes(p.id)).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </Card>
      ))}
    </div>
  );
}
