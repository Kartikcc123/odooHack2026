export default function AssetTag({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 mono text-xs"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface-elevated)",
        color: "var(--accent)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--accent-dim)" }}
      />
      {tag}
    </span>
  );
}