"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getKpis } from "@/lib/api";
import { KpiData } from "@/lib/types";
import KpiCard from "@/components/ui/KpiCard";

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KpiData | null>(null);

  useEffect(() => { getKpis().then(setKpis); }, []);

  if (!kpis) return <p style={{ color: "var(--text-muted)" }}>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1 animate-in">Dashboard</h1>
      <p className="mb-6 text-sm animate-in stagger-1" style={{ color: "var(--text-muted)" }}>
        Real-time snapshot across all departments
      </p>  

      <div className="grid grid-cols-3 gap-4 mb-8">
        <KpiCard label="Assets Available" value={kpis.assetsAvailable} accentColor="var(--status-available)" delay={1} />
        <KpiCard label="Assets Allocated" value={kpis.assetsAllocated} accentColor="var(--status-allocated)" delay={2} />
        <KpiCard label="Maintenance Today" value={kpis.maintenanceToday} accentColor="var(--status-maintenance)" delay={3} />
        <KpiCard label="Active Bookings" value={kpis.activeBookings} accentColor="var(--status-reserved)" delay={4} />
        <KpiCard label="Pending Transfers" value={kpis.pendingTransfers} accentColor="var(--accent)" delay={5} />
        <KpiCard label="Upcoming Returns" value={kpis.upcomingReturns} accentColor="var(--status-allocated)" delay={6} />
      </div>

      {kpis.overdueReturns.length > 0 && (
        <div
          className="animate-in rounded-lg border p-5 mb-6"
          style={{ borderColor: "var(--status-lost)", background: "rgba(248,113,113,0.06)" }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: "var(--status-lost)" }}>Overdue Returns</p>
          {kpis.overdueReturns.map((o) => (
            <p key={o.assetId} className="text-sm mono">{o.assetTag} — {o.employeeName} — due {o.expectedReturnDate}</p>
          ))}
        </div>
      )}

      <div className="flex gap-3 animate-in stagger-2">
        <QuickAction href="/assets" label="Register Asset" />
        <QuickAction href="/bookings" label="Book Resource" />
        <QuickAction href="/allocations" label="Raise Maintenance Request" />
      </div>
    </div>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="card-hover rounded-md border px-4 py-2 text-sm"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {label}
    </Link>
  );
}