import { useSearchParams } from "react-router-dom";
import { destinations, getDestination, placesOf } from "../data";
import { useI18n } from "../i18n";
import { Select } from "../components/ui/fields";
import { Card, PageTitle } from "../components/ui/Section";

/** Embedded OpenStreetMap view for a destination plus a list of its places. */
export function MapPage() {
  const { m } = useI18n();
  const [params, setParams] = useSearchParams();
  const destination = getDestination(params.get("destination") ?? "") ?? destinations[0];
  const list = placesOf(destination.id);

  const pad = 0.08;
  const bbox = [destination.lng - pad, destination.lat - pad, destination.lng + pad, destination.lat + pad].join("%2C");
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${destination.lat}%2C${destination.lng}`;

  return (
    <div>
      <PageTitle title={m.map.title} />
      <Select aria-label={m.map.choose} className="mb-4 w-full sm:w-80" value={destination.id} onChange={(e) => setParams({ destination: e.target.value })}>
        {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}, {d.region}</option>)}
      </Select>
      <div className="grid gap-6 lg:grid-cols-3">
        <iframe title={destination.name} src={embed} className="h-80 w-full rounded-3xl border-0 shadow-soft lg:col-span-2 lg:h-[32rem]" loading="lazy" />
        <Card className="max-h-[32rem] overflow-y-auto">
          <h2 className="mb-3 text-xl font-semibold">{m.map.placesHere}</h2>
          <ul className="space-y-2">
            {list.map((p) => (
              <li key={p.id}>
                <a
                  className="block rounded-2xl bg-muted p-3 text-sm hover:bg-accent"
                  href={`https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}#map=16/${p.lat}/${p.lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="font-semibold">{p.name}</span>
                  <span className="block text-xs text-muted-foreground">{m.map.openIn}</span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
