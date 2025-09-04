import { useRanking } from "../hooks/useRanking";

interface RankingTableProps {
  type: "free" | "premium";
}

export function RankingTable({ type }: RankingTableProps) {
  const { top10, rest90, loading, error } = useRanking(type);

  if (loading) return <p>Carregando ranking...</p>;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  return (
    <div className="p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-lg font-bold mb-3">
        Ranking {type === "premium" ? "Premium" : "Free"}
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">#</th>
            <th className="border px-2 py-1">Usuário</th>
            <th className="border px-2 py-1">Total</th>
            {type === "free" ? (
              <>
                <th className="border px-2 py-1">Arena</th>
                <th className="border px-2 py-1">Treinamento</th>
              </>
            ) : (
              <>
                <th className="border px-2 py-1">Labirinto</th>
                <th className="border px-2 py-1">Bônus</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {top10?.map((user, i) => (
            <tr key={user.id} className="bg-yellow-100">
              <td className="border px-2 py-1">{i + 1}</td>
              <td className="border px-2 py-1">{user.username || "Anônimo"}</td>
              <td className="border px-2 py-1">{user.total_points}</td>
              {type === "free" ? (
                <>
                  <td className="border px-2 py-1">{user.arena_points}</td>
                  <td className="border px-2 py-1">{user.training_points}</td>
                </>
              ) : (
                <>
                  <td className="border px-2 py-1">{user.labirinto_points}</td>
                  <td className="border px-2 py-1">{user.premium_bonus}</td>
                </>
              )}
            </tr>
          ))}
          {rest90?.map((user, i) => (
            <tr key={user.id}>
              <td className="border px-2 py-1">{(top10?.length ?? 0) + i + 1}</td>
              <td className="border px-2 py-1">{user.username || "Anônimo"}</td>
              <td className="border px-2 py-1">{user.total_points}</td>
              {type === "free" ? (
                <>
                  <td className="border px-2 py-1">{user.arena_points}</td>
                  <td className="border px-2 py-1">{user.training_points}</td>
                </>
              ) : (
                <>
                  <td className="border px-2 py-1">{user.labirinto_points}</td>
                  <td className="border px-2 py-1">{user.premium_bonus}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
