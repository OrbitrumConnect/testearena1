// Novo sistema de créditos - Conversão 100 créditos = R$ 1,00
// Integração com sistema de vidas e PvP

interface NewCreditsEarnedParams {
  battleType: 'training' | 'pvp';
  questionsCorrect: number;
  questionsTotal: number;
  accuracyPercentage: number;
  eraSlug?: string;
  usedExtraLife?: boolean;
}

// Recompensas por era (baseadas no novo sistema)
const ERA_REWARDS = {
  'egito-antigo': { base: 1, victory: 2, excellent: 3 },
  'mesopotamia': { base: 2, victory: 3, excellent: 4 },
  'medieval': { base: 3, victory: 4, excellent: 5 },
  'digital': { base: 4, victory: 5, excellent: 6 }
};

// Função para calcular créditos do novo sistema
export const calculateNewCreditsEarned = (params: NewCreditsEarnedParams): {
  creditsEarned: number;
  creditsSpent: number;
  netCredits: number;
  reason: string;
} => {
  const { battleType, questionsCorrect, questionsTotal, accuracyPercentage, eraSlug = 'egito-antigo', usedExtraLife = false } = params;
  
  if (battleType === 'training') {
    // Sistema de treino com vidas
    const creditsSpent = usedExtraLife ? 10 : 0; // 10 créditos por vida extra
    
    // Recompensas baseadas na era e performance
    const eraRewards = ERA_REWARDS[eraSlug as keyof typeof ERA_REWARDS] || ERA_REWARDS['egito-antigo'];
    let creditsEarned = 0;
    
    if (accuracyPercentage >= 90) {
      creditsEarned = eraRewards.excellent;
    } else if (accuracyPercentage >= 70) {
      creditsEarned = eraRewards.victory;
    } else {
      creditsEarned = eraRewards.base;
    }
    
    return {
      creditsEarned,
      creditsSpent,
      netCredits: creditsEarned - creditsSpent,
      reason: `${accuracyPercentage >= 90 ? 'Excelente' : accuracyPercentage >= 70 ? 'Vitória' : 'Participação'} em ${eraSlug}`
    };
  } else if (battleType === 'pvp') {
    // Sistema PvP
    const entryCost = 50; // 50 créditos para entrar
    const victoryReward = 80; // 80 créditos se ganhar
    const isVictory = accuracyPercentage >= 70; // Considerando vitória com 70%+
    
    return {
      creditsEarned: isVictory ? victoryReward : 0,
      creditsSpent: entryCost,
      netCredits: isVictory ? (victoryReward - entryCost) : -entryCost,
      reason: isVictory ? 'Vitória PvP' : 'Derrota PvP'
    };
  }
  
  return {
    creditsEarned: 0,
    creditsSpent: 0,
    netCredits: 0,
    reason: 'Tipo de batalha não reconhecido'
  };
};

// Função para atualizar créditos na nova assinatura (localStorage demo)
export const updateNewSubscriptionCredits = (
  creditsChange: number,
  description: string
): void => {
  try {
    // Buscar assinatura demo
    const existing = localStorage.getItem('demo_new_subscription');
    if (!existing) return;
    
    const subscription = JSON.parse(existing);
    subscription.credits_balance += creditsChange;
    subscription.updated_at = new Date().toISOString();
    
    // Salvar
    localStorage.setItem('demo_new_subscription', JSON.stringify(subscription));
    
    const action = creditsChange > 0 ? '+' : '';
    console.log(`💰 ${action}${creditsChange} créditos - ${description}! Saldo: ${subscription.credits_balance}`);
    
  } catch (error) {
    console.error('Erro ao atualizar créditos da assinatura:', error);
  }
};

// Função integrada para usar nos treinos - novo sistema
export const handleNewBattleCredits = (params: NewCreditsEarnedParams): {
  creditsEarned: number;
  creditsSpent: number;
  netCredits: number;
  message: string;
} => {
  const result = calculateNewCreditsEarned(params);
  
  // Atualizar créditos na assinatura
  updateNewSubscriptionCredits(result.netCredits, result.reason);
  
  return {
    ...result,
    message: result.netCredits >= 0 
      ? `+${result.netCredits} créditos! ${result.reason}`
      : `${result.netCredits} créditos. ${result.reason}`
  };
};

// Conversão de créditos para reais (display)
export const creditsToReais = (credits: number): string => {
  const value = credits / 100; // 100 créditos = R$ 1,00
  return `R$ ${value.toFixed(2)}`;
};

// Conversão de reais para créditos
export const reaisToCredits = (reais: number): number => {
  return Math.round(reais * 100); // R$ 1,00 = 100 créditos
};

// Função para verificar se pode realizar ação baseada em créditos
export const canAffordAction = (
  currentCredits: number, 
  requiredCredits: number
): {
  canAfford: boolean;
  missing: number;
  missingInReais: string;
} => {
  const missing = Math.max(0, requiredCredits - currentCredits);
  
  return {
    canAfford: currentCredits >= requiredCredits,
    missing,
    missingInReais: creditsToReais(missing)
  };
};
