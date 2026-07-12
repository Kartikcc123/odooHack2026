import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1 animate-in">Reports & Analytics</h1>
      <p className="mb-8 text-sm animate-in stagger-1" style={{ color: "var(--text-muted)" }}>
        Actionable operational insight across departments
      </p>
      <div
        className="animate-in stagger-2 flex flex-col items-center justify-center rounded-lg border py-20 px-6 text-center"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--accent-soft)" }}>
          <BarChart3 size={22} color="var(--accent)" />
        </div>
        <p className="font-semibold mb-1">Coming soon in this build</p>
        <p className="text-sm max-w-md" style={{ color: "var(--text-muted)" }}>
          Utilization trends, maintenance frequency, booking heatmaps, exportable reports
        </p>
      </div>
    </div>
  );
}