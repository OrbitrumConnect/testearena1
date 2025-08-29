import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player, BattleRoom, BattleState, ArenaPhase } from '@/types/arena';

// Schema para tabela de batalhas em tempo real
interface ActiveBattle {
  id: string;
  player1_id: string;
  player2_id: string;
  status: 'waiting' | 'active' | 'finished';
  bet_amount: number;
  total_pool: number;
  current_round: number;
  player1_hp: number;
  player2_hp: number;
  winner_id?: string;
  created_at: string;
  updated_at: string;
}

// Schema para matchmaking queue
interface MatchmakingQueue {
  id: string;
  user_id: string;
  status: 'waiting' | 'matched';
  bet_amount: number;
  created_at: string;
}

export const useRealArena = () => {
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [phase, setPhase] = useState<ArenaPhase>('lobby');
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [activeBattle, setActiveBattle] = useState<ActiveBattle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔐 AUTENTICAÇÃO E CARREGAMENTO DO USUÁRIO ATUAL
  const loadCurrentUser = useCallback(async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('👤 Usuário não autenticado, usando demo');
        // Fallback para demo user
        setCurrentUser({
          id: 'demo-user',
          name: 'Guerreiro Demo',
          level: 15,
          xp: 2500,
          status: 'online',
          winRate: 75,
          totalBattles: 20,
        });
        return;
      }

      // Buscar perfil do usuário real no Supabase
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('❌ Erro ao carregar perfil:', profileError);
        throw profileError;
      }

      // Converter profile do Supabase para Player
      const playerData: Player = {
        id: user.id,
        name: profile.display_name || 'Guerreiro',
        level: Math.floor(profile.total_xp / 100) + 1,
        xp: profile.total_xp,
        status: 'online',
        winRate: profile.total_battles > 0 
          ? Math.round((profile.battles_won / profile.total_battles) * 100) 
          : 0,
        totalBattles: profile.total_battles,
        avatar: profile.avatar_url
      };

      setCurrentUser(playerData);
      console.log('✅ Usuário autenticado:', playerData.name);

    } catch (err) {
      console.error('❌ Erro ao carregar usuário:', err);
      setError('Erro ao carregar dados do usuário');
    }
  }, []);

  // 🌐 BUSCAR PLAYERS ONLINE (USUÁRIOS REAIS)
  const loadAvailablePlayers = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      // Buscar usuários online na fila de matchmaking
      const { data: queue, error: queueError } = await supabase
        .from('matchmaking_queue')
        .select(`
          user_id,
          profiles (
            display_name,
            total_xp,
            total_battles,
            battles_won,
            avatar_url
          )
        `)
        .eq('status', 'waiting')
        .neq('user_id', currentUser.id) // Excluir o próprio usuário
        .limit(20);

      if (queueError) throw queueError;

      // Converter para formato Player
      const players: Player[] = (queue || []).map(item => ({
        id: item.user_id,
        name: item.profiles?.display_name || 'Guerreiro',
        level: Math.floor((item.profiles?.total_xp || 0) / 100) + 1,
        xp: item.profiles?.total_xp || 0,
        status: 'waiting' as const,
        winRate: item.profiles?.total_battles > 0 
          ? Math.round(((item.profiles?.battles_won || 0) / item.profiles.total_battles) * 100)
          : 0,
        totalBattles: item.profiles?.total_battles || 0,
        avatar: item.profiles?.avatar_url
      }));

      setAvailablePlayers(players);
      console.log(`👥 ${players.length} players encontrados na fila`);

    } catch (err) {
      console.error('❌ Erro ao carregar players:', err);
      setError('Erro ao carregar jogadores online');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // 🎯 ENTRAR NA FILA DE MATCHMAKING
  const enterMatchmakingQueue = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setPhase('matchmaking');

      // Verificar saldo suficiente
      const { data: wallet, error: walletError } = await supabase
        .from('user_wallet')
        .select('balance')
        .eq('user_id', currentUser.id)
        .single();

      if (walletError || !wallet || wallet.balance < 9.00) {
        throw new Error('Saldo insuficiente para apostar 900 créditos');
      }

      // Adicionar à fila de matchmaking
      const { error: queueError } = await supabase
        .from('matchmaking_queue')
        .insert({
          user_id: currentUser.id,
          status: 'waiting',
          bet_amount: 9.00
        });

      if (queueError) throw queueError;

      console.log('⏳ Usuário adicionado à fila de matchmaking');
      
      // Procurar match automaticamente
      await findMatch();

    } catch (err) {
      console.error('❌ Erro ao entrar na fila:', err);
      setError(err instanceof Error ? err.message : 'Erro ao entrar na fila');
      setPhase('lobby');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // 🔍 PROCURAR MATCH AUTOMÁTICO
  const findMatch = useCallback(async () => {
    if (!currentUser) return;

    try {
      // Buscar outro player na fila
      const { data: opponent, error } = await supabase
        .from('matchmaking_queue')
        .select(`
          user_id,
          profiles (
            display_name,
            total_xp,
            total_battles,
            battles_won,
            avatar_url
          )
        `)
        .eq('status', 'waiting')
        .neq('user_id', currentUser.id)
        .limit(1)
        .single();

      if (error || !opponent) {
        console.log('⏳ Aguardando outros players...');
        // Continuar procurando a cada 3 segundos
        setTimeout(findMatch, 3000);
        return;
      }

      console.log('🎯 Match encontrado!');
      await createBattle(opponent);

    } catch (err) {
      console.error('❌ Erro ao procurar match:', err);
    }
  }, [currentUser]);

  // ⚔️ CRIAR BATALHA REAL
  const createBattle = useCallback(async (opponent: any) => {
    if (!currentUser) return;

    try {
      // Criar batalha no banco
      const { data: battle, error: battleError } = await supabase
        .from('active_battles')
        .insert({
          player1_id: currentUser.id,
          player2_id: opponent.user_id,
          status: 'waiting',
          bet_amount: 9.00,
          total_pool: 18.00,
          current_round: 1,
          player1_hp: 100,
          player2_hp: 100
        })
        .select()
        .single();

      if (battleError) throw battleError;

      // Remover ambos players da fila
      await supabase
        .from('matchmaking_queue')
        .delete()
        .in('user_id', [currentUser.id, opponent.user_id]);

      // Débitar R$ 9,00 de ambos players
      await Promise.all([
        debitFromWallet(currentUser.id, 9.00, 'Arena PvP - Aposta'),
        debitFromWallet(opponent.user_id, 9.00, 'Arena PvP - Aposta')
      ]);

      setActiveBattle(battle);
      setPhase('room_created');

      console.log('✅ Batalha criada:', battle.id);

    } catch (err) {
      console.error('❌ Erro ao criar batalha:', err);
      setError('Erro ao criar batalha');
    }
  }, [currentUser]);

  // 💰 DÉBITAR DA CARTEIRA
  const debitFromWallet = async (userId: string, amount: number, description: string) => {
    // Atualizar saldo
    const { error: walletError } = await supabase.rpc('update_wallet_balance', {
      user_id: userId,
      amount: -amount
    });

    if (walletError) throw walletError;

    // Registrar transação
    await supabase
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        transaction_type: 'debit',
        amount: amount,
        description: description
      });
  };

  // 🏆 CREDITAR VITÓRIA
  const creditVictory = async (winnerId: string, loserId: string, battleId: string) => {
    try {
      // Vencedor recebe 1.400 créditos (aposta de 900 + 500 créditos)
      const { error: creditError } = await supabase.rpc('update_wallet_balance', {
        user_id: winnerId,
        amount: 14.00
      });

      if (creditError) throw creditError;

      // Registrar transação de vitória
      await supabase
        .from('wallet_transactions')
        .insert({
          user_id: winnerId,
          transaction_type: 'credit',
          amount: 14.00,
          description: 'Arena PvP - Vitória',
          battle_id: battleId
        });

      // Atualizar estatísticas do vencedor
      await supabase.rpc('update_battle_stats', {
        user_id: winnerId,
        won: true
      });

      // Atualizar estatísticas do perdedor
      await supabase.rpc('update_battle_stats', {
        user_id: loserId,
        won: false
      });

      console.log('💰 Recompensas processadas');

    } catch (err) {
      console.error('❌ Erro ao processar recompensas:', err);
    }
  };

  // 🔄 REAL-TIME SUBSCRIPTIONS
  useEffect(() => {
    if (!currentUser) return;

    // Subscrever a mudanças na batalha ativa
    const battleSubscription = supabase
      .channel('active_battles')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'active_battles',
          filter: `player1_id=eq.${currentUser.id},player2_id=eq.${currentUser.id}`
        }, 
        (payload) => {
          console.log('🔄 Batalha atualizada:', payload);
          if (payload.new) {
            setActiveBattle(payload.new as ActiveBattle);
          }
        }
      )
      .subscribe();

    // Subscrever a mudanças na fila
    const queueSubscription = supabase
      .channel('matchmaking_queue')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'matchmaking_queue'
        }, 
        () => {
          console.log('🔄 Fila atualizada');
          loadAvailablePlayers();
        }
      )
      .subscribe();

    return () => {
      battleSubscription.unsubscribe();
      queueSubscription.unsubscribe();
    };
  }, [currentUser, loadAvailablePlayers]);

  // Inicializar usuário
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  return {
    currentUser,
    phase,
    availablePlayers,
    activeBattle,
    loading,
    error,
    actions: {
      enterMatchmakingQueue,
      loadAvailablePlayers,
      creditVictory,
      returnToLobby: () => setPhase('lobby')
    }
  };
};
