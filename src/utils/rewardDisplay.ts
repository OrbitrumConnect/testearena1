// Utilitário para exibir recompensas do sistema balanceado (100 créditos = R$ 1,00)
export const getRewardDisplayValues = (eraSlug: string) => {
  const rewardValues: Record<string, { excellent: string; victory: string; base: string }> = {
    'egito-antigo': { excellent: '4 créditos', victory: '2 créditos', base: '1 crédito' },
    'mesopotamia': { excellent: '8 créditos', victory: '4 créditos', base: '2 créditos' },
    'medieval': { excellent: '12 créditos', victory: '6 créditos', base: '3 créditos' },
    'digital': { excellent: '16 créditos', victory: '8 créditos', base: '4 créditos' }
  };
  
  return rewardValues[eraSlug] || rewardValues['egito-antigo'];
};

// Informações do novo sistema financeiro para display
export const getFinancialSystemInfo = () => {
  return {
    // Sistema de Assinatura
    subscriptionCycle: 'Ciclo de 3 meses com desconto',
    month1: 'R$ 5,00 → 400 créditos',
    month2: 'R$ 3,50 → 280 créditos',
    month3: 'R$ 2,00 → 160 créditos',
    conversion: '100 créditos = R$ 1,00',
    
    // Sistema de Vidas
    livesPerDay: '3 vidas grátis/dia',
    extraLifeCost: '10 créditos/vida',
    resetTime: 'Reset à meia-noite',
    
    // PvP Arena
    pvpEntry: '50 créditos',
    pvpVictory: '80 créditos',
    pvpProfit: '+30 créditos (vitória)',
    pvpLoss: '-50 créditos (derrota)',
    
    // Sistema de Saque
    minWithdrawal: 'R$ 2,00 (200 créditos)',
    withdrawalFee: '10% taxa de saque',
    conversionRate: '100 créditos = R$ 1,00'
  };
};
