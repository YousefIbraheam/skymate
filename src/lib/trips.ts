import { getPlace } from "../data";
import type { Trip } from "../store/appStore";

const DAY_MS = 86_400_000;

/** Number of days in a trip (inclusive of both dates, minimum 1). */
export function tripDays(trip: Pick<Trip, "startDate" | "endDate">) {
  const days = Math.round((Date.parse(trip.endDate) - Date.parse(trip.startDate)) / DAY_MS) + 1;
  return Number.isFinite(days) && days > 0 ? days : 1;
}

/** Estimated cost per person: entry costs of the places planned in the trip. Removing a place lowers it. */
export function tripCostPerPerson(trip: Trip) {
  return trip.days.flat().reduce((sum, id) => sum + (getPlace(id)?.cost ?? 0), 0);
}
