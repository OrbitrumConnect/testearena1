// Sistema Financeiro Arena of Wisdom Wars
// ROI Fixo + PvP + Taxa de Retenção

export interface FinancialConfig {
  // Sistema de Recompensas por Atividade
  initialDeposit: number; // R$ 20,00
  platformFee: number; // R$ 1,00 (taxa da plataforma)
  playableAmount: number; // R$ 19,00
  monthlyActivityTarget: number; // Meta de atividade mensal
  maxMonthlyRewards: number; // Máximo de recompensas mensais
  dailyActivityTarget: number; // Meta diária de atividade

  // PvP Arena
  pvpBetAmount: number; // R$ 9,00 por jogador
  pvpPoolTotal: number; // R$ 18,00 total
  pvpWinnerReceives: number; // R$ 14,00
  pvpLoserLoses: number; // R$ 9,00
  pvpPlatformRevenue: number; // R$ 4,00

  // Limites e Controles
  maxDailyTraining: number; // 3 treinamentos/dia
  trainingCooldown: number; // 24h entre resets
}

export const FINANCIAL_CONFIG: FinancialConfig = {
  // Sistema de Recompensas por Atividade
  initialDeposit: 20.00,
  platformFee: 1.00,
  playableAmount: 19.00,
  monthlyActivityTarget: 30, // 30 dias de atividade
  maxMonthlyRewards: 22.00, // Máximo possível em recompensas
  dailyActivityTarget: 0.73, // Meta diária sugerida

  // PvP
  pvpBetAmount: 9.00,
  pvpPoolTotal: 18.00,
  pvpWinnerReceives: 14.00,
  pvpLoserLoses: 9.00,
  pvpPlatformRevenue: 4.00,

  // Controles
  maxDailyTraining: 3,
  trainingCooldown: 24 * 60 * 60 * 1000 // 24h em ms
};

// Cálculo de recompensas mensais por atividade
export const calculateMonthlyRewards = (daysActive: number): number => {
  const maxDays = FINANCIAL_CONFIG.monthlyActivityTarget;
  const dailyTarget = FINANCIAL_CONFIG.dailyActivityTarget; // R$ 0,73/dia
  return Math.min(daysActive * dailyTarget, FINANCIAL_CONFIG.maxMonthlyRewards);
};

// Meta diária de atividade sugerida
export const getDailyActivityTarget = (): number => {
  return FINANCIAL_CONFIG.dailyActivityTarget; // R$ 0,73/dia
};

// Sistema de treinamento como contribuição para recompensas
export const getTrainingReward = (eraSlug: string, accuracy: number): number => {
  // Treinamento contribui para meta de atividade mensal
  // Valores simbólicos para feedback do jogador
  const baseValues: Record<string, number> = {
    'egito-antigo': 0.02,
    'mesopotamia': 0.03,
    'medieval': 0.04,
    'digital': 0.05
  };

  const base = baseValues[eraSlug] || 0.02;
  
  if (accuracy >= 90) return base * 1.5; // Bônus excelência
  if (accuracy >= 70) return base * 1.2; // Bônus vitória
  return base; // Base
};

// Verificar se pode fazer PvP (tem saldo suficiente)
export const canPlayPvP = (currentBalance: number): boolean => {
  return currentBalance >= FINANCIAL_CONFIG.pvpBetAmount;
};

// Processar resultado de PvP
export const processPvPResult = (isWinner: boolean): {
  balanceChange: number;
  platformEarning: number;
  description: string;
} => {
  if (isWinner) {
    return {
      balanceChange: FINANCIAL_CONFIG.pvpWinnerReceives - FINANCIAL_CONFIG.pvpBetAmount, // +R$ 5,00
      platformEarning: FINANCIAL_CONFIG.pvpPlatformFee,
      description: `Vitória PvP: +R$ ${(FINANCIAL_CONFIG.pvpWinnerReceives - FINANCIAL_CONFIG.pvpBetAmount).toFixed(2)}`
    };
  } else {
    return {
      balanceChange: -FINANCIAL_CONFIG.pvpBetAmount, // -R$ 9,00
      platformEarning: FINANCIAL_CONFIG.pvpPlatformFee,
      description: `Derrota PvP: -R$ ${FINANCIAL_CONFIG.pvpBetAmount.toFixed(2)}`
    };
  }
};

// Simulação de números da plataforma
export const getPlatformStats = (activeUsers: number, dailyBattles: number) => {
  const monthlyRewardsCost = activeUsers * 2.00; // Custo estimado de recompensas
  const monthlyPlatformFees = activeUsers * FINANCIAL_CONFIG.platformFee; // Receita taxas
  const monthlyPvPRevenue = dailyBattles * 30 * FINANCIAL_CONFIG.pvpPlatformRevenue; // Receita PvP
  
  const totalRevenue = monthlyPlatformFees + monthlyPvPRevenue;
  const totalCosts = monthlyRewardsCost;
  const netProfit = totalRevenue - totalCosts;

  return {
    activeUsers,
    dailyBattles,
    monthlyRewardsCost,
    monthlyPlatformFees,
    monthlyPvPRevenue,
    totalRevenue,
    totalCosts,
    netProfit,
    profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) : 0
  };
};
