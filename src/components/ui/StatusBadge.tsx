import { AssetStatus, BookingStatus, AllocationStatus } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "var(--status-available)",
  ALLOCATED: "var(--status-allocated)",
  RESERVED: "var(--status-reserved)",
  UNDER_MAINTENANCE: "var(--status-maintenance)",
  LOST: "var(--status-lost)",
  RETIRED: "var(--status-retired)",
  DISPOSED: "var(--status-retired)",
  UPCOMING: "var(--status-allocated)",
  ONGOING: "var(--status-maintenance)",
  COMPLETED: "var(--status-available)",
  CANCELLED: "var(--status-retired)",
  ACTIVE: "var(--status-allocated)",
  RETURNED: "var(--status-available)",
  OVERDUE: "var(--status-lost)",
  PENDING_TRANSFER: "var(--status-reserved)",
};

export default function StatusBadge({ status }: { status: AssetStatus | BookingStatus | AllocationStatus }) {
  const color = STATUS_COLORS[status] ?? "var(--text-muted)";
  const isOverdue = status === "OVERDUE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${isOverdue ? "pulse-dot" : ""}`}
      style={{ background: `${color}1F`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {status.replaceAll("_", " ")}
    </span>
  );
}