import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BattleData {
  eraName: string;
  questionsTotal: number;
  questionsCorrect: number;
  xpEarned: number;
  moneyEarned: number;
  battleDurationSeconds?: number;
}

export const useBattleSave = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveBattleResult = async (battleData: BattleData) => {
    try {
      setSaving(true);
      setError(null);

      // Tentar salvar no localStorage primeiro (fallback para RLS)
      const localProfile = JSON.parse(localStorage.getItem('demo_profile') || 'null');
      const localWallet = JSON.parse(localStorage.getItem('demo_wallet') || 'null');
      const localBattles = JSON.parse(localStorage.getItem('demo_battles') || '[]');

      if (localProfile && localWallet) {
        console.log('💾 Salvando dados localmente (modo demo)');
        
        // Atualizar dados locais
        const accuracyPercentage = Math.round((battleData.questionsCorrect / battleData.questionsTotal) * 100);
        const isWin = accuracyPercentage >= 70;

        // Atualizar perfil local
        localProfile.total_xp += battleData.xpEarned;
        localProfile.total_battles += 1;
        localProfile.battles_won += isWin ? 1 : 0;
        localProfile.favorite_era = battleData.eraName;
        localProfile.updated_at = new Date().toISOString();

        // Atualizar carteira local
        localWallet.balance += battleData.moneyEarned;
        localWallet.total_earned += battleData.moneyEarned;
        localWallet.updated_at = new Date().toISOString();

        // Adicionar batalha ao histórico
        const newBattle = {
          id: `battle-${Date.now()}`,
          user_id: 'demo-user',
          era_name: battleData.eraName,
          questions_total: battleData.questionsTotal,
          questions_correct: battleData.questionsCorrect,
          accuracy_percentage: accuracyPercentage,
          xp_earned: battleData.xpEarned,
          money_earned: battleData.moneyEarned,
          battle_duration_seconds: battleData.battleDurationSeconds || 180,
          completed_at: new Date().toISOString()
        };

        localBattles.unshift(newBattle); // Adicionar no início

        // Salvar no localStorage
        localStorage.setItem('demo_profile', JSON.stringify(localProfile));
        localStorage.setItem('demo_wallet', JSON.stringify(localWallet));
        localStorage.setItem('demo_battles', JSON.stringify(localBattles));

        console.log('✅ Dados salvos localmente com sucesso');
        setSaving(false);
        return;
      }

      // Verificar se há usuário logado, se não, criar um usuário demo
      let { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Criar usuário demo se não houver autenticação
        const demoUserId = 'demo-user-' + Date.now();
        
        // Para este demo, vamos usar um UUID fixo para facilitar
        const demoUUID = '12345678-1234-1234-1234-123456789012';
        
        // Criar perfil demo se não existir
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', demoUUID)
          .maybeSingle();

        if (!existingProfile) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: demoUUID,
              display_name: 'Guerreiro Demo',
              total_xp: 0,
              total_battles: 0,
              battles_won: 0,
            });

          if (profileError) {
            console.log('Perfil demo já existe ou erro:', profileError);
          }

          // Criar carteira demo se não existir
          const { error: walletError } = await supabase
            .from('user_wallet')
            .insert({
              user_id: demoUUID,
              balance: 0,
              total_earned: 0,
              total_spent: 0,
            });

          if (walletError) {
            console.log('Carteira demo já existe ou erro:', walletError);
          }
        }

        user = { id: demoUUID } as any;
      }

      const userId = user.id;

      // Calcular precisão
      const accuracyPercentage = Math.round((battleData.questionsCorrect / battleData.questionsTotal) * 100);
      
      // Verificar se é vitória (>= 70% de acertos)
      const isWin = accuracyPercentage >= 70;

      // Salvar histórico de batalha
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
        throw battleError;
      }

      // Atualizar perfil do usuário
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (currentProfile) {
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({
            total_xp: currentProfile.total_xp + battleData.xpEarned,
            total_battles: currentProfile.total_battles + 1,
            battles_won: currentProfile.battles_won + (isWin ? 1 : 0),
            favorite_era: battleData.eraName,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (profileUpdateError) {
          throw profileUpdateError;
        }
      }

      // Atualizar carteira do usuário
      if (battleData.moneyEarned > 0) {
        const { data: currentWallet } = await supabase
          .from('user_wallet')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (currentWallet) {
          const { error: walletUpdateError } = await supabase
            .from('user_wallet')
            .update({
              balance: currentWallet.balance + battleData.moneyEarned,
              total_earned: currentWallet.total_earned + battleData.moneyEarned,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          if (walletUpdateError) {
            throw walletUpdateError;
          }

          // Adicionar transação
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
            throw transactionError;
          }
        }
      }

      console.log('✅ Dados salvos com sucesso!', {
        user: userId,
        xp: battleData.xpEarned,
        money: battleData.moneyEarned,
        era: battleData.eraName
      });

      return { success: true, battleId: battleRecord.id };

    } catch (err) {
      console.error('❌ Erro ao salvar dados da batalha:', err);
      
      // Se der erro no Supabase, salvar localmente como fallback
      console.log('💾 Erro no Supabase, salvando apenas localmente...');
      
      try {
        let localProfile = JSON.parse(localStorage.getItem('demo_profile') || 'null');
        let localWallet = JSON.parse(localStorage.getItem('demo_wallet') || 'null');
        const localBattles = JSON.parse(localStorage.getItem('demo_battles') || '[]');

        if (!localProfile || !localWallet) {
          // Criar dados iniciais se não existirem
          localProfile = {
            id: 'demo-id',
            user_id: 'demo-user',
            display_name: 'Guerreiro Demo',
            total_xp: battleData.xpEarned,
            total_battles: 1,
            battles_won: battleData.questionsCorrect >= battleData.questionsTotal * 0.7 ? 1 : 0,
            favorite_era: battleData.eraName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          localWallet = {
            id: 'demo-wallet',
            user_id: 'demo-user',
            balance: battleData.moneyEarned,
            total_earned: battleData.moneyEarned,
            total_spent: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        } else {
          // Atualizar dados existentes
          const isWin = battleData.questionsCorrect >= battleData.questionsTotal * 0.7;
          localProfile.total_xp += battleData.xpEarned;
          localProfile.total_battles += 1;
          localProfile.battles_won += isWin ? 1 : 0;
          localProfile.favorite_era = battleData.eraName;
          localProfile.updated_at = new Date().toISOString();

          localWallet.balance += battleData.moneyEarned;
          localWallet.total_earned += battleData.moneyEarned;
          localWallet.updated_at = new Date().toISOString();
        }

        // Salvar perfil e carteira atualizados
        localStorage.setItem('demo_profile', JSON.stringify(localProfile));
        localStorage.setItem('demo_wallet', JSON.stringify(localWallet));

        // Adicionar batalha
        const newBattle = {
          id: `battle-${Date.now()}`,
          user_id: 'demo-user',
          era_name: battleData.eraName,
          questions_total: battleData.questionsTotal,
          questions_correct: battleData.questionsCorrect,
          accuracy_percentage: Math.round((battleData.questionsCorrect / battleData.questionsTotal) * 100),
          xp_earned: battleData.xpEarned,
          money_earned: battleData.moneyEarned,
          battle_duration_seconds: battleData.battleDurationSeconds || 180,
          completed_at: new Date().toISOString()
        };

        localBattles.unshift(newBattle);
        localStorage.setItem('demo_battles', JSON.stringify(localBattles));

        console.log('✅ Dados salvos localmente como fallback');
        setError(null); // Limpar erro já que conseguimos salvar localmente
        return { success: true, battleId: newBattle.id };
      } catch (localErr) {
        console.error('Erro ao salvar localmente:', localErr);
        setError('Erro ao salvar dados');
        return { success: false, error: localErr };
      }
    } finally {
      setSaving(false);
    }
  };

  return {
    saveBattleResult,
    saving,
    error,
  };
};
