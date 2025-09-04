import { useState, useEffect } from 'react';

interface FreeTrainingData {
  date: string;
  eras: {
    'egito-antigo': number;
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
  const [maxTrainings] = useState<number>(8); // 4 eras × 2 treinos = 8 treinos/dia para FREE

  useEffect(() => {
    checkDailyLimit();
  }, [safeEraSlug]);

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
          // Mesmo dia - verificar se já treinou nesta era (máximo 2x)
          const eraTrainingCount = trainingData.eras[safeEraSlug as keyof typeof trainingData.eras] || 0;
          const canTrainInEra = eraTrainingCount < 2;
          setCanTrain(canTrainInEra);
          
          // Contar quantas eras já treinou hoje
          const trainedEras = Object.values(trainingData.eras).reduce((sum, count) => sum + count, 0);
          setTrainingCount(trainedEras);
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
    setCanTrain(true);
  };

  const incrementTrainingCount = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('free_training_limit');
    
    if (storedData) {
      const trainingData: FreeTrainingData = JSON.parse(storedData);
      
      if (trainingData.date === today) {
        // Marcar esta era como treinada hoje
        trainingData.eras[safeEraSlug as keyof typeof trainingData.eras] = (trainingData.eras[safeEraSlug as keyof typeof trainingData.eras] || 0) + 1;
        
        // Contar quantas eras já treinou hoje
        const trainedEras = Object.values(trainingData.eras).reduce((sum, count) => sum + count, 0);
        
        localStorage.setItem('free_training_limit', JSON.stringify(trainingData));
        setTrainingCount(trainedEras);
        
        // Verificar se ainda pode treinar nesta era
        const eraTrainingCount = trainingData.eras[safeEraSlug as keyof typeof trainingData.eras];
        setCanTrain(eraTrainingCount < 2);
        
        console.log(`🎯 FREE: Treino ${safeEraSlug} realizado! ${eraTrainingCount}/2 treinos nesta era, ${trainedEras}/8 total hoje`);
      }
    }
  };

  const getRemainingTrainings = (): number => {
    return Math.max(0, maxTrainings - trainingCount);
  };

  const resetTrainingCount = () => {
    resetDailyCount();
    console.log('🔄 Contador de treinamentos FREE resetado');
  };

  return {
    trainingCount,
    canTrain,
    maxTrainings,
    remainingTrainings: getRemainingTrainings(),
    incrementTrainingCount,
    resetTrainingCount,
    checkDailyLimit
  };
};
