import { ClipboardCheck } from "lucide-react";

export default function AuditPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1 animate-in">Asset Audit</h1>
      <p className="mb-8 text-sm animate-in stagger-1" style={{ color: "var(--text-muted)" }}>
        Run structured verification cycles with assigned auditors
      </p>
      <div
        className="animate-in stagger-2 flex flex-col items-center justify-center rounded-lg border py-20 px-6 text-center"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--accent-soft)" }}>
          <ClipboardCheck size={22} color="var(--accent)" />
        </div>
        <p className="font-semibold mb-1">Coming soon in this build</p>
        <p className="text-sm max-w-md" style={{ color: "var(--text-muted)" }}>
          Create audit cycles, assign auditors, verify assets, auto-generate discrepancy reports
        </p>
      </div>
    </div>
  );
}