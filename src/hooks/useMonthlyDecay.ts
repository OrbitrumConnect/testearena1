import { useState, useEffect } from 'react';

interface MonthlyDecayData {
  currentMonth: string;
  previousMonth: string;
  previousMonthCredits: number;
  decayedCredits: number;
  daysElapsed: number;
  decayPercentage: number;
  isDecayActive: boolean;
}

const DECAY_RATE_DAILY = 0.2705; // 27.05% ao dia útil
const WORKING_DAYS_TO_ZERO = 22; // 22 dias úteis para zerar

export const useMonthlyDecay = () => {
  const [decayData, setDecayData] = useState<MonthlyDecayData>({
    currentMonth: '',
    previousMonth: '',
    previousMonthCredits: 0,
    decayedCredits: 0,
    daysElapsed: 0,
    decayPercentage: 0,
    isDecayActive: false
  });

  // Calcular decay exponencial
  const calculateDecay = (originalCredits: number, daysElapsed: number): number => {
    if (daysElapsed >= WORKING_DAYS_TO_ZERO) return 0;
    return Math.round(originalCredits * Math.pow(1 - DECAY_RATE_DAILY, daysElapsed));
  };

  // Obter dias úteis entre duas datas
  const getWorkingDays = (startDate: Date, endDate: Date): number => {
    let count = 0;
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Não é sábado nem domingo
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  };

  // Verificar e atualizar decay
  useEffect(() => {
    const today = new Date();
    const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    // Calcular mês anterior
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const previousMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
    
    // Buscar créditos do mês anterior
    const creditsHistory = localStorage.getItem('monthly_credits_history');
    const monthlyData = creditsHistory ? JSON.parse(creditsHistory) : {};
    
    if (monthlyData[previousMonthKey]) {
      // Calcular primeiro dia útil do mês atual
      const firstWorkingDay = new Date(today.getFullYear(), today.getMonth(), 1);
      while (firstWorkingDay.getDay() === 0 || firstWorkingDay.getDay() === 6) {
        firstWorkingDay.setDate(firstWorkingDay.getDate() + 1);
      }
      
      // Calcular dias úteis decorridos
      const daysElapsed = getWorkingDays(firstWorkingDay, today);
      const originalCredits = monthlyData[previousMonthKey].credits;
      const currentDecayedCredits = calculateDecay(originalCredits, daysElapsed);
      
      setDecayData({
        currentMonth: currentMonthKey,
        previousMonth: previousMonthKey,
        previousMonthCredits: originalCredits,
        decayedCredits: currentDecayedCredits,
        daysElapsed,
        decayPercentage: Math.round(((originalCredits - currentDecayedCredits) / originalCredits) * 100),
        isDecayActive: originalCredits > 0 && daysElapsed < WORKING_DAYS_TO_ZERO
      });

      // Atualizar histórico com valor decaído
      if (monthlyData[previousMonthKey].credits !== currentDecayedCredits) {
        monthlyData[previousMonthKey].decayedCredits = currentDecayedCredits;
        monthlyData[previousMonthKey].lastDecayUpdate = today.toISOString();
        localStorage.setItem('monthly_credits_history', JSON.stringify(monthlyData));
      }
    } else {
      setDecayData(prev => ({
        ...prev,
        currentMonth: currentMonthKey,
        previousMonth: previousMonthKey,
        isDecayActive: false
      }));
    }
  }, []);

  // Função para salvar créditos do mês atual no histórico
  const saveCurrentMonthCredits = (credits: number) => {
    const today = new Date();
    const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    const creditsHistory = localStorage.getItem('monthly_credits_history');
    const monthlyData = creditsHistory ? JSON.parse(creditsHistory) : {};
    
    monthlyData[monthKey] = {
      credits,
      decayedCredits: credits,
      savedAt: today.toISOString(),
      lastDecayUpdate: today.toISOString()
    };
    
    localStorage.setItem('monthly_credits_history', JSON.stringify(monthlyData));
  };

  // Função para obter informações de decay formatadas
  const getDecayInfo = () => {
    if (!decayData.isDecayActive) return null;
    
    const daysRemaining = Math.max(0, WORKING_DAYS_TO_ZERO - decayData.daysElapsed);
    const decayRateFormatted = Math.round(DECAY_RATE_DAILY * 100);
    
    return {
      ...decayData,
      daysRemaining,
      decayRateFormatted,
      isExpiringSoon: daysRemaining <= 5,
      statusText: daysRemaining === 0 ? 'Expirado' : `${daysRemaining}d restantes`
    };
  };

  return {
    decayData,
    getDecayInfo,
    saveCurrentMonthCredits,
    isDecayActive: decayData.isDecayActive,
    DECAY_RATE_DAILY,
    WORKING_DAYS_TO_ZERO
  };
};
