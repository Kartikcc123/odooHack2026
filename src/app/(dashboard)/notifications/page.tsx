"use client";
import { Bell } from "lucide-react";

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Asset AF-0001 assigned to Priya Sharma", time: "2h ago", type: "info" },
  { id: 2, text: "Booking confirmed for Conference Room B2", time: "5h ago", type: "success" },
  { id: 3, text: "Overdue return alert — AF-0114", time: "1d ago", type: "danger" },
];

export default function NotificationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1 animate-in">Activity & Notifications</h1>
      <p className="mb-8 text-sm animate-in stagger-1" style={{ color: "var(--text-muted)" }}>
        Stay informed without digging for updates
      </p>

      <div className="flex flex-col gap-2">
        {MOCK_NOTIFICATIONS.map((n, i) => (
          <div
            key={n.id}
            className={`animate-in stagger-${Math.min(i + 2, 6)} flex items-center gap-3 rounded-lg border p-4`}
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full shrink-0"
              style={{
                background:
                  n.type === "danger" ? "rgba(248,113,113,0.12)" :
                  n.type === "success" ? "rgba(74,222,128,0.12)" : "var(--accent-soft)",
              }}
            >
              <Bell
                size={16}
                color={
                  n.type === "danger" ? "var(--status-lost)" :
                  n.type === "success" ? "var(--status-available)" : "var(--accent)"
                }
              />
            </div>
            <p className="text-sm flex-1">{n.text}</p>
            <span className="text-xs mono" style={{ color: "var(--text-muted)" }}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}