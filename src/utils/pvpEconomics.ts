// ⚔️ Sistema de Economia PvP Meritocrática
// Garante sustentabilidade financeira enquanto recompensa os melhores

export interface PvPEconomics {
  // Custos e Prêmios (em créditos)
  entryFee: number;          // 1.5 créditos para jogar
  winnerPrize: number;       // 2.0 créditos para vencedor
  platformRetention: number; // 0.5 créditos retidos pela plataforma
  
  // Economia do Sistema
  totalPool: number;         // Pool total por partida (3.0 créditos)
  profitMargin: number;      // Margem de lucro (0.5 / 3.0 = 16.67%)
  
  // Limites e Controles
  maxDailyPvP: number;       // Máximo 20 PvPs por usuário/dia
  minCreditsRequired: number; // Mínimo 10 créditos para jogar PvP
}

export interface PvPTransaction {
  transactionId: string;
  userId: string;
  opponentId: string;
  
  // Dados da Partida
  timestamp: string;
  questionsTotal: number;
  userCorrect: number;
  opponentCorrect: number;
  userAccuracy: number;
  opponentAccuracy: number;
  
  // Resultado Financeiro
  userEntryFee: number;
  opponentEntryFee: number;
  winnerId: string | null;    // null = empate
  prizeAmount: number;
  platformRetention: number;
  
  // Estado
  status: 'completed' | 'disputed' | 'refunded';
}

export interface SustainabilityMetrics {
  // Dados de Entrada
  totalUsers: number;
  averagePvPsPerUser: number;
  averageCreditsPerUser: number;
  
  // Fluxos Financeiros
  totalEntryFees: number;     // Total arrecadado em taxas
  totalPrizesAwarded: number; // Total pago em prêmios
  platformRetention: number;  // Total retido pela plataforma
  
  // Sustentabilidade
  netPlatformRevenue: number; // Receita líquida
  breakEvenPoint: number;     // Ponto de equilíbrio (usuários)
  profitMargin: number;       // Margem de lucro (%)
  
  // Alertas
  isSustainable: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

// 🎯 Configuração da economia PvP
export const PVP_ECONOMICS_CONFIG: PvPEconomics = {
  entryFee: 1.5,           // R$ 0,015 (1.5 créditos)
  winnerPrize: 2.0,        // R$ 0,020 (2.0 créditos)
  platformRetention: 0.5,  // R$ 0,005 (0.5 créditos)
  totalPool: 3.0,          // 1.5 + 1.5 = 3.0 créditos por partida
  profitMargin: 16.67,     // 0.5 / 3.0 = 16.67%
  maxDailyPvP: 20,         // Máximo 20 partidas por dia
  minCreditsRequired: 10   // Mínimo 10 créditos para jogar
};

// 💰 Calcular resultado financeiro de uma partida PvP
export const calculatePvPResult = (
  userCorrect: number,
  opponentCorrect: number,
  totalQuestions: number,
  userCredits: number
): {
  canPlay: boolean;
  winnerId: 'user' | 'opponent' | 'tie';
  userCostBenefit: {
    entryFee: number;
    prizeWon: number;
    netResult: number;
  };
  platformRevenue: number;
  error?: string;
} => {
  // Verificar se o usuário pode jogar
  if (userCredits < PVP_ECONOMICS_CONFIG.entryFee + PVP_ECONOMICS_CONFIG.minCreditsRequired) {
    return {
      canPlay: false,
      winnerId: 'tie',
      userCostBenefit: { entryFee: 0, prizeWon: 0, netResult: 0 },
      platformRevenue: 0,
      error: `Créditos insuficientes. Mínimo: ${PVP_ECONOMICS_CONFIG.entryFee + PVP_ECONOMICS_CONFIG.minCreditsRequired} créditos`
    };
  }

  // Determinar vencedor
  let winnerId: 'user' | 'opponent' | 'tie';
  if (userCorrect > opponentCorrect) {
    winnerId = 'user';
  } else if (opponentCorrect > userCorrect) {
    winnerId = 'opponent';
  } else {
    winnerId = 'tie';
  }

  // Calcular custos e benefícios
  const entryFee = PVP_ECONOMICS_CONFIG.entryFee;
  let prizeWon = 0;
  
  if (winnerId === 'user') {
    prizeWon = PVP_ECONOMICS_CONFIG.winnerPrize;
  } else if (winnerId === 'tie') {
    // Em caso de empate, ambos recebem a taxa de volta
    prizeWon = entryFee;
  }

  const netResult = prizeWon - entryFee;
  
  // Receita da plataforma
  let platformRevenue = PVP_ECONOMICS_CONFIG.platformRetention;
  if (winnerId === 'tie') {
    // Em empates, plataforma recebe as duas taxas de retenção
    platformRevenue = PVP_ECONOMICS_CONFIG.platformRetention * 2;
  }

  return {
    canPlay: true,
    winnerId,
    userCostBenefit: {
      entryFee,
      prizeWon,
      netResult
    },
    platformRevenue
  };
};

// 📊 Simular sustentabilidade econômica
export const simulateSustainability = (
  totalUsers: number,
  avgPvPsPerUserPerMonth: number = 8,
  avgUserWinRate: number = 50
): SustainabilityMetrics => {
  // Cálculos básicos
  const totalPvPsPerMonth = totalUsers * avgPvPsPerUserPerMonth;
  const totalEntryFees = totalPvPsPerMonth * PVP_ECONOMICS_CONFIG.entryFee;
  
  // Considerando que cada PvP tem 2 jogadores pagando taxa
  const actualTotalEntryFees = totalEntryFees * 2;
  
  // Prêmios pagos (aproximadamente 50% dos jogadores ganham)
  const winnersCount = totalPvPsPerMonth; // 1 vencedor por partida
  const totalPrizesAwarded = winnersCount * PVP_ECONOMICS_CONFIG.winnerPrize;
  
  // Retenção da plataforma
  const platformRetention = totalPvPsPerMonth * PVP_ECONOMICS_CONFIG.platformRetention;
  
  // Receita líquida
  const netPlatformRevenue = actualTotalEntryFees - totalPrizesAwarded;
  
  // Verificações de sustentabilidade
  const profitMargin = (netPlatformRevenue / actualTotalEntryFees) * 100;
  const isSustainable = netPlatformRevenue > 0 && profitMargin >= 10;
  
  // Cálculo do ponto de equilíbrio
  const breakEvenPoint = Math.ceil(
    totalPrizesAwarded / (PVP_ECONOMICS_CONFIG.entryFee * 2 * avgPvPsPerUserPerMonth)
  );
  
  // Nível de risco
  let riskLevel: 'low' | 'medium' | 'high';
  if (profitMargin >= 15) {
    riskLevel = 'low';
  } else if (profitMargin >= 5) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }
  
  // Recomendações
  const recommendations: string[] = [];
  
  if (!isSustainable) {
    recommendations.push('⚠️ Sistema não sustentável - ajustar taxas ou prêmios');
  }
  
  if (profitMargin < 10) {
    recommendations.push('📉 Margem de lucro baixa - considerar aumentar taxa de retenção');
  }
  
  if (totalUsers < breakEvenPoint * 1.2) {
    recommendations.push('👥 Poucos usuários - focar em crescimento da base');
  }
  
  if (avgPvPsPerUserPerMonth > 15) {
    recommendations.push('🎮 Alta atividade PvP - excelente engajamento');
  }

  return {
    totalUsers,
    averagePvPsPerUser: avgPvPsPerUserPerMonth,
    averageCreditsPerUser: totalUsers > 0 ? totalEntryFees / totalUsers : 0,
    totalEntryFees: actualTotalEntryFees,
    totalPrizesAwarded,
    platformRetention,
    netPlatformRevenue,
    breakEvenPoint,
    profitMargin,
    isSustainable,
    riskLevel,
    recommendations
  };
};

// 🎯 Calcular limite diário de PvP para um usuário
export const calculateDailyPvPLimit = (
  userCredits: number,
  pvpsPlayedToday: number,
  userTier: 'bronze' | 'silver' | 'gold' | 'elite'
): {
  canPlay: boolean;
  remaining: number;
  reason?: string;
  suggestion?: string;
} => {
  // Verificar limite de créditos
  const minCreditsNeeded = PVP_ECONOMICS_CONFIG.entryFee + PVP_ECONOMICS_CONFIG.minCreditsRequired;
  if (userCredits < minCreditsNeeded) {
    return {
      canPlay: false,
      remaining: 0,
      reason: 'Créditos insuficientes',
      suggestion: `Você precisa de pelo menos ${minCreditsNeeded} créditos para jogar PvP`
    };
  }

  // Limite base por tier
  let maxDaily = PVP_ECONOMICS_CONFIG.maxDailyPvP;
  switch (userTier) {
    case 'elite':
      maxDaily = 30; // +50% para usuários elite
      break;
    case 'gold':
      maxDaily = 25; // +25% para usuários gold
      break;
    case 'silver':
      maxDaily = 22; // +10% para usuários silver
      break;
    default:
      maxDaily = 20; // Base para bronze
  }

  // Verificar se atingiu o limite diário
  if (pvpsPlayedToday >= maxDaily) {
    return {
      canPlay: false,
      remaining: 0,
      reason: 'Limite diário atingido',
      suggestion: `Usuários ${userTier} podem jogar até ${maxDaily} PvPs por dia`
    };
  }

  // Calcular quantos PvPs ainda pode jogar baseado nos créditos
  const maxByCredits = Math.floor(
    (userCredits - PVP_ECONOMICS_CONFIG.minCreditsRequired) / PVP_ECONOMICS_CONFIG.entryFee
  );

  const remaining = Math.min(maxDaily - pvpsPlayedToday, maxByCredits);

  return {
    canPlay: remaining > 0,
    remaining,
    suggestion: remaining > 0 
      ? `Você pode jogar mais ${remaining} PvPs hoje`
      : 'Limite diário ou créditos esgotados'
  };
};

// 📈 Projetar receita mensal baseada em cenários
export const projectMonthlyRevenue = (scenarios: {
  conservative: { users: number; avgPvPs: number };
  realistic: { users: number; avgPvPs: number };
  optimistic: { users: number; avgPvPs: number };
}) => {
  const results = {
    conservative: simulateSustainability(scenarios.conservative.users, scenarios.conservative.avgPvPs),
    realistic: simulateSustainability(scenarios.realistic.users, scenarios.realistic.avgPvPs),
    optimistic: simulateSustainability(scenarios.optimistic.users, scenarios.optimistic.avgPvPs)
  };

  return {
    scenarios: results,
    summary: {
      revenueRange: {
        min: results.conservative.netPlatformRevenue,
        expected: results.realistic.netPlatformRevenue,
        max: results.optimistic.netPlatformRevenue
      },
      userRange: {
        min: results.conservative.totalUsers,
        expected: results.realistic.totalUsers,
        max: results.optimistic.totalUsers
      },
      sustainability: {
        conservative: results.conservative.isSustainable,
        realistic: results.realistic.isSustainable,
        optimistic: results.optimistic.isSustainable
      }
    }
  };
};

// 🔄 Processar transação PvP completa
export const processPvPTransaction = (
  userId: string,
  opponentId: string,
  gameResult: {
    userCorrect: number;
    opponentCorrect: number;
    totalQuestions: number;
    userAccuracy: number;
    opponentAccuracy: number;
  }
): PvPTransaction => {
  const calculation = calculatePvPResult(
    gameResult.userCorrect,
    gameResult.opponentCorrect,
    gameResult.totalQuestions,
    1000 // Assumindo que o usuário tem créditos suficientes
  );

  const transaction: PvPTransaction = {
    transactionId: `pvp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    opponentId,
    timestamp: new Date().toISOString(),
    questionsTotal: gameResult.totalQuestions,
    userCorrect: gameResult.userCorrect,
    opponentCorrect: gameResult.opponentCorrect,
    userAccuracy: gameResult.userAccuracy,
    opponentAccuracy: gameResult.opponentAccuracy,
    userEntryFee: PVP_ECONOMICS_CONFIG.entryFee,
    opponentEntryFee: PVP_ECONOMICS_CONFIG.entryFee,
    winnerId: calculation.winnerId === 'user' ? userId : 
              calculation.winnerId === 'opponent' ? opponentId : null,
    prizeAmount: calculation.userCostBenefit.prizeWon,
    platformRetention: calculation.platformRevenue,
    status: 'completed'
  };

  return transaction;
};
