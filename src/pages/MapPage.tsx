import { useSearchParams } from "react-router-dom";
import { destinations, getDestination, placesOf } from "../data";
import { useI18n } from "../i18n";
import { PlacesMap } from "../components/PlacesMap";
import { Select } from "../components/ui/fields";
import { Card, PageTitle } from "../components/ui/Section";

/** Interactive map with pins for every place, plus the destination's place list. */
export function MapPage() {
  const { m } = useI18n();
  const [params, setParams] = useSearchParams();
  const destinationParam = params.get("destination") ?? "";
  const destination = getDestination(destinationParam);
  const list = destination ? placesOf(destination.id) : [];

  return (
    <div>
      <PageTitle title={m.map.title} />
      <Select
        aria-label={m.map.choose}
        className="mb-4 w-full sm:w-80"
        value={destination?.id ?? ""}
        onChange={(e) => (e.target.value ? setParams({ destination: e.target.value }) : setParams({}, { replace: true }))}
      >
        <option value="">{m.common.all}</option>
        {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}, {d.region}</option>)}
      </Select>
      <div className="grid gap-6 lg:grid-cols-3">
        <PlacesMap destinationId={destination?.id} className="lg:col-span-2" />
        {destination && (
          <Card className="max-h-[32rem] overflow-y-auto">
            <h2 className="mb-3 text-xl font-semibold">{m.map.placesHere}</h2>
            <ul className="space-y-2">
              {list.map((p) => (
                <li key={p.id}>
                  <a
                    className="block rounded-2xl bg-muted p-3 text-sm hover:bg-accent"
                    href={`https://www.google.com/maps/search/?api=1&query=${p.lat}%2C${p.lng}`}
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
        )}
      </div>
    </div>
  );
}
