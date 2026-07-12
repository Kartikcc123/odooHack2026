"use client";
import { useEffect, useState } from "react";
import { getBookings, getAssets, createBooking } from "@/lib/api";
import { Booking, Asset } from "@/lib/types";
import StatusBadge from "@/components/ui/StatusBadge";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [resources, setResources] = useState<Asset[]>([]);

  const [selectedResource, setSelectedResource] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [overlapMsg, setOverlapMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getBookings().then(setBookings);
    getAssets().then((all) => setResources(all.filter((a) => a.isBookable)));
  }, []);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setOverlapMsg(null);
    if (!selectedResource || !startTime || !endTime) return;

    setSubmitting(true);
    try {
      await createBooking(selectedResource, startTime, endTime);
      const updated = await getBookings();
      setBookings(updated);
      setSelectedResource("");
      setStartTime("");
      setEndTime("");
    } catch (err: any) {
      if (err.code === "OVERLAP") {
        const c = err.conflictingBooking;
        setOverlapMsg(
          `Overlaps with existing booking ${new Date(c.startTime).toLocaleTimeString()}–${new Date(c.endTime).toLocaleTimeString()}`
        );
      } else {
        setOverlapMsg("Something went wrong. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const resourceBookings = bookings.filter((b) => b.resourceAssetId === selectedResource);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1 animate-in">Resource Booking</h1>
      <p className="mb-6 text-sm animate-in stagger-1" style={{ color: "var(--text-muted)" }}>
        Book shared resources by time slot — no overlaps allowed
      </p>

      <form
        onSubmit={handleBook}
        className="animate-in stagger-2 mb-6 rounded-lg border p-5 grid grid-cols-3 gap-4 items-end"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div>
          <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Resource</label>
          <select
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            style={{ background: "var(--surface-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            <option value="">Select resource</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            style={{ background: "var(--surface-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>

        <div>
          <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
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
            {submitting ? "Booking..." : "Book Resource"}
          </button>

          {overlapMsg && (
            <div
              className="mt-3 rounded-md border px-3 py-2 text-sm"
              style={{ borderColor: "var(--status-lost)", background: "rgba(248,113,113,0.08)", color: "var(--status-lost)" }}
            >
              {overlapMsg}
            </div>
          )}
        </div>
      </form>

      {selectedResource && (
        <div className="animate-in stagger-3 mb-4">
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
            Existing bookings for this resource
          </p>
          <div className="flex flex-col gap-2">
            {resourceBookings.length === 0 && (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No bookings yet — this slot is open.</p>
            )}
            {resourceBookings.map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <span className="mono text-xs">
                  {new Date(b.startTime).toLocaleString()} → {new Date(b.endTime).toLocaleString()}
                </span>
                <span className="flex items-center gap-3">
                  <span style={{ color: "var(--text-muted)" }}>{b.bookedByName}</span>
                  <StatusBadge status={b.status} />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="animate-in stagger-4">
        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>All bookings</p>
        <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead style={{ background: "var(--surface-elevated)" }}>
              <tr className="text-left" style={{ color: "var(--text-muted)" }}>
                <th className="px-4 py-3 font-medium">Resource</th>
                <th className="px-4 py-3 font-medium">Booked By</th>
                <th className="px-4 py-3 font-medium">Start</th>
                <th className="px-4 py-3 font-medium">End</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-3">{b.resourceName}</td>
                  <td className="px-4 py-3">{b.bookedByName}</td>
                  <td className="px-4 py-3 mono text-xs" style={{ color: "var(--text-muted)" }}>
                    {new Date(b.startTime).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 mono text-xs" style={{ color: "var(--text-muted)" }}>
                    {new Date(b.endTime).toLocaleString()}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}