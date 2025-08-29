// Utilitários para balanceamento do jogo

export const calculateHpDamage = (totalQuestions: number): number => {
  // Calcular dano por pergunta para que o jogo termine exatamente quando as perguntas acabarem
  // HP base: 100, então cada resposta errada deve causar 100/totalQuestions de dano
  return Math.ceil(100 / totalQuestions);
};

export const getEraQuestionCount = (eraSlug: string): number => {
  const questionCounts: Record<string, number> = {
    'egito-antigo': 5,
    'mesopotamia': 10,
    'medieval': 5,
    'digital': 25
  };
  
  return questionCounts[eraSlug] || 5;
};

// Sistema de ROI Fixo - Treinamentos contribuem para meta mensal
export const getTrainingRewards = (eraSlug: string, questionsCorrect: number, totalQuestions: number) => {
  const accuracyPercentage = (questionsCorrect / totalQuestions) * 100;
  const isWin = accuracyPercentage >= 70; // 70% para ganhar
  const isPerfect = accuracyPercentage >= 90; // 90% para bônus
  
  // Valores simbólicos - contribuição para ROI mensal
  const contributionValues: Record<string, { max: number; min: number }> = {
    'egito-antigo': { max: 0.03, min: 0.02 },     // Contribuição 2-3 créditos
    'mesopotamia': { max: 0.04, min: 0.03 },      // Contribuição 3-4 créditos
    'medieval': { max: 0.05, min: 0.04 },         // Contribuição 4-5 créditos
    'digital': { max: 0.06, min: 0.05 }           // Contribuição 5-6 créditos
  };
  
  const rewards = contributionValues[eraSlug] || contributionValues['egito-antigo'];
  let baseContribution = isWin ? rewards.max : rewards.min;
  
  // Bônus de 20% para 90% ou mais de acerto
  if (isPerfect) {
    baseContribution = baseContribution * 1.20;
  }
  
  return {
    moneyEarned: baseContribution,
    xpEarned: questionsCorrect * 10 + (isWin ? 50 : 20) + (isPerfect ? 30 : 0), // XP extra para 90%
    bonusApplied: isPerfect,
    accuracyPercentage: Math.round(accuracyPercentage),
    isROIContribution: true // Flag para indicar que é contribuição para ROI
  };
};

// Arena - Sistema PvP: Aposta R$ 9,00, Vencedor R$ 14,00, Plataforma R$ 4,00
export const getArenaRewards = (isVictory: boolean) => {
  const betAmount = 9.00;
  const winnerReceives = 14.00;
  const platformFee = 4.00;
  
  return {
    moneyEarned: isVictory ? (winnerReceives - betAmount) : -betAmount, // +R$ 5,00 ou -R$ 9,00
    xpEarned: isVictory ? 200 : 50,
    betAmount: betAmount,
    totalPool: betAmount * 2, // R$ 18,00
    winnerReceives: winnerReceives,
    platformFee: platformFee,
    isPvP: true
  };
};
