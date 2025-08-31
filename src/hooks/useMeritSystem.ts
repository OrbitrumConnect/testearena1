import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  UserMerit, 
  updateUserMerit, 
  identifyTopPerformers, 
  generateMeritReport,
  shouldResetMonthlyCycle,
  resetMonthlyCycle,
  MERIT_CONFIG
} from '@/utils/meritSystem';

export const useMeritSystem = () => {
  const [userMerit, setUserMerit] = useState<UserMerit | null>(null);
  const [globalRanking, setGlobalRanking] = useState<UserMerit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📊 Carregar dados de mérito do usuário
  const fetchUserMerit = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        // Carregar dados demo locais
        const localMerit = localStorage.getItem('demo_user_merit');
        if (localMerit) {
          const merit = JSON.parse(localMerit);
          
          // Verificar se precisa resetar ciclo mensal
          if (shouldResetMonthlyCycle(merit)) {
            const resetMerit = resetMonthlyCycle(merit);
            localStorage.setItem('demo_user_merit', JSON.stringify(resetMerit));
            setUserMerit(resetMerit);
          } else {
            setUserMerit(merit);
          }
        } else {
          // Criar mérito demo inicial
          const demoMerit: UserMerit = {
            userId: 'demo-user',
            displayName: 'Guerreiro Demo',
            totalPvP: 0,
            pvpWins: 0,
            winRate: 0,
            averageAccuracy: 0,
            currentStreak: 0,
            maxStreak: 0,
            daysActive: 1,
            totalQuestions: 0,
            totalCorrect: 0,
            meritScore: 0,
            rankPosition: 0,
            isTopPerformer: false,
            meritTier: 'bronze',
            bonusMultiplier: 1.0,
            monthlyCreditsEarned: 0,
            meritBonus: 0,
            maxWithdrawal: 0,
            lastUpdated: new Date().toISOString(),
            cycleMonth: new Date().toISOString().substring(0, 7)
          };
          
          localStorage.setItem('demo_user_merit', JSON.stringify(demoMerit));
          setUserMerit(demoMerit);
        }
        return;
      }

      // Buscar mérito real do Supabase
      const { data: merit, error: meritError } = await supabase
        .from('user_merit')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (meritError && meritError.code !== 'PGRST116') {
        throw meritError;
      }

      if (!merit) {
        // Criar registro inicial de mérito
        const newMerit: Partial<UserMerit> = {
          userId: user.id,
          displayName: user.user_metadata?.full_name || 'Guerreiro',
          totalPvP: 0,
          pvpWins: 0,
          winRate: 0,
          averageAccuracy: 0,
          currentStreak: 0,
          maxStreak: 0,
          daysActive: 1,
          totalQuestions: 0,
          totalCorrect: 0,
          meritScore: 0,
          rankPosition: 0,
          isTopPerformer: false,
          meritTier: 'bronze',
          bonusMultiplier: 1.0,
          monthlyCreditsEarned: 0,
          meritBonus: 0,
          maxWithdrawal: 0,
          cycleMonth: new Date().toISOString().substring(0, 7)
        };

        const { data: createdMerit, error: createError } = await supabase
          .from('user_merit')
          .insert(newMerit)
          .select()
          .single();

        if (createError) throw createError;
        setUserMerit(createdMerit as UserMerit);
      } else {
        // Verificar se precisa resetar ciclo
        if (shouldResetMonthlyCycle(merit as UserMerit)) {
          const resetMerit = resetMonthlyCycle(merit as UserMerit);
          await updateMeritInDatabase(resetMerit);
          setUserMerit(resetMerit);
        } else {
          setUserMerit(merit as UserMerit);
        }
      }

    } catch (err) {
      console.error('❌ Erro ao carregar mérito:', err);
      setError('Erro ao carregar dados de mérito');
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔄 Atualizar mérito no banco/localStorage
  const updateMeritInDatabase = useCallback(async (merit: UserMerit) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id === 'demo-user') {
        // Atualizar localmente (demo)
        localStorage.setItem('demo_user_merit', JSON.stringify(merit));
        return { success: true };
      }

      // Atualizar no Supabase (usuário real)
      const { error: updateError } = await supabase
        .from('user_merit')
        .update(merit)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      return { success: true };

    } catch (err) {
      console.error('❌ Erro ao atualizar mérito:', err);
      return { success: false, error: err };
    }
  }, []);

  // ⚔️ Registrar resultado de PvP
  const recordPvPResult = useCallback(async (result: {
    won: boolean;
    accuracy: number;
    questionsAnswered: number;
    correctAnswers: number;
    creditsEarned: number;
  }) => {
    if (!userMerit) return { success: false, error: 'Mérito não carregado' };

    try {
      const updatedMerit = updateUserMerit(userMerit, {
        pvpResult: { won: result.won, accuracy: result.accuracy },
        questionsAnswered: result.questionsAnswered,
        correctAnswers: result.correctAnswers,
        creditsEarned: result.creditsEarned
      });

      const updateResult = await updateMeritInDatabase(updatedMerit);
      
      if (updateResult.success) {
        setUserMerit(updatedMerit);
        
        return {
          success: true,
          meritUpdate: {
            meritScore: updatedMerit.meritScore,
            tier: updatedMerit.meritTier,
            bonusEarned: updatedMerit.meritBonus - (userMerit.meritBonus || 0),
            newStreak: updatedMerit.currentStreak,
            rankImprovement: userMerit.rankPosition - updatedMerit.rankPosition
          }
        };
      } else {
        return { success: false, error: updateResult.error };
      }

    } catch (err) {
      console.error('❌ Erro ao registrar PvP:', err);
      return { success: false, error: err };
    }
  }, [userMerit, updateMeritInDatabase]);

  // 📚 Registrar resultado de treino
  const recordTrainingResult = useCallback(async (result: {
    questionsAnswered: number;
    correctAnswers: number;
    creditsEarned: number;
    accuracy: number;
  }) => {
    if (!userMerit) return { success: false, error: 'Mérito não carregado' };

    try {
      const updatedMerit = updateUserMerit(userMerit, {
        questionsAnswered: result.questionsAnswered,
        correctAnswers: result.correctAnswers,
        creditsEarned: result.creditsEarned
      });

      // Atualizar precisão média geral
      const totalQuestions = updatedMerit.totalQuestions;
      const totalCorrect = updatedMerit.totalCorrect;
      updatedMerit.averageAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

      const updateResult = await updateMeritInDatabase(updatedMerit);
      
      if (updateResult.success) {
        setUserMerit(updatedMerit);
        return { success: true };
      } else {
        return { success: false, error: updateResult.error };
      }

    } catch (err) {
      console.error('❌ Erro ao registrar treino:', err);
      return { success: false, error: err };
    }
  }, [userMerit, updateMeritInDatabase]);

  // 🏆 Carregar ranking global
  const fetchGlobalRanking = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id === 'demo-user') {
        // Gerar ranking demo (simulado)
        const demoRanking = generateDemoRanking();
        setGlobalRanking(demoRanking);
        return;
      }

      // Buscar ranking real
      const { data: allMerits, error } = await supabase
        .from('user_merit')
        .select('*')
        .gte('total_pvp', MERIT_CONFIG.minGamesForRanking)
        .order('merit_score', { ascending: false })
        .limit(100);

      if (error) throw error;

      const rankedUsers = identifyTopPerformers(allMerits as UserMerit[]);
      setGlobalRanking(rankedUsers);

    } catch (err) {
      console.error('❌ Erro ao carregar ranking:', err);
      // Fallback para ranking demo
      const demoRanking = generateDemoRanking();
      setGlobalRanking(demoRanking);
    }
  }, []);

  // 📊 Gerar ranking demo (para desenvolvimento)
  const generateDemoRanking = (): UserMerit[] => {
    const demoUsers: UserMerit[] = [];
    
    for (let i = 0; i < 50; i++) {
      const winRate = Math.random() * 100;
      const accuracy = 60 + Math.random() * 40;
      const totalPvP = 10 + Math.floor(Math.random() * 90);
      const pvpWins = Math.floor((winRate / 100) * totalPvP);
      
      demoUsers.push({
        userId: `demo-${i}`,
        displayName: `Guerreiro ${i + 1}`,
        totalPvP,
        pvpWins,
        winRate,
        averageAccuracy: accuracy,
        currentStreak: Math.floor(Math.random() * 10),
        maxStreak: Math.floor(Math.random() * 15),
        daysActive: 15 + Math.floor(Math.random() * 15),
        totalQuestions: totalPvP * 5,
        totalCorrect: Math.floor((totalPvP * 5) * (accuracy / 100)),
        meritScore: (winRate * 0.3 + accuracy * 0.25 + 70 * 0.45),
        rankPosition: i + 1,
        isTopPerformer: i < 3, // Top 3 para demo
        meritTier: i < 3 ? 'elite' : i < 8 ? 'gold' : i < 20 ? 'silver' : 'bronze',
        bonusMultiplier: i < 3 ? 1.2 : i < 8 ? 1.1 : i < 20 ? 1.05 : 1.0,
        monthlyCreditsEarned: 200 + Math.floor(Math.random() * 800),
        meritBonus: i < 3 ? 50 + Math.floor(Math.random() * 100) : 0,
        maxWithdrawal: 200 + Math.floor(Math.random() * 300),
        lastUpdated: new Date().toISOString(),
        cycleMonth: new Date().toISOString().substring(0, 7)
      });
    }
    
    return identifyTopPerformers(demoUsers);
  };

  // 📈 Obter estatísticas do usuário
  const getUserStats = useCallback(() => {
    if (!userMerit) return null;

    return {
      performance: {
        meritScore: userMerit.meritScore,
        rankPosition: userMerit.rankPosition,
        tier: userMerit.meritTier,
        isTopPerformer: userMerit.isTopPerformer
      },
      pvp: {
        totalGames: userMerit.totalPvP,
        wins: userMerit.pvpWins,
        winRate: userMerit.winRate,
        currentStreak: userMerit.currentStreak,
        maxStreak: userMerit.maxStreak
      },
      accuracy: {
        average: userMerit.averageAccuracy,
        totalQuestions: userMerit.totalQuestions,
        totalCorrect: userMerit.totalCorrect
      },
      financial: {
        bonusMultiplier: userMerit.bonusMultiplier,
        monthlyCredits: userMerit.monthlyCreditsEarned,
        meritBonus: userMerit.meritBonus,
        maxWithdrawal: userMerit.maxWithdrawal
      },
      activity: {
        daysActive: userMerit.daysActive,
        cycleMonth: userMerit.cycleMonth
      }
    };
  }, [userMerit]);

  // Inicializar dados
  useEffect(() => {
    fetchUserMerit();
  }, [fetchUserMerit]);

  return {
    userMerit,
    globalRanking,
    loading,
    error,
    actions: {
      recordPvPResult,
      recordTrainingResult,
      fetchGlobalRanking,
      refetchUserMerit: fetchUserMerit
    },
    computed: {
      getUserStats,
      generateReport: () => generateMeritReport(globalRanking)
    }
  };
};
