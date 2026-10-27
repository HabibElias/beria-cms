import { Loader2 } from "lucide-react";
import { BrandMark } from "./brand-mark";

export function AppLoading() {
  return <div className="app-loading" role="status" aria-live="polite"><BrandMark size={54} /><p><Loader2 size={15} className="animate-spin" />Opening your library…</p></div>;
}
