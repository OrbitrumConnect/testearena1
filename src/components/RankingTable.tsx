// src/components/RankingTable.tsx
import React from "react";
import { useRanking, RankingType } from "../hooks/useRanking";

function shorten(id?: string) {
  if (!id) return "";
  return id.length > 10 ? id.slice(0, 6) + "…" + id.slice(-4) : id;
}

type Props = { type?: RankingType; title?: string };

export default function RankingTable({ type = "free", title }: Props) {
  const { loading, error, top10, rest90 } = useRanking(type);
  const isPremium = type === "premium";

  if (loading) return <div>Carregando ranking {title ?? type}…</div>;
  if (error) return <div>Erro ao carregar ranking: {error}</div>;

  const renderHeader = () => (
    <thead>
      <tr>
        <th>#</th>
        <th>Usuário</th>
        <th>Total</th>
        <th>{isPremium ? "Arena" : "Arena"}</th>
        <th>{isPremium ? "Labirinto" : "Treino"}</th>
        {isPremium && <th>Bônus</th>}
        <th>Vitórias</th>
        <th>Acc (%)</th>
      </tr>
    </thead>
  );

  const renderRows = (arr: any[], startIndex = 0) =>
    arr.map((u, i) => (
      <tr key={u.user_id}>
        <td>{startIndex + i + 1}</td>
        <td>{u.username ?? shorten(u.user_id)}</td>
        <td>{u.total_points ?? 0}</td>
        <td>{u.arena_points ?? 0}</td>
        <td>{isPremium ? u.labirinto_points ?? 0 : u.training_points ?? 0}</td>
        {isPremium && <td>{u.premium_bonus ?? 0}</td>}
        <td>{u.battles_won ?? 0}</td>
        <td>{Number(u.accuracy_average ?? 0).toFixed(2)}</td>
      </tr>
    ));

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
  };
  const cardStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    background: "white",
    boxShadow: "0 1px 2px rgba(0,0,0,.04)",
  };

  return (
    <div style={cardStyle}>
      <h2>{title ?? (isPremium ? "Ranking Premium" : "Ranking Free")}</h2>

      <h3>TOP 10%</h3>
      <table style={tableStyle}>
        {renderHeader()}
        <tbody>{renderRows(top10)}</tbody>
      </table>

      <h3 style={{ marginTop: 24 }}>Restante 90%</h3>
      <table style={tableStyle}>
        {renderHeader()}
        <tbody>{renderRows(rest90, top10?.length ?? 0)}</tbody>
      </table>
    </div>
  );
}