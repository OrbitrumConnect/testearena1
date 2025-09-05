import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateTrainingCredits, calculateArenaCredits, calculateMonthlyBonus } from '@/utils/creditsSystem';

interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  daily_credits: number;
  last_daily_reset: string;
  created_at: string;
  updated_at: string;
}

interface CreditTransaction {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  description: string;
  battle_id?: string;
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
            credits: 400, // 400 créditos iniciais (novo sistema)
            daily_credits: 0,
            last_daily_reset: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          localStorage.setItem('demo_credits', JSON.stringify(demoCredits));
          setUserCredits(demoCredits);
        }
        
        // Carregar transações demo
        const localTransactions = localStorage.getItem('demo_wallet_transactions');
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
          credits: 400, // 400 créditos (novo sistema)
          daily_credits: 0,
          last_daily_reset: new Date().toISOString()
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
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsError) {
        console.error('❌ Erro ao carregar transações:', transactionsError);
        
        // Se a tabela não existir, usar dados demo
        if (transactionsError.code === 'PGRST116') {
          console.warn('Tabela wallet_transactions não encontrada, usando dados demo');
          const demoTransactions = localStorage.getItem('demo_transactions');
          if (demoTransactions) {
            setTransactions(JSON.parse(demoTransactions));
          } else {
            // Criar dados demo baseados no JSON que você enviou
            const demoData: CreditTransaction[] = [
              { id: '1', user_id: user.id, transaction_type: 'credit', amount: 1.5, description: 'Participação - Egito Antigo', created_at: new Date().toISOString() },
              { id: '2', user_id: user.id, transaction_type: 'credit', amount: 2.0, description: 'Participação - Mesopotâmia', created_at: new Date().toISOString() },
              { id: '3', user_id: user.id, transaction_type: 'credit', amount: 4.5, description: 'Vitória - Era Medieval', created_at: new Date().toISOString() },
              { id: '4', user_id: user.id, transaction_type: 'credit', amount: 5.0, description: 'Vitória - Era Digital', created_at: new Date().toISOString() },
              { id: '5', user_id: user.id, transaction_type: 'credit', amount: 2.0, description: 'Participação - Arena - Egito Antigo', created_at: new Date().toISOString() }
            ];
            setTransactions(demoData);
            localStorage.setItem('demo_transactions', JSON.stringify(demoData));
          }
        } else {
          throw transactionsError;
        }
      } else {
        setTransactions(transactionsData || []);
      }

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
    description: string
  ) => {
    if (!userCredits) return;

    try {
      const updatedCredits = {
        ...userCredits,
        credits: userCredits.credits + amount,
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

        const currentTransactions = JSON.parse(localStorage.getItem('demo_wallet_transactions') || '[]');
        const updatedTransactions = [newTransaction, ...currentTransactions];
        localStorage.setItem('demo_wallet_transactions', JSON.stringify(updatedTransactions));
        setTransactions(updatedTransactions);

        return { success: true };
      }

      // Atualizar no Supabase (usuário real)
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          credits: updatedCredits.credits,
          updated_at: updatedCredits.updated_at
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Registrar transação
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
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
  ) => {
    if (!userCredits || userCredits.credits < amount) {
      setError('Créditos insuficientes');
      return { success: false, error: 'Créditos insuficientes' };
    }

    try {
      const updatedCredits = {
        ...userCredits,
        credits: userCredits.credits - amount,
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

        const currentTransactions = JSON.parse(localStorage.getItem('demo_wallet_transactions') || '[]');
        const updatedTransactions = [newTransaction, ...currentTransactions];
        localStorage.setItem('demo_wallet_transactions', JSON.stringify(updatedTransactions));
        setTransactions(updatedTransactions);

        return { success: true };
      }

      // Atualizar no Supabase (usuário real)
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          credits: updatedCredits.credits,
          updated_at: updatedCredits.updated_at
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Registrar transação
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
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
