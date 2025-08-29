import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  UserSubscription, 
  getNextPaymentInfo, 
  calculateWithdrawalLimits,
  calculateScaledMonthlyBonus,
  generateCycleReport,
  getSystemDisplayInfo,
  SUBSCRIPTION_CONFIG
} from '@/utils/subscriptionSystem';

export const useSubscription = () => {
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Carregar dados de assinatura do usuário
  const fetchUserSubscription = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        // Fallback para dados demo
        const localSubscription = localStorage.getItem('demo_subscription');
        if (localSubscription) {
          setUserSubscription(JSON.parse(localSubscription));
        } else {
          // Criar assinatura demo inicial
          const demoSubscription: UserSubscription = {
            id: 'demo-subscription',
            user_id: 'demo-user',
            current_cycle_month: 1,
            cycle_start_date: new Date().toISOString(),
            last_payment_date: new Date().toISOString(),
            total_paid_current_cycle: 20.00,
            withdrawals_made: 0,
            next_payment_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          localStorage.setItem('demo_subscription', JSON.stringify(demoSubscription));
          setUserSubscription(demoSubscription);
        }
        return;
      }

      // Buscar assinatura real do Supabase
      const { data: subscription, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError;
      }

      if (!subscription) {
        // Criar nova assinatura
        const newSubscription: Partial<UserSubscription> = {
          user_id: user.id,
          current_cycle_month: 1,
          cycle_start_date: new Date().toISOString(),
          last_payment_date: new Date().toISOString(),
          total_paid_current_cycle: 20.00,
          withdrawals_made: 0,
          next_payment_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        };

        const { data: createdSubscription, error: createError } = await supabase
          .from('user_subscriptions')
          .insert(newSubscription)
          .select()
          .single();

        if (createError) throw createError;
        setUserSubscription(createdSubscription);
      } else {
        setUserSubscription(subscription);
      }

    } catch (err) {
      console.error('❌ Erro ao carregar assinatura:', err);
      setError('Erro ao carregar dados de assinatura');
    } finally {
      setLoading(false);
    }
  }, []);

  // 💰 Processar pagamento do próximo mês
  const processNextPayment = useCallback(async () => {
    if (!userSubscription) return { success: false, error: 'Assinatura não encontrada' };

    try {
      const nextPaymentInfo = getNextPaymentInfo(userSubscription);
      const nextConfig = SUBSCRIPTION_CONFIG[nextPaymentInfo.nextMonth];
      
      const updatedSubscription: UserSubscription = {
        ...userSubscription,
        current_cycle_month: nextPaymentInfo.nextMonth,
        last_payment_date: new Date().toISOString(),
        total_paid_current_cycle: userSubscription.total_paid_current_cycle + nextConfig.entryAmount,
        next_payment_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      };

      // Se é reinício de ciclo, resetar totais
      if (nextPaymentInfo.cycleRestart) {
        updatedSubscription.total_paid_current_cycle = nextConfig.entryAmount;
        updatedSubscription.withdrawals_made = 0;
        updatedSubscription.cycle_start_date = new Date().toISOString();
      }

      // Verificar se é usuário real ou demo
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id === 'demo-user') {
        // Atualizar localmente (demo)
        localStorage.setItem('demo_subscription', JSON.stringify(updatedSubscription));
        setUserSubscription(updatedSubscription);
        return { success: true, newMonth: nextPaymentInfo.nextMonth };
      }

      // Atualizar no Supabase (usuário real)
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          current_cycle_month: updatedSubscription.current_cycle_month,
          last_payment_date: updatedSubscription.last_payment_date,
          total_paid_current_cycle: updatedSubscription.total_paid_current_cycle,
          withdrawals_made: updatedSubscription.withdrawals_made,
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

  // 💸 Processar saque
  const processWithdrawal = useCallback(async (amount: number) => {
    if (!userSubscription) return { success: false, error: 'Assinatura não encontrada' };

    try {
      const daysSincePayment = Math.floor(
        (Date.now() - new Date(userSubscription.last_payment_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      const withdrawalLimits = calculateWithdrawalLimits(userSubscription, daysSincePayment);
      
      if (!withdrawalLimits.canWithdraw) {
        return { 
          success: false, 
          error: withdrawalLimits.message 
        };
      }

      if (amount > withdrawalLimits.maxAmount) {
        return { 
          success: false, 
          error: `Valor máximo disponível: R$ ${withdrawalLimits.maxAmount.toFixed(2)}` 
        };
      }

      const updatedSubscription: UserSubscription = {
        ...userSubscription,
        withdrawals_made: userSubscription.withdrawals_made + amount,
        updated_at: new Date().toISOString()
      };

      // Verificar se é usuário real ou demo
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id === 'demo-user') {
        // Atualizar localmente (demo)
        localStorage.setItem('demo_subscription', JSON.stringify(updatedSubscription));
        setUserSubscription(updatedSubscription);
        return { success: true, amount, fee: withdrawalLimits.fee };
      }

      // Atualizar no Supabase (usuário real)
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          withdrawals_made: updatedSubscription.withdrawals_made,
          updated_at: updatedSubscription.updated_at
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Registrar transação de saque
      await supabase
        .from('withdrawal_transactions')
        .insert({
          user_id: user.id,
          amount: amount,
          fee: withdrawalLimits.fee || 0,
          gross_amount: withdrawalLimits.grossAmount || amount,
          subscription_month: userSubscription.current_cycle_month,
          status: 'completed'
        });

      setUserSubscription(updatedSubscription);
      return { success: true, amount, fee: withdrawalLimits.fee };

    } catch (err) {
      console.error('❌ Erro ao processar saque:', err);
      return { success: false, error: err };
    }
  }, [userSubscription]);

  // 📊 Dados computados
  const computed = {
    nextPaymentInfo: userSubscription ? getNextPaymentInfo(userSubscription) : null,
    withdrawalLimits: userSubscription ? calculateWithdrawalLimits(
      userSubscription, 
      Math.floor((Date.now() - new Date(userSubscription.last_payment_date).getTime()) / (1000 * 60 * 60 * 24))
    ) : null,
    cycleReport: userSubscription ? generateCycleReport(userSubscription) : null,
    systemDisplayInfo: userSubscription ? getSystemDisplayInfo(userSubscription.current_cycle_month) : null
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
      processWithdrawal,
      refetchSubscription: fetchUserSubscription
    }
  };
};
