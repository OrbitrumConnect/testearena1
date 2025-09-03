import { useState, useEffect } from 'react';

interface FreeTrainingData {
  date: string;
  eras: {
    'egito-antigo': boolean;
    'mesopotamia': boolean;
    'medieval': boolean;
    'digital': boolean;
  };
}

export const useFreeTrainingLimit = (eraSlug: string) => {
  // Proteção robusta para eraSlug undefined
  const safeEraSlug = eraSlug || 'egito-antigo';
  
  // Debug: Log do eraSlug recebido
  console.log('🔍 useFreeTrainingLimit chamado com eraSlug:', eraSlug, 'safeEraSlug:', safeEraSlug);

  const [canTrain, setCanTrain] = useState<boolean>(true);
  const [trainingCount, setTrainingCount] = useState<number>(0);
  const [maxTrainings] = useState<number>(4); // 4 eras = 4 treinos/dia para FREE

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
          // Mesmo dia - verificar se já treinou nesta era
          const alreadyTrainedInEra = trainingData.eras[safeEraSlug as keyof typeof trainingData.eras];
          setCanTrain(!alreadyTrainedInEra);
          
          // Contar quantas eras já treinou hoje
          const trainedEras = Object.values(trainingData.eras).filter(Boolean).length;
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
        'egito-antigo': false,
        'mesopotamia': false,
        'medieval': false,
        'digital': false
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
        trainingData.eras[safeEraSlug as keyof typeof trainingData.eras] = true;
        
        // Contar quantas eras já treinou hoje
        const trainedEras = Object.values(trainingData.eras).filter(Boolean).length;
        
        localStorage.setItem('free_training_limit', JSON.stringify(trainingData));
        setTrainingCount(trainedEras);
        setCanTrain(false); // Não pode treinar novamente nesta era hoje
        
        console.log(`🎯 FREE: Treino ${safeEraSlug} realizado! ${trainedEras}/4 eras treinadas hoje`);
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
