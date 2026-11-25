import { languages, useI18n } from "../../i18n";
import { Flag } from "../ui/Flag";
import { cn } from "../../lib/cn";

/**
 * Arabic (Saudi flag) / English (US flag) switch.
 * A pill slides under the active flag; it flips direction automatically in RTL.
 */
export function LanguageSwitch() {
  const { lang, setLang, m } = useI18n();
  const index = languages.findIndex((l) => l.code === lang);
  return (
    <div role="group" aria-label={m.shell.language} className="relative grid grid-cols-2 rounded-full bg-muted p-1">
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 start-1 w-[calc(50%-4px)] rounded-full bg-card shadow-soft transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)]",
          index === 1 && "translate-x-full rtl:-translate-x-full",
        )}
      />
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          aria-pressed={lang === l.code}
          aria-label={l.label}
          onClick={() => setLang(l.code)}
          className={cn(
            "relative z-10 flex h-9 w-11 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-opacity sm:w-[6.5rem]",
            lang === l.code ? "opacity-100" : "opacity-60 hover:opacity-90",
          )}
        >
          <Flag code={l.flag} />
          <span className="hidden sm:inline">{l.label}</span>
        </button>
      ))}
    </div>
  );
}
