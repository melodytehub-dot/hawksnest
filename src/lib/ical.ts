import { parseISODate, toISODate, DAY } from "./dates";

export interface IcalEvent {
  uid: string;
  start: string; // YYYY-MM-DD (check-in)
  end: string;   // YYYY-MM-DD (check-out, exclusive)
  summary?: string;
}

export interface IcalParseResult {
  events: IcalEvent[];
  error?: string;
}

/** Normalize a date value found in an iCal component to YYYY-MM-DD. */
function normalizeDate(v: string): string | null {
  if (!v) return null;
  const cleaned = v.trim();
  // "20260922" -> 2026-09-22
  const plain = cleaned.match(/^(\d{4})(\d{2})(\d{2})/);
  if (plain) return `${plain[1]}-${plain[2]}-${plain[3]}`;
  // "2026-09-22" or "2026-09-22T00:00:00Z"
  const dashed = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dashed) return `${dashed[1]}-${dashed[2]}-${dashed[3]}`;
  return null;
}

/** Parse an .ics string into normalized events. Handles folded lines + VEVENT blocks. */
export function parseIcal(text: string): IcalParseResult {
  // Unfold CRLF "\n " and "\r\n " into single lines.
  const unfolded = text.replace(/\r\n[ \t]/g, "").replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
  const events: IcalEvent[] = [];

  const blocks = unfolded.split(/BEGIN:VEVENT/i).slice(1);
  for (const block of blocks) {
    const endIdx = block.search(/\n?END:VEVENT/i);
    const body = endIdx >= 0 ? block.slice(0, endIdx) : block;

    const props: Record<string, string> = {};
    for (const line of body.split("\n")) {
      const i = line.indexOf(":");
      if (i < 0) continue;
      const key = line.slice(0, i).trim().toUpperCase();
      // key may include parameters e.g. DTSTART;VALUE=DATE — take first token
      const bare = key.split(";")[0];
      const value = line.slice(i + 1).trim();
      if (!props[bare]) props[bare] = value;
    }

    // Skip VEVENT blocks that aren't reservations/blocked periods
    if (!props.DTSTART || !props.DTEND) continue;

    const start = normalizeDate(props.DTSTART);
    const end = normalizeDate(props.DTEND);
    if (!start || !end) continue;

    const uid =
      props.UID ||
      `${start}:${end}:${props.SUMMARY || ""}`;

    events.push({ uid, start, end, summary: props.SUMMARY || undefined });
  }

  return { events };
}

export async function fetchIcal(url: string): Promise<IcalParseResult> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { events: [], error: `HTTP ${res.status}` };
    const text = await res.text();
    return parseIcal(text);
  } catch (e: any) {
    return { events: [], error: e?.message || "fetch failed" };
  }
}

/** Expand an event into the set of blocked nights (start inclusive -> end exclusive). */
export function eventNights(ev: IcalEvent): string[] {
  const nights: string[] = [];
  const start = parseISODate(ev.start).getTime();
  const end = parseISODate(ev.end).getTime();
  for (let t = start; t < end; t += DAY) {
    nights.push(toISODate(new Date(t)));
  }
  return nights;
}
