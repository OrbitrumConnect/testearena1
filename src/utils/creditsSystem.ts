// Sistema de Créditos Internos - Legalmente Seguro
// 🎯 R$ 1,00 = 100 créditos (conversão interna, não exibida)

export interface CreditsConfig {
  // Entrada do usuário
  initialDeposit: number; // R$ 5,00
  platformRetention: number; // R$ 0,50
  creditsReceived: number; // 500 créditos

  // PvP Arena
  pvpBetCredits: number; // 1,5 créditos
  pvpWinnerCredits: number; // 2 créditos
  pvpPlatformFeeCredits: number; // 0,5 créditos

  // Treinos
  trainingRewards: {
    [era: string]: {
      base: number; // créditos base
      victory: number; // créditos vitória
      excellent: number; // créditos excelência (90%+)
    };
  };

  // Bônus Misterioso
  monthlyBonusMax: number; // 2.500 créditos máximo
  bonusCriteria: {
    dailyActivity: number; // peso
    accuracyBonus: number; // peso
    erasDiversity: number; // peso
    platformTime: number; // peso
  };

  // Saque
  withdrawalFeePercent: number; // 5%
  withdrawalMinDays: number; // 30 dias
}

export const CREDITS_CONFIG: CreditsConfig = {
  // 🔰 Entrada e Configuração Inicial
  initialDeposit: 20.00,
  platformRetention: 1.00,
  creditsReceived: 2000, // R$ 19,00 = 1.900 créditos + 100 bônus entrada

  // ⚔️ Sistema PvP
  pvpBetCredits: 900, // equivale a R$ 9,00
  pvpWinnerCredits: 1400, // equivale a R$ 14,00 
  pvpPlatformFeeCredits: 400, // equivale a R$ 4,00

  // 📚 Recompensas de Treino (Atividade)
  trainingRewards: {
    'egito-antigo': {
      base: 2, // ~R$ 0,02
      victory: 3, // ~R$ 0,03  
      excellent: 4 // ~R$ 0,04 (com bônus 20%)
    },
    'mesopotamia': {
      base: 3, // ~R$ 0,03
      victory: 4, // ~R$ 0,04
      excellent: 5 // ~R$ 0,05
    },
    'medieval': {
      base: 4, // ~R$ 0,04
      victory: 5, // ~R$ 0,05
      excellent: 6 // ~R$ 0,06
    },
    'digital': {
      base: 5, // ~R$ 0,05
      victory: 6, // ~R$ 0,06
      excellent: 7 // ~R$ 0,07
    }
  },

  // 🎁 Bônus Misterioso Mensal
  monthlyBonusMax: 2500, // máximo possível (equivale ~R$ 25,00)
  bonusCriteria: {
    dailyActivity: 40, // 40% do peso
    accuracyBonus: 25, // 25% do peso
    erasDiversity: 20, // 20% do peso
    platformTime: 15  // 15% do peso
  },

  // 💸 Sistema de Saque
  withdrawalFeePercent: 5, // 5% de taxa administrativa
  withdrawalMinDays: 30 // mínimo 30 dias para sacar
};

// 🎯 Funções para Cálculos de Créditos
export const calculateTrainingCredits = (
  eraSlug: string, 
  questionsCorrect: number, 
  totalQuestions: number
) => {
  const accuracyPercentage = (questionsCorrect / totalQuestions) * 100;
  const isVictory = accuracyPercentage >= 70;
  const isExcellent = accuracyPercentage >= 90;
  
  const eraRewards = CREDITS_CONFIG.trainingRewards[eraSlug] || 
                     CREDITS_CONFIG.trainingRewards['egito-antigo'];
  
  let baseCredits = isVictory ? eraRewards.victory : eraRewards.base;
  
  // Bônus de 20% para 90%+ acerto
  if (isExcellent) {
    baseCredits = Math.round(baseCredits * 1.20);
  }
  
  return {
    creditsEarned: baseCredits,
    xpEarned: questionsCorrect * 10 + (isVictory ? 50 : 20) + (isExcellent ? 30 : 0),
    bonusApplied: isExcellent,
    accuracyPercentage: Math.round(accuracyPercentage),
    isActivityContribution: true
  };
};

// ⚔️ Recompensas de Arena PvP
export const calculateArenaCredits = (isVictory: boolean) => {
  return {
    creditsEarned: isVictory 
      ? (CREDITS_CONFIG.pvpWinnerCredits - CREDITS_CONFIG.pvpBetCredits) // +500 créditos
      : -CREDITS_CONFIG.pvpBetCredits, // -900 créditos
    xpEarned: isVictory ? 200 : 50,
    betAmount: CREDITS_CONFIG.pvpBetCredits,
    totalPool: CREDITS_CONFIG.pvpBetCredits * 2, // 1.800 créditos
    winnerReceives: CREDITS_CONFIG.pvpWinnerCredits,
    platformFee: CREDITS_CONFIG.pvpPlatformFeeCredits,
    isPvP: true
  };
};

// 🎁 Cálculo do Bônus Misterioso Mensal
export const calculateMonthlyBonus = (userActivity: {
  daysActive: number;
  totalAccuracy: number;
  erasCompleted: number;
  hoursInPlatform: number;
}) => {
  const { bonusCriteria, monthlyBonusMax } = CREDITS_CONFIG;
  
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
  
  // Calcular bônus final
  const bonusCredits = Math.round(monthlyBonusMax * totalScore);
  
  return {
    bonusCredits,
    maxPossible: monthlyBonusMax,
    breakdown: {
      activity: Math.round(activityScore * bonusCriteria.dailyActivity),
      accuracy: Math.round(accuracyScore * bonusCriteria.accuracyBonus),
      diversity: Math.round(diversityScore * bonusCriteria.erasDiversity),
      time: Math.round(timeScore * bonusCriteria.platformTime)
    }
  };
};

// 💸 Cálculo de Saque (Devolução do Valor Pago)
export const calculateWithdrawal = (daysSinceDeposit: number) => {
  const { withdrawalFeePercent, withdrawalMinDays, initialDeposit, platformRetention } = CREDITS_CONFIG;
  
  if (daysSinceDeposit < withdrawalMinDays) {
    return {
      canWithdraw: false,
      daysRemaining: withdrawalMinDays - daysSinceDeposit,
      message: `Saque disponível em ${withdrawalMinDays - daysSinceDeposit} dias`
    };
  }
  
  const withdrawableAmount = initialDeposit - platformRetention; // R$ 19,00
  const fee = withdrawableAmount * (withdrawalFeePercent / 100); // R$ 0,95
  const finalAmount = withdrawableAmount - fee; // R$ 18,05
  
  return {
    canWithdraw: true,
    withdrawableAmount,
    fee,
    finalAmount,
    message: `Disponível para saque: R$ ${finalAmount.toFixed(2)}`
  };
};

// 🎨 Formatação para Display
export const formatCredits = (credits: number): string => {
  return credits.toLocaleString('pt-BR');
};

export const getCreditsDisplayInfo = () => {
  return {
    systemName: "Sistema de Créditos Internos",
    disclaimer: "Créditos não possuem valor monetário fora da plataforma",
    usage: "Use seus créditos para treinos, PvP e conteúdos exclusivos",
    withdrawal: "Devolução do valor pago disponível após 30 dias"
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
