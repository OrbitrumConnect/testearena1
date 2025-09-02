import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCreditsPerception } from '@/hooks/useCreditsPerception';

interface BattleData {
  eraName: string;
  questionsTotal: number;
  questionsCorrect: number;
  xpEarned: number;
  moneyEarned: number;
  battleDurationSeconds?: number;
  battleType?: 'training' | 'pvp' | 'tournament';
}

export const useBattleSave = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gerar ou recuperar ID único do usuário
  const getOrCreateUserId = () => {
    let userId = localStorage.getItem('current_user_id');
    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('current_user_id', userId);
      console.log('🆔 Novo usuário criado:', userId);
    }
    return userId;
  };

  // Salvar dados no Supabase
  const saveToSupabase = async (userId: string, battleData: BattleData) => {
    const accuracyPercentage = Math.round((battleData.questionsCorrect / battleData.questionsTotal) * 100);
    const isWin = accuracyPercentage >= 70;

    // 1. Criar ou atualizar perfil do usuário
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingProfile) {
      // Criar novo perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          display_name: `Guerreiro ${userId.slice(-4)}`,
          total_xp: battleData.xpEarned,
          total_battles: 1,
          battles_won: isWin ? 1 : 0,
          favorite_era: battleData.eraName,
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        throw profileError;
      }
    } else {
      // Atualizar perfil existente
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          total_xp: existingProfile.total_xp + battleData.xpEarned,
          total_battles: existingProfile.total_battles + 1,
          battles_won: existingProfile.battles_won + (isWin ? 1 : 0),
          favorite_era: battleData.eraName,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError);
        throw profileError;
      }
    }

    // 2. Criar ou atualizar carteira do usuário
    const { data: existingWallet } = await supabase
      .from('user_wallet')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingWallet) {
      // Criar nova carteira
      const { error: walletError } = await supabase
        .from('user_wallet')
        .insert({
          user_id: userId,
          balance: battleData.moneyEarned,
          total_earned: battleData.moneyEarned,
          total_spent: 0,
        });

      if (walletError) {
        console.error('Erro ao criar carteira:', walletError);
        throw walletError;
      }
    } else {
      // Atualizar carteira existente
      const { error: walletError } = await supabase
        .from('user_wallet')
        .update({
          balance: existingWallet.balance + battleData.moneyEarned,
          total_earned: existingWallet.total_earned + battleData.moneyEarned,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (walletError) {
        console.error('Erro ao atualizar carteira:', walletError);
        throw walletError;
      }
    }

    // 3. Salvar histórico de batalha
    const { data: battleRecord, error: battleError } = await supabase
      .from('battle_history')
      .insert({
        user_id: userId,
        era_name: battleData.eraName,
        questions_total: battleData.questionsTotal,
        questions_correct: battleData.questionsCorrect,
        accuracy_percentage: accuracyPercentage,
        xp_earned: battleData.xpEarned,
        money_earned: battleData.moneyEarned,
        battle_duration_seconds: battleData.battleDurationSeconds || 180,
      })
      .select()
      .single();

    if (battleError) {
      console.error('Erro ao salvar batalha:', battleError);
      throw battleError;
    }

    // 4. Adicionar transação na carteira
    if (battleData.moneyEarned > 0) {
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: userId,
          transaction_type: 'earned',
          amount: battleData.moneyEarned,
          description: `${isWin ? 'Vitória' : 'Participação'} - ${battleData.eraName}`,
          battle_id: battleRecord.id,
        });

      if (transactionError) {
        console.error('Erro ao salvar transação:', transactionError);
        // Não falhar se a transação der erro
      }
    }

    return { success: true, battleId: battleRecord.id, userId };
  };

  // Fallback para localStorage
  const saveToLocalStorage = async (userId: string, battleData: BattleData) => {
    const accuracyPercentage = Math.round((battleData.questionsCorrect / battleData.questionsTotal) * 100);
    const isWin = accuracyPercentage >= 70;

    let localProfile = JSON.parse(localStorage.getItem(`profile_${userId}`) || 'null');
    let localWallet = JSON.parse(localStorage.getItem(`wallet_${userId}`) || 'null');
    let localBattles = JSON.parse(localStorage.getItem(`battles_${userId}`) || '[]');

    if (!localProfile) {
      localProfile = {
        id: `profile-${userId}`,
        user_id: userId,
        display_name: `Guerreiro ${userId.slice(-4)}`,
        total_xp: battleData.xpEarned,
        total_battles: 1,
        battles_won: isWin ? 1 : 0,
        favorite_era: battleData.eraName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } else {
      localProfile.total_xp += battleData.xpEarned;
      localProfile.total_battles += 1;
      localProfile.battles_won += isWin ? 1 : 0;
      localProfile.favorite_era = battleData.eraName;
      localProfile.updated_at = new Date().toISOString();
    }

    if (!localWallet) {
      localWallet = {
        id: `wallet-${userId}`,
        user_id: userId,
        balance: battleData.moneyEarned,
        total_earned: battleData.moneyEarned,
        total_spent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } else {
      localWallet.balance += battleData.moneyEarned;
      localWallet.total_earned += battleData.moneyEarned;
      localWallet.updated_at = new Date().toISOString();
    }

    const newBattle = {
      id: `battle-${Date.now()}`,
      user_id: userId,
      era_name: battleData.eraName,
      questions_total: battleData.questionsTotal,
      questions_correct: battleData.questionsCorrect,
      accuracy_percentage: accuracyPercentage,
      xp_earned: battleData.xpEarned,
      money_earned: battleData.moneyEarned,
      battle_duration_seconds: battleData.battleDurationSeconds || 180,
      completed_at: new Date().toISOString()
    };

    localBattles.unshift(newBattle);

    // Salvar dados específicos do usuário
    localStorage.setItem(`profile_${userId}`, JSON.stringify(localProfile));
    localStorage.setItem(`wallet_${userId}`, JSON.stringify(localWallet));
    localStorage.setItem(`battles_${userId}`, JSON.stringify(localBattles));

    return { success: true, battleId: newBattle.id, userId, local: true };
  };

  const saveBattleResult = async (battleData: BattleData) => {
    try {
      setSaving(true);
      setError(null);

      const userId = getOrCreateUserId();
      console.log('🎯 Salvando batalha para usuário:', userId);

      // Tentar Supabase primeiro
      try {
        const result = await saveToSupabase(userId, battleData);
        console.log('✅ Dados salvos no Supabase com sucesso!', {
          user: userId,
          xp: battleData.xpEarned,
          money: battleData.moneyEarned,
          era: battleData.eraName
        });
        setSaving(false);
        return result;
      } catch (supabaseError) {
        console.log('❌ Erro no Supabase, usando localStorage como fallback:', supabaseError);
        
        // Fallback para localStorage
        const localResult = await saveToLocalStorage(userId, battleData);
        console.log('💾 Dados salvos localmente como fallback');
        setSaving(false);
        return localResult;
      }

    } catch (err) {
      console.error('❌ Erro crítico ao salvar dados:', err);
      setError('Erro ao salvar dados da batalha');
      setSaving(false);
      return { success: false, error: err };
    }
  };

  return {
    saveBattleResult,
    saving,
    error,
  };
};
