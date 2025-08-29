// Utilitário para exibir contribuições para ROI mensal por era
export const getRewardDisplayValues = (eraSlug: string) => {
  const contributionValues: Record<string, { excellent: string; victory: string; base: string }> = {
    'egito-antigo': { excellent: '0,036', victory: '0,030', base: '0,020' },
    'mesopotamia': { excellent: '0,048', victory: '0,040', base: '0,030' },
    'medieval': { excellent: '0,060', victory: '0,050', base: '0,040' },
    'digital': { excellent: '0,072', victory: '0,060', base: '0,050' }
  };
  
  return contributionValues[eraSlug] || contributionValues['egito-antigo'];
};

// Informações do sistema de créditos para display
export const getFinancialSystemInfo = () => {
  return {
    initialDeposit: '2.000 créditos',
    platformFee: 'Taxa plataforma incluída',
    playableAmount: '1.900 créditos',
    activityRewards: 'Recompensas por Atividade',
    monthlyTarget: 'Meta de Atividade Mensal',
    dailyTarget: '73 créditos',
    
    // PvP Arena
    pvpBet: '900 créditos',
    pvpWinnerGets: '+500 créditos',
    pvpLoserLoses: '-900 créditos',
    pvpPoolTotal: '1.800 créditos',
    platformRevenue: '400 créditos'
  };
};
