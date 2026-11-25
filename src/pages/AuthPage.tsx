import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { requestPasswordReset, resetPassword, sendVerificationCode, verifyCode } from "../api/client";
import { useI18n } from "../i18n";
import { useAuth } from "../hooks/useAuth";
import { LanguageSwitch } from "../components/layout/LanguageSwitch";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/fields";
import { Card, PageTitle } from "../components/ui/Section";

type Step = "signin" | "register" | "verify" | "forgot" | "reset";

/** Login, register, email code verification and password reset. UI only: the API file is mock for now. */
export function AuthPage() {
  const { m, fill } = useI18n();
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithGoogle, signOut } = useAuth();
  const [step, setStep] = useState<Step>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };
  const go = (next: Step) => {
    setStep(next);
    setError("");
    setNote("");
    setCode("");
  };
  const done = () => navigate("/"); // the header greets the user by name

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void run(async () => {
      if (step === "signin") {
        await signIn(email, password);
        done();
      } else if (step === "register") {
        await sendVerificationCode(email);
        setNote(m.auth.codeSent);
        setStep("verify");
      } else if (step === "verify") {
        if (!(await verifyCode(email, code))) return setError(m.auth.wrongCode);
        await signUp(name, email, password);
        done();
      } else if (step === "forgot") {
        await requestPasswordReset(email);
        setNote(m.auth.codeSent);
        setStep("reset");
      } else if (step === "reset") {
        if (!(await verifyCode(email, code))) return setError(m.auth.wrongCode);
        if (password !== confirm) return setError(m.auth.passwordsDiffer);
        await resetPassword({ email, code, password });
        setPassword("");
        setConfirm("");
        setStep("signin");
        setNote(m.auth.resetDone);
      }
    });
  };

  const resend = () => run(async () => {
    await (step === "verify" ? sendVerificationCode(email) : requestPasswordReset(email));
    setNote(m.auth.codeSent);
  });

  const titles: Record<Step, [string, string]> = {
    signin: [m.auth.title, m.auth.subtitle],
    register: [m.auth.register, m.auth.subtitle],
    verify: [m.auth.verifyTitle, fill(m.auth.verifySubtitle, { email })],
    forgot: [m.auth.forgotTitle, m.auth.forgotSubtitle],
    reset: [m.auth.resetTitle, fill(m.auth.resetSubtitle, { email })],
  };
  const [title, subtitle] = titles[step];
  const needsCode = step === "verify" || step === "reset";
  const needsEmail = step === "signin" || step === "register" || step === "forgot";
  const needsPassword = step === "signin" || step === "register";
  const submitLabel = { signin: m.auth.submitSignIn, register: m.auth.submitRegister, verify: m.auth.verify, forgot: m.auth.sendCode, reset: m.auth.savePassword }[step];

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2 font-display text-xl font-semibold">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sun text-sun-foreground"><Compass className="h-5 w-5" /></span>
            {m.appName}
          </span>
          <LanguageSwitch />
        </div>

        {user ? (
          <>
            <PageTitle title={fill(m.auth.welcome, { name: user.name })} subtitle={fill(m.auth.signedInAs, { email: user.email })} />
            <div className="flex gap-2">
              <Button onClick={done}>{m.nav.home}</Button>
              <Button variant="outline" onClick={signOut}>{m.auth.signOut}</Button>
            </div>
          </>
        ) : (
          <>
            <PageTitle title={title} subtitle={subtitle} />
            <Card>
              <form onSubmit={submit} className="space-y-4">
                {step === "register" && (
                  <label className="block text-sm font-medium">{m.auth.name}<Input required className="mt-1" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
                )}
                {needsEmail && (
                  <label className="block text-sm font-medium">{step === "register" ? m.auth.gmail : m.auth.email}<Input required type="email" dir="ltr" className="mt-1" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                )}
                {needsCode && (
                  <label className="block text-sm font-medium">{m.auth.code}
                    <Input required inputMode="numeric" dir="ltr" maxLength={6} placeholder="••••••" className="mt-1 text-center text-lg tracking-[0.5em]" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
                  </label>
                )}
                {(needsPassword || step === "reset") && (
                  <label className="block text-sm font-medium">{step === "reset" ? m.auth.newPassword : m.auth.password}<Input required type="password" minLength={6} className="mt-1" autoComplete={step === "signin" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
                )}
                {step === "reset" && (
                  <label className="block text-sm font-medium">{m.auth.confirmPassword}<Input required type="password" minLength={6} className="mt-1" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></label>
                )}
                {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
                {note && <p role="status" className="text-sm font-medium text-teal">{note}</p>}
                <Button type="submit" size="lg" className="w-full" disabled={busy}>{submitLabel}</Button>
              </form>

              {(step === "signin" || step === "register") && (
                <>
                  <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="h-px flex-1 bg-border" />{m.auth.or}<span className="h-px flex-1 bg-border" />
                  </div>
                  <Button type="button" variant="outline" size="lg" className="w-full gap-3" disabled={busy} onClick={() => run(async () => { await signInWithGoogle(); done(); })}>
                    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
                      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.4-4.7 7l7.3 5.7c4.3-4 6.8-9.9 6.8-17.2z" />
                      <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
                      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.3-8.6 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
                    </svg>
                    {m.auth.google}
                  </Button>
                </>
              )}

              <div className="mt-4 flex flex-col items-start gap-2 text-sm font-semibold text-teal">
                {needsCode && <button type="button" onClick={resend} disabled={busy}>{m.auth.resend}</button>}
                {step === "signin" && <button type="button" onClick={() => go("forgot")}>{m.auth.forgot}</button>}
                {step === "signin" && <button type="button" onClick={() => go("register")}>{m.auth.noAccount}</button>}
                {step === "register" && <button type="button" onClick={() => go("signin")}>{m.auth.haveAccount}</button>}
                {step !== "signin" && step !== "register" && <button type="button" onClick={() => go("signin")}>{m.auth.backToSignIn}</button>}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{m.auth.mock}</p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
