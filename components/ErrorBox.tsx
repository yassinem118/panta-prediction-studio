import { SetupCard } from "./SetupCard";
export function ErrorBox({ error }: { error?: unknown }) {
  if (!error) return null;
  const e: any = error;
  if (e?.body?.code === "no_key") return <SetupCard />;
  if (e?.status === 401 || e?.status === 403) return <SetupCard rejected />;
  const code = e?.body?.code ? ` (${e.body.code})` : "";
  const msg = e?.body?.message ?? e?.message ?? String(error);
  return <div role="alert" className="card p-3 text-sm" style={{ borderColor: "var(--no)", color: "var(--no)" }}>{msg}{code}</div>;
}
