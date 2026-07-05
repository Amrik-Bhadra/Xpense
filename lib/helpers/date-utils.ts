// Formats a Date into the exact string format <input type="datetime-local"> expects,
// using LOCAL time — not toISOString(), which would shift to UTC and show the wrong time.
export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}