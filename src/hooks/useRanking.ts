import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RankingUser {
  id: string;
  display_name: string;
  avatar_url?: string;
  total_xp: number;
  total_battles: number;
  battles_won: number;
  win_rate: number;
  favorite_era?: string;
  position: number;
  total_earned?: number;
}

export interface EraRanking {
  era_name: string;
  era_slug: string;
  top_users: RankingUser[];
  background_theme: string;
  icon: string;
}

export const useRanking = () => {
  const [globalRanking, setGlobalRanking] = useState<RankingUser[]>([]);
  const [eraRankings, setEraRankings] = useState<EraRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalRanking = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(50);

      if (error) throw error;

      const rankingData = (data || []).map((user, index) => ({
        ...user,
        win_rate: user.total_battles > 0 ? Math.round((user.battles_won / user.total_battles) * 100) : 0,
        position: index + 1
      }));

      setGlobalRanking(rankingData);
    } catch (err) {
      console.error('Erro ao buscar ranking global:', err);
    }
  };

  const fetchEraRankings = async () => {
    try {
      // Get era-specific rankings based on battle history
      const eras = [
        { name: 'Egito Antigo', slug: 'egito-antigo', theme: 'bg-gradient-to-br from-yellow-600 via-orange-500 to-amber-700', icon: '🏺' },
        { name: 'Mesopotâmia', slug: 'mesopotamia', theme: 'bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-700', icon: '🏛️' },
        { name: 'Era Medieval', slug: 'medieval', theme: 'bg-gradient-to-br from-gray-600 via-stone-500 to-slate-700', icon: '⚔️' },
        { name: 'Era Digital', slug: 'digital', theme: 'bg-gradient-to-br from-green-600 via-cyan-500 to-blue-700', icon: '💻' }
      ];

      const eraRankingData: EraRanking[] = [];

      for (const era of eras) {
        const { data: battleData, error } = await supabase
          .from('battle_history')
          .select(`
            user_id,
            xp_earned,
            accuracy_percentage,
            profiles!inner(
              id,
              display_name,
              avatar_url,
              total_xp,
              total_battles,
              battles_won
            )
          `)
          .ilike('era_name', `%${era.name.split(' ')[0]}%`)
          .order('xp_earned', { ascending: false })
          .limit(10);

        if (error) continue;

        // Aggregate user performance in this era
        const userStats = new Map<string, any>();
        
        (battleData || []).forEach(battle => {
          const userId = battle.user_id;
          if (!userStats.has(userId)) {
            userStats.set(userId, {
              ...battle.profiles,
              era_xp: 0,
              era_battles: 0,
              era_accuracy: 0,
              total_accuracy: 0
            });
          }
          
          const stats = userStats.get(userId);
          stats.era_xp += battle.xp_earned;
          stats.era_battles += 1;
          stats.total_accuracy += battle.accuracy_percentage;
        });

        const topUsers = Array.from(userStats.values())
          .map((user, index) => ({
            ...user,
            win_rate: user.total_battles > 0 ? Math.round((user.battles_won / user.total_battles) * 100) : 0,
            era_accuracy: user.era_battles > 0 ? Math.round(user.total_accuracy / user.era_battles) : 0,
            position: index + 1
          }))
          .sort((a, b) => b.era_xp - a.era_xp)
          .slice(0, 5);

        eraRankingData.push({
          era_name: era.name,
          era_slug: era.slug,
          top_users: topUsers,
          background_theme: era.theme,
          icon: era.icon
        });
      }

      setEraRankings(eraRankingData);
    } catch (err) {
      console.error('Erro ao buscar rankings por era:', err);
    }
  };

  const generateMockRanking = () => {
    // Generate mock data for demonstration
    const mockUsers: RankingUser[] = [
      { id: '1', display_name: 'Faraó Supremo', total_xp: 15000, total_battles: 150, battles_won: 120, win_rate: 80, favorite_era: 'Egito Antigo', position: 1 },
      { id: '2', display_name: 'Guerreiro Digital', total_xp: 12500, total_battles: 120, battles_won: 90, win_rate: 75, favorite_era: 'Era Digital', position: 2 },
      { id: '3', display_name: 'Cavaleiro Medieval', total_xp: 11000, total_battles: 100, battles_won: 75, win_rate: 75, favorite_era: 'Era Medieval', position: 3 },
      { id: '4', display_name: 'Escriba Mesopotâmico', total_xp: 9500, total_battles: 90, battles_won: 65, win_rate: 72, favorite_era: 'Mesopotâmia', position: 4 },
      { id: '5', display_name: 'Mestre das Eras', total_xp: 8800, total_battles: 80, battles_won: 60, win_rate: 75, favorite_era: 'Egito Antigo', position: 5 },
    ];

    setGlobalRanking(mockUsers);

    // Mock era rankings
    const mockEraRankings: EraRanking[] = [
      {
        era_name: 'Egito Antigo',
        era_slug: 'egito-antigo',
        background_theme: 'bg-gradient-to-br from-yellow-600 via-orange-500 to-amber-700',
        icon: '🏺',
        top_users: mockUsers.slice(0, 3)
      },
      {
        era_name: 'Mesopotâmia',
        era_slug: 'mesopotamia', 
        background_theme: 'bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-700',
        icon: '🏛️',
        top_users: mockUsers.slice(1, 4)
      },
      {
        era_name: 'Era Medieval',
        era_slug: 'medieval',
        background_theme: 'bg-gradient-to-br from-gray-600 via-stone-500 to-slate-700',
        icon: '⚔️',
        top_users: mockUsers.slice(2, 5)
      },
      {
        era_name: 'Era Digital',
        era_slug: 'digital',
        background_theme: 'bg-gradient-to-br from-green-600 via-cyan-500 to-blue-700',
        icon: '💻',
        top_users: mockUsers.slice(0, 3)
      }
    ];

    setEraRankings(mockEraRankings);
  };

  useEffect(() => {
    const loadRankings = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([fetchGlobalRanking(), fetchEraRankings()]);
        
        // If no real data, use mock data
        if (globalRanking.length === 0) {
          generateMockRanking();
        }
      } catch (err) {
        setError('Erro ao carregar rankings');
        generateMockRanking(); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, []);

  const refetch = () => {
    return Promise.all([fetchGlobalRanking(), fetchEraRankings()]);
  };

  return {
    globalRanking,
    eraRankings,
    loading,
    error,
    refetch
  };
};
