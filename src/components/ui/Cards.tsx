import { Link } from "react-router-dom";
import { Bookmark, MapPin, Star } from "lucide-react";
import type { Destination, Place } from "../../data/types";
import { categories, placeCost } from "../../data";
import { actions, useAppState } from "../../store/appStore";
import { Photo } from "./Photo";
import { cn } from "../../lib/cn";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      to={`/destination/${destination.id}`}
      className="group relative block overflow-hidden rounded-3xl shadow-soft transition-shadow hover:shadow-lift"
    >
      <Photo src={destination.image} alt={destination.name} gradient={destination.gradient} className="h-48 w-full transition-transform duration-700 group-hover:scale-105 sm:h-56" />
      <div className="absolute inset-0 bg-scrim" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-on-image">
        <p className="text-xs uppercase tracking-widest opacity-85">{destination.region}</p>
        <h3 className="text-2xl font-semibold">{destination.name}</h3>
        <p className="line-clamp-1 text-sm opacity-90">{destination.tagline}</p>
      </div>
    </Link>
  );
}

export function PlaceCard({ place }: { place: Place }) {
  const saved = useAppState((s) => s.saved.includes(place.id));
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-card shadow-soft transition-shadow hover:shadow-lift">
      <Link to={`/place/${place.id}`} className="block">
        <div className="overflow-hidden">
          <Photo src={place.image} alt={place.name} className="h-36 w-full transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{categories.find((c) => c.id === place.category)?.label ?? place.category}</span>
            <span className="ms-auto flex items-center gap-0.5 font-semibold text-foreground">
              <Star className="h-3 w-3 fill-sun text-sun" />
              {place.rating.toFixed(1)}
            </span>
          </div>
          <h3 className="mt-1 line-clamp-1 font-semibold">{place.name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{place.description}</p>
          <p className="mt-2 text-xs font-semibold text-teal">{placeCost(place)}</p>
        </div>
      </Link>
      <button
        type="button"
        aria-pressed={saved}
        aria-label={`Save ${place.name}`}
        onClick={() => actions.toggleSaved(place.id)}
        className="absolute end-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/85 shadow-soft backdrop-blur"
      >
        <Bookmark className={cn("h-4 w-4", saved && "fill-sun text-sun")} />
      </button>
    </div>
  );
}
