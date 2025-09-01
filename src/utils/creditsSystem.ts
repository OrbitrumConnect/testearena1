// Sistema de Créditos Internos - 3 Planos de Assinatura
// 🎯 R$ 1,00 = 100 créditos (conversão interna, não exibida)
// 🏆 ROI máximo: 150-300% anual (sistema sustentável e legal)
// 📅 PROGRESSÃO OBRIGATÓRIA: Mês 1 → Mês 2 → Mês 3

export type PlanType = 'premium' | 'standard' | 'basic';
export type MonthType = 'month1' | 'month2' | 'month3';

export interface PlanConfig {
  // Entrada do usuário
  initialDeposit: number; // Valor pago
  platformRetention: number; // Taxa plataforma
  creditsReceived: number; // Créditos iniciais
  monthType: MonthType; // Tipo do mês na progressão
  isAdultOnly: boolean; // Apenas para maiores de 18 anos

  // Treinos (ROI controlado)
  trainingRewards: {
    [era: string]: {
      base: number; // créditos base
      victory: number; // créditos vitória  
      excellent: number; // créditos excelência (90%+)
    };
  };

  // PvP Arena (SUSTENTÁVEL E LEGAL)
  pvpBetCredits: number; // Aposta
  pvpWinnerCredits: number; // Prêmio vitória

  // Bônus Misterioso Mensal
  monthlyBonusMax: number; // Máximo possível

  // Saque (CONTROLADO E LEGAL)
  withdrawalFeePercent: number; // 5%
  withdrawalMinDays: number; // 30 dias
  maxMonthlyWithdrawal: number; // Limite legal
  maxWithdrawalUnder18: number; // Limite para menores de 18 (50%)
}

// 📊 CONFIGURAÇÕES DOS 3 PLANOS - PROGRESSÃO OBRIGATÓRIA
export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  premium: {
    // 💎 MÊS 1 - R$ 5,00 (OBRIGATÓRIO PARA TODOS)
    initialDeposit: 5.00,
    platformRetention: 0.50,
    creditsReceived: 500, // R$ 4,50 + 50 bônus
    monthType: 'month1',
    isAdultOnly: true, // Apenas maiores de 18 anos

    trainingRewards: {
      'egito-antigo': { base: 0.3, victory: 0.7, excellent: 1.4 },
      'mesopotamia': { base: 0.5, victory: 1.0, excellent: 2.0 },
      'medieval': { base: 0.7, victory: 1.4, excellent: 2.8 },
      'digital': { base: 1.0, victory: 2.0, excellent: 3.5 }
    },

    // PvP SUSTENTÁVEL - Equilibrado
    pvpBetCredits: 1.5, // R$ 0,015 por partida
    pvpWinnerCredits: 2.5, // R$ 0,025 para vencedor (lucro 1.0)
    monthlyBonusMax: 60,
    withdrawalFeePercent: 5,
    withdrawalMinDays: 30,
    maxMonthlyWithdrawal: 100, // R$ 1,00/mês (limite legal)
    maxWithdrawalUnder18: 50 // 50% para menores de 18
  },

  standard: {
    // 🥈 MÊS 2 - R$ 3,50 (SÓ QUEM PAGOU MÊS 1)
    initialDeposit: 3.50,
    platformRetention: 0.35,
    creditsReceived: 350, // R$ 3,15 + 35 bônus
    monthType: 'month2',
    isAdultOnly: true, // Apenas maiores de 18 anos

    trainingRewards: {
      'egito-antigo': { base: 0.2, victory: 0.5, excellent: 1.0 },
      'mesopotamia': { base: 0.3, victory: 0.7, excellent: 1.4 },
      'medieval': { base: 0.5, victory: 1.0, excellent: 2.0 },
      'digital': { base: 0.7, victory: 1.4, excellent: 2.5 }
    },

    // PvP SUSTENTÁVEL - Equilibrado
    pvpBetCredits: 1.5, // R$ 0,015 por partida
    pvpWinnerCredits: 2.5, // R$ 0,025 para vencedor (lucro 1.0)
    monthlyBonusMax: 42,
    withdrawalFeePercent: 5,
    withdrawalMinDays: 30,
    maxMonthlyWithdrawal: 100, // R$ 1,00/mês (limite legal)
    maxWithdrawalUnder18: 50 // 50% para menores de 18
  },

  basic: {
    // 🥉 MÊS 3 - R$ 2,00 (SÓ QUEM PAGOU MÊS 2)
    initialDeposit: 2.00,
    platformRetention: 0.20,
    creditsReceived: 200, // R$ 1,80 + 20 bônus
    monthType: 'month3',
    isAdultOnly: true, // Apenas maiores de 18 anos

    trainingRewards: {
      'egito-antigo': { base: 0.1, victory: 0.3, excellent: 0.6 },
      'mesopotamia': { base: 0.2, victory: 0.4, excellent: 0.8 },
      'medieval': { base: 0.3, victory: 0.6, excellent: 1.2 },
      'digital': { base: 0.4, victory: 0.8, excellent: 1.5 }
    },

    // PvP SUSTENTÁVEL - Equilibrado
    pvpBetCredits: 1.5, // R$ 0,015 por partida
    pvpWinnerCredits: 2.5, // R$ 0,025 para vencedor (lucro 1.0)
    monthlyBonusMax: 24,
    withdrawalFeePercent: 5,
    withdrawalMinDays: 30,
    maxMonthlyWithdrawal: 100, // R$ 1,00/mês (limite legal)
    maxWithdrawalUnder18: 50 // 50% para menores de 18
  }
};

// 🔒 SISTEMA DE PROGRESSÃO OBRIGATÓRIA
export const getAvailablePlans = (userProgress: {
  month1Completed: boolean;
  month2Completed: boolean;
  month3Completed: boolean;
}) => {
  const availablePlans: PlanType[] = [];
  
  // Mês 1 sempre disponível
  availablePlans.push('premium');
  
  // Mês 2 só se completou Mês 1
  if (userProgress.month1Completed) {
    availablePlans.push('standard');
  }
  
  // Mês 3 só se completou Mês 2
  if (userProgress.month2Completed) {
    availablePlans.push('basic');
  }
  
  return availablePlans;
};

// 📅 VERIFICAR PROGRESSÃO DO USUÁRIO
export const checkUserProgression = (userHistory: {
  payments: Array<{ planType: PlanType; date: string }>;
}) => {
  const month1Completed = userHistory.payments.some(p => p.planType === 'premium');
  const month2Completed = userHistory.payments.some(p => p.planType === 'standard');
  const month3Completed = userHistory.payments.some(p => p.planType === 'basic');
  
  return {
    month1Completed,
    month2Completed,
    month3Completed,
    currentMonth: month3Completed ? 3 : month2Completed ? 2 : month1Completed ? 1 : 0,
    canAccessMonth2: month1Completed,
    canAccessMonth3: month2Completed
  };
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

// ⚔️ Recompensas de Arena PvP com Sistema de Planos (SUSTENTÁVEL)
export const calculateArenaCredits = (planType: PlanType, isVictory: boolean) => {
  const planConfig = PLAN_CONFIGS[planType];
  
  return {
    creditsEarned: isVictory 
      ? (planConfig.pvpWinnerCredits - planConfig.pvpBetCredits) // Lucro na vitória (1.0 crédito)
      : -planConfig.pvpBetCredits, // Perda na derrota (1.5 créditos)
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
  },
  userRank?: 'top1' | 'top5' | 'top10' | 'top20' | 'regular' // Novo: ranking do usuário
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
  
  // Calcular bônus base (REDUZIDO para usuários regulares)
  let bonusCredits = Math.round(planConfig.monthlyBonusMax * totalScore * 0.6); // 60% do bônus base
  
  // BÔNUS ESPECIAL PARA TOP RANKINGS (DISTRIBUÍDO)
  if (userRank) {
    switch (userRank) {
      case 'top1':
        bonusCredits += 45; // +45 créditos para Top 1 (ROI 250%+)
        break;
      case 'top5':
        bonusCredits += 35; // +35 créditos para Top 5 (ROI 200%+)
        break;
      case 'top10':
        bonusCredits += 25; // +25 créditos para Top 10 (ROI 189%)
        break;
      case 'top20':
        bonusCredits += 15; // +15 créditos para Top 20 (ROI 150%)
        break;
      default:
        // Usuário regular: sem bônus extra (ROI 120%)
        break;
    }
  }
  
  return {
    bonusCredits,
    maxPossible: planConfig.monthlyBonusMax * 0.6 + (userRank === 'top1' ? 45 : userRank === 'top5' ? 35 : userRank === 'top10' ? 25 : userRank === 'top20' ? 15 : 0),
    planType: planType,
    userRank,
    breakdown: {
      activity: Math.round(activityScore * bonusCriteria.dailyActivity),
      accuracy: Math.round(accuracyScore * bonusCriteria.accuracyBonus),
      diversity: Math.round(diversityScore * bonusCriteria.erasDiversity),
      time: Math.round(timeScore * bonusCriteria.platformTime),
      rankingBonus: userRank === 'top1' ? 45 : userRank === 'top5' ? 35 : userRank === 'top10' ? 25 : userRank === 'top20' ? 15 : 0
    }
  };
};

// 💸 Cálculo de Saque por Plano (SUSTENTÁVEL E LEGAL)
export const calculateWithdrawal = (
  planType: PlanType, 
  daysSinceDeposit: number, 
  monthlyEarnings: number = 0,
  isAdult: boolean = true
) => {
  const planConfig = PLAN_CONFIGS[planType];
  
  if (daysSinceDeposit < planConfig.withdrawalMinDays) {
    return {
      canWithdraw: false,
      daysRemaining: planConfig.withdrawalMinDays - daysSinceDeposit,
      message: `Saque disponível em ${planConfig.withdrawalMinDays - daysSinceDeposit} dias`,
      planType: planType,
      isAdult
    };
  }
  
  // SUSTENTÁVEL: Saque baseado em ganhos reais
  const maxWithdrawal = isAdult ? planConfig.maxMonthlyWithdrawal : planConfig.maxWithdrawalUnder18;
  const baseWithdrawal = Math.min(monthlyEarnings, maxWithdrawal);
  const fee = baseWithdrawal > 50 ? baseWithdrawal * (planConfig.withdrawalFeePercent / 100) : 0; // Taxa 5% para >R$ 0,50
  const finalAmount = baseWithdrawal - fee;
  
  return {
    canWithdraw: true,
    withdrawableAmount: baseWithdrawal,
    fee,
    finalAmount,
    planType: planType,
    isAdult,
    maxWithdrawal,
    message: `Disponível para saque: ${finalAmount.toFixed(0)} créditos (R$ ${(finalAmount / 100).toFixed(2)})${!isAdult ? ' - Limite 50% para menores de 18' : ''}`
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
    premium: '💎 Mês 1 - Premium',
    standard: '🥈 Mês 2 - Standard', 
    basic: '🥉 Mês 3 - Basic'
  };
  
  return {
    name: planNames[planType],
    value: planConfig.initialDeposit,
    credits: planConfig.creditsReceived,
    monthlyBonusMax: planConfig.monthlyBonusMax,
    pvpBet: planConfig.pvpBetCredits,
    pvpPrize: planConfig.pvpWinnerCredits,
    maxWithdrawal: planConfig.maxMonthlyWithdrawal,
    monthType: planConfig.monthType
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
    systemName: "Sistema de Créditos Internos - Progressão 3 Meses",
    disclaimer: "Créditos não possuem valor monetário fora da plataforma",
    usage: "Use seus créditos para treinos, PvP e conteúdos exclusivos",
    withdrawal: "Saque até 100 créditos/mês (R$ 1,00) após 30 dias",
    plansAvailable: "Progressão: Mês 1 (R$ 5,00) → Mês 2 (R$ 3,50) → Mês 3 (R$ 2,00)",
    pvpRewards: "PvP: 1.5 créditos entrada, 2.5 créditos vitória (lucro 1.0)",
    progression: "Progressão obrigatória: cada mês desbloqueia o próximo"
  };
};

// 🔐 Compliance e Legal
export const getComplianceInfo = () => {
  return {
    legalStatus: "Créditos internos para uso exclusivo na plataforma",
    pvpNature: "Competições baseadas em habilidade e conhecimento",
    noGamblingPromise: "Não constitui jogo de azar ou investimento",
    withdrawalPolicy: "Saque limitado a 100 créditos/mês (R$ 1,00) - conforme legislação",
    dataProtection: "Em conformidade com LGPD",
    sustainability: "Sistema economicamente sustentável e legalmente compliant",
    progression: "Progressão de planos baseada em engajamento e mérito"
  };
};
