import Navbar from "@/components/Navbar";
import AssetTag from "@/components/ui/AssetsTag";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";

const FEATURES = [
  {
    title: "Full Asset Lifecycle",
    desc: "Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed — every state transition tracked.",
  },
  {
    title: "Conflict-Safe Allocation",
    desc: "The system blocks double-allocation automatically and offers a transfer request instead.",
  },
  {
    title: "Overlap-Free Booking",
    desc: "Shared resources are booked by time slot with automatic overlap validation.",
  },
  {
    title: "Structured Maintenance",
    desc: "Repairs route through approval before work starts — no unauthorized fixes.",
  },
  {
    title: "Audit Cycles",
    desc: "Assign auditors, verify assets, auto-generate discrepancy reports.",
  },
  {
    title: "Real-Time KPI Dashboard",
    desc: "Every role gets an operational snapshot the moment they log in.",
  },
];

const ROLES = [
  {
    name: "Admin",
    desc: "Manages departments, categories, audit cycles, and role assignment.",
  },
  {
    name: "Asset Manager",
    desc: "Registers assets, approves transfers, maintenance, and returns.",
  },
  {
    name: "Department Head",
    desc: "Approves requests within their department, books shared resources.",
  },
  {
    name: "Employee",
    desc: "Views allocated assets, books resources, raises maintenance requests.",
  },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section
        className="animate-in"
        style={{ maxWidth: 1180, margin: "0 auto", padding: "96px 24px 64px" }}
      >
        <div className="flex justify-center mb-6">
          <AssetTag tag="AF-0001 · AVAILABLE" />
        </div>
        <h1
          className="display text-center font-semibold"
          style={{
            fontSize: "48px",
            lineHeight: 1.1,
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          Know exactly who holds what,{" "}
          <span style={{ color: "var(--accent)" }}>where it is</span>, and its
          condition.
        </h1>
        <p
          className="text-center mt-6"
          style={{
            color: "var(--text-muted)",
            maxWidth: 560,
            margin: "24px auto 0",
            fontSize: "16px",
          }}
        >
          AssetFlow replaces spreadsheets and paper logs with structured
          lifecycles, conflict-safe allocation, and overlap-free resource
          booking — for any organization with equipment, vehicles, or shared
          spaces.
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Link
            href="/sign-up"
            className="rounded-md px-5 py-2.5 text-sm font-semibold"
            style={{ background: "var(--accent)", color: "#12161F" }}
          >
            Get started
          </Link>
          <Link
            href="#features"
            className="rounded-md border px-5 py-2.5 text-sm font-medium"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          >
            See features
          </Link>
        </div>
      </section>

      {/* Live preview strip */}
      <section
        className="animate-in stagger-1"
        style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 80px" }}
      >
        <div
          className="rounded-lg border p-5"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex justify-between items-center mb-4">
            <p
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Live allocation snapshot
            </p>
            <StatusBadge status="OVERDUE" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <PreviewRow
              tag="AF-0001"
              name="Dell Latitude Laptop"
              holder="Priya Sharma"
              status="ALLOCATED"
            />
            <PreviewRow
              tag="AF-0003"
              name="Toyota Innova"
              holder="—"
              status="AVAILABLE"
            />
            <PreviewRow
              tag="AF-0005"
              name="HP Printer LaserJet"
              holder="—"
              status="UNDER_MAINTENANCE"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 80px" }}
      >
        <p
          className="text-xs uppercase tracking-wider mb-2"
          style={{ color: "var(--accent)" }}
        >
          Features
        </p>
        <h2 className="display text-2xl font-semibold mb-10">
          Built for real ERP workflows
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`animate-in card-hover stagger-${Math.min(i + 1, 6)} rounded-lg border p-5`}
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h3 className="font-semibold mb-2" style={{ fontSize: "15px" }}>
                {f.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section
        id="workflow"
        style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 80px" }}
      >
        <p
          className="text-xs uppercase tracking-wider mb-2"
          style={{ color: "var(--accent)" }}
        >
          Workflow
        </p>
        <h2 className="display text-2xl font-semibold mb-10">
          From setup to audit
        </h2>
        <div className="flex flex-col gap-3">
          {[
            "Admin sets up departments, categories, and promotes Department Heads / Asset Managers.",
            "Asset Manager registers a new asset — it enters the system as Available.",
            "Asset is allocated to an employee or marked as a shared bookable resource.",
            "Employees book shared resources by time slot — overlapping requests are rejected.",
            "Maintenance requests are approved before work begins.",
            "Periodic audit cycles verify assets and auto-generate discrepancy reports.",
          ].map((step, i) => (
            <div
              key={i}
              className="flex gap-4 items-start rounded-md border p-4"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
            >
              <span
                className="mono text-xs shrink-0"
                style={{ color: "var(--accent)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section
        id="roles"
        style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 100px" }}
      >
        <p
          className="text-xs uppercase tracking-wider mb-2"
          style={{ color: "var(--accent)" }}
        >
          Roles
        </p>
        <h2 className="display text-2xl font-semibold mb-10">
          One platform, every role
        </h2>
        <div className="grid grid-cols-4 gap-5">
          {ROLES.map((r) => (
            <div
              key={r.name}
              className="rounded-lg border p-5"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="font-semibold mb-2"
                style={{ color: "var(--accent)", fontSize: "14px" }}
              >
                {r.name}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: "var(--border)" }}>
        <div
          className="flex justify-between items-center"
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "24px",
            color: "var(--text-muted)",
            fontSize: "13px",
          }}
        >
          <span>AssetFlow — Enterprise Asset & Resource Management</span>
          <span className="mono">Built for Hackathon 2026</span>
        </div>
      </footer>
    </div>
  );
}

function PreviewRow({
  tag,
  name,
  holder,
  status,
}: {
  tag: string;
  name: string;
  holder: string;
  status: any;
}) {
  return (
    <div
      className="rounded-md border p-3"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface-elevated)",
      }}
    >
      <AssetTag tag={tag} />
      <p className="text-sm mt-2">{name}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {holder}
        </span>
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
