import type { Category, Country, Destination, DestinationFacts, Dish, Place } from "./types";
import countriesJson from "./countries.json";
import categoriesJson from "./categories.json";
import destinationsJson from "./destinations.json";
import placesJson from "./places.json";
import foodJson from "./food.json";
import bestMonthsJson from "./bestMonths.json";
import wikiJson from "./wiki.json";
import factsJson from "./facts.json";
import { getDataLang, arFacts, arWiki, localizeCategories, localizeCountries, localizeList, localizedRecord } from "./localize";

const RATE_TO_USD: Record<string, number> = { INR: 0.012, JPY: 0.0067, IDR: 0.000062, EGP: 0.02 };
const toUsd = (amount: number, countryCode: string) => {
  const currency = (countriesJson as Country[]).find((c) => c.code === countryCode)?.currency ?? "USD";
  const usd = amount * (RATE_TO_USD[currency] ?? 1);
  if (usd === 0) return 0;
  return usd < 10 ? Math.max(1, Math.round(usd)) : Math.round(usd / 5) * 5 || 5;
};
const countryOf = (destinationId: string) => (destinationsJson as Destination[]).find((d) => d.id === destinationId)?.country ?? "";
const usdDestinations = (list: Destination[]) => list.map((d) => ({ ...d, dailyBudget: toUsd(d.dailyBudget, d.country) }));
const usdPlaces = (list: Place[]) => list.map((p) => ({ ...p, cost: toUsd(p.cost, countryOf(p.destinationId)) }));
const usdDishes = (list: Dish[]) => list.map((d) => ({ ...d, price: toUsd(d.price, countryOf(d.destinationId)) }));

export const countries = localizeCountries(countriesJson as Country[], ["name", "language", "blurb"]);
export const categories = localizeCategories(categoriesJson as Category[]);
export const destinations = localizeList(usdDestinations(destinationsJson as Destination[]), "destinations", ["name", "region", "tagline", "description", "bestTime", "tags"]);
export const places = localizeList(usdPlaces(placesJson as Place[]), "places", ["name", "description", "tip"]);
export const dishes = localizeList(usdDishes(foodJson as Dish[]), "food", ["name", "description", "where"]);
export const bestMonths = bestMonthsJson as Record<string, number[]>;
export const wiki = localizedRecord(wikiJson as Record<string, string>, arWiki as Record<string, string>);
export const facts = localizedRecord(factsJson as Record<string, DestinationFacts>, arFacts as Record<string, DestinationFacts>);

export const getCountry = (code: string) => countries.find((c) => c.code === code);
export const getDestination = (id: string) => destinations.find((d) => d.id === id);
export const getPlace = (id: string) => places.find((p) => p.id === id);
export const placesOf = (destinationId: string) => places.filter((p) => p.destinationId === destinationId);
export const dishesOf = (destinationId: string) => dishes.filter((d) => d.destinationId === destinationId);
export const countryOfDestination = (destinationId: string) =>
  getCountry(getDestination(destinationId)?.country ?? "") ?? countries[0];

/** All prices in the mock data are US dollars. */
export function formatMoney(amount: number, _destinationId?: string) {
  if (amount === 0) return getDataLang() === "ar" ? "مجاني" : "Free";
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}
