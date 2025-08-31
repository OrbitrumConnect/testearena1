import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  NewUserSubscription,
  NEW_SUBSCRIPTION_CONFIG,
  LIVES_AND_CREDITS_CONFIG,
  getNewPaymentInfo,
  calculateLivesStatus,
  calculateNewWithdrawal,
  generateNewSystemReport,
  migrateFromOldSystem
} from '@/utils/newSubscriptionSystem';

export const useNewSubscription = () => {
  const [userSubscription, setUserSubscription] = useState<NewUserSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Carregar dados de assinatura do usuário
  const fetchUserSubscription = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        // Fallback para dados demo
        const localSubscription = localStorage.getItem('demo_new_subscription');
        if (localSubscription) {
          setUserSubscription(JSON.parse(localSubscription));
        } else {
          // Criar assinatura demo inicial
          const demoSubscription: NewUserSubscription = {
            id: 'demo-new-subscription',
            user_id: 'demo-user',
            current_cycle_month: 1,
            cycle_start_date: new Date().toISOString(),
            last_payment_date: new Date().toISOString(),
            total_paid_current_cycle: NEW_SUBSCRIPTION_CONFIG[1].entryAmount,
            credits_balance: NEW_SUBSCRIPTION_CONFIG[1].creditsReceived,
            lives_remaining: LIVES_AND_CREDITS_CONFIG.freePerDay,
            lives_reset_date: new Date().toISOString(),
            next_payment_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          localStorage.setItem('demo_new_subscription', JSON.stringify(demoSubscription));
          setUserSubscription(demoSubscription);
        }
        return;
      }

      // Buscar nova assinatura do Supabase
      const { data: subscription, error: subscriptionError } = await supabase
        .from('new_user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError;
      }

      if (!subscription) {
        // Verificar se existe assinatura do sistema antigo para migrar
        const { data: oldSubscription } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const { data: oldCredits } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Criar nova assinatura (com migração se necessário)
        const migrationData = migrateFromOldSystem(oldSubscription, oldCredits);
        
        const newSubscription: Partial<NewUserSubscription> = {
          user_id: user.id,
          ...migrationData
        };

        const { data: createdSubscription, error: createError } = await supabase
          .from('new_user_subscriptions')
          .insert(newSubscription)
          .select()
          .single();

        if (createError) throw createError;
        setUserSubscription(createdSubscription);
      } else {
        setUserSubscription(subscription);
      }

    } catch (err) {
      console.error('❌ Erro ao carregar nova assinatura:', err);
      setError('Erro ao carregar dados de assinatura');
    } finally {
      setLoading(false);
    }
  }, []);

  // 💰 Processar pagamento do próximo mês
  const processNextPayment = useCallback(async () => {
    if (!userSubscription) return { success: false, error: 'Assinatura não encontrada' };

    try {
      const nextPaymentInfo = getNewPaymentInfo(userSubscription);
      const nextConfig = NEW_SUBSCRIPTION_CONFIG[nextPaymentInfo.nextMonth];
      
      const updatedSubscription: NewUserSubscription = {
        ...userSubscription,
        current_cycle_month: nextPaymentInfo.nextMonth,
        last_payment_date: new Date().toISOString(),
        total_paid_current_cycle: userSubscription.total_paid_current_cycle + nextConfig.entryAmount,
        credits_balance: userSubscription.credits_balance + nextConfig.creditsReceived,
        next_payment_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      };

      // Se é reinício de ciclo, resetar totais
      if (nextPaymentInfo.cycleRestart) {
        updatedSubscription.total_paid_current_cycle = nextConfig.entryAmount;
        updatedSubscription.cycle_start_date = new Date().toISOString();
      }

      // Verificar se é usuário real ou demo
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id === 'demo-user') {
        // Atualizar localmente (demo)
        localStorage.setItem('demo_new_subscription', JSON.stringify(updatedSubscription));
        setUserSubscription(updatedSubscription);
        return { success: true, newMonth: nextPaymentInfo.nextMonth };
      }

      // Atualizar no Supabase (usuário real)
      const { error: updateError } = await supabase
        .from('new_user_subscriptions')
        .update({
          current_cycle_month: updatedSubscription.current_cycle_month,
          last_payment_date: updatedSubscription.last_payment_date,
          total_paid_current_cycle: updatedSubscription.total_paid_current_cycle,
          credits_balance: updatedSubscription.credits_balance,
          next_payment_due: updatedSubscription.next_payment_due,
          cycle_start_date: updatedSubscription.cycle_start_date,
          updated_at: updatedSubscription.updated_at
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setUserSubscription(updatedSubscription);
      return { success: true, newMonth: nextPaymentInfo.nextMonth };

    } catch (err) {
      console.error('❌ Erro ao processar pagamento:', err);
      return { success: false, error: err };
    }
  }, [userSubscription]);

  // ❤️ Comprar vida extra
  const buyExtraLife = useCallback(async (quantity: number = 1) => {
    if (!userSubscription) return { success: false, error: 'Assinatura não encontrada' };

    const totalCost = LIVES_AND_CREDITS_CONFIG.extraLifeCost * quantity;
    
    if (userSubscription.credits_balance < totalCost) {
      return { success: false, error: 'Créditos insuficientes' };
    }

    try {
      const updatedSubscription: NewUserSubscription = {
        ...userSubscription,
        credits_balance: userSubscription.credits_balance - totalCost,
        lives_remaining: userSubscription.lives_remaining + quantity,
        updated_at: new Date().toISOString()
      };

      // Verificar se é usuário real ou demo
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id === 'demo-user') {
        // Atualizar localmente (demo)
        localStorage.setItem('demo_new_subscription', JSON.stringify(updatedSubscription));
        setUserSubscription(updatedSubscription);
        return { success: true, livesAdded: quantity, creditsSpent: totalCost };
      }

      // Atualizar no Supabase (usuário real)
      const { error: updateError } = await supabase
        .from('new_user_subscriptions')
        .update({
          credits_balance: updatedSubscription.credits_balance,
          lives_remaining: updatedSubscription.lives_remaining,
          updated_at: updatedSubscription.updated_at
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setUserSubscription(updatedSubscription);
      return { success: true, livesAdded: quantity, creditsSpent: totalCost };

    } catch (err) {
      console.error('❌ Erro ao comprar vida extra:', err);
      return { success: false, error: err };
    }
  }, [userSubscription]);

  // 🎮 Usar vida para treino
  const useLifeForTraining = useCallback(async () => {
    if (!userSubscription) return { success: false, error: 'Assinatura não encontrada' };

    // Verificar se precisa resetar vidas
    const livesStatus = calculateLivesStatus(userSubscription.lives_remaining, userSubscription.lives_reset_date);
    
    let currentLives = livesStatus.livesAvailable;
    let needsUpdate = livesStatus.resetToday;

    if (currentLives <= 0) {
      return { success: false, error: 'Sem vidas disponíveis. Compre vidas extras!' };
    }

    try {
      const updatedSubscription: NewUserSubscription = {
        ...userSubscription,
        lives_remaining: currentLives - 1,
        lives_reset_date: needsUpdate ? new Date().toISOString() : userSubscription.lives_reset_date,
        updated_at: new Date().toISOString()
      };

      // Verificar se é usuário real ou demo
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id === 'demo-user') {
        // Atualizar localmente (demo)
        localStorage.setItem('demo_new_subscription', JSON.stringify(updatedSubscription));
        setUserSubscription(updatedSubscription);
        return { success: true, livesRemaining: updatedSubscription.lives_remaining };
      }

      // Atualizar no Supabase (usuário real)
      const { error: updateError } = await supabase
        .from('new_user_subscriptions')
        .update({
          lives_remaining: updatedSubscription.lives_remaining,
          lives_reset_date: updatedSubscription.lives_reset_date,
          updated_at: updatedSubscription.updated_at
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setUserSubscription(updatedSubscription);
      return { success: true, livesRemaining: updatedSubscription.lives_remaining };

    } catch (err) {
      console.error('❌ Erro ao usar vida:', err);
      return { success: false, error: err };
    }
  }, [userSubscription]);

  // ⚔️ Processar batalha PvP
  const processPvPBattle = useCallback(async (isVictory: boolean) => {
    if (!userSubscription) return { success: false, error: 'Assinatura não encontrada' };

    const entryCost = LIVES_AND_CREDITS_CONFIG.pvpCosts.battleEntry;
    const victoryReward = LIVES_AND_CREDITS_CONFIG.pvpCosts.victoryReward;

    if (userSubscription.credits_balance < entryCost) {
      return { success: false, error: 'Créditos insuficientes para PvP' };
    }

    try {
      const creditsChange = isVictory ? (victoryReward - entryCost) : -entryCost;
      
      const updatedSubscription: NewUserSubscription = {
        ...userSubscription,
        credits_balance: userSubscription.credits_balance + creditsChange,
        updated_at: new Date().toISOString()
      };

      // Verificar se é usuário real ou demo
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id === 'demo-user') {
        // Atualizar localmente (demo)
        localStorage.setItem('demo_new_subscription', JSON.stringify(updatedSubscription));
        setUserSubscription(updatedSubscription);
        return { 
          success: true, 
          creditsChange, 
          newBalance: updatedSubscription.credits_balance,
          isVictory 
        };
      }

      // Atualizar no Supabase (usuário real)
      const { error: updateError } = await supabase
        .from('new_user_subscriptions')
        .update({
          credits_balance: updatedSubscription.credits_balance,
          updated_at: updatedSubscription.updated_at
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setUserSubscription(updatedSubscription);
      return { 
        success: true, 
        creditsChange, 
        newBalance: updatedSubscription.credits_balance,
        isVictory 
      };

    } catch (err) {
      console.error('❌ Erro ao processar PvP:', err);
      return { success: false, error: err };
    }
  }, [userSubscription]);

  // 💸 Processar saque
  const processWithdrawal = useCallback(async (creditsToWithdraw: number) => {
    if (!userSubscription) return { success: false, error: 'Assinatura não encontrada' };

    const withdrawalInfo = calculateNewWithdrawal(creditsToWithdraw);
    
    if (!withdrawalInfo.canWithdraw) {
      return { success: false, error: withdrawalInfo.message };
    }

    if (userSubscription.credits_balance < creditsToWithdraw) {
      return { success: false, error: 'Créditos insuficientes' };
    }

    try {
      const updatedSubscription: NewUserSubscription = {
        ...userSubscription,
        credits_balance: userSubscription.credits_balance - creditsToWithdraw,
        updated_at: new Date().toISOString()
      };

      // Verificar se é usuário real ou demo
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id === 'demo-user') {
        // Atualizar localmente (demo)
        localStorage.setItem('demo_new_subscription', JSON.stringify(updatedSubscription));
        setUserSubscription(updatedSubscription);
        return { 
          success: true, 
          amount: withdrawalInfo.netAmount,
          fee: withdrawalInfo.fee,
          creditsWithdrawn: creditsToWithdraw
        };
      }

      // Atualizar no Supabase (usuário real)
      const { error: updateError } = await supabase
        .from('new_user_subscriptions')
        .update({
          credits_balance: updatedSubscription.credits_balance,
          updated_at: updatedSubscription.updated_at
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Registrar transação de saque
      await supabase
        .from('new_withdrawal_transactions')
        .insert({
          user_id: user.id,
          credits_amount: creditsToWithdraw,
          reais_amount: withdrawalInfo.maxAmount,
          fee: withdrawalInfo.fee,
          net_amount: withdrawalInfo.netAmount,
          subscription_month: userSubscription.current_cycle_month,
          status: 'completed'
        });

      setUserSubscription(updatedSubscription);
      return { 
        success: true, 
        amount: withdrawalInfo.netAmount,
        fee: withdrawalInfo.fee,
        creditsWithdrawn: creditsToWithdraw
      };

    } catch (err) {
      console.error('❌ Erro ao processar saque:', err);
      return { success: false, error: err };
    }
  }, [userSubscription]);

  // 📊 Dados computados
  const computed = {
    paymentInfo: userSubscription ? getNewPaymentInfo(userSubscription) : null,
    livesStatus: userSubscription ? calculateLivesStatus(
      userSubscription.lives_remaining, 
      userSubscription.lives_reset_date
    ) : null,
    withdrawalInfo: userSubscription ? calculateNewWithdrawal(userSubscription.credits_balance) : null,
    systemReport: userSubscription ? generateNewSystemReport(userSubscription) : null
  };

  // Inicializar dados
  useEffect(() => {
    fetchUserSubscription();
  }, [fetchUserSubscription]);

  return {
    userSubscription,
    loading,
    error,
    computed,
    actions: {
      processNextPayment,
      buyExtraLife,
      useLifeForTraining,
      processPvPBattle,
      processWithdrawal,
      refetchSubscription: fetchUserSubscription
    }
  };
};
