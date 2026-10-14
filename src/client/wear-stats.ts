import type { Wear } from "@/storage/closet";

// How often and how recently a piece was worn, worked out from the wears.

// Today as the person's local day, "2026-10-13". Not toISOString(): that is
// UTC, so a wear at 00:30 in Zurich would land on yesterday.
export function today(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Whole days between a local day and today (0 = today).
function daysSince(day: string): number {
  const [y, m, d] = day.split("-").map(Number);
  const [ty, tm, td] = today().split("-").map(Number);
  // Noon on both sides, so a daylight-saving switch can't round a day away.
  return Math.round((Date.UTC(ty, tm - 1, td, 12) - Date.UTC(y, m - 1, d, 12)) / 86_400_000);
}

export type WearStats = { count: number; lastDay: string | null };

export function wearStats(pieceId: string, wears: Wear[]): WearStats {
  const days = wears.filter((wear) => wear.pieceIds.includes(pieceId)).map((wear) => wear.date);
  // "2026-10-13" strings sort in date order, so the last one is the latest.
  return { count: days.length, lastDay: days.length === 0 ? null : days.sort()[days.length - 1] };
}

// "Never worn", "Worn 3× · today", "Worn 1× · 12 days ago"
export function describeWear({ count, lastDay }: WearStats): string {
  if (lastDay === null) return "Never worn";
  const days = daysSince(lastDay);
  const when = days === 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`;
  return `Worn ${count}× · ${when}`;
}
