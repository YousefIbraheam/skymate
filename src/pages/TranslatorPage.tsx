import { useState } from "react";
import { ScanLine, Volume2 } from "lucide-react";
import { phraseLanguages } from "../data/phrases";
import { translate } from "../api/client";
import { useI18n } from "../i18n";
import { Flag } from "../components/ui/Flag";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/fields";
import { Card, PageTitle } from "../components/ui/Section";
import { cn } from "../lib/cn";

const meaningAr: Record<string, string> = {
  "Hello": "مرحباً",
  "Thank you": "شكراً",
  "How much is this?": "بكام ده؟",
  "Where is the toilet?": "فين الحمّام؟",
  "No spice, please": "من غير حار، لو سمحت",
};

export function TranslatorPage() {
  const { m, lang } = useI18n();
  const langName = (code: string, fallback: string) =>
    lang === "ar" ? new Intl.DisplayNames(["ar"], { type: "language" }).of(code) ?? fallback : fallback;
  const [code, setCode] = useState(phraseLanguages[0].code);
  const [scanNote, setScanNote] = useState(false);
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const language = phraseLanguages.find((l) => l.code === code) ?? phraseLanguages[0];

  const speak = (value: string) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = language.code;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      <PageTitle title={m.translator.title} subtitle={m.translator.subtitle} />

      <div role="group" aria-label={m.translator.language} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1">
        {phraseLanguages.map((l) => (
          <Button key={l.code} size="sm" variant={l.code === code ? "default" : "outline"} aria-pressed={l.code === code} onClick={() => { setCode(l.code); setResult(""); }}>
            <Flag code={l.country} /> {langName(l.code, l.name)}
          </Button>
        ))}
      </div>

      <Card>
        <h2 className="mb-3 text-xl font-semibold">{m.translator.phrases}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {language.phrases.map((phrase) => (
            <li key={phrase.en} className="flex items-center justify-between gap-3 rounded-2xl bg-muted p-3">
              <div>
                <p className="text-xs text-muted-foreground">{lang === "ar" ? meaningAr[phrase.en] ?? phrase.en : phrase.en}</p>
                <p className="text-lg font-semibold">{phrase.text}</p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Play" onClick={() => speak(phrase.text)}><Volume2 /></Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <button
          type="button"
          onClick={() => setScanNote(true)}
          dir="ltr" className="mb-3 inline-flex h-10 items-center gap-2 rounded-full bg-ocean px-4 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90"
        >
          <ScanLine className="h-4 w-4" aria-hidden /> {m.translator.scan}
        </button>
        {scanNote && <p role="status" className="mb-3 text-sm text-muted-foreground">{m.translator.scanSoon}</p>}
        <Textarea placeholder={m.translator.yourText} value={text} onChange={(e) => setText(e.target.value)} />
        <Button className="mt-3" disabled={!text.trim()} onClick={async () => setResult(await translate(text, language.code))}>{m.translator.translate}</Button>
        <p className={cn("mt-3 text-sm text-muted-foreground", result && "text-foreground")}>{result || m.translator.offline}</p>
      </Card>
    </div>
  );
}
