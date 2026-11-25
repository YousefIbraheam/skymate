import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Flame, Heart } from "lucide-react";
import { dishes, formatMoney, getDestination } from "../data";
import { actions, useAppState } from "../store/appStore";
import { useI18n } from "../i18n";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/fields";
import { Photo } from "../components/ui/Photo";
import { cn } from "../lib/cn";

export function FoodPage() {
  const { m, lang } = useI18n();
  const country = useAppState((s) => s.country);
  const wanted = useAppState((s) => s.foodWanted);
  const tried = useAppState((s) => s.foodTried);
  const [query, setQuery] = useState("");
  const [mineOnly, setMineOnly] = useState(true);
  const [region, setRegion] = useState("");
  useEffect(() => setRegion(""), [lang]);

  const inScope = dishes.filter((d) => !mineOnly || getDestination(d.destinationId)?.country === country);
  const regions = [...new Set(inScope.map((d) => getDestination(d.destinationId)?.region ?? ""))].filter(Boolean).sort();
  const q = query.trim().toLowerCase();
  const visible = inScope.filter(
    (d) =>
      (!region || getDestination(d.destinationId)?.region === region) &&
      (!q || [d.name, d.description, d.where].some((s) => s.toLowerCase().includes(q))),
  );

  return (
    <div>
      <Input aria-label={m.food.search} placeholder={m.food.search} value={query} onChange={(e) => setQuery(e.target.value)} className="mb-3" />
      <div className="mb-6 flex flex-wrap gap-2">
        <Button size="sm" variant={mineOnly ? "default" : "outline"} onClick={() => { setMineOnly(true); setRegion(""); }}>{m.food.mine}</Button>
        <Button size="sm" variant={mineOnly ? "outline" : "default"} onClick={() => { setMineOnly(false); setRegion(""); }}>{m.food.everywhere}</Button>
      </div>
      <Select aria-label="Food region" className="mb-5 max-w-full" value={region} onChange={(e) => setRegion(e.target.value)}>
        <option value="">{m.food.allRegions}</option>
        {regions.map((r) => <option key={r} value={r}>{r}</option>)}
      </Select>
      <p className="mb-4 text-xs text-muted-foreground">{m.food.note}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((dish) => {
          const destination = getDestination(dish.destinationId);
          return (
            <article key={dish.id} className="overflow-hidden rounded-3xl bg-card shadow-soft">
              <Photo src={dish.image} alt={dish.name} gradient={destination?.gradient} className="aspect-[4/3] w-full" />
              <div className="p-5">
                <div className="flex items-center justify-between text-xs">
                  <Link to={`/destination/${dish.destinationId}`} className="font-semibold text-teal hover:underline">{destination?.name}</Link>
                  <span className="flex" aria-label={`Spice level ${dish.spice} of 3`}>
                    {Array.from({ length: dish.spice }, (_, i) => <Flame key={i} className="h-3.5 w-3.5 text-sun" />)}
                  </span>
                </div>
                <h2 className="mt-1 text-xl font-semibold">{dish.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{dish.description}</p>
                <p className="mt-3 flex items-center justify-between text-sm">
                  <span>{dish.where}</span>
                  <span className="rounded-full bg-accent px-2.5 py-1 font-semibold text-accent-foreground">
                    {dish.price ? formatMoney(dish.price, dish.destinationId) : dish.veg ? m.food.veg : m.food.nonVeg}
                  </span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant={wanted.includes(dish.id) ? "default" : "outline"} aria-pressed={wanted.includes(dish.id)} aria-label={`${m.food.want} ${dish.name}`} onClick={() => actions.toggleFoodWanted(dish.id)}>
                    <Heart className={cn(wanted.includes(dish.id) && "fill-current")} /> {m.food.want}
                  </Button>
                  <Button size="sm" variant={tried.includes(dish.id) ? "default" : "outline"} aria-pressed={tried.includes(dish.id)} aria-label={`${m.food.tried} ${dish.name}`} onClick={() => actions.toggleFoodTried(dish.id)}>
                    <Check /> {m.food.tried}
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
