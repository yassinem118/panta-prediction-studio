// Request-body field names. The create-market fields below come straight from the live API's own
// validation error (question, resolutionRule, sourcesOfTruth, startTime, endTime, resolutionTime, imageUrl).
export const AMOUNT_FIELD: "amount" | "amountUsdc" = "amount"; // VERIFY with `npm run probe` (live key)

export type CreateForm = {
  title: string; description: string; category: string;
  endDate: string; source: string; imageUrl: string;
};

const unix = (iso: string) => Math.floor(new Date(iso).getTime() / 1000);

export function createPayload(f: CreateForm, wallet?: string) {
  const end = f.endDate ? unix(`${f.endDate}T23:59:59Z`) : undefined;
  return {
    question: f.title,
    resolutionRule: f.description,
    category: f.category,
    sourcesOfTruth: f.source ? [f.source] : [], // VERIFY: list of strings (change to a plain string if the API says so)
    startTime: Math.floor(Date.now() / 1000),   // unix seconds
    endTime: end,                               // unix seconds
    resolutionTime: end ? end + 86400 : undefined, // one day after the end
    imageUrl: f.imageUrl,
    wallet,
  };
}
