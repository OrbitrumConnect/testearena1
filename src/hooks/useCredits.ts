import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateTrainingCredits, calculateArenaCredits, calculateMonthlyBonus } from '@/utils/creditsSystem';

interface UserCredits {
  id: string;
  user_id: string;
  credits_balance: number;
  credits_earned: number;
  credits_spent: number;
  monthly_bonus: number;
  deposit_date: string;
  last_bonus_date: string;
  created_at: string;
  updated_at: string;
}

interface CreditTransaction {
  id: string;
  user_id: string;
  transaction_type: 'credit' | 'debit' | 'bonus';
  amount: number;
  description: string;
  source: 'training' | 'arena' | 'monthly_bonus' | 'initial_deposit';
  created_at: string;
}

export const useCredits = () => {
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Carregar dados de créditos do usuário
  const fetchUserCredits = useCallback(async () => {
    try {
      setLoading(true);
      
      // Verificar usuário autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        // Fallback para dados locais (demo)
        const localCredits = localStorage.getItem('demo_credits');
        if (localCredits) {
          setUserCredits(JSON.parse(localCredits));
        } else {
          // Criar dados demo iniciais
          const demoCredits: UserCredits = {
            id: 'demo-credits',
            user_id: 'demo-user',
            credits_balance: 400, // 400 créditos iniciais (novo sistema)
            credits_earned: 0,
            credits_spent: 0,
            monthly_bonus: 0,
            deposit_date: new Date().toISOString(),
            last_bonus_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          localStorage.setItem('demo_credits', JSON.stringify(demoCredits));
          setUserCredits(demoCredits);
        }
        
        // Carregar transações demo
        const localTransactions = localStorage.getItem('demo_credit_transactions');
        if (localTransactions) {
          setTransactions(JSON.parse(localTransactions));
        }
        
        return;
      }

      // Buscar créditos reais do Supabase
      const { data: credits, error: creditsError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (creditsError && creditsError.code !== 'PGRST116') {
        throw creditsError;
      }

      if (!credits) {
        // Criar registro inicial de créditos
        const newCredits: Partial<UserCredits> = {
          user_id: user.id,
          credits_balance: 400, // 400 créditos (novo sistema)
          credits_earned: 0,
          credits_spent: 0,
          monthly_bonus: 0,
          deposit_date: new Date().toISOString(),
          last_bonus_date: new Date().toISOString()
        };

        const { data: createdCredits, error: createError } = await supabase
          .from('user_credits')
          .insert(newCredits)
          .select()
          .single();

        if (createError) throw createError;
        setUserCredits(createdCredits);
      } else {
        setUserCredits(credits);
      }

      // Buscar transações
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);

    } catch (err) {
      console.error('❌ Erro ao carregar créditos:', err);
      setError('Erro ao carregar dados de créditos');
    } finally {
      setLoading(false);
    }
  }, []);

  // 💰 Adicionar créditos (treino, arena, bônus)
  const addCredits = useCallback(async (
    amount: number, 
    source: 'training' | 'arena' | 'monthly_bonus', 
    description: string
  ) => {
    if (!userCredits) return;

    try {
      const updatedCredits = {
        ...userCredits,
        credits_balance: userCredits.credits_balance + amount,
        credits_earned: userCredits.credits_earned + amount,
        updated_at: new Date().toISOString()
      };

      // Verificar se é usuário real ou demo
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id === 'demo-user') {
        // Atualizar localmente (demo)
        localStorage.setItem('demo_credits', JSON.stringify(updatedCredits));
        setUserCredits(updatedCredits);

        // Adicionar transação local
        const newTransaction: CreditTransaction = {
          id: `tx-${Date.now()}`,
          user_id: 'demo-user',
          transaction_type: 'credit',
          amount,
          description,
          source,
          created_at: new Date().toISOString()
        };

        const currentTransactions = JSON.parse(localStorage.getItem('demo_credit_transactions') || '[]');
        const updatedTransactions = [newTransaction, ...currentTransactions];
        localStorage.setItem('demo_credit_transactions', JSON.stringify(updatedTransactions));
        setTransactions(updatedTransactions);

        return { success: true };
      }

      // Atualizar no Supabase (usuário real)
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          credits_balance: updatedCredits.credits_balance,
          credits_earned: updatedCredits.credits_earned,
          updated_at: updatedCredits.updated_at
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Registrar transação
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'credit',
          amount,
          description,
          source
        });

      if (transactionError) throw transactionError;

      setUserCredits(updatedCredits);
      await fetchUserCredits(); // Recarregar para pegar transações atualizadas

      return { success: true };

    } catch (err) {
      console.error('❌ Erro ao adicionar créditos:', err);
      return { success: false, error: err };
    }
  }, [userCredits, fetchUserCredits]);

  // 💸 Gastar créditos (arena, compras)
  const spendCredits = useCallback(async (
    amount: number, 
    description: string,
    source: 'arena' | 'purchase' = 'arena'
  ) => {
    if (!userCredits || userCredits.credits_balance < amount) {
      setError('Créditos insuficientes');
      return { success: false, error: 'Créditos insuficientes' };
    }

    try {
      const updatedCredits = {
        ...userCredits,
        credits_balance: userCredits.credits_balance - amount,
        credits_spent: userCredits.credits_spent + amount,
        updated_at: new Date().toISOString()
      };

      // Verificar se é usuário real ou demo
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id === 'demo-user') {
        // Atualizar localmente (demo)
        localStorage.setItem('demo_credits', JSON.stringify(updatedCredits));
        setUserCredits(updatedCredits);

        // Adicionar transação local
        const newTransaction: CreditTransaction = {
          id: `tx-${Date.now()}`,
          user_id: 'demo-user',
          transaction_type: 'debit',
          amount,
          description,
          source,
          created_at: new Date().toISOString()
        };

        const currentTransactions = JSON.parse(localStorage.getItem('demo_credit_transactions') || '[]');
        const updatedTransactions = [newTransaction, ...currentTransactions];
        localStorage.setItem('demo_credit_transactions', JSON.stringify(updatedTransactions));
        setTransactions(updatedTransactions);

        return { success: true };
      }

      // Atualizar no Supabase (usuário real)
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          credits_balance: updatedCredits.credits_balance,
          credits_spent: updatedCredits.credits_spent,
          updated_at: updatedCredits.updated_at
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Registrar transação
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'debit',
          amount,
          description,
          source
        });

      if (transactionError) throw transactionError;

      setUserCredits(updatedCredits);
      await fetchUserCredits();

      return { success: true };

    } catch (err) {
      console.error('❌ Erro ao gastar créditos:', err);
      return { success: false, error: err };
    }
  }, [userCredits, fetchUserCredits]);

  // 🎁 Calcular e aplicar bônus mensal
  const applyMonthlyBonus = useCallback(async (userActivity: {
    daysActive: number;
    totalAccuracy: number;
    erasCompleted: number;
    hoursInPlatform: number;
  }) => {
    if (!userCredits) return;

    const bonusResult = calculateMonthlyBonus(userActivity);
    
    if (bonusResult.bonusCredits > 0) {
      await addCredits(
        bonusResult.bonusCredits, 
        'monthly_bonus', 
        `Bônus Misterioso Mensal - ${bonusResult.bonusCredits} créditos`
      );
    }

    return bonusResult;
  }, [userCredits, addCredits]);

  // 📊 Calcular dias desde depósito
  const getDaysSinceDeposit = useCallback(() => {
    if (!userCredits) return 0;
    
    const depositDate = new Date(userCredits.deposit_date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - depositDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }, [userCredits]);

  // Inicializar dados
  useEffect(() => {
    fetchUserCredits();
  }, [fetchUserCredits]);

  return {
    userCredits,
    transactions,
    loading,
    error,
    actions: {
      addCredits,
      spendCredits,
      applyMonthlyBonus,
      refetchCredits: fetchUserCredits
    },
    computed: {
      daysSinceDeposit: getDaysSinceDeposit()
    }
  };
};
