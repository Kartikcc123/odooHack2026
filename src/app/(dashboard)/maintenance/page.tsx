import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1 animate-in">Maintenance Management</h1>
      <p className="mb-8 text-sm animate-in stagger-1" style={{ color: "var(--text-muted)" }}>
        Route repair requests through approval before work starts
      </p>
      <ComingSoon icon={Wrench} note="Raise → Approve/Reject → Technician Assigned → In Progress → Resolved" />
    </div>
  );
}

function ComingSoon({ icon: Icon, note }: { icon: any; note: string }) {
  return (
    <div
      className="animate-in stagger-2 flex flex-col items-center justify-center rounded-lg border py-20 px-6 text-center"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
        style={{ background: "var(--accent-soft)" }}
      >
        <Icon size={22} color="var(--accent)" />
      </div>
      <p className="font-semibold mb-1">Coming soon in this build</p>
      <p className="text-sm max-w-md" style={{ color: "var(--text-muted)" }}>{note}</p>
    </div>
  );
}