"use client";

import { formatCurrency, formatNumber, formatRoas } from "@/lib/format";
import type { AdSetRow } from "@/lib/types";

export function AdSetsTable({ adSets, currency }: { adSets: AdSetRow[]; currency: string }) {
  if (adSets.length === 0) {
    return <p className="muted">Nenhum conjunto de anúncios encontrado nesta campanha.</p>;
  }

  const sorted = [...adSets].sort((a, b) => b.metrics.spend - a.metrics.spend);

  return (
    <div style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Conjunto de anúncios</th>
            <th>Status</th>
            <th className="num">Gasto</th>
            <th className="num">Receita</th>
            <th className="num">Lucro</th>
            <th className="num">ROAS</th>
            <th className="num">Compras</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>
                <span className={`badge ${s.effectiveStatus === "ACTIVE" ? "active" : "paused"}`}>
                  {s.effectiveStatus === "ACTIVE" ? "Ativo" : s.effectiveStatus}
                </span>
              </td>
              <td className="num">{formatCurrency(s.metrics.spend, currency)}</td>
              <td className="num">{formatCurrency(s.metrics.revenue, currency)}</td>
              <td className="num" style={{ color: s.metrics.profit < 0 ? "var(--critical)" : "var(--success-text)" }}>
                {formatCurrency(s.metrics.profit, currency)}
              </td>
              <td className="num">{formatRoas(s.metrics.roas)}</td>
              <td className="num">{formatNumber(s.metrics.purchases)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
