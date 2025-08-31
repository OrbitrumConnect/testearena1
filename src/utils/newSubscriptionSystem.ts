// 💎 NOVO SISTEMA R$ 5,00 - CICLO DE DESCONTO PROGRESSIVO
// 🎯 Mês 1: R$ 5,00 → Mês 2: R$ 3,50 → Mês 3: R$ 2,00 → Reinicia

export interface NewSubscriptionCycle {
  month: 1 | 2 | 3;
  entryAmount: number;      // Valor que o usuário paga
  creditsReceived: number;  // 80% em créditos (conversão: 100 créditos = R$ 1,00)
  platformRetention: number; // 20% retido pela plataforma
  livesPerDay: number;      // 3 vidas grátis por dia
}

export interface NewUserSubscription {
  id: string;
  user_id: string;
  current_cycle_month: 1 | 2 | 3;
  cycle_start_date: string;
  last_payment_date: string;
  total_paid_current_cycle: number;
  credits_balance: number;
  lives_remaining: number;
  lives_reset_date: string; // Data do último reset de vidas
  next_payment_due: string;
  status: 'active' | 'pending_payment' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface LivesSystem {
  freePerDay: number;       // 3 vidas grátis
  extraLifeCost: number;    // 10 créditos por vida extra
  resetTime: string;        // "00:00" - meia-noite
}

// 📊 Configuração do Novo Sistema de R$ 5,00
export const NEW_SUBSCRIPTION_CONFIG: Record<1 | 2 | 3, NewSubscriptionCycle> = {
  1: {
    month: 1,
    entryAmount: 5.00,        // R$ 5,00
    creditsReceived: 400,     // 400 créditos (R$ 4,00 = 80%)
    platformRetention: 1.00,  // R$ 1,00 (20%)
    livesPerDay: 3            // 3 vidas grátis/dia
  },
  2: {
    month: 2,
    entryAmount: 3.50,        // R$ 3,50 (desconto 30%)
    creditsReceived: 280,     // 280 créditos (R$ 2,80 = 80%)
    platformRetention: 0.70,  // R$ 0,70 (20%)
    livesPerDay: 3            // 3 vidas grátis/dia
  },
  3: {
    month: 3,
    entryAmount: 2.00,        // R$ 2,00 (desconto 60%)
    creditsReceived: 160,     // 160 créditos (R$ 1,60 = 80%)
    platformRetention: 0.40,  // R$ 0,40 (20%)
    livesPerDay: 3            // 3 vidas grátis/dia
  }
};

// 🎮 Sistema de Vidas e Créditos
export const LIVES_AND_CREDITS_CONFIG: LivesSystem & {
  trainingCosts: {
    extraLife: number;      // 10 créditos por vida extra
    trainingComplete: number; // 0 créditos (grátis com vidas)
  };
  pvpCosts: {
    battleEntry: number;    // 50 créditos por batalha
    victoryReward: number;  // 80 créditos por vitória
  };
  withdrawalConfig: {
    minAmount: number;      // R$ 2,00 mínimo
    fee: number;           // 10% taxa
    minCredits: number;    // 200 créditos mínimo
  };
} = {
  freePerDay: 3,
  extraLifeCost: 10,
  resetTime: "00:00",
  
  trainingCosts: {
    extraLife: 10,          // 10 créditos = R$ 0,10
    trainingComplete: 0     // Grátis com vidas
  },
  
  pvpCosts: {
    battleEntry: 50,        // 50 créditos = R$ 0,50
    victoryReward: 80       // 80 créditos = R$ 0,80
  },
  
  withdrawalConfig: {
    minAmount: 2.00,        // R$ 2,00 mínimo
    fee: 10,               // 10% taxa de saque
    minCredits: 200        // 200 créditos = R$ 2,00
  }
};

// 🧮 Cálculos do Novo Sistema
export const calculateNewCycleBenefits = (currentMonth: 1 | 2 | 3) => {
  const config = NEW_SUBSCRIPTION_CONFIG[currentMonth];
  const fullPriceAmount = NEW_SUBSCRIPTION_CONFIG[1].entryAmount;
  const savings = fullPriceAmount - config.entryAmount;
  const creditsInReais = config.creditsReceived / 100; // 100 créditos = R$ 1,00
  
  return {
    entryAmount: config.entryAmount,
    creditsReceived: config.creditsReceived,
    creditsValue: creditsInReais,
    platformRetention: config.platformRetention,
    savings: savings,
    userPercentage: 80, // 80% para o usuário
    nextMonth: currentMonth === 3 ? 1 : (currentMonth + 1) as 1 | 2 | 3,
    cycleSavings: currentMonth === 1 ? 0 : 
                  currentMonth === 2 ? 1.50 : 3.00 // Economia acumulada
  };
};

// 📅 Gerenciamento de Ciclos
export const getNewPaymentInfo = (userSubscription: NewUserSubscription) => {
  const currentConfig = NEW_SUBSCRIPTION_CONFIG[userSubscription.current_cycle_month];
  const nextMonth = userSubscription.current_cycle_month === 3 ? 1 : 
                   (userSubscription.current_cycle_month + 1) as 1 | 2 | 3;
  const nextConfig = NEW_SUBSCRIPTION_CONFIG[nextMonth];
  
  const nextPaymentDate = new Date(userSubscription.next_payment_due);
  const daysUntilPayment = Math.max(0, 
    Math.ceil((nextPaymentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
  
  const savings = currentConfig.entryAmount - nextConfig.entryAmount;
  
  return {
    currentMonth: userSubscription.current_cycle_month,
    currentAmount: currentConfig.entryAmount,
    nextMonth,
    nextAmount: nextConfig.entryAmount,
    daysUntilPayment,
    nextPaymentDate: nextPaymentDate.toLocaleDateString('pt-BR'),
    savings: nextMonth > userSubscription.current_cycle_month ? savings : 0,
    cycleRestart: nextMonth === 1 && userSubscription.current_cycle_month === 3,
    cycleProgress: `${userSubscription.current_cycle_month}/3`
  };
};

// ❤️ Sistema de Vidas
export const calculateLivesStatus = (
  livesRemaining: number, 
  lastResetDate: string
): {
  livesAvailable: number;
  hoursUntilReset: number;
  canBuyExtra: boolean;
  resetToday: boolean;
} => {
  const now = new Date();
  const lastReset = new Date(lastResetDate);
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);
  
  // Verificar se precisa resetar vidas
  const needsReset = lastReset < todayMidnight;
  const currentLives = needsReset ? LIVES_AND_CREDITS_CONFIG.freePerDay : livesRemaining;
  
  // Calcular horas até próximo reset
  const tomorrowMidnight = new Date(todayMidnight);
  tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);
  const hoursUntilReset = Math.ceil((tomorrowMidnight.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  return {
    livesAvailable: currentLives,
    hoursUntilReset,
    canBuyExtra: true, // Sempre pode comprar vidas extras
    resetToday: needsReset
  };
};

// 💰 Cálculo de Créditos por Atividade
export const calculateNewTrainingCredits = (
  questionsCorrect: number,
  totalQuestions: number,
  usedExtraLife: boolean = false
): {
  creditsSpent: number;
  creditsEarned: number;
  netCredits: number;
  xpEarned: number;
} => {
  const accuracyPercentage = (questionsCorrect / totalQuestions) * 100;
  
  // Gasto de créditos
  const creditsSpent = usedExtraLife ? LIVES_AND_CREDITS_CONFIG.extraLifeCost : 0;
  
  // Ganho de créditos (mínimo para engajamento)
  const baseReward = Math.round(accuracyPercentage >= 70 ? 2 : 1);
  const bonusReward = accuracyPercentage >= 90 ? 1 : 0;
  const creditsEarned = baseReward + bonusReward;
  
  // XP baseado na performance
  const xpEarned = questionsCorrect * 10 + (accuracyPercentage >= 70 ? 50 : 20);
  
  return {
    creditsSpent,
    creditsEarned,
    netCredits: creditsEarned - creditsSpent,
    xpEarned
  };
};

// ⚔️ Cálculo de PvP
export const calculateNewPvPResult = (isVictory: boolean): {
  creditsSpent: number;
  creditsEarned: number;
  netCredits: number;
  xpEarned: number;
} => {
  const entryFee = LIVES_AND_CREDITS_CONFIG.pvpCosts.battleEntry;
  const victoryReward = LIVES_AND_CREDITS_CONFIG.pvpCosts.victoryReward;
  
  return {
    creditsSpent: entryFee,
    creditsEarned: isVictory ? victoryReward : 0,
    netCredits: isVictory ? (victoryReward - entryFee) : -entryFee,
    xpEarned: isVictory ? 200 : 50
  };
};

// 💸 Cálculo de Saque
export const calculateNewWithdrawal = (
  creditsBalance: number
): {
  canWithdraw: boolean;
  maxCredits: number;
  maxAmount: number;
  fee: number;
  netAmount: number;
  message: string;
} => {
  const config = LIVES_AND_CREDITS_CONFIG.withdrawalConfig;
  
  if (creditsBalance < config.minCredits) {
    return {
      canWithdraw: false,
      maxCredits: 0,
      maxAmount: 0,
      fee: 0,
      netAmount: 0,
      message: `Mínimo para saque: ${config.minCredits} créditos (R$ ${config.minAmount.toFixed(2)})`
    };
  }
  
  // Converter créditos para reais
  const grossAmount = creditsBalance / 100; // 100 créditos = R$ 1,00
  const fee = grossAmount * (config.fee / 100);
  const netAmount = grossAmount - fee;
  
  return {
    canWithdraw: true,
    maxCredits: creditsBalance,
    maxAmount: grossAmount,
    fee,
    netAmount,
    message: `Disponível: R$ ${netAmount.toFixed(2)} (taxa ${config.fee}%)`
  };
};

// 📊 Relatório do Novo Sistema
export const generateNewSystemReport = (userSubscription: NewUserSubscription) => {
  const currentConfig = NEW_SUBSCRIPTION_CONFIG[userSubscription.current_cycle_month];
  const benefits = calculateNewCycleBenefits(userSubscription.current_cycle_month);
  const paymentInfo = getNewPaymentInfo(userSubscription);
  const withdrawalInfo = calculateNewWithdrawal(userSubscription.credits_balance);
  
  return {
    subscription: {
      currentMonth: userSubscription.current_cycle_month,
      amount: currentConfig.entryAmount,
      creditsReceived: currentConfig.creditsReceived,
      savings: benefits.savings,
      cycleProgress: paymentInfo.cycleProgress
    },
    credits: {
      balance: userSubscription.credits_balance,
      balanceInReais: userSubscription.credits_balance / 100,
      canWithdraw: withdrawalInfo.canWithdraw,
      withdrawalAmount: withdrawalInfo.netAmount
    },
    lives: calculateLivesStatus(userSubscription.lives_remaining, userSubscription.lives_reset_date),
    nextPayment: paymentInfo,
    comparison: {
      oldSystemPrice: 20.00,
      newSystemPrice: currentConfig.entryAmount,
      savings: 20.00 - currentConfig.entryAmount,
      savingsPercentage: Math.round(((20.00 - currentConfig.entryAmount) / 20.00) * 100)
    }
  };
};

// 🎯 Interface para Display
export const getNewSystemDisplayInfo = (currentMonth: 1 | 2 | 3) => {
  const config = NEW_SUBSCRIPTION_CONFIG[currentMonth];
  const benefits = calculateNewCycleBenefits(currentMonth);
  
  return {
    title: `Plano Guerreiro - Mês ${currentMonth}/3`,
    price: `R$ ${config.entryAmount.toFixed(2)}`,
    credits: `${config.creditsReceived} créditos`,
    creditsValue: `R$ ${benefits.creditsValue.toFixed(2)} sacáveis`,
    lives: `${config.livesPerDay} vidas/dia`,
    savings: benefits.savings > 0 ? `Economia: R$ ${benefits.savings.toFixed(2)}` : null,
    nextMonth: `Próximo: R$ ${NEW_SUBSCRIPTION_CONFIG[benefits.nextMonth].entryAmount.toFixed(2)}`,
    userMessage: currentMonth === 1 ? 
                 "🚀 Iniciando sua jornada!" :
                 currentMonth === 2 ?
                 "🎉 30% de desconto este mês!" :
                 "🔥 60% de desconto - máxima economia!",
    features: [
      "✅ 3 vidas grátis por dia",
      "✅ Créditos 100% sacáveis",
      "✅ PvP competitivo",
      "✅ Todas as eras disponíveis",
      "✅ Sistema de desconto progressivo"
    ]
  };
};

// 📱 Migração do Sistema Antigo
export const migrateFromOldSystem = (
  oldSubscription: any,
  oldCredits: any
): Partial<NewUserSubscription> => {
  return {
    current_cycle_month: 1, // Começar no mês 1 do novo sistema
    cycle_start_date: new Date().toISOString(),
    last_payment_date: new Date().toISOString(),
    total_paid_current_cycle: NEW_SUBSCRIPTION_CONFIG[1].entryAmount,
    credits_balance: Math.max(oldCredits?.credits_balance || 0, NEW_SUBSCRIPTION_CONFIG[1].creditsReceived),
    lives_remaining: LIVES_AND_CREDITS_CONFIG.freePerDay,
    lives_reset_date: new Date().toISOString(),
    next_payment_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active' as const
  };
};
