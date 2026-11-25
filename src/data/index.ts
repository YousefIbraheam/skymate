import type { Category, Country, Destination, DestinationFacts, Dish, Place } from "./types";
import countriesJson from "./countries.json";
import categoriesJson from "./categories.json";
import destinationsJson from "./destinations.json";
import placesJson from "./places.json";
import foodJson from "./food.json";
import bestMonthsJson from "./bestMonths.json";
import wikiJson from "./wiki.json";
import factsJson from "./facts.json";

export const countries = countriesJson as Country[];
export const categories = categoriesJson as Category[];
export const destinations = destinationsJson as Destination[];
export const places = placesJson as Place[];
export const dishes = foodJson as Dish[];
export const bestMonths = bestMonthsJson as Record<string, number[]>;
export const wiki = wikiJson as Record<string, string>;
export const facts = factsJson as Record<string, DestinationFacts>;

export const getCountry = (code: string) => countries.find((c) => c.code === code);
export const getDestination = (id: string) => destinations.find((d) => d.id === id);
export const getPlace = (id: string) => places.find((p) => p.id === id);
export const placesOf = (destinationId: string) => places.filter((p) => p.destinationId === destinationId);
export const dishesOf = (destinationId: string) => dishes.filter((d) => d.destinationId === destinationId);
export const countryOfDestination = (destinationId: string) =>
  getCountry(getDestination(destinationId)?.country ?? "") ?? countries[0];

export function formatMoney(amount: number, destinationId: string) {
  return `${countryOfDestination(destinationId).symbol}${Math.round(amount).toLocaleString("en-IN")}`;
}
