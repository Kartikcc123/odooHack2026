"use client";
import { useEffect, useState } from "react";
import { getAssets } from "@/lib/api";
import { Asset } from "@/lib/types";
import AssetTag from "@/components/ui/AssetsTag";
import StatusBadge from "@/components/ui/StatusBadge";

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { getAssets().then(setAssets); }, []);

  const filtered = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.assetTag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 animate-in">
        <h1 className="text-2xl font-semibold">Asset Directory</h1>
        <button
          className="rounded-md px-4 py-2 text-sm font-medium"
          style={{ background: "var(--accent)", color: "#12161F" }}
        >
          + Register Asset
        </button>
      </div>

      <input
        placeholder="Search by tag, name, serial number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="animate-in stagger-1 mb-4 w-full max-w-md rounded-md border px-3 py-2 text-sm outline-none"
        style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
      />

      <div className="animate-in stagger-2 overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-sm">
          <thead style={{ background: "var(--surface-elevated)" }}>
            <tr className="text-left" style={{ color: "var(--text-muted)" }}>
              <th className="px-4 py-3 font-medium">Tag</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Holder</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                <td className="px-4 py-3"><AssetTag tag={a.assetTag} /></td>
                <td className="px-4 py-3">{a.name}</td>
                <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{a.categoryName}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{a.location}</td>
                <td className="px-4 py-3">{a.currentHolderName ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}