import { useState, useEffect } from 'react';

interface TrainingData {
  date: string;
  count: number;
}

export const useTrainingLimit = () => {
  const [trainingCount, setTrainingCount] = useState<number>(0);
  const [canTrain, setCanTrain] = useState<boolean>(true);
  const MAX_TRAINING_PER_DAY = 8; // Sistema Arena de Créditos - 8 treinos por dia

  useEffect(() => {
    checkDailyLimit();
  }, []);

  const checkDailyLimit = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('training_limit');
    
    if (storedData) {
      const trainingData: TrainingData = JSON.parse(storedData);
      
      if (trainingData.date === today) {
        // Mesmo dia - verificar limite
        setTrainingCount(trainingData.count);
        setCanTrain(trainingData.count < MAX_TRAINING_PER_DAY);
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
    const newData: TrainingData = {
      date: today,
      count: 0
    };
    
    localStorage.setItem('training_limit', JSON.stringify(newData));
    setTrainingCount(0);
    setCanTrain(true);
  };

  const incrementTrainingCount = () => {
    const today = new Date().toDateString();
    const newCount = trainingCount + 1;
    
    const newData: TrainingData = {
      date: today,
      count: newCount
    };
    
    localStorage.setItem('training_limit', JSON.stringify(newData));
    setTrainingCount(newCount);
    setCanTrain(newCount < MAX_TRAINING_PER_DAY);
    
    console.log(`🎯 Treinamento ${newCount}/${MAX_TRAINING_PER_DAY} realizado hoje`);
  };

  const getRemainingTrainings = (): number => {
    return Math.max(0, MAX_TRAINING_PER_DAY - trainingCount);
  };

  const resetTrainingCount = () => {
    resetDailyCount();
    console.log('🔄 Contador de treinamentos resetado');
  };

  return {
    trainingCount,
    canTrain,
    maxTrainings: MAX_TRAINING_PER_DAY,
    remainingTrainings: getRemainingTrainings(),
    incrementTrainingCount,
    resetTrainingCount,
    checkDailyLimit
  };
};
