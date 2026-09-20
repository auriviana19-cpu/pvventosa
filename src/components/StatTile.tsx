export function StatTile({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "bad";
}) {
  return (
    <div className="stat-tile">
      <div className="label">{label}</div>
      <div className={`value${tone !== "neutral" ? ` ${tone}` : ""}`}>{value}</div>
    </div>
  );
}
