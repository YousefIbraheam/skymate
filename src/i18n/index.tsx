import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { actions, useAppState, type Lang } from "../store/appStore";
import { en, type Messages } from "./en";
import { ar } from "./ar";

const dictionaries: Record<Lang, Messages> = { en, ar };

/** `flag` is an ISO country code (SA for Arabic, US for English). */
export const languages: { code: Lang; label: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", flag: "US", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "SA", dir: "rtl" },
];

interface I18nValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  m: Messages;
  setLang: (lang: Lang) => void;
  /** Replace {placeholders} in a message. */
  fill: (template: string, vars: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const fill: I18nValue["fill"] = (template, vars) =>
  template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useAppState((s) => s.lang);
  const dir = languages.find((l) => l.code === lang)?.dir ?? "ltr";

  // Keep <html lang dir> in sync so layout mirrors for Arabic.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo<I18nValue>(
    () => ({ lang, dir, m: dictionaries[lang], setLang: (l) => actions.update({ lang: l }), fill }),
    [lang, dir],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
