// src/hooks/useRanking.ts
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../integrations/supabase/client";

export type RankingType = "free" | "premium";

type BaseRow = {
  user_id: string;
  total_points: number;
  arena_points: number;
  training_points?: number;
  labirinto_points?: number;
  premium_bonus?: number;
  battles_won?: number | null;
  total_xp?: number | null;
  accuracy_average?: number | null;
  current_rank?: number | null;
  last_updated?: string;
  username?: string;
};

export function useRanking(type: RankingType = "free") {
  const [data, setData] = useState<BaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    // Admin sempre usa premium_rankings
    const table = type === "premium" ? "premium_rankings" : "free_rankings";

    const fetchRanking = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from<BaseRow>(table)
          .select("*")
          .order("total_points", { ascending: false });

        if (!active) return;

        if (error) {
          setError(error.message);
          setData([]);
        } else {
          setData(data ?? []);
        }
      } catch (err: any) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();

    return () => {
      active = false;
    };
  }, [type]);

  const { top10, rest90 } = useMemo(() => {
    const total = data?.length ?? 0;
    const topCount = Math.max(1, Math.ceil(total * 0.1));
    return {
      top10: data?.slice(0, topCount) ?? [],
      rest90: data?.slice(topCount) ?? [],
    };
  }, [data]);

  return { loading, error, top10, rest90 };
}