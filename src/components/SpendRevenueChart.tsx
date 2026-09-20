"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import type { CampaignRow } from "@/lib/types";

interface TooltipState {
  x: number;
  y: number;
  campaign: string;
  spend: number;
  revenue: number;
}

/** Barras horizontais agrupadas comparando gasto vs receita das campanhas com maior gasto. */
export function SpendRevenueChart({ campaigns, currency }: { campaigns: CampaignRow[]; currency: string }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const top = [...campaigns]
    .filter((c) => c.metrics.spend > 0 || c.metrics.revenue > 0)
    .sort((a, b) => b.metrics.spend - a.metrics.spend)
    .slice(0, 8);

  if (top.length === 0) {
    return <p className="muted">Sem dados de gasto ou receita para exibir no período selecionado.</p>;
  }

  const max = Math.max(...top.flatMap((c) => [c.metrics.spend, c.metrics.revenue]), 1);

  const showTooltip = (e: React.MouseEvent | React.FocusEvent, c: CampaignRow) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({
      x: rect.right,
      y: rect.top,
      campaign: c.name,
      spend: c.metrics.spend,
      revenue: c.metrics.revenue,
    });
  };

  return (
    <div>
      <div className="legend">
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: "var(--series-spend)" }} />
          Gasto
        </span>
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: "var(--series-revenue)" }} />
          Receita
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {top.map((c) => (
          <div key={c.id}>
            <div
              className="muted"
              style={{
                fontSize: 12.5,
                marginBottom: 4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {c.name}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <BarRow
                widthPct={(c.metrics.spend / max) * 100}
                color="var(--series-spend)"
                value={formatCurrency(c.metrics.spend, currency)}
                onEnter={(e) => showTooltip(e, c)}
                onLeave={() => setTooltip(null)}
              />
              <BarRow
                widthPct={(c.metrics.revenue / max) * 100}
                color="var(--series-revenue)"
                value={formatCurrency(c.metrics.revenue, currency)}
                onEnter={(e) => showTooltip(e, c)}
                onLeave={() => setTooltip(null)}
              />
            </div>
          </div>
        ))}
      </div>

      {tooltip && (
        <div className="chart-tooltip" style={{ left: tooltip.x + 10, top: tooltip.y - 8 }} role="status">
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{tooltip.campaign}</div>
          <div className="row">
            <span>Gasto</span>
            <span className="val">{formatCurrency(tooltip.spend, currency)}</span>
          </div>
          <div className="row">
            <span>Receita</span>
            <span className="val">{formatCurrency(tooltip.revenue, currency)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function BarRow({
  widthPct,
  color,
  value,
  onEnter,
  onLeave,
}: {
  widthPct: number;
  color: string;
  value: string;
  onEnter: (e: React.MouseEvent | React.FocusEvent) => void;
  onLeave: () => void;
}) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, borderLeft: "1px solid var(--baseline)" }}
      tabIndex={0}
      onMouseEnter={onEnter}
      onMouseMove={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <div
        style={{
          height: 18,
          minWidth: 3,
          width: `${Math.max(widthPct, 0.5)}%`,
          background: color,
          borderRadius: "0 4px 4px 0",
        }}
      />
      <span className="muted" style={{ fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </span>
    </div>
  );
}
