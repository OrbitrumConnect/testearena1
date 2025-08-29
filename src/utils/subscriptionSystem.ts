// Sistema de 3 - Entrada Escalonada e Créditos
// 🎯 Mês 1: R$20 → Mês 2: R$16 → Mês 3: R$12 → Reinicia

export interface SubscriptionCycle {
  month: 1 | 2 | 3;
  entryAmount: number;  // Valor que o usuário paga
  creditsReceived: number;  // Créditos que recebe
  maxWithdrawal: number;  // Máximo sacável
  platformRetention: number;  // Taxa da plataforma
}

export interface UserSubscription {
  id: string;
  user_id: string;
  current_cycle_month: 1 | 2 | 3;
  cycle_start_date: string;
  last_payment_date: string;
  total_paid_current_cycle: number;
  withdrawals_made: number;
  next_payment_due: string;
  status: 'active' | 'pending_payment' | 'suspended';
  created_at: string;
  updated_at: string;
}

// 📊 Configuração do Sistema de 3
export const SUBSCRIPTION_CONFIG: Record<1 | 2 | 3, SubscriptionCycle> = {
  1: {
    month: 1,
    entryAmount: 20.00,      // R$ 20,00
    creditsReceived: 2000,   // 2.000 créditos
    maxWithdrawal: 20.00,    // Pode sacar até R$ 20,00
    platformRetention: 1.00  // R$ 1,00 taxa
  },
  2: {
    month: 2,
    entryAmount: 16.00,      // R$ 16,00 (economia de R$ 4,00)
    creditsReceived: 1600,   // 1.600 créditos
    maxWithdrawal: 20.00,    // Devolução do valor pago
    platformRetention: 1.00  // R$ 1,00 taxa
  },
  3: {
    month: 3,
    entryAmount: 12.00,      // R$ 12,00 (economia de R$ 8,00)
    creditsReceived: 1200,   // 1.200 créditos  
    maxWithdrawal: 20.00,    // Devolução do valor pago
    platformRetention: 1.00  // R$ 1,00 taxa
  }
};

// 🧮 Cálculos do Sistema
export const calculateCycleBenefits = (currentMonth: 1 | 2 | 3) => {
  const config = SUBSCRIPTION_CONFIG[currentMonth];
  const potentialSavings = 20.00 - config.entryAmount; // Economia vs Mês 1
  const withdrawalAdvantage = config.maxWithdrawal - config.entryAmount; // Diferença de devolução
  
  return {
    entryAmount: config.entryAmount,
    creditsReceived: config.creditsReceived,
    maxWithdrawal: config.maxWithdrawal,
    savings: potentialSavings,
    potentialAdvantage: withdrawalAdvantage,
    userPerception: withdrawalAdvantage > 0 ? 'advantageous' : 'neutral',
    nextMonth: currentMonth === 3 ? 1 : (currentMonth + 1) as 1 | 2 | 3
  };
};

// 📅 Gerenciamento de Ciclos
export const getNextPaymentInfo = (userSubscription: UserSubscription) => {
  const currentConfig = SUBSCRIPTION_CONFIG[userSubscription.current_cycle_month];
  const nextMonth = userSubscription.current_cycle_month === 3 ? 1 : 
                   (userSubscription.current_cycle_month + 1) as 1 | 2 | 3;
  const nextConfig = SUBSCRIPTION_CONFIG[nextMonth];
  
  const nextPaymentDate = new Date(userSubscription.next_payment_due);
  const daysUntilPayment = Math.max(0, 
    Math.ceil((nextPaymentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
  
  return {
    currentMonth: userSubscription.current_cycle_month,
    currentAmount: currentConfig.entryAmount,
    nextMonth,
    nextAmount: nextConfig.entryAmount,
    daysUntilPayment,
    nextPaymentDate: nextPaymentDate.toLocaleDateString('pt-BR'),
    savings: nextMonth > userSubscription.current_cycle_month ? 
             currentConfig.entryAmount - nextConfig.entryAmount : 0,
    cycleRestart: nextMonth === 1 && userSubscription.current_cycle_month === 3
  };
};

// 💸 Cálculo de Saque com Sistema de 3
export const calculateWithdrawalLimits = (
  userSubscription: UserSubscription,
  daysSinceLastPayment: number
) => {
  const currentConfig = SUBSCRIPTION_CONFIG[userSubscription.current_cycle_month];
  const withdrawalFeePercent = 5; // 5% taxa administrativa
  const minDaysForWithdrawal = 30; // 30 dias mínimo
  
  if (daysSinceLastPayment < minDaysForWithdrawal) {
    return {
      canWithdraw: false,
      maxAmount: 0,
      daysRemaining: minDaysForWithdrawal - daysSinceLastPayment,
      message: `Saque disponível em ${minDaysForWithdrawal - daysSinceLastPayment} dias`
    };
  }
  
  const grossAmount = currentConfig.maxWithdrawal;
  const fee = grossAmount * (withdrawalFeePercent / 100);
  const netAmount = grossAmount - fee;
  
  return {
    canWithdraw: true,
    maxAmount: netAmount,
    grossAmount,
    fee,
    feePercent: withdrawalFeePercent,
    message: `Disponível: R$ ${netAmount.toFixed(2)} (taxa de ${withdrawalFeePercent}%)`
  };
};

// 🎁 Bonus Misterioso Escalonado por Mês
export const calculateScaledMonthlyBonus = (
  userSubscription: UserSubscription,
  userActivity: {
    daysActive: number;
    totalAccuracy: number;
    erasCompleted: number;
    hoursInPlatform: number;
    pvpWins: number;
  }
) => {
  // Base do bônus varia por mês do ciclo
  const baseBonusMultiplier: Record<1 | 2 | 3, number> = {
    1: 1.0,   // Mês 1: multiplicador normal
    2: 1.2,   // Mês 2: 20% a mais (incentivo por economia)
    3: 1.5    // Mês 3: 50% a mais (maior incentivo)
  };
  
  const maxBaseBonus = 2500; // 2.500 créditos base
  const multiplier = baseBonusMultiplier[userSubscription.current_cycle_month];
  const scaledMaxBonus = Math.round(maxBaseBonus * multiplier);
  
  // Normalizar valores (0-1)
  const activityScore = Math.min(userActivity.daysActive / 30, 1);
  const accuracyScore = Math.min(userActivity.totalAccuracy / 100, 1);
  const diversityScore = Math.min(userActivity.erasCompleted / 4, 1);
  const timeScore = Math.min(userActivity.hoursInPlatform / 100, 1);
  const pvpScore = Math.min(userActivity.pvpWins / 20, 1);
  
  // Pontuação ponderada
  const totalScore = (
    (activityScore * 30) +      // 30% atividade diária
    (accuracyScore * 25) +      // 25% precisão
    (diversityScore * 20) +     // 20% diversidade
    (timeScore * 15) +          // 15% tempo na plataforma
    (pvpScore * 10)             // 10% vitórias PvP
  ) / 100;
  
  const bonusCredits = Math.round(scaledMaxBonus * totalScore);
  
  return {
    bonusCredits,
    maxPossible: scaledMaxBonus,
    baseMaxBonus: maxBaseBonus,
    monthMultiplier: multiplier,
    currentMonth: userSubscription.current_cycle_month,
    breakdown: {
      activity: Math.round(activityScore * 30),
      accuracy: Math.round(accuracyScore * 25),
      diversity: Math.round(diversityScore * 20),
      time: Math.round(timeScore * 15),
      pvp: Math.round(pvpScore * 10)
    },
    message: `Bônus Mês ${userSubscription.current_cycle_month} (${Math.round(multiplier * 100)}% multiplier)`
  };
};

// 📊 Relatório Financeiro do Ciclo
export const generateCycleReport = (userSubscription: UserSubscription) => {
  const currentConfig = SUBSCRIPTION_CONFIG[userSubscription.current_cycle_month];
  const benefits = calculateCycleBenefits(userSubscription.current_cycle_month);
  
  return {
    currentCycle: {
      month: userSubscription.current_cycle_month,
      paid: currentConfig.entryAmount,
      creditsReceived: currentConfig.creditsReceived,
      maxWithdrawal: currentConfig.maxWithdrawal,
      potentialAdvantage: benefits.potentialAdvantage
    },
    cycleSummary: {
      totalPaidCycle: userSubscription.total_paid_current_cycle,
      totalWithdrawals: userSubscription.withdrawals_made,
      netPosition: userSubscription.withdrawals_made - userSubscription.total_paid_current_cycle
    },
    nextPayment: getNextPaymentInfo(userSubscription),
    userAdvantage: {
      savingsThisCycle: benefits.savings,
      advantageMargin: (benefits.potentialAdvantage / currentConfig.entryAmount) * 100,
      perception: benefits.userPerception
    }
  };
};

// 🎯 Interface para Display do Sistema
export const getSystemDisplayInfo = (currentMonth: 1 | 2 | 3) => {
  const config = SUBSCRIPTION_CONFIG[currentMonth];
  const benefits = calculateCycleBenefits(currentMonth);
  
  return {
    title: `Sistema de 3 - Mês ${currentMonth}`,
    entryAmount: `R$ ${config.entryAmount.toFixed(2)}`,
    creditsReceived: `${config.creditsReceived.toLocaleString()} créditos`,
    maxWithdrawal: `R$ ${config.maxWithdrawal.toFixed(2)}`,
    savings: benefits.savings > 0 ? `Economia: R$ ${benefits.savings.toFixed(2)}` : null,
    advantage: benefits.potentialAdvantage > 0 ? 
               `Devolução: ${Math.round(benefits.potentialAdvantage * 100)} créditos` : null,
    nextMonth: `Próximo mês: R$ ${SUBSCRIPTION_CONFIG[benefits.nextMonth].entryAmount.toFixed(2)}`,
    cycleProgress: `${currentMonth}/3`,
    userMessage: currentMonth === 1 ? 
                 "Começando o ciclo com valor padrão" :
                 currentMonth === 2 ?
                 "Economia de 400 créditos este mês!" :
                 "Máxima economia: 800 créditos este mês!"
  };
};
