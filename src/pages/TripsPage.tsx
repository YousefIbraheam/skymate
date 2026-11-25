import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { getDestination } from "../data";
import { actions, useAppState } from "../store/appStore";
import { useI18n } from "../i18n";
import { Button } from "../components/ui/Button";
import { Photo } from "../components/ui/Photo";
import { PageTitle } from "../components/ui/Section";
import { tripDays } from "../lib/trips";

export function TripsPage() {
  const { m, fill } = useI18n();
  const trips = useAppState((s) => s.trips);

  return (
    <div>
      <PageTitle title={m.trips.title} />
      <div className="grid gap-4 sm:grid-cols-2">
        {trips.map((trip) => {
          const destination = getDestination(trip.destinationId);
          return (
            <div key={trip.id} className="relative overflow-hidden rounded-3xl bg-card shadow-soft">
              <Link to={`/trips/${trip.id}`} className="block">
                <Photo src={destination?.image} alt={destination?.name ?? ""} gradient={destination?.gradient} className="h-40 w-full" />
                <div className="p-5">
                  <h2 className="text-xl font-semibold">{trip.title}</h2>
                  <p className="text-sm text-muted-foreground">{destination?.name} · {trip.startDate} → {trip.endDate}</p>
                  <p className="mt-3 flex justify-between text-sm">
                    <span>{fill(m.trips.nights, { n: tripDays(trip) })}</span>
                    <span>{trip.travellers} {m.trips.travellers}</span>
                  </p>
                </div>
              </Link>
              <Button variant="glass" size="icon" className="absolute end-3 top-3" aria-label={`${m.common.delete} ${trip.title}`} onClick={() => actions.deleteTrip(trip.id)}>
                <Trash2 />
              </Button>
            </div>
          );
        })}
        <Link to="/trips/new" className="grid min-h-40 place-items-center rounded-3xl border-2 border-dashed p-6 text-center font-semibold text-teal">
          + {m.trips.empty}
        </Link>
      </div>
    </div>
  );
}
