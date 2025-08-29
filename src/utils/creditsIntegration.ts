// Utilitário para integrar o sistema de créditos de percepção
// sem quebrar os hooks existentes

interface CreditsEarnedParams {
  battleType: 'training' | 'pvp' | 'tournament';
  questionsCorrect: number;
  questionsTotal: number;
  accuracyPercentage: number;
}

// Função para calcular créditos baseado no tipo de atividade
export const calculateCreditsEarned = (params: CreditsEarnedParams): number => {
  const { battleType, questionsCorrect, accuracyPercentage } = params;
  
  // Base de créditos por tipo de atividade
  let baseCredits = 0;
  
  switch (battleType) {
    case 'training':
      baseCredits = 10; // 10 créditos base por treino
      break;
    case 'pvp':
      baseCredits = 15; // 15 créditos base por PvP
      break;
    case 'tournament':
      baseCredits = 50; // 50 créditos base por torneio
      break;
  }
  
  // Bonus baseado na precisão (até 50% extra)
  const accuracyBonus = Math.floor((accuracyPercentage / 100) * baseCredits * 0.5);
  
  // Bonus por respostas corretas
  const correctAnswersBonus = questionsCorrect * 2;
  
  const totalCredits = baseCredits + accuracyBonus + correctAnswersBonus;
  
  return Math.max(5, totalCredits); // Mínimo 5 créditos sempre
};

// Função para atualizar créditos no localStorage
export const updateCreditsPerception = (
  battleType: 'training' | 'pvp' | 'tournament',
  creditsEarned: number
): void => {
  try {
    // Buscar dados existentes
    const existing = localStorage.getItem('credits_perception');
    let data = existing ? JSON.parse(existing) : {
      totalCredits: 0,
      perceptionValue: 0,
      sacableValue: 20.00,
      creditsFromTraining: 0,
      creditsFromPvP: 0,
      creditsFromTournaments: 0
    };
    
    // Atualizar baseado no tipo
    switch (battleType) {
      case 'training':
        data.creditsFromTraining += creditsEarned;
        break;
      case 'pvp':
        data.creditsFromPvP += creditsEarned;
        break;
      case 'tournament':
        data.creditsFromTournaments += creditsEarned;
        break;
    }
    
    // Recalcular totais
    data.totalCredits = data.creditsFromTraining + data.creditsFromPvP + data.creditsFromTournaments;
    data.perceptionValue = data.totalCredits * 0.05; // R$ 0,05 por crédito
    
    // Salvar
    localStorage.setItem('credits_perception', JSON.stringify(data));
    
    console.log(`💰 +${creditsEarned} créditos de ${battleType}! Total: ${data.totalCredits}`);
    
  } catch (error) {
    console.error('Erro ao atualizar créditos:', error);
  }
};

// Função integrada para usar nos treinos
export const handleBattleCredits = (params: CreditsEarnedParams): number => {
  const creditsEarned = calculateCreditsEarned(params);
  updateCreditsPerception(params.battleType, creditsEarned);
  return creditsEarned;
};
