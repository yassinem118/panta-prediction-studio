export function ErrorBox({ error }: { error?: unknown }) {
  if (!error) return null;
  const e: any = error;
  const code = e?.body?.code ? ` [${e.body.code}]` : "";
  const msg = e?.body?.message ?? e?.message ?? String(error);
  return (
    <div role="alert" className="rounded-lg border p-3 text-sm" style={{ borderColor: "var(--no)", color: "#f3b3bd" }}>
      {msg}{code}
    </div>
  );
}
