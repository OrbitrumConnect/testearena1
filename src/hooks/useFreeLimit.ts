import { useState, useEffect } from 'react';

const FREE_TRAINING_LIMIT = 8; // Sistema Arena de Créditos - 8 treinos por dia

export const useFreeLimit = (userType: 'free' | 'paid' | 'vip' | 'banned' = 'free') => {
  const [freeTrainingCount, setFreeTrainingCount] = useState(0);
  const [canTrainFree, setCanTrainFree] = useState(true);

  useEffect(() => {
    checkFreeLimit();
  }, [userType]);

  const checkFreeLimit = () => {
    if (userType !== 'free') {
      // Usuários pagos, VIP não têm limite
      setCanTrainFree(true);
      return;
    }

    const today = new Date().toDateString();
    const savedData = localStorage.getItem('free_training_limit');
    
    if (savedData) {
      const parsed = JSON.parse(savedData);
      
      if (parsed.date === today) {
        setFreeTrainingCount(parsed.count);
        setCanTrainFree(parsed.count < FREE_TRAINING_LIMIT);
      } else {
        // Novo dia - resetar contador
        const newData = { date: today, count: 0 };
        localStorage.setItem('free_training_limit', JSON.stringify(newData));
        setFreeTrainingCount(0);
        setCanTrainFree(true);
      }
    } else {
      // Primeira vez
      const newData = { date: today, count: 0 };
      localStorage.setItem('free_training_limit', JSON.stringify(newData));
      setFreeTrainingCount(0);
      setCanTrainFree(true);
    }
  };

  const incrementFreeTraining = () => {
    if (userType !== 'free') return; // Não aplicar limite para não-free

    const today = new Date().toDateString();
    const newCount = freeTrainingCount + 1;
    
    const newData = { date: today, count: newCount };
    localStorage.setItem('free_training_limit', JSON.stringify(newData));
    
    setFreeTrainingCount(newCount);
    setCanTrainFree(newCount < FREE_TRAINING_LIMIT);
  };

  const getRemainingFreeTrainings = () => {
    if (userType !== 'free') return 999; // Ilimitado para não-free
    return Math.max(0, FREE_TRAINING_LIMIT - freeTrainingCount);
  };

  const getFreeTrainingInfo = () => ({
    dailyLimit: FREE_TRAINING_LIMIT,
    used: freeTrainingCount,
    remaining: getRemainingFreeTrainings(),
    canTrain: canTrainFree,
    isFreeLimited: userType === 'free'
  });

  const resetFreeTrainingCount = () => {
    const today = new Date().toDateString();
    const newData = { date: today, count: 0 };
    localStorage.setItem('free_training_limit', JSON.stringify(newData));
    setFreeTrainingCount(0);
    setCanTrainFree(true);
  };

  return {
    canTrainFree,
    freeTrainingCount,
    incrementFreeTraining,
    getRemainingFreeTrainings,
    getFreeTrainingInfo,
    resetFreeTrainingCount,
    checkFreeLimit
  };
};
