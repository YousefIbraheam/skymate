import { getDestination, getPlace } from "../data";
import type { Trip } from "../store/appStore";

const DAY_MS = 86_400_000;

/** Number of days in a trip (inclusive of both dates, minimum 1). */
export function tripDays(trip: Pick<Trip, "startDate" | "endDate">) {
  const days = Math.round((Date.parse(trip.endDate) - Date.parse(trip.startDate)) / DAY_MS) + 1;
  return Number.isFinite(days) && days > 0 ? days : 1;
}

/** Estimated cost per person: daily budget for each day plus entry costs of planned places. */
export function tripCostPerPerson(trip: Trip) {
  const destination = getDestination(trip.destinationId);
  const entries = trip.days.flat().reduce((sum, id) => sum + (getPlace(id)?.cost ?? 0), 0);
  return (destination?.dailyBudget ?? 0) * tripDays(trip) + entries;
}
