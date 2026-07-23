export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Eligible for Final Review": "pill pill-ok",
    "On Track": "pill pill-neutral",
    "Watchlist": "pill pill-warn",
    "Remediation": "pill pill-bad"
  };
  return <span className={map[status] || "pill pill-neutral"}>{status}</span>;
}

export function YesNoPill({ value }: { value: string }) {
  return <span className={value === "Yes" ? "pill pill-ok" : "pill pill-bad"}>{value}</span>;
}
