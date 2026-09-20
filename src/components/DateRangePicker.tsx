"use client";

import { DATE_PRESET_LABELS } from "@/lib/format";
import type { DatePreset } from "@/lib/types";

const PRESETS: DatePreset[] = ["today", "yesterday", "last_7d", "last_14d", "last_30d", "this_month", "last_month"];

export function DateRangePicker({
  value,
  onChange,
}: {
  value: DatePreset;
  onChange: (v: DatePreset) => void;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as DatePreset)} aria-label="Período">
      {PRESETS.map((p) => (
        <option key={p} value={p}>
          {DATE_PRESET_LABELS[p]}
        </option>
      ))}
    </select>
  );
}
