import { useState, useEffect } from 'react';

const DAILY_CREDITS_LIMIT = 22.5; // Limite diário do Sistema Arena de Créditos

interface DailyCreditsData {
  date: string;
  creditsEarned: number;
}

export const useDailyCreditsLimit = () => {
  const [creditsEarned, setCreditsEarned] = useState<number>(0);
  const [canEarnCredits, setCanEarnCredits] = useState<boolean>(true);
  const [remainingCredits, setRemainingCredits] = useState<number>(DAILY_CREDITS_LIMIT);

  useEffect(() => {
    checkDailyLimit();
  }, []);

  const checkDailyLimit = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('daily_credits_limit');
    
    if (storedData) {
      const creditsData: DailyCreditsData = JSON.parse(storedData);
      
      if (creditsData.date === today) {
        // Mesmo dia - verificar limite
        setCreditsEarned(creditsData.creditsEarned);
        setCanEarnCredits(creditsData.creditsEarned < DAILY_CREDITS_LIMIT);
        setRemainingCredits(Math.max(0, DAILY_CREDITS_LIMIT - creditsData.creditsEarned));
      } else {
        // Novo dia - resetar contador
        resetDailyLimit();
      }
    } else {
      // Primeira vez - inicializar
      resetDailyLimit();
    }
  };

  const resetDailyLimit = () => {
    const today = new Date().toDateString();
    const newData: DailyCreditsData = {
      date: today,
      creditsEarned: 0
    };
    
    localStorage.setItem('daily_credits_limit', JSON.stringify(newData));
    setCreditsEarned(0);
    setCanEarnCredits(true);
    setRemainingCredits(DAILY_CREDITS_LIMIT);
  };

  const addCredits = (credits: number) => {
    if (!canEarnCredits) {
      console.warn('⚠️ Limite diário de créditos atingido!');
      return false;
    }

    const today = new Date().toDateString();
    const newTotal = Math.min(creditsEarned + credits, DAILY_CREDITS_LIMIT);
    
    const newData: DailyCreditsData = {
      date: today,
      creditsEarned: newTotal
    };
    
    localStorage.setItem('daily_credits_limit', JSON.stringify(newData));
    setCreditsEarned(newTotal);
    setCanEarnCredits(newTotal < DAILY_CREDITS_LIMIT);
    setRemainingCredits(Math.max(0, DAILY_CREDITS_LIMIT - newTotal));
    
    console.log(`🎯 Créditos adicionados: ${credits}. Total hoje: ${newTotal}/${DAILY_CREDITS_LIMIT}`);
    return true;
  };

  const getDailyLimitInfo = () => {
    return {
      dailyLimit: DAILY_CREDITS_LIMIT,
      creditsEarned,
      remainingCredits,
      canEarnCredits,
      resetTime: "00:00 (meia-noite)",
      warningMessage: `⚠️ Limite diário: ${DAILY_CREDITS_LIMIT} créditos para controlar ganhos`
    };
  };

  return {
    creditsEarned,
    canEarnCredits,
    remainingCredits,
    dailyLimit: DAILY_CREDITS_LIMIT,
    addCredits,
    resetDailyLimit,
    getDailyLimitInfo,
    checkDailyLimit
  };
};
