export default function KpiCard({
  label, value, accentColor = "var(--accent)", delay = 0,
}: { label: string; value: number | string; accentColor?: string; delay?: number }) {
  return (
    <div
      className={`animate-in card-hover rounded-lg border p-5 stagger-${delay}`}
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="display mono mt-2 text-3xl font-semibold">{value}</p>
      <div className="mt-3 h-0.5 w-8 rounded-full" style={{ background: accentColor }} />
    </div>
  );
}