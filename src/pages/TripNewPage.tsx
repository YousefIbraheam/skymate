import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { destinations, getDestination } from "../data";
import { actions } from "../store/appStore";
import { useI18n } from "../i18n";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/fields";
import { PageTitle } from "../components/ui/Section";
import { tripDays } from "../lib/trips";

export function TripNewPage() {
  const { m } = useI18n();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialDestination = getDestination(params.get("destination") ?? "")?.id ?? destinations[0].id;
  const today = new Date().toISOString().slice(0, 10);

  const [destinationId, setDestinationId] = useState(initialDestination);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [travellers, setTravellers] = useState(2);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const days = tripDays({ startDate, endDate });
    const id = actions.saveTrip({
      title: title.trim() || getDestination(destinationId)?.name || "Trip",
      destinationId,
      startDate,
      endDate: endDate < startDate ? startDate : endDate,
      travellers,
      days: Array.from({ length: days }, () => []),
    });
    navigate(`/trips/${id}`);
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-4">
      <PageTitle title={m.trips.newTitle} />
      <label className="block text-sm font-medium">
        {m.trips.tripName}
        <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="block text-sm font-medium">
        {m.trips.destination}
        <Select className="mt-1 w-full" value={destinationId} onChange={(e) => setDestinationId(e.target.value)}>
          {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}, {d.region}</option>)}
        </Select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium">
          {m.trips.start}
          <Input type="date" className="mt-1" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          {m.trips.end}
          <Input type="date" min={startDate} className="mt-1" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        {m.trips.travellers}
        <Input type="number" min={1} max={20} className="mt-1" value={travellers} onChange={(e) => setTravellers(Math.max(1, Number(e.target.value)))} />
      </label>
      <Button type="submit" size="lg" className="w-full">{m.trips.create}</Button>
    </form>
  );
}
