// Sistema de Teste para Créditos Consistentes
// 🎯 Resolve problemas de valores inconsistentes entre telas

import { getUserCredits, updateUserCredits } from './creditsUnified';

// 🧪 USUÁRIO DE TESTE PADRÃO
export const createTestUser = async (userId: string = 'test-user-123') => {
  const testCredits = {
    userId,
    planType: 'premium' as const,
    initialDeposit: 5.00, // R$ 5,00
    creditsBalance: 350, // 350 créditos iniciais
    creditsInitial: 350,
    pvpEarnings: 25, // 25 créditos de PvP
    trainingEarnings: 45, // 45 créditos de treino
    labyrinthEarnings: 8, // 8 créditos do labirinto
    totalEarned: 78, // 25 + 45 + 8
    lastUpdated: new Date().toISOString()
  };

  await updateUserCredits(userId, testCredits);
  
  console.log('🧪 Usuário de teste criado:', testCredits);
  return testCredits;
};

// 🔄 SINCRONIZAR TODOS OS DADOS DE TESTE
export const syncAllTestData = async () => {
  const testUserId = 'test-user-123';
  
  // 1. Criar usuário de teste
  const testCredits = await createTestUser(testUserId);
  
  // 2. Sincronizar localStorage
  localStorage.setItem(`userCredits_${testUserId}`, JSON.stringify(testCredits));
  
  // 3. Sincronizar outras chaves do localStorage
  localStorage.setItem('userEmail', 'teste@arena.com');
  localStorage.setItem('userCpf', '123.456.789-00');
  localStorage.setItem('userPhone', '(11) 99999-9999');
  localStorage.setItem('userPixKey', 'teste@arena.com');
  localStorage.setItem('userInstitution', 'Arena do Conhecimento');
  localStorage.setItem('favoriteEra', 'Egito Antigo');
  localStorage.setItem('birthDate', '1990-01-01');
  
  // 4. Criar histórico de batalhas de teste
  const testBattles = [
    {
      id: 'battle-1',
      era_name: 'Egito Antigo',
      questions_correct: 8,
      questions_total: 10,
      accuracy: 80,
      created_at: new Date().toISOString()
    },
    {
      id: 'battle-2',
      era_name: 'Mesopotâmia',
      questions_correct: 7,
      questions_total: 10,
      accuracy: 70,
      created_at: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('battleHistory', JSON.stringify(testBattles));
  
  // 5. Criar transações de teste
  const testTransactions = [
    {
      id: 'tx-1',
      type: 'deposit',
      amount: 350,
      description: 'Depósito inicial - Plano Premium',
      timestamp: new Date().toISOString()
    },
    {
      id: 'tx-2',
      type: 'training',
      amount: 25,
      description: 'Treino Egito: +25 créditos',
      timestamp: new Date().toISOString()
    },
    {
      id: 'tx-3',
      type: 'pvp',
      amount: 15,
      description: 'PvP: +15 créditos',
      timestamp: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('transactions', JSON.stringify(testTransactions));
  
  console.log('🔄 Todos os dados de teste foram sincronizados!');
  return testCredits;
};

// 🧹 LIMPAR DADOS DE TESTE
export const clearTestData = () => {
  const testUserId = 'test-user-123';
  
  // Remover chaves específicas
  localStorage.removeItem(`userCredits_${testUserId}`);
  localStorage.removeItem('battleHistory');
  localStorage.removeItem('transactions');
  
  console.log('🧹 Dados de teste removidos!');
};

// 📊 VERIFICAR CONSISTÊNCIA DOS DADOS
export const checkDataConsistency = async (userId: string = 'test-user-123') => {
  try {
    // 1. Verificar créditos unificados
    const credits = await getUserCredits(userId);
    
    // 2. Verificar localStorage
    const localCredits = localStorage.getItem(`userCredits_${userId}`);
    const localBattles = localStorage.getItem('battleHistory');
    const localTransactions = localStorage.getItem('transactions');
    
    // 3. Verificar cálculos
    const totalBalance = credits.creditsBalance + credits.creditsInitial;
    const totalEarned = credits.pvpEarnings + credits.trainingEarnings + credits.labyrinthEarnings;
    
    const consistency = {
      credits: {
        balance: credits.creditsBalance,
        initial: credits.creditsInitial,
        total: totalBalance,
        earned: totalEarned,
        pvp: credits.pvpEarnings,
        training: credits.trainingEarnings,
        labyrinth: credits.labyrinthEarnings
      },
      localStorage: {
        credits: localCredits ? '✅' : '❌',
        battles: localBattles ? '✅' : '❌',
        transactions: localTransactions ? '✅' : '❌'
      },
      calculations: {
        totalBalance,
        totalEarned,
        isConsistent: totalBalance === credits.creditsInitial + totalEarned
      }
    };
    
    console.log('📊 Verificação de Consistência:', consistency);
    return consistency;
    
  } catch (error) {
    console.error('❌ Erro ao verificar consistência:', error);
    return null;
  }
};

// 🚀 INICIALIZAR SISTEMA DE TESTE
export const initializeTestSystem = async () => {
  console.log('🚀 Inicializando sistema de teste...');
  
  // 1. Sincronizar dados
  await syncAllTestData();
  
  // 2. Verificar consistência
  const consistency = await checkDataConsistency();
  
  // 3. Retornar status
  if (consistency?.calculations.isConsistent) {
    console.log('✅ Sistema de teste inicializado com sucesso!');
    return true;
  } else {
    console.log('⚠️ Sistema de teste inicializado com inconsistências');
    return false;
  }
};
