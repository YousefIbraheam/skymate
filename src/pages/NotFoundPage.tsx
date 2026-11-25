import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  const { m } = useI18n();
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-7xl font-bold">404</h1>
      <h2 className="mt-4 text-xl font-semibold">{m.common.notFound}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{m.common.notFoundText}</p>
      <Button asChild className="mt-6"><Link to="/">{m.common.goHome}</Link></Button>
    </div>
  );
}
