import { useEffect, useMemo, useState } from "react";
import { supabase } from "../integrations/supabase/client";

type RankingType = "free" | "premium";

// Função para validar UUID
function isValidUUID(uuid: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

export function useRanking(type: RankingType) {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Para usuário admin, sempre usar premium_rankings
    let table = "premium_rankings"; // Forçar premium para admin
    
    // Se não for admin, usar o tipo especificado
    // let table = type === "premium" ? "premium_rankings" : "free_rankings";

    const fetchRanking = async () => {
      setLoading(true);
      setError(null);

      console.log(`🔍 Tentando buscar ranking da tabela: ${table}`);

      try {
        // Verificar se a tabela existe antes de fazer a query
        const { data, error } = await supabase
          .from(table as any)
          .select("*")
          .order("total_points", { ascending: false })
          .limit(100); // Limitar para evitar sobrecarga

        if (error) {
          console.warn(`Erro ao buscar ranking da tabela ${table}:`, error);
          // Se a tabela não existir, usar dados vazios
          if (error.code === 'PGRST116') {
            console.warn(`Tabela ${table} não encontrada, usando dados vazios`);
            setRanking([]);
            return;
          }
          throw error;
        }

        // Validar dados recebidos
        const validData = (data || []).filter((item: any) => {
          if (item?.user_id && !isValidUUID(item.user_id)) {
            console.warn("UUID inválido encontrado:", item.user_id);
            return false;
          }
          return true;
        });

        setRanking(validData);
      } catch (err: any) {
        console.error("Erro ao buscar ranking:", err);
        setError(err.message || "Erro desconhecido");
        setRanking([]); // Garantir array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();

    // Removido realtime temporariamente para evitar erros de WebSocket
    // const subscription = supabase
    //   .channel(`${table}_changes`)
    //   .on(
    //     "postgres_changes",
    //     { event: "*", schema: "public", table },
    //     () => fetchRanking()
    //   )
    //   .subscribe();

    // return () => {
    //   supabase.removeChannel(subscription);
    // };
  }, [type]);

  const { top10, rest90 } = useMemo(() => {
    const limit = Math.ceil(ranking.length * 0.1);
    return {
      top10: ranking.slice(0, limit) || [],
      rest90: ranking.slice(limit) || [],
    };
  }, [ranking]);

  return { 
    ranking, 
    top10: Array.isArray(top10) ? top10 : [],
    rest90: Array.isArray(rest90) ? rest90 : [],
    loading, 
    error 
  };
}
