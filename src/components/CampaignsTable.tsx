"use client";

import { formatCurrency, formatNumber, formatRoas } from "@/lib/format";
import type { CampaignRow } from "@/lib/types";

export function CampaignsTable({
  campaigns,
  currency,
  selectedId,
  onSelect,
}: {
  campaigns: CampaignRow[];
  currency: string;
  selectedId: string | null;
  onSelect: (c: CampaignRow) => void;
}) {
  if (campaigns.length === 0) {
    return <p className="muted">Nenhuma campanha encontrada nesta conta.</p>;
  }

  const sorted = [...campaigns].sort((a, b) => b.metrics.spend - a.metrics.spend);

  return (
    <div style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Campanha</th>
            <th>Status</th>
            <th className="num">Gasto</th>
            <th className="num">Receita</th>
            <th className="num">Lucro</th>
            <th className="num">ROAS</th>
            <th className="num">Compras</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => (
            <tr
              key={c.id}
              className={c.id === selectedId ? "selected" : ""}
              onClick={() => onSelect(c)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(c);
              }}
            >
              <td>{c.name}</td>
              <td>
                <span className={`badge ${c.effectiveStatus === "ACTIVE" ? "active" : "paused"}`}>
                  {c.effectiveStatus === "ACTIVE" ? "Ativa" : c.effectiveStatus}
                </span>
              </td>
              <td className="num">{formatCurrency(c.metrics.spend, currency)}</td>
              <td className="num">{formatCurrency(c.metrics.revenue, currency)}</td>
              <td className="num" style={{ color: c.metrics.profit < 0 ? "var(--critical)" : "var(--success-text)" }}>
                {formatCurrency(c.metrics.profit, currency)}
              </td>
              <td className="num">{formatRoas(c.metrics.roas)}</td>
              <td className="num">{formatNumber(c.metrics.purchases)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
