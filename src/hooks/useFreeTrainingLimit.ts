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
  const [canTrain, setCanTrain] = useState<boolean>(true);
  const [trainingCount, setTrainingCount] = useState<number>(0);
  const [maxTrainings] = useState<number>(4); // 4 eras = 4 treinos/dia para FREE

  useEffect(() => {
    checkDailyLimit();
  }, [eraSlug]);

  const checkDailyLimit = () => {
    // Verificação de segurança para eraSlug
    if (!eraSlug || typeof eraSlug !== 'string') {
      console.error('❌ Era slug inválido no checkDailyLimit:', eraSlug);
      return; // Sair da função se eraSlug for inválido
    }

    const today = new Date().toDateString();
    const storedData = localStorage.getItem('free_training_limit');
    
    if (storedData) {
      const trainingData: FreeTrainingData = JSON.parse(storedData);
      
      if (trainingData.date === today) {
        // Mesmo dia - verificar se já treinou nesta era
        const alreadyTrainedInEra = trainingData.eras[eraSlug as keyof typeof trainingData.eras];
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
        trainingData.eras[eraSlug as keyof typeof trainingData.eras] = true;
        
        // Contar quantas eras já treinou hoje
        const trainedEras = Object.values(trainingData.eras).filter(Boolean).length;
        
        localStorage.setItem('free_training_limit', JSON.stringify(trainingData));
        setTrainingCount(trainedEras);
        setCanTrain(false); // Não pode treinar novamente nesta era hoje
        
        console.log(`🎯 FREE: Treino ${eraSlug} realizado! ${trainedEras}/4 eras treinadas hoje`);
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
