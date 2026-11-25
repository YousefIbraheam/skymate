import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Compass } from "lucide-react";
import { countries, destinations } from "../data";
import { actions, useAppState } from "../store/appStore";
import { useI18n } from "../i18n";
import { Flag } from "../components/ui/Flag";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/fields";
import { Photo } from "../components/ui/Photo";
import { LanguageSwitch } from "../components/layout/LanguageSwitch";
import { cn } from "../lib/cn";

export function OnboardingPage() {
  const navigate = useNavigate();
  const { m } = useI18n();
  const savedName = useAppState((s) => s.name);
  const [country, setCountry] = useState(useAppState((s) => s.country));
  const [name, setName] = useState(savedName);
  const hero = destinations.find((d) => d.country === country) ?? destinations[0];

  const start = () => {
    actions.update({ onboarded: true, country, name: name.trim() });
    navigate("/");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Photo src={hero.image} alt={hero.name} gradient={hero.gradient} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-scrim" />
        <div className="absolute bottom-12 start-12 max-w-md text-on-image">
          <p className="text-sm uppercase tracking-[0.2em] opacity-85">{hero.region}</p>
          <h2 className="font-display text-5xl font-semibold">{hero.name}</h2>
          <p className="mt-2 opacity-90">{hero.tagline}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mb-6 flex items-center justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Compass className="h-6 w-6" />
          </span>
          <LanguageSwitch />
        </div>
        <h1 className="text-4xl font-semibold sm:text-5xl">
          {m.onboarding.title1} <em className="text-teal">{m.onboarding.title2}</em> {m.onboarding.title3}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">{m.onboarding.text}</p>

        <fieldset className="mt-8 grid gap-3 sm:grid-cols-2">
          <legend className="sr-only">{m.onboarding.country}</legend>
          {countries.map((c) => {
            const selected = c.code === country;
            return (
              <button
                key={c.code}
                type="button"
                aria-pressed={selected}
                onClick={() => setCountry(c.code)}
                className={cn(
                  "relative rounded-3xl bg-card p-5 text-start shadow-soft transition-shadow hover:shadow-lift",
                  selected && "ring-2 ring-primary",
                )}
              >
                <Flag code={c.code} className="h-8 w-12 rounded-md" />
                <h2 className="mt-2 font-display text-xl font-semibold">
                  {c.name}
                  {c.code === "EG" && <span className="ms-2 rounded-full bg-accent px-2 py-0.5 align-middle font-sans text-xs text-accent-foreground">{m.onboarding.starter}</span>}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
                {selected && <Check className="absolute end-4 top-4 h-5 w-5 text-primary" />}
              </button>
            );
          })}
        </fieldset>

        <label className="mt-6 block max-w-sm text-sm font-medium">
          {m.onboarding.nameLabel}
          <Input className="mt-2" placeholder={m.onboarding.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <Button size="lg" className="mt-8 w-full sm:w-fit" onClick={start}>
          {m.onboarding.start}
        </Button>
      </div>
    </div>
  );
}
