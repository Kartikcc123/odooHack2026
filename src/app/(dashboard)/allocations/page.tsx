"use client";
import { useEffect, useState } from "react";
import { getAllocations, getAssets, getEmployees, createAllocation } from "@/lib/api";
import { Allocation, Asset, Employee } from "@/lib/types";
import AssetTag from "@/components/ui/AssetsTag";
import StatusBadge from "@/components/ui/StatusBadge";

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [conflictMsg, setConflictMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAllocations().then(setAllocations);
    getAssets().then(setAssets);
    getEmployees().then(setEmployees);
  }, []);

  async function handleAllocate(e: React.FormEvent) {
    e.preventDefault();
    setConflictMsg(null);
    if (!selectedAsset || !selectedEmployee) return;

    setSubmitting(true);
    try {
      await createAllocation(selectedAsset, selectedEmployee, returnDate || undefined);
      const updated = await getAllocations();
      setAllocations(updated);
      setSelectedAsset("");
      setSelectedEmployee("");
      setReturnDate("");
    } catch (err: any) {
      if (err.code === "ALREADY_ALLOCATED") {
        setConflictMsg(`Currently held by ${err.currentHolderName}`);
      } else {
        setConflictMsg("Something went wrong. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1 animate-in">Asset Allocation & Transfer</h1>
      <p className="mb-6 text-sm animate-in stagger-1" style={{ color: "var(--text-muted)" }}>
        Assign assets to employees or departments
      </p>

      <form
        onSubmit={handleAllocate}
        className="animate-in stagger-2 mb-8 rounded-lg border p-5 grid grid-cols-3 gap-4 items-end"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div>
          <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Asset</label>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            style={{ background: "var(--surface-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            <option value="">Select asset</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>{a.assetTag} — {a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            style={{ background: "var(--surface-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            <option value="">Select employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Expected Return Date</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            style={{ background: "var(--surface-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>

        <div className="col-span-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            style={{ background: "var(--accent)", color: "#12161F" }}
          >
            {submitting ? "Allocating..." : "Allocate Asset"}
          </button>

          {conflictMsg && (
            <div
              className="mt-3 rounded-md border px-3 py-2 text-sm flex items-center justify-between"
              style={{ borderColor: "var(--status-lost)", background: "rgba(248,113,113,0.08)", color: "var(--status-lost)" }}
            >
              <span>{conflictMsg}</span>
              {conflictMsg.startsWith("Currently held") && (
                <button
                  type="button"
                  className="text-xs underline"
                  style={{ color: "var(--accent)" }}
                  onClick={() => alert("Transfer request flow — wire this to POST /api/allocations/:id/transfer-request")}
                >
                  Request Transfer
                </button>
              )}
            </div>
          )}
        </div>
      </form>

      <div className="animate-in stagger-3 overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-sm">
          <thead style={{ background: "var(--surface-elevated)" }}>
            <tr className="text-left" style={{ color: "var(--text-muted)" }}>
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Allocated</th>
              <th className="px-4 py-3 font-medium">Expected Return</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((a) => (
              <tr key={a.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                <td className="px-4 py-3"><AssetTag tag={a.assetTag} /></td>
                <td className="px-4 py-3">{a.employeeName}</td>
                <td className="px-4 py-3 mono text-xs" style={{ color: "var(--text-muted)" }}>
                  {new Date(a.allocatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 mono text-xs" style={{ color: "var(--text-muted)" }}>
                  {a.expectedReturnDate ? new Date(a.expectedReturnDate).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3">
                  {a.status === "ACTIVE" && (
                    <button
                      className="text-xs underline"
                      style={{ color: "var(--accent)" }}
                      onClick={() => alert("Return flow — open a dialog for condition notes, call POST /api/allocations/:id/return")}
                    >
                      Mark Returned
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}