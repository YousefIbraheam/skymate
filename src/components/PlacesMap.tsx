import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getDestination, places } from "../data";
import { useAppState } from "../store/appStore";
import { useI18n } from "../i18n";
import { Button } from "./ui/Button";

const COLORS = { visited: "#059669", bucket: "#d97706", memory: "#0d9488", other: "#2563eb" } as const;

type Filter = "all" | "visited" | "bucket" | "memories";

/** Interactive map of every place, colored by its state: visited, bucket list, has memories, or other. */
export function PlacesMap({ destinationId, className = "" }: { destinationId?: string; className?: string }) {
  const { m } = useI18n();
  const visits = useAppState((s) => s.visits);
  const saved = useAppState((s) => s.saved);
  const journal = useAppState((s) => s.journal);
  const [filter, setFilter] = useState<Filter>("all");

  const memoryIds = useMemo(() => new Set(journal.map((j) => j.placeId)), [journal]);

  const stateOf = (placeId: string): keyof typeof COLORS =>
    visits[placeId] ? "visited" : memoryIds.has(placeId) ? "memory" : saved.includes(placeId) ? "bucket" : "other";

  const shown = places.filter((p) => {
    if (destinationId && p.destinationId !== destinationId) return false;
    if (filter === "visited") return Boolean(visits[p.id]);
    if (filter === "bucket") return saved.includes(p.id);
    if (filter === "memories") return memoryIds.has(p.id);
    return true;
  });

  const focus = destinationId ? getDestination(destinationId) : undefined;
  const center: [number, number] = focus ? [focus.lat, focus.lng] : [24, 30];
  const zoom = focus ? 11 : 2;

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: m.common.all },
    { id: "visited", label: m.map.legendVisited },
    { id: "bucket", label: m.map.legendBucket },
    { id: "memories", label: m.map.legendMemory },
  ];

  return (
    <div className={className}>
      <div role="group" aria-label={m.map.title} className="no-scrollbar -mx-1 mb-3 flex gap-2 overflow-x-auto px-1 py-1">
        {filters.map((f) => (
          <Button key={f.id} size="sm" variant={filter === f.id ? "default" : "outline"} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </Button>
        ))}
      </div>
      <MapContainer key={`${center[0]},${center[1]},${zoom}`} center={center} zoom={zoom} scrollWheelZoom className="h-80 w-full rounded-3xl shadow-soft lg:h-[32rem]">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {shown.map((p) => {
          const kind = stateOf(p.id);
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={7}
              pathOptions={{ color: "#ffffff", weight: 1.5, fillColor: COLORS[kind], fillOpacity: 0.9 }}
            >
              <Popup>
                <div style={{ minWidth: 140 }}>
                  <strong>{p.name}</strong>
                  <br />
                  <span style={{ fontSize: 12 }}>{getDestination(p.destinationId)?.name} · ★ {p.rating}</span>
                  <br />
                  <Link to={`/place/${p.id}`} style={{ color: "#0d9488", fontWeight: 600, fontSize: 13 }}>
                    {m.common.showOnMap} →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: COLORS.visited }} /> {m.map.legendVisited}</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: COLORS.bucket }} /> {m.map.legendBucket}</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: COLORS.memory }} /> {m.map.legendMemory}</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: COLORS.other }} /> {m.map.legendOther}</span>
      </div>
    </div>
  );
}

