import { useState, useEffect } from 'react';

interface FreeTrainingData {
  date: string;
  eras: {
    'egito-antigo': number; // Mudando de boolean para number para contar treinos
    'mesopotamia': number;
    'medieval': number;
    'digital': number;
  };
}

export const useFreeTrainingLimit = (eraSlug: string) => {
  // Proteção robusta para eraSlug undefined
  const safeEraSlug = eraSlug || 'egito-antigo';
  
  // Debug: Log do eraSlug recebido
  console.log('🔍 useFreeTrainingLimit chamado com eraSlug:', eraSlug, 'safeEraSlug:', safeEraSlug);

  const [canTrain, setCanTrain] = useState<boolean>(true);
  const [trainingCount, setTrainingCount] = useState<number>(0);
  const [maxTrainings] = useState<number>(8); // 8 treinos totais por dia para FREE
  const [eraTrainingCount, setEraTrainingCount] = useState<number>(0); // Contador específico da era
  const [remainingTrainings, setRemainingTrainings] = useState<number>(8);
  const [remainingEraTrainings, setRemainingEraTrainings] = useState<number>(2);

  useEffect(() => {
    checkDailyLimit();
  }, [safeEraSlug]);

  // Proteção extra para garantir que os valores nunca sejam NaN
  useEffect(() => {
    if (isNaN(remainingTrainings) || remainingTrainings < 0) {
      setRemainingTrainings(8);
    }
    if (isNaN(remainingEraTrainings) || remainingEraTrainings < 0) {
      setRemainingEraTrainings(2);
    }
    if (isNaN(trainingCount) || trainingCount < 0) {
      setTrainingCount(0);
    }
    if (isNaN(eraTrainingCount) || eraTrainingCount < 0) {
      setEraTrainingCount(0);
    }
  }, [remainingTrainings, remainingEraTrainings, trainingCount, eraTrainingCount]);

  const checkDailyLimit = () => {
    try {
      // PROTEÇÃO EXTRA - Garantir que safeEraSlug é válido
      if (!safeEraSlug || typeof safeEraSlug !== 'string') {
        console.error('❌ safeEraSlug inválido, usando fallback:', safeEraSlug);
        return;
      }
      
      // Debug: Log do eraSlug na função
      console.log('🔍 checkDailyLimit executado com safeEraSlug:', safeEraSlug);
      
      const today = new Date().toDateString();
      const storedData = localStorage.getItem('free_training_limit');
      
      if (storedData) {
        const trainingData: FreeTrainingData = JSON.parse(storedData);
        
        if (trainingData.date === today) {
          // Mesmo dia - verificar se pode treinar nesta era (máximo 2 por era)
          const eraCount = trainingData.eras[safeEraSlug as keyof typeof trainingData.eras] || 0;
          setEraTrainingCount(eraCount);
          
          // Pode treinar se: menos de 2 treinos nesta era E menos de 8 treinos totais
          const totalTrainings = Object.values(trainingData.eras).reduce((sum, count) => sum + (count || 0), 0);
          const canTrainInEra = eraCount < 2; // Máximo 2 por era
          const canTrainTotal = totalTrainings < 8; // Máximo 8 total
          
          setCanTrain(canTrainInEra && canTrainTotal);
          setTrainingCount(totalTrainings);
          
          // Calcular valores restantes com proteção extra
          const remainingTotal = Math.max(0, maxTrainings - (totalTrainings || 0));
          const remainingEra = Math.max(0, 2 - (eraCount || 0));
          
          setRemainingTrainings(remainingTotal);
          setRemainingEraTrainings(remainingEra);
          
          console.log(`🔍 FREE: Estado atualizado - Era: ${eraCount}/2, Total: ${totalTrainings}/8, Restantes: ${remainingTotal}, Era restantes: ${remainingEra}`);
        } else {
          // Novo dia - resetar contador
          resetDailyCount();
        }
      } else {
        // Primeira vez - inicializar
        resetDailyCount();
      }
    } catch (error) {
      console.error('Erro inesperado na função checkDailyLimit:', error);
      resetDailyCount(); // Fallback para garantir que não quebre
    }
  };

  const resetDailyCount = () => {
    const today = new Date().toDateString();
    const newData: FreeTrainingData = {
      date: today,
      eras: {
        'egito-antigo': 0,
        'mesopotamia': 0,
        'medieval': 0,
        'digital': 0
      }
    };
    
    localStorage.setItem('free_training_limit', JSON.stringify(newData));
    setTrainingCount(0);
    setEraTrainingCount(0);
    setCanTrain(true);
    setRemainingTrainings(maxTrainings);
    setRemainingEraTrainings(2);
  };

  const incrementTrainingCount = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('free_training_limit');
    
    if (storedData) {
      const trainingData: FreeTrainingData = JSON.parse(storedData);
      
      if (trainingData.date === today) {
        // Incrementar contador desta era
        trainingData.eras[safeEraSlug as keyof typeof trainingData.eras] = 
          (trainingData.eras[safeEraSlug as keyof typeof trainingData.eras] || 0) + 1;
        
        // Contar total de treinos hoje
        const totalTrainings = Object.values(trainingData.eras).reduce((sum, count) => sum + (count || 0), 0);
        const currentEraCount = trainingData.eras[safeEraSlug as keyof typeof trainingData.eras];
        
        localStorage.setItem('free_training_limit', JSON.stringify(trainingData));
        setTrainingCount(totalTrainings);
        setEraTrainingCount(currentEraCount);
        
        // Verificar se ainda pode treinar
        const canTrainInEra = currentEraCount < 2; // Máximo 2 por era
        const canTrainTotal = totalTrainings < 8; // Máximo 8 total
        setCanTrain(canTrainInEra && canTrainTotal);
        
        // Atualizar valores restantes com proteção extra
        const remainingTotal = Math.max(0, maxTrainings - (totalTrainings || 0));
        const remainingEra = Math.max(0, 2 - (currentEraCount || 0));
        setRemainingTrainings(remainingTotal);
        setRemainingEraTrainings(remainingEra);

        console.log(`🎯 FREE: Treino ${safeEraSlug} realizado! ${currentEraCount}/2 nesta era, ${totalTrainings}/8 total hoje`);
      }
    }
  };

  const resetTrainingCount = () => {
    resetDailyCount();
    console.log('🔄 Contador de treinamentos FREE resetado');
  };

  return {
    trainingCount,
    canTrain,
    maxTrainings,
    remainingTrainings,
    eraTrainingCount,
    remainingEraTrainings,
    incrementTrainingCount,
    resetTrainingCount,
    checkDailyLimit
  };
};
