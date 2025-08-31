import { useState, useEffect } from 'react';

// Constantes do sistema de percepção de valor (novo sistema)
const CREDIT_TO_PERCEPTION_RATE = 0.01; // R$ 0,01 por crédito (100 créditos = R$ 1,00)
const MAX_SACABLE_VALUE = 5.00;         // Máximo R$ 5,00 sacável

interface CreditsPerceptionData {
  totalCredits: number;
  perceptionValue: number;
  sacableValue: number;
  creditsFromTraining: number;
  creditsFromPvP: number;
  creditsFromTournaments: number;
}

export const useCreditsPerception = () => {
  const [data, setData] = useState<CreditsPerceptionData>({
    totalCredits: 0,
    perceptionValue: 0,
    sacableValue: MAX_SACABLE_VALUE,
    creditsFromTraining: 0,
    creditsFromPvP: 0,
    creditsFromTournaments: 0
  });

  // Função para calcular o valor de percepção
  const calculatePerceptionValue = (credits: number): number => {
    return credits * CREDIT_TO_PERCEPTION_RATE;
  };

  // Função para atualizar créditos por categoria
  const updateCredits = (source: 'training' | 'pvp' | 'tournament', amount: number) => {
    setData(prev => {
      const newData = { ...prev };
      
      switch (source) {
        case 'training':
          newData.creditsFromTraining += amount;
          break;
        case 'pvp':
          newData.creditsFromPvP += amount;
          break;
        case 'tournament':
          newData.creditsFromTournaments += amount;
          break;
      }
      
      // Recalcular totais
      newData.totalCredits = newData.creditsFromTraining + newData.creditsFromPvP + newData.creditsFromTournaments;
      newData.perceptionValue = calculatePerceptionValue(newData.totalCredits);
      
      // Salvar no localStorage
      localStorage.setItem('credits_perception', JSON.stringify(newData));
      
      return newData;
    });
  };

  // Carregar dados salvos
  useEffect(() => {
    const saved = localStorage.getItem('credits_perception');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setData({
          ...parsedData,
          sacableValue: MAX_SACABLE_VALUE, // Sempre fixo
        });
      } catch (error) {
        console.error('Erro ao carregar dados de percepção:', error);
      }
    }
  }, []);

  // Função para resetar dados (para testes)
  const resetCredits = () => {
    const newData: CreditsPerceptionData = {
      totalCredits: 0,
      perceptionValue: 0,
      sacableValue: MAX_SACABLE_VALUE,
      creditsFromTraining: 0,
      creditsFromPvP: 0,
      creditsFromTournaments: 0
    };
    
    setData(newData);
    localStorage.setItem('credits_perception', JSON.stringify(newData));
  };

  // Função para obter estatísticas mensais estimadas
  const getMonthlyProjection = () => {
    const trainingsPerDay = 3; // 3 vidas grátis (novo sistema)
    const pvpPerDay = 3;
    const tournamentsPerMonth = 10;
    const daysInMonth = 30;
    
    const projectedTrainingCredits = trainingsPerDay * 3 * daysInMonth; // 3 créditos por treino (novo sistema)
    const projectedPvPCredits = pvpPerDay * 30 * daysInMonth; // 30 créditos líquidos por PvP
    const projectedTournamentCredits = tournamentsPerMonth * 50; // 50 créditos por torneio
    
    const totalProjected = projectedTrainingCredits + projectedPvPCredits + projectedTournamentCredits;
    
    return {
      training: {
        credits: projectedTrainingCredits,
        value: calculatePerceptionValue(projectedTrainingCredits)
      },
      pvp: {
        credits: projectedPvPCredits,
        value: calculatePerceptionValue(projectedPvPCredits)
      },
      tournaments: {
        credits: projectedTournamentCredits,
        value: calculatePerceptionValue(projectedTournamentCredits)
      },
      total: {
        credits: totalProjected,
        value: calculatePerceptionValue(totalProjected)
      }
    };
  };

  // Função para obter informações detalhadas
  const getDetailedInfo = () => {
    return {
      ...data,
      creditRate: CREDIT_TO_PERCEPTION_RATE,
      maxSacableValue: MAX_SACABLE_VALUE,
      breakdown: {
        training: {
          credits: data.creditsFromTraining,
          value: calculatePerceptionValue(data.creditsFromTraining),
          percentage: data.totalCredits > 0 ? (data.creditsFromTraining / data.totalCredits) * 100 : 0
        },
        pvp: {
          credits: data.creditsFromPvP,
          value: calculatePerceptionValue(data.creditsFromPvP),
          percentage: data.totalCredits > 0 ? (data.creditsFromPvP / data.totalCredits) * 100 : 0
        },
        tournaments: {
          credits: data.creditsFromTournaments,
          value: calculatePerceptionValue(data.creditsFromTournaments),
          percentage: data.totalCredits > 0 ? (data.creditsFromTournaments / data.totalCredits) * 100 : 0
        }
      }
    };
  };

  return {
    data,
    updateCredits,
    resetCredits,
    calculatePerceptionValue,
    getMonthlyProjection,
    getDetailedInfo,
    
    // Constantes para uso externo
    CREDIT_RATE: CREDIT_TO_PERCEPTION_RATE,
    MAX_SACABLE: MAX_SACABLE_VALUE
  };
};
