// Sistema Unificado de Créditos - Sincroniza localStorage com Supabase
// 🎯 Resolve problemas de valores inconsistentes entre telas

import { supabase } from '@/integrations/supabase/client';
import { PlanType, PLAN_CONFIGS } from './creditsSystem';

export interface UserCredits {
  userId: string;
  planType: PlanType;
  initialDeposit: number;
  creditsBalance: number;
  creditsInitial: number;
  pvpEarnings: number;
  trainingEarnings: number;
  labyrinthEarnings: number;
  totalEarned: number;
  lastUpdated: string;
}

export interface CreditsTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'training' | 'pvp' | 'labyrinth' | 'withdrawal' | 'bonus';
  amount: number;
  description: string;
  timestamp: string;
  era?: string;
  battleId?: string;
}

// 🎯 FUNÇÃO PRINCIPAL: Obter créditos do usuário (unificada)
export const getUserCredits = async (userId: string): Promise<UserCredits> => {
  try {
    // 1. Tentar buscar do Supabase primeiro
    const { data: supabaseCredits, error } = await supabase
      .from('user_wallet')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (supabaseCredits && !error) {
      // ✅ Dados do Supabase encontrados - sincronizar localStorage
      const userCredits: UserCredits = {
        userId,
        planType: supabaseCredits.plan_type || 'basic',
        initialDeposit: supabaseCredits.initial_deposit || 0,
        creditsBalance: supabaseCredits.credits_balance || 0,
        creditsInitial: supabaseCredits.credits_initial || 0,
        pvpEarnings: supabaseCredits.pvp_earnings || 0,
        trainingEarnings: supabaseCredits.training_earnings || 0,
        labyrinthEarnings: supabaseCredits.labyrinth_earnings || 0,
        totalEarned: (supabaseCredits.pvp_earnings || 0) + (supabaseCredits.training_earnings || 0) + (supabaseCredits.labyrinth_earnings || 0),
        lastUpdated: supabaseCredits.updated_at || new Date().toISOString()
      };

      // Sincronizar localStorage
      localStorage.setItem(`userCredits_${userId}`, JSON.stringify(userCredits));
      return userCredits;
    }

    // 2. Se não encontrou no Supabase, usar localStorage como fallback
    const localCredits = localStorage.getItem(`userCredits_${userId}`);
    if (localCredits) {
      const parsed = JSON.parse(localCredits);
      console.log('📱 Usando créditos do localStorage:', parsed);
      return parsed;
    }

    // 3. Se nada encontrou, criar perfil padrão
    const defaultCredits: UserCredits = {
      userId,
      planType: 'basic',
      initialDeposit: 0,
      creditsBalance: 0,
      creditsInitial: 0,
      pvpEarnings: 0,
      trainingEarnings: 0,
      labyrinthEarnings: 0,
      totalEarned: 0,
      lastUpdated: new Date().toISOString()
    };

    // Salvar no localStorage e tentar criar no Supabase
    localStorage.setItem(`userCredits_${userId}`, JSON.stringify(defaultCredits));
    
    // Tentar criar no Supabase (pode falhar se não for admin)
    try {
      await supabase.from('user_wallet').insert({
        user_id: userId,
        plan_type: 'basic',
        initial_deposit: 0,
        credits_balance: 0,
        credits_initial: 0,
        pvp_earnings: 0,
        training_earnings: 0,
        labyrinth_earnings: 0
      });
    } catch (dbError) {
      console.log('⚠️ Não foi possível criar carteira no Supabase (usuário comum):', dbError);
    }

    return defaultCredits;

  } catch (error) {
    console.error('❌ Erro ao buscar créditos do usuário:', error);
    
    // Fallback para localStorage
    const localCredits = localStorage.getItem(`userCredits_${userId}`);
    if (localCredits) {
      return JSON.parse(localCredits);
    }

    // Último fallback: perfil vazio
    return {
      userId,
      planType: 'basic',
      initialDeposit: 0,
      creditsBalance: 0,
      creditsInitial: 0,
      pvpEarnings: 0,
      trainingEarnings: 0,
      labyrinthEarnings: 0,
      totalEarned: 0,
      lastUpdated: new Date().toISOString()
    };
  }
};

// 💰 FUNÇÃO: Atualizar créditos do usuário
export const updateUserCredits = async (
  userId: string,
  updates: Partial<UserCredits>
): Promise<UserCredits> => {
  try {
    // 1. Atualizar localStorage primeiro (resposta imediata)
    const currentCredits = await getUserCredits(userId);
    const updatedCredits: UserCredits = {
      ...currentCredits,
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(`userCredits_${userId}`, JSON.stringify(updatedCredits));

    // 2. Tentar atualizar no Supabase (pode falhar para usuários comuns)
    try {
      const { error } = await supabase
        .from('user_wallet')
        .upsert({
          user_id: userId,
          plan_type: updatedCredits.planType,
          initial_deposit: updatedCredits.initialDeposit,
          credits_balance: updatedCredits.creditsBalance,
          credits_initial: updatedCredits.creditsInitial,
          pvp_earnings: updatedCredits.pvpEarnings,
          training_earnings: updatedCredits.trainingEarnings,
          labyrinth_earnings: updatedCredits.labyrinthEarnings,
          updated_at: updatedCredits.lastUpdated
        });

      if (error) {
        console.log('⚠️ Não foi possível atualizar Supabase (usuário comum):', error);
      }
    } catch (dbError) {
      console.log('⚠️ Erro ao atualizar Supabase:', dbError);
    }

    return updatedCredits;

  } catch (error) {
    console.error('❌ Erro ao atualizar créditos:', error);
    throw error;
  }
};

// 🎮 FUNÇÃO: Adicionar créditos de treino
export const addTrainingCredits = async (
  userId: string,
  era: string,
  creditsEarned: number,
  battleId?: string
): Promise<UserCredits> => {
  const currentCredits = await getUserCredits(userId);
  
  const updatedCredits = await updateUserCredits(userId, {
    trainingEarnings: currentCredits.trainingEarnings + creditsEarned,
    creditsBalance: currentCredits.creditsBalance + creditsEarned,
    totalEarned: currentCredits.totalEarned + creditsEarned
  });

  // Registrar transação
  await addTransaction(userId, {
    type: 'training',
    amount: creditsEarned,
    description: `Treino ${era}: +${creditsEarned} créditos`,
    era,
    battleId
  });

  return updatedCredits;
};

// ⚔️ FUNÇÃO: Adicionar créditos de PvP
export const addPvPCredits = async (
  userId: string,
  creditsEarned: number,
  battleId?: string
): Promise<UserCredits> => {
  const currentCredits = await getUserCredits(userId);
  
  const updatedCredits = await updateUserCredits(userId, {
    pvpEarnings: currentCredits.pvpEarnings + creditsEarned,
    creditsBalance: currentCredits.creditsBalance + creditsEarned,
    totalEarned: currentCredits.totalEarned + creditsEarned
  });

  // Registrar transação
  await addTransaction(userId, {
    type: 'pvp',
    amount: creditsEarned,
    description: `PvP: +${creditsEarned} créditos`,
    battleId
  });

  return updatedCredits;
};

// 🏰 FUNÇÃO: Adicionar créditos do Labirinto
export const addLabyrinthCredits = async (
  userId: string,
  creditsEarned: number,
  era: string
): Promise<UserCredits> => {
  const currentCredits = await getUserCredits(userId);
  
  const updatedCredits = await updateUserCredits(userId, {
    labyrinthEarnings: currentCredits.labyrinthEarnings + creditsEarned,
    creditsBalance: currentCredits.creditsBalance + creditsEarned,
    totalEarned: currentCredits.totalEarned + creditsEarned
  });

  // Registrar transação
  await addTransaction(userId, {
    type: 'labyrinth',
    amount: creditsEarned,
    description: `Labirinto ${era}: +${creditsEarned} créditos`,
    era
  });

  return updatedCredits;
};

// 💸 FUNÇÃO: Registrar transação
export const addTransaction = async (
  userId: string,
  transaction: Omit<CreditsTransaction, 'id' | 'userId' | 'timestamp'>
): Promise<void> => {
  try {
    const newTransaction: CreditsTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      timestamp: new Date().toISOString(),
      ...transaction
    };

    // Salvar no localStorage
    const existingTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`) || '[]');
    existingTransactions.push(newTransaction);
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(existingTransactions));

    // Tentar salvar no Supabase
    try {
      await supabase.from('wallet_transactions').insert({
        user_id: userId,
        transaction_type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        era: transaction.era,
        battle_id: transaction.battleId,
        created_at: newTransaction.timestamp
      });
    } catch (dbError) {
      console.log('⚠️ Não foi possível salvar transação no Supabase:', dbError);
    }

  } catch (error) {
    console.error('❌ Erro ao registrar transação:', error);
  }
};

// 📊 FUNÇÃO: Obter histórico de transações
export const getTransactionHistory = async (userId: string): Promise<CreditsTransaction[]> => {
  try {
    // Tentar buscar do Supabase
    const { data: supabaseTransactions, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (supabaseTransactions && !error) {
      // Converter para formato unificado
      const transactions: CreditsTransaction[] = supabaseTransactions.map(tx => ({
        id: tx.id,
        userId: tx.user_id,
        type: tx.transaction_type as any,
        amount: tx.amount,
        description: tx.description,
        timestamp: tx.created_at,
        era: tx.era,
        battleId: tx.battle_id
      }));

      // Sincronizar localStorage
      localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
      return transactions;
    }

    // Fallback para localStorage
    const localTransactions = localStorage.getItem(`transactions_${userId}`);
    if (localTransactions) {
      return JSON.parse(localTransactions);
    }

    return [];

  } catch (error) {
    console.error('❌ Erro ao buscar histórico:', error);
    
    // Fallback para localStorage
    const localTransactions = localStorage.getItem(`transactions_${userId}`);
    if (localTransactions) {
      return JSON.parse(localTransactions);
    }

    return [];
  }
};

// 🔄 FUNÇÃO: Sincronizar dados (para admins)
export const syncUserCredits = async (userId: string): Promise<void> => {
  try {
    const localCredits = localStorage.getItem(`userCredits_${userId}`);
    if (!localCredits) return;

    const credits = JSON.parse(localCredits);
    
    // Forçar atualização no Supabase
    await supabase
      .from('user_wallet')
      .upsert({
        user_id: userId,
        plan_type: credits.planType,
        initial_deposit: credits.initialDeposit,
        credits_balance: credits.creditsBalance,
        credits_initial: credits.creditsInitial,
        pvp_earnings: credits.pvpEarnings,
        training_earnings: credits.trainingEarnings,
        labyrinth_earnings: credits.labyrinthEarnings,
        updated_at: credits.lastUpdated
      });

    console.log('✅ Créditos sincronizados com Supabase para usuário:', userId);

  } catch (error) {
    console.error('❌ Erro ao sincronizar créditos:', error);
  }
};

// 🎯 FUNÇÃO: Calcular saldo total disponível
export const calculateTotalBalance = (credits: UserCredits): number => {
  return credits.creditsBalance + credits.creditsInitial;
};

// 💰 FUNÇÃO: Calcular valor sacável (considerando taxas)
export const calculateWithdrawableAmount = (
  credits: UserCredits,
  withdrawalFeePercent: number = 22.5
): number => {
  const totalBalance = calculateTotalBalance(credits);
  const fee = totalBalance * (withdrawalFeePercent / 100);
  return Math.max(0, totalBalance - fee);
};

// 📱 FUNÇÃO: Formatar créditos para display
export const formatCreditsDisplay = (credits: number): string => {
  if (credits >= 1000) {
    return `${(credits / 1000).toFixed(1)}k`;
  }
  return credits.toString();
};

// 🔍 FUNÇÃO: Verificar se usuário pode realizar ação
export const canUserAfford = (
  credits: UserCredits,
  requiredCredits: number
): boolean => {
  return credits.creditsBalance >= requiredCredits;
};
