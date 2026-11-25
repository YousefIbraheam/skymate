/**
 * Arabic content for the mock data. English stays in the JSON files; Arabic lives
 * in data/ar/*.json keyed by the same ids. Items expose localized fields through
 * getters, so components keep reading `place.name`, `destination.tagline`, etc.
 */
import type { Lang } from "../store/appStore";
import arMisc from "./ar/misc.json";
import arFacts from "./ar/facts.json";
import arWiki from "./ar/wiki.json";
import arPlaces1 from "./ar/places1.json";
import arPlaces2 from "./ar/places2.json";
import arPlaces3 from "./ar/places3.json";

let current: Lang = "en";
export const setDataLang = (lang: Lang) => {
  current = lang;
};

type Row = Record<string, unknown>;
type Table = Record<string, Row>;

const arPlaces: Table = { ...arPlaces1, ...arPlaces2, ...arPlaces3 };
const tables = {
  countries: arMisc.countries as Table,
  categories: arMisc.categories as unknown as Table,
  destinations: arMisc.destinations as Table,
  food: arMisc.food as Table,
  places: arPlaces,
};

/** Returns a copy of `item` whose listed fields switch to Arabic when the language is Arabic. */
export function localized<T extends object>(item: T, row: Row | undefined, fields: (keyof T)[]): T {
  const copy = { ...item } as T;
  for (const field of fields) {
    const english = item[field];
    Object.defineProperty(copy, field, {
      enumerable: true,
      get: () => (current === "ar" && row && row[field as string] !== undefined && row[field as string] !== "" ? row[field as string] : english),
    });
  }
  return copy;
}

export const localizeList = <T extends { id: string }>(list: T[], table: keyof typeof tables, fields: (keyof T)[]) =>
  list.map((item) => localized(item, tables[table][item.id], fields));

export const localizeCountries = <T extends { code: string }>(list: T[], fields: (keyof T)[]) =>
  list.map((item) => localized(item, tables.countries[item.code], fields));

export const localizeCategories = <T extends { id: string; label: string }>(list: T[]) =>
  list.map((item) => {
    const copy = { ...item };
    Object.defineProperty(copy, "label", {
      enumerable: true,
      get: () => (current === "ar" ? ((arMisc.categories as Record<string, string>)[item.id] ?? item.label) : item.label),
    });
    return copy;
  });

/** Record<id, value> whose entries switch language on read. */
export function localizedRecord<T>(english: Record<string, T>, arabic: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const key of Object.keys(english)) {
    Object.defineProperty(out, key, { enumerable: true, get: () => (current === "ar" && arabic[key] !== undefined ? arabic[key] : english[key]) });
  }
  return out;
}

export { arFacts, arWiki };
