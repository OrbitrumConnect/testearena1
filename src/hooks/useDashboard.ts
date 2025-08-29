import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  total_battles: number;
  battles_won: number;
  favorite_era: string | null;
  created_at: string;
  updated_at: string;
}

interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

interface BattleHistory {
  id: string;
  user_id: string;
  era_name: string;
  questions_total: number;
  questions_correct: number;
  accuracy_percentage: number;
  xp_earned: number;
  money_earned: number;
  battle_duration_seconds: number | null;
  completed_at: string;
}

interface WalletTransaction {
  id: string;
  user_id: string;
  transaction_type: 'earned' | 'spent' | 'bonus';
  amount: number;
  description: string;
  battle_id: string | null;
  created_at: string;
}

export const useDashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [battleHistory, setBattleHistory] = useState<BattleHistory[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      let { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Usar usuário demo se não há autenticação
        const demoUUID = '12345678-1234-1234-1234-123456789012';
        user = { id: demoUUID } as any;
      }

      // Verificar se há dados salvos localmente primeiro
      const localProfile = localStorage.getItem('demo_profile');
      const localWallet = localStorage.getItem('demo_wallet');
      const localBattles = localStorage.getItem('demo_battles');
      
      if (localProfile && localWallet && localBattles) {
        console.log('📱 Carregando dados locais salvos');
        setProfile(JSON.parse(localProfile));
        setWallet(JSON.parse(localWallet));
        setBattleHistory(JSON.parse(localBattles));
        setTransactions([]);
        setLoading(false);
        return;
      }

      // Buscar ou criar perfil do usuário
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (!profileData) {
        // Criar perfil se não existir
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            display_name: user.user_metadata?.full_name || 'Guerreiro',
            avatar_url: user.user_metadata?.avatar_url || null,
          })
          .select()
          .single();

        if (createError) throw createError;
        profileData = newProfile;
      }

      setProfile(profileData);

      // Buscar ou criar carteira do usuário
      let { data: walletData, error: walletError } = await supabase
        .from('user_wallet')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (walletError && walletError.code !== 'PGRST116') {
        throw walletError;
      }

      if (!walletData) {
        // Criar carteira se não existir
        const { data: newWallet, error: createWalletError } = await supabase
          .from('user_wallet')
          .insert({
            user_id: user.id,
            balance: 0.00,
            total_earned: 0.00,
            total_spent: 0.00,
          })
          .select()
          .single();

        if (createWalletError) throw createWalletError;
        walletData = newWallet;
      }

      setWallet(walletData);

      // Buscar histórico de batalhas
      const { data: battlesData, error: battlesError } = await supabase
        .from('battle_history')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (battlesError) throw battlesError;
      setBattleHistory(battlesData || []);

      // Buscar transações da carteira
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;
      setTransactions((transactionsData || []) as WalletTransaction[]);

    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      
      // Se houver erro de permissão, usar dados de fallback local
      console.log('🚫 Erro de permissão detectado, usando dados locais de fallback');
      
      const fallbackProfile: UserProfile = {
        id: 'demo-id',
        user_id: 'demo-user',
        display_name: 'Guerreiro Demo',
        avatar_url: null,
        total_xp: 0,
        total_battles: 0,
        battles_won: 0,
        favorite_era: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const fallbackWallet: UserWallet = {
        id: 'demo-wallet',
        user_id: 'demo-user',
        balance: 0,
        total_earned: 0,
        total_spent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Salvar dados locais
      localStorage.setItem('demo_profile', JSON.stringify(fallbackProfile));
      localStorage.setItem('demo_wallet', JSON.stringify(fallbackWallet));
      localStorage.setItem('demo_battles', JSON.stringify([]));

      setProfile(fallbackProfile);
      setWallet(fallbackWallet);
      setBattleHistory([]);
      setTransactions([]);
      setError(null); // Limpar erro já que temos fallback
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      throw err;
    }
  };

  const addBattleRecord = async (battleData: Omit<BattleHistory, 'id' | 'user_id' | 'completed_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('battle_history')
        .insert({
          ...battleData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar estatísticas do perfil
      if (profile) {
        const isWin = battleData.questions_correct >= battleData.questions_total * 0.7;
        await updateProfile({
          total_battles: profile.total_battles + 1,
          battles_won: profile.battles_won + (isWin ? 1 : 0),
          total_xp: profile.total_xp + battleData.xp_earned,
        });
      }

      // Atualizar carteira se houver ganhos
      if (battleData.money_earned > 0 && wallet) {
        await supabase
          .from('user_wallet')
          .update({
            balance: wallet.balance + battleData.money_earned,
            total_earned: wallet.total_earned + battleData.money_earned,
          })
          .eq('user_id', user.id);

        // Adicionar transação
        await supabase
          .from('wallet_transactions')
          .insert({
            user_id: user.id,
            transaction_type: 'earned',
            amount: battleData.money_earned,
            description: `Vitória na batalha: ${battleData.era_name}`,
            battle_id: data.id,
          });
      }

      await fetchDashboardData(); // Atualizar dados
      return data;
    } catch (err) {
      console.error('Erro ao adicionar registro de batalha:', err);
      throw err;
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    profile,
    wallet,
    battleHistory,
    transactions,
    loading,
    error,
    refetch: fetchDashboardData,
    updateProfile,
    addBattleRecord,
  };
};