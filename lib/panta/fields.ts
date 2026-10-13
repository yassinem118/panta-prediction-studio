// Request-body field names that the probe could not confirm in sandbox mode.
// Run `npm run probe` with a LIVE key: it tests both variants and shows which one the API accepts.
export const AMOUNT_FIELD: "amount" | "amountUsdc" = "amount"; // VERIFY

export type CreateForm = { title: string; description: string; category: string; endDate: string };
export function createPayload(f: CreateForm, wallet?: string) {
  return {
    title: f.title,
    description: f.description,
    category: f.category,
    endTime: f.endDate ? new Date(`${f.endDate}T23:59:59Z`).toISOString() : undefined, // VERIFY
    marketType: "standard",
    wallet,
  };
}
