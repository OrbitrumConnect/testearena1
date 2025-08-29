import { useState, useEffect } from 'react';

// Limite diário de partidas PvP para controlar ganhos
const DAILY_PVP_LIMIT = 10; // Máximo 10 partidas PvP por dia
const STORAGE_KEY = 'pvp_daily_limit';

interface PvPLimitData {
  date: string;
  battlesPlayed: number;
}

export const usePvPLimit = () => {
  const [battlesPlayed, setBattlesPlayed] = useState(0);
  const [canPlayPvP, setCanPlayPvP] = useState(true);
  
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      try {
        const data: PvPLimitData = JSON.parse(stored);
        
        if (data.date === today) {
          // Mesmo dia - usar dados existentes
          setBattlesPlayed(data.battlesPlayed);
          setCanPlayPvP(data.battlesPlayed < DAILY_PVP_LIMIT);
        } else {
          // Novo dia - resetar contadores
          resetDailyLimit();
        }
      } catch {
        resetDailyLimit();
      }
    } else {
      resetDailyLimit();
    }
  }, []);

  const resetDailyLimit = () => {
    const today = new Date().toDateString();
    const newData: PvPLimitData = {
      date: today,
      battlesPlayed: 0
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setBattlesPlayed(0);
    setCanPlayPvP(true);
  };

  const incrementBattles = () => {
    const today = new Date().toDateString();
    const newCount = battlesPlayed + 1;
    
    const newData: PvPLimitData = {
      date: today,
      battlesPlayed: newCount
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setBattlesPlayed(newCount);
    setCanPlayPvP(newCount < DAILY_PVP_LIMIT);
    
    return newCount;
  };

  const getBattlesRemaining = () => {
    return Math.max(0, DAILY_PVP_LIMIT - battlesPlayed);
  };

  const getPvPLimitInfo = () => {
    return {
      dailyLimit: DAILY_PVP_LIMIT,
      battlesPlayed,
      battlesRemaining: getBattlesRemaining(),
      canPlay: canPlayPvP,
      resetTime: "00:00 (meia-noite)",
      warningMessage: `⚠️ Limite diário: ${DAILY_PVP_LIMIT} partidas PvP para controlar ganhos de créditos`
    };
  };

  return {
    battlesPlayed,
    canPlayPvP,
    incrementBattles,
    getBattlesRemaining,
    getPvPLimitInfo,
    resetDailyLimit // Para testes
  };
};
