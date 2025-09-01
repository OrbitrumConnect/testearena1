// Sistema de Créditos Internos - 3 Planos de Assinatura
// 🎯 R$ 1,00 = 100 créditos (conversão interna, não exibida)
// 🏆 ROI máximo: 400% anual (100% por trimestre)

export type PlanType = 'premium' | 'standard' | 'basic';

export interface PlanConfig {
  // Entrada do usuário
  initialDeposit: number; // Valor pago
  platformRetention: number; // Taxa plataforma
  creditsReceived: number; // Créditos iniciais

  // Treinos (ROI controlado)
  trainingRewards: {
    [era: string]: {
      base: number; // créditos base
      victory: number; // créditos vitória  
      excellent: number; // créditos excelência (90%+)
    };
  };

  // PvP Arena
  pvpBetCredits: number; // Aposta
  pvpWinnerCredits: number; // Prêmio vitória

  // Bônus Misterioso Mensal
  monthlyBonusMax: number; // Máximo possível

  // Saque
  withdrawalFeePercent: number; // 5%
  withdrawalMinDays: number; // 30 dias
}

// 📊 CONFIGURAÇÕES DOS 3 PLANOS - ROI 400% ANUAL MÁXIMO
export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  premium: {
    // 💎 PLANO PREMIUM - R$ 5,00
    initialDeposit: 5.00,
    platformRetention: 0.50,
    creditsReceived: 500, // R$ 4,50 + 50 bônus

    trainingRewards: {
      'egito-antigo': { base: 0.3, victory: 0.7, excellent: 1.4 },
      'mesopotamia': { base: 0.5, victory: 1.0, excellent: 2.0 },
      'medieval': { base: 0.7, victory: 1.4, excellent: 2.8 },
      'digital': { base: 1.0, victory: 2.0, excellent: 3.5 }
    },

    pvpBetCredits: 3,
    pvpWinnerCredits: 5,
    monthlyBonusMax: 60,
    withdrawalFeePercent: 5,
    withdrawalMinDays: 30
  },

  standard: {
    // 🥈 PLANO STANDARD - R$ 3,50
    initialDeposit: 3.50,
    platformRetention: 0.35,
    creditsReceived: 350, // R$ 3,15 + 35 bônus

    trainingRewards: {
      'egito-antigo': { base: 0.2, victory: 0.5, excellent: 1.0 },
      'mesopotamia': { base: 0.3, victory: 0.7, excellent: 1.4 },
      'medieval': { base: 0.5, victory: 1.0, excellent: 2.0 },
      'digital': { base: 0.7, victory: 1.4, excellent: 2.5 }
    },

    pvpBetCredits: 2,
    pvpWinnerCredits: 3.5,
    monthlyBonusMax: 42,
    withdrawalFeePercent: 5,
    withdrawalMinDays: 30
  },

  basic: {
    // 🥉 PLANO BASIC - R$ 2,00
    initialDeposit: 2.00,
    platformRetention: 0.20,
    creditsReceived: 200, // R$ 1,80 + 20 bônus

    trainingRewards: {
      'egito-antigo': { base: 0.1, victory: 0.3, excellent: 0.6 },
      'mesopotamia': { base: 0.2, victory: 0.4, excellent: 0.8 },
      'medieval': { base: 0.3, victory: 0.6, excellent: 1.2 },
      'digital': { base: 0.4, victory: 0.8, excellent: 1.5 }
    },

    pvpBetCredits: 1,
    pvpWinnerCredits: 2,
    monthlyBonusMax: 24,
    withdrawalFeePercent: 5,
    withdrawalMinDays: 30
  }
};

// 🎯 Funções para Cálculos de Créditos com Sistema de Planos
export const calculateTrainingCredits = (
  planType: PlanType,
  eraSlug: string, 
  questionsCorrect: number, 
  totalQuestions: number
) => {
  const accuracyPercentage = (questionsCorrect / totalQuestions) * 100;
  const isVictory = accuracyPercentage >= 70;
  const isExcellent = accuracyPercentage >= 90;
  
  const planConfig = PLAN_CONFIGS[planType];
  const eraRewards = planConfig.trainingRewards[eraSlug] || 
                     planConfig.trainingRewards['egito-antigo'];
  
  let baseCredits = 0;
  if (isExcellent) {
    baseCredits = eraRewards.excellent;
  } else if (isVictory) {
    baseCredits = eraRewards.victory;
  } else {
    baseCredits = eraRewards.base;
  }
  
  return {
    creditsEarned: Math.round(baseCredits * 100) / 100, // Arredondar para 2 casas
    xpEarned: questionsCorrect * 10 + (isVictory ? 50 : 20) + (isExcellent ? 30 : 0),
    bonusApplied: isExcellent,
    accuracyPercentage: Math.round(accuracyPercentage),
    planType: planType,
    isActivityContribution: true
  };
};

// ⚔️ Recompensas de Arena PvP com Sistema de Planos
export const calculateArenaCredits = (planType: PlanType, isVictory: boolean) => {
  const planConfig = PLAN_CONFIGS[planType];
  
  return {
    creditsEarned: isVictory 
      ? (planConfig.pvpWinnerCredits - planConfig.pvpBetCredits) // Lucro na vitória
      : -planConfig.pvpBetCredits, // Perda na derrota
    xpEarned: isVictory ? 200 : 50,
    betAmount: planConfig.pvpBetCredits,
    totalPool: planConfig.pvpBetCredits * 2,
    winnerReceives: planConfig.pvpWinnerCredits,
    planType: planType,
    isPvP: true
  };
};

// 🎁 Cálculo do Bônus Misterioso Mensal com Sistema de Planos
export const calculateMonthlyBonus = (
  planType: PlanType,
  userActivity: {
    daysActive: number;
    totalAccuracy: number;
    erasCompleted: number;
    hoursInPlatform: number;
  }
) => {
  const planConfig = PLAN_CONFIGS[planType];
  
  // Critérios de bônus (pesos fixos)
  const bonusCriteria = {
    dailyActivity: 40, // 40% do peso
    accuracyBonus: 25, // 25% do peso  
    erasDiversity: 20, // 20% do peso
    platformTime: 15  // 15% do peso
  };
  
  // Normalizar valores (0-1)
  const activityScore = Math.min(userActivity.daysActive / 30, 1);
  const accuracyScore = Math.min(userActivity.totalAccuracy / 100, 1);
  const diversityScore = Math.min(userActivity.erasCompleted / 4, 1);
  const timeScore = Math.min(userActivity.hoursInPlatform / 100, 1);
  
  // Calcular pontuação ponderada
  const totalScore = (
    (activityScore * bonusCriteria.dailyActivity) +
    (accuracyScore * bonusCriteria.accuracyBonus) +
    (diversityScore * bonusCriteria.erasDiversity) +
    (timeScore * bonusCriteria.platformTime)
  ) / 100;
  
  // Calcular bônus final baseado no plano
  const bonusCredits = Math.round(planConfig.monthlyBonusMax * totalScore);
  
  return {
    bonusCredits,
    maxPossible: planConfig.monthlyBonusMax,
    planType: planType,
    breakdown: {
      activity: Math.round(activityScore * bonusCriteria.dailyActivity),
      accuracy: Math.round(accuracyScore * bonusCriteria.accuracyBonus),
      diversity: Math.round(diversityScore * bonusCriteria.erasDiversity),
      time: Math.round(timeScore * bonusCriteria.platformTime)
    }
  };
};

// 💸 Cálculo de Saque por Plano (Devolução do Valor Pago)
export const calculateWithdrawal = (planType: PlanType, daysSinceDeposit: number) => {
  const planConfig = PLAN_CONFIGS[planType];
  
  if (daysSinceDeposit < planConfig.withdrawalMinDays) {
    return {
      canWithdraw: false,
      daysRemaining: planConfig.withdrawalMinDays - daysSinceDeposit,
      message: `Saque disponível em ${planConfig.withdrawalMinDays - daysSinceDeposit} dias`,
      planType: planType
    };
  }
  
  const withdrawableAmount = planConfig.initialDeposit - planConfig.platformRetention;
  const fee = withdrawableAmount * (planConfig.withdrawalFeePercent / 100);
  const finalAmount = withdrawableAmount - fee;
  
  return {
    canWithdraw: true,
    withdrawableAmount,
    fee,
    finalAmount,
    planType: planType,
    message: `Disponível para saque: R$ ${finalAmount.toFixed(2)}`
  };
};

// 🎨 Formatação para Display
export const formatCredits = (credits: number): string => {
  return credits.toLocaleString('pt-BR');
};

// 🎯 Funções Auxiliares para Planos
export const getPlanInfo = (planType: PlanType) => {
  const planConfig = PLAN_CONFIGS[planType];
  const planNames = {
    premium: '💎 Premium',
    standard: '🥈 Standard', 
    basic: '🥉 Basic'
  };
  
  return {
    name: planNames[planType],
    value: planConfig.initialDeposit,
    credits: planConfig.creditsReceived,
    monthlyBonusMax: planConfig.monthlyBonusMax,
    pvpBet: planConfig.pvpBetCredits,
    pvpPrize: planConfig.pvpWinnerCredits
  };
};

export const getAllPlansInfo = () => {
  return Object.keys(PLAN_CONFIGS).map(planType => ({
    planType: planType as PlanType,
    ...getPlanInfo(planType as PlanType)
  }));
};

export const getCreditsDisplayInfo = () => {
  return {
    systemName: "Sistema de Créditos Internos - 3 Planos",
    disclaimer: "Créditos não possuem valor monetário fora da plataforma",
    usage: "Use seus créditos para treinos, PvP e conteúdos exclusivos",
    withdrawal: "Devolução do valor pago disponível após 30 dias",
    plansAvailable: "Planos: Basic (R$ 2,00), Standard (R$ 3,50), Premium (R$ 5,00)"
  };
};

// 🔐 Compliance e Legal
export const getComplianceInfo = () => {
  return {
    legalStatus: "Créditos internos para uso exclusivo na plataforma",
    pvpNature: "Competições baseadas em habilidade e conhecimento",
    noGamblingPromise: "Não constitui jogo de azar ou investimento",
    withdrawalPolicy: "Saque limitado ao valor originalmente pago",
    dataProtection: "Em conformidade com LGPD"
  };
};
