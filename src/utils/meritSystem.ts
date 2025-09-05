// 🏆 Sistema de Mérito e Ranking - PvP Meritocrático
// Identifica top 5% usuários e calcula bônus por performance

export interface UserMerit {
  userId: string;
  displayName: string;
  
  // Métricas de Performance
  totalPvP: number;           // Total de PvPs jogados
  pvpWins: number;            // Vitórias em PvP
  winRate: number;            // Taxa de vitória (%)
  averageAccuracy: number;    // Precisão média das respostas
  currentStreak: number;      // Sequência atual de vitórias
  maxStreak: number;          // Maior sequência de vitórias
  
  // Métricas de Atividade
  daysActive: number;         // Dias ativos no mês
  totalQuestions: number;     // Total de perguntas respondidas
  totalCorrect: number;       // Total de acertos
  
  // Pontuação de Mérito
  meritScore: number;         // Pontuação final calculada
  rankPosition: number;       // Posição no ranking (1 = melhor)
  isTopPerformer: boolean;    // Top 5% dos usuários
  meritTier: 'bronze' | 'silver' | 'gold' | 'elite'; // Categoria
  
  // Bônus Financeiros
  merit_points: number;    // 1.0 a 1.2 (20% máximo)
  monthlyCreditsEarned: number; // Créditos ganhos no mês
  meritBonus: number;         // Bônus em créditos por mérito
  maxWithdrawal: number;      // Limite máximo de saque
  
  // Timestamps
  lastUpdated: string;
  cycleMonth: string;         // Mês/ano do ciclo (reset mensal)
}

export interface MeritCalculationWeights {
  winRate: number;        // 30% - Taxa de vitória
  accuracy: number;       // 25% - Precisão das respostas
  activity: number;       // 20% - Dias ativos
  streak: number;         // 15% - Sequência de vitórias
  volume: number;         // 10% - Volume de jogos
}

// 🏆 Pesos para cálculo de mérito (soma = 100%)
export const MERIT_WEIGHTS: MeritCalculationWeights = {
  winRate: 30,
  accuracy: 25,
  activity: 20,
  streak: 15,
  volume: 10
};

// 🎯 Configurações do sistema de mérito
export const MERIT_CONFIG = {
  topPerformerPercentage: 5,      // Top 5% são considerados elite
  maxBonusMultiplier: 1.2,        // Bônus máximo de 20%
  minGamesForRanking: 10,         // Mínimo 10 jogos para ranking
  cycleResetDay: 1,               // Reset no dia 1 de cada mês
  
  // Limites por tier
  tiers: {
    elite: { minScore: 85, merit_points: 1.2, color: '#FFD700' },    // Top 5%
    gold: { minScore: 70, merit_points: 1.1, color: '#FFA500' },     // 5-15%
    silver: { minScore: 50, merit_points: 1.05, color: '#C0C0C0' },  // 15-40%
    bronze: { minScore: 0, merit_points: 1.0, color: '#CD7F32' }     // Resto
  }
};

// 🧮 Calcular pontuação de mérito
export const calculateMeritScore = (user: Partial<UserMerit>): number => {
  if (!user.totalPvP || user.totalPvP < MERIT_CONFIG.minGamesForRanking) {
    return 0; // Não qualificado para ranking
  }

  // Normalizar métricas (0-100)
  const normalizedWinRate = Math.min(100, user.winRate || 0);
  const normalizedAccuracy = Math.min(100, user.averageAccuracy || 0);
  const normalizedActivity = Math.min(100, (user.daysActive || 0) / 30 * 100);
  const normalizedStreak = Math.min(100, (user.maxStreak || 0) / 10 * 100);
  const normalizedVolume = Math.min(100, (user.totalPvP || 0) / 50 * 100);

  // Calcular pontuação ponderada
  const meritScore = (
    (normalizedWinRate * MERIT_WEIGHTS.winRate) +
    (normalizedAccuracy * MERIT_WEIGHTS.accuracy) +
    (normalizedActivity * MERIT_WEIGHTS.activity) +
    (normalizedStreak * MERIT_WEIGHTS.streak) +
    (normalizedVolume * MERIT_WEIGHTS.volume)
  ) / 100;

  return Math.round(meritScore * 100) / 100; // 2 casas decimais
};

// 🏅 Determinar tier do usuário
export const calculateUserTier = (meritScore: number): {
  tier: UserMerit['meritTier'];
  merit_points: number;
  color: string;
} => {
  const { tiers } = MERIT_CONFIG;
  
  if (meritScore >= tiers.elite.minScore) {
    return { tier: 'elite', merit_points: tiers.elite.merit_points, color: tiers.elite.color };
  } else if (meritScore >= tiers.gold.minScore) {
    return { tier: 'gold', merit_points: tiers.gold.merit_points, color: tiers.gold.color };
  } else if (meritScore >= tiers.silver.minScore) {
    return { tier: 'silver', merit_points: tiers.silver.merit_points, color: tiers.silver.color };
  } else {
    return { tier: 'bronze', merit_points: tiers.bronze.merit_points, color: tiers.bronze.color };
  }
};

// 🎯 Identificar top performers (top 5%)
export const identifyTopPerformers = (users: UserMerit[]): UserMerit[] => {
  // Filtrar usuários qualificados
  const qualifiedUsers = users.filter(user => 
    user.totalPvP >= MERIT_CONFIG.minGamesForRanking && user.meritScore > 0
  );

  // Ordenar por pontuação de mérito (maior primeiro)
  const sortedUsers = qualifiedUsers.sort((a, b) => b.meritScore - a.meritScore);

  // Calcular quantos usuários são top 5%
  const topCount = Math.max(1, Math.ceil(sortedUsers.length * (MERIT_CONFIG.topPerformerPercentage / 100)));

  // Marcar top performers e atualizar posições
  return sortedUsers.map((user, index) => ({
    ...user,
    rankPosition: index + 1,
    isTopPerformer: index < topCount
  }));
};

// 💰 Calcular bônus de mérito em créditos
export const calculateMeritBonus = (user: UserMerit): {
  baseCredits: number;
  bonusCredits: number;
  totalCredits: number;
  maxWithdrawal: number;
} => {
  const baseCredits = user.monthlyCreditsEarned || 0;
  
  // Bônus apenas para usuários qualificados
  let bonusCredits = 0;
  if (user.totalPvP >= MERIT_CONFIG.minGamesForRanking) {
    bonusCredits = Math.round(baseCredits * (user.merit_points - 1));
  }

  const totalCredits = baseCredits + bonusCredits;
  
  // Limite de saque: 80% dos créditos totais
  const maxWithdrawal = Math.round(totalCredits * 0.8);

  return {
    baseCredits,
    bonusCredits,
    totalCredits,
    maxWithdrawal
  };
};

// 📊 Gerar relatório de mérito
export const generateMeritReport = (users: UserMerit[]): {
  totalUsers: number;
  qualifiedUsers: number;
  topPerformers: number;
  averageMeritScore: number;
  totalBonusCredits: number;
  tierDistribution: Record<UserMerit['meritTier'], number>;
} => {
  const qualifiedUsers = users.filter(user => user.totalPvP >= MERIT_CONFIG.minGamesForRanking);
  const topPerformers = users.filter(user => user.isTopPerformer);
  
  const averageMeritScore = qualifiedUsers.length > 0 
    ? qualifiedUsers.reduce((sum, user) => sum + user.meritScore, 0) / qualifiedUsers.length 
    : 0;

  const totalBonusCredits = users.reduce((sum, user) => sum + (user.meritBonus || 0), 0);

  const tierDistribution = {
    bronze: users.filter(user => user.meritTier === 'bronze').length,
    silver: users.filter(user => user.meritTier === 'silver').length,
    gold: users.filter(user => user.meritTier === 'gold').length,
    elite: users.filter(user => user.meritTier === 'elite').length
  };

  return {
    totalUsers: users.length,
    qualifiedUsers: qualifiedUsers.length,
    topPerformers: topPerformers.length,
    averageMeritScore: Math.round(averageMeritScore * 100) / 100,
    totalBonusCredits,
    tierDistribution
  };
};

// 🔄 Atualizar mérito de um usuário
export const updateUserMerit = (currentUser: Partial<UserMerit>, newData: {
  pvpResult?: { won: boolean; accuracy: number };
  questionsAnswered?: number;
  correctAnswers?: number;
  creditsEarned?: number;
}): UserMerit => {
  const updated: UserMerit = {
    userId: currentUser.userId || '',
    displayName: currentUser.displayName || 'Usuário',
    totalPvP: currentUser.totalPvP || 0,
    pvpWins: currentUser.pvpWins || 0,
    winRate: 0,
    averageAccuracy: currentUser.averageAccuracy || 0,
    currentStreak: currentUser.currentStreak || 0,
    maxStreak: currentUser.maxStreak || 0,
    daysActive: currentUser.daysActive || 0,
    totalQuestions: currentUser.totalQuestions || 0,
    totalCorrect: currentUser.totalCorrect || 0,
    meritScore: 0,
    rankPosition: 0,
    isTopPerformer: false,
    meritTier: 'bronze',
    monthlyCreditsEarned: currentUser.monthlyCreditsEarned || 0,
    meritBonus: 0,
    maxWithdrawal: 0,
    lastUpdated: new Date().toISOString(),
    cycleMonth: new Date().toISOString().substring(0, 7) // YYYY-MM
  };

  // Atualizar dados de PvP
  if (newData.pvpResult) {
    updated.totalPvP += 1;
    if (newData.pvpResult.won) {
      updated.pvpWins += 1;
      updated.currentStreak += 1;
      updated.maxStreak = Math.max(updated.maxStreak, updated.currentStreak);
    } else {
      updated.currentStreak = 0;
    }
    
    // Recalcular taxa de vitória
    updated.winRate = (updated.pvpWins / updated.totalPvP) * 100;
    
    // Atualizar precisão média
    const totalAccuracy = (currentUser.averageAccuracy || 0) * (currentUser.totalPvP || 0) + newData.pvpResult.accuracy;
    updated.averageAccuracy = totalAccuracy / updated.totalPvP;
  }

  // Atualizar perguntas respondidas
  if (newData.questionsAnswered && newData.correctAnswers !== undefined) {
    updated.totalQuestions += newData.questionsAnswered;
    updated.totalCorrect += newData.correctAnswers;
  }

  // Atualizar créditos
  if (newData.creditsEarned) {
    updated.monthlyCreditsEarned += newData.creditsEarned;
  }

  // Recalcular pontuação de mérito
  updated.meritScore = calculateMeritScore(updated);

  // Determinar tier e bônus
  const tierInfo = calculateUserTier(updated.meritScore);
  updated.meritTier = tierInfo.tier;
  updated.merit_points = tierInfo.merit_points;

  // Calcular bônus de mérito
  const meritCalc = calculateMeritBonus(updated);
  updated.meritBonus = meritCalc.bonusCredits;
  updated.maxWithdrawal = meritCalc.maxWithdrawal;

  return updated;
};

// 🔄 Verificar se precisa resetar ciclo mensal
export const shouldResetMonthlyCycle = (user: UserMerit): boolean => {
  const currentMonth = new Date().toISOString().substring(0, 7);
  return user.cycleMonth !== currentMonth;
};

// 🔄 Resetar dados mensais do usuário
export const resetMonthlyCycle = (user: UserMerit): UserMerit => {
  return {
    ...user,
    totalPvP: 0,
    pvpWins: 0,
    winRate: 0,
    merit_points: 0,
    daysActive: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    monthlyCreditsEarned: 0,
    meritScore: 0,
    rankPosition: 0,
    isTopPerformer: false,
    meritTier: 'bronze',
    meritBonus: 0,
    maxWithdrawal: 0,
    cycleMonth: new Date().toISOString().substring(0, 7),
    lastUpdated: new Date().toISOString()
  };
};
