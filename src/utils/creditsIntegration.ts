// Novo sistema de créditos - Sistema de 3 Planos
// 🎯 R$ 1,00 = 100 créditos (conversão interna, não exibida)
// 🏆 ROI máximo: 400% anual (100% por trimestre)

import { PlanType, calculateTrainingCredits, calculateArenaCredits, PLAN_CONFIGS } from './creditsSystem';

interface NewCreditsEarnedParams {
  battleType: 'training' | 'pvp';
  questionsCorrect: number;
  questionsTotal: number;
  accuracyPercentage: number;
  eraSlug?: string;
  usedExtraLife?: boolean;
  planType?: PlanType; // Novo: tipo do plano do usuário
}

// 📊 Sistema agora usa PLAN_CONFIGS do creditsSystem.ts
// Removido ERA_REWARDS antigo - agora baseado em planos

// Função para calcular créditos com sistema de planos
export const calculateNewCreditsEarned = (params: NewCreditsEarnedParams): {
  creditsEarned: number;
  creditsSpent: number;
  netCredits: number;
  reason: string;
  planType: PlanType;
} => {
  const { 
    battleType, 
    questionsCorrect, 
    questionsTotal, 
    accuracyPercentage, 
    eraSlug = 'egito-antigo', 
    usedExtraLife = false,
    planType = 'basic' // Default para basic se não informado
  } = params;
  
  if (battleType === 'training') {
    // Sistema de treino com vidas e planos
    const creditsSpent = usedExtraLife ? 10 : 0; // 10 créditos por vida extra
    
    // Usar sistema de planos para calcular recompensas
    const trainingResult = calculateTrainingCredits(planType, eraSlug, questionsCorrect, questionsTotal);
    
    return {
      creditsEarned: trainingResult.creditsEarned,
      creditsSpent,
      netCredits: trainingResult.creditsEarned - creditsSpent,
      reason: `${trainingResult.bonusApplied ? 'Excelente' : accuracyPercentage >= 70 ? 'Vitória' : 'Participação'} em ${eraSlug} (${trainingResult.planType})`,
      planType: planType
    };
  } else if (battleType === 'pvp') {
    // Sistema PvP baseado no plano
    const isVictory = accuracyPercentage >= 70;
    const arenaResult = calculateArenaCredits(planType, isVictory);
    
    return {
      creditsEarned: isVictory ? arenaResult.winnerReceives : 0,
      creditsSpent: arenaResult.betAmount,
      netCredits: arenaResult.creditsEarned,
      reason: `${isVictory ? 'Vitória' : 'Derrota'} PvP (${planType})`,
      planType: planType
    };
  }
  
  return {
    creditsEarned: 0,
    creditsSpent: 0,
    netCredits: 0,
    reason: 'Tipo de batalha não reconhecido',
    planType: planType
  };
};

// Função para atualizar créditos na assinatura (localStorage demo)
export const updateNewSubscriptionCredits = (
  creditsChange: number,
  description: string,
  planType?: PlanType
): void => {
  try {
    // Buscar assinatura demo
    const existing = localStorage.getItem('demo_new_subscription');
    if (!existing) {
      // Criar assinatura demo padrão se não existir
      const defaultPlan = planType || 'basic';
      const planConfig = PLAN_CONFIGS[defaultPlan];
      
      const newSubscription = {
        id: 'demo-subscription',
        user_id: 'demo-user',
        plan_type: defaultPlan,
        plan_value: planConfig.initialDeposit,
        credits_balance: planConfig.creditsReceived + creditsChange,
        credits_initial: planConfig.creditsReceived,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('demo_new_subscription', JSON.stringify(newSubscription));
      console.log(`💰 Assinatura criada: ${defaultPlan.toUpperCase()} - ${creditsChange} créditos!`);
      return;
    }
    
    const subscription = JSON.parse(existing);
    subscription.credits_balance += creditsChange;
    subscription.updated_at = new Date().toISOString();
    
    // Salvar
    localStorage.setItem('demo_new_subscription', JSON.stringify(subscription));
    
    const action = creditsChange > 0 ? '+' : '';
    console.log(`💰 ${action}${creditsChange} créditos - ${description} [${subscription.plan_type.toUpperCase()}]! Saldo: ${subscription.credits_balance}`);
    
  } catch (error) {
    console.error('Erro ao atualizar créditos da assinatura:', error);
  }
};

// Função integrada para usar nos treinos - sistema com planos
export const handleNewBattleCredits = (params: NewCreditsEarnedParams): {
  creditsEarned: number;
  creditsSpent: number;
  netCredits: number;
  message: string;
  planType: PlanType;
} => {
  const result = calculateNewCreditsEarned(params);
  
  // Atualizar créditos na assinatura
  updateNewSubscriptionCredits(result.netCredits, result.reason, result.planType);
  
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

// Função para obter plano do usuário (localStorage demo)
export const getUserPlan = (): PlanType => {
  try {
    const subscription = localStorage.getItem('demo_new_subscription');
    if (subscription) {
      const parsed = JSON.parse(subscription);
      return parsed.plan_type as PlanType;
    }
  } catch (error) {
    console.error('Erro ao buscar plano do usuário:', error);
  }
  return 'basic'; // Default
};

// Função para obter valores do PvP baseados no plano do usuário
export const getPvPValues = (planType?: PlanType) => {
  const userPlan = planType || getUserPlan();
  const planConfig = PLAN_CONFIGS[userPlan];
  
  return {
    betAmount: planConfig.pvpBetCredits,
    winnerReceives: planConfig.pvpWinnerCredits,
    totalPool: planConfig.pvpBetCredits * 2,
    netWin: planConfig.pvpWinnerCredits - planConfig.pvpBetCredits,
    netLoss: -planConfig.pvpBetCredits,
    planType: userPlan
  };
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
