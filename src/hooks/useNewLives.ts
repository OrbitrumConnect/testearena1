import { useState, useCallback, useEffect } from 'react';
import { useNewSubscription } from './useNewSubscription';
import { 
  LIVES_AND_CREDITS_CONFIG,
  calculateLivesStatus 
} from '@/utils/newSubscriptionSystem';

export interface LivesInfo {
  available: number;
  maxFree: number;
  hoursUntilReset: number;
  canBuyExtra: boolean;
  extraLifeCost: number;
  resetToday: boolean;
}

export const useNewLives = () => {
  const { userSubscription, actions } = useNewSubscription();
  const [livesInfo, setLivesInfo] = useState<LivesInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📊 Calcular informações das vidas
  const calculateLivesInfo = useCallback((): LivesInfo | null => {
    if (!userSubscription) return null;

    const status = calculateLivesStatus(
      userSubscription.lives_remaining,
      userSubscription.lives_reset_date
    );

    return {
      available: status.livesAvailable,
      maxFree: LIVES_AND_CREDITS_CONFIG.freePerDay,
      hoursUntilReset: status.hoursUntilReset,
      canBuyExtra: status.canBuyExtra && userSubscription.credits_balance >= LIVES_AND_CREDITS_CONFIG.extraLifeCost,
      extraLifeCost: LIVES_AND_CREDITS_CONFIG.extraLifeCost,
      resetToday: status.resetToday
    };
  }, [userSubscription]);

  // ❤️ Usar uma vida
  const useLife = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
    livesRemaining?: number;
    message?: string;
  }> => {
    if (!livesInfo || livesInfo.available <= 0) {
      return {
        success: false,
        error: 'Sem vidas disponíveis. Compre vidas extras ou aguarde o reset!'
      };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await actions.useLifeForTraining();
      
      if (result.success) {
        // Atualizar informações locais
        setLivesInfo(prev => prev ? {
          ...prev,
          available: prev.available - 1
        } : null);

        return {
          success: true,
          livesRemaining: result.livesRemaining,
          message: `Vida usada! Restam ${result.livesRemaining} vidas.`
        };
      } else {
        setError(result.error || 'Erro ao usar vida');
        return {
          success: false,
          error: result.error || 'Erro ao usar vida'
        };
      }
    } catch (err) {
      const errorMsg = 'Erro inesperado ao usar vida';
      setError(errorMsg);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  }, [livesInfo, actions]);

  // 🛒 Comprar vidas extras
  const buyExtraLives = useCallback(async (quantity: number = 1): Promise<{
    success: boolean;
    error?: string;
    livesAdded?: number;
    creditsSpent?: number;
    message?: string;
  }> => {
    if (!userSubscription) {
      return {
        success: false,
        error: 'Dados de assinatura não encontrados'
      };
    }

    const totalCost = LIVES_AND_CREDITS_CONFIG.extraLifeCost * quantity;
    
    if (userSubscription.credits_balance < totalCost) {
      return {
        success: false,
        error: `Créditos insuficientes. Precisa de ${totalCost} créditos.`
      };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await actions.buyExtraLife(quantity);
      
      if (result.success) {
        // Atualizar informações locais
        setLivesInfo(prev => prev ? {
          ...prev,
          available: prev.available + quantity,
          canBuyExtra: (userSubscription.credits_balance - totalCost) >= LIVES_AND_CREDITS_CONFIG.extraLifeCost
        } : null);

        return {
          success: true,
          livesAdded: result.livesAdded,
          creditsSpent: result.creditsSpent,
          message: `${quantity} vida(s) comprada(s) por ${totalCost} créditos!`
        };
      } else {
        setError(result.error || 'Erro ao comprar vidas');
        return {
          success: false,
          error: result.error || 'Erro ao comprar vidas'
        };
      }
    } catch (err) {
      const errorMsg = 'Erro inesperado ao comprar vidas';
      setError(errorMsg);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  }, [userSubscription, actions]);

  // 🔄 Verificar se precisa resetar vidas
  const checkAndResetLives = useCallback(async (): Promise<{
    wasReset: boolean;
    newLivesCount: number;
  }> => {
    if (!userSubscription) return { wasReset: false, newLivesCount: 0 };

    const status = calculateLivesStatus(
      userSubscription.lives_remaining,
      userSubscription.lives_reset_date
    );

    if (status.resetToday) {
      // Forçar refetch da assinatura para atualizar dados
      await actions.refetchSubscription();
      
      return {
        wasReset: true,
        newLivesCount: LIVES_AND_CREDITS_CONFIG.freePerDay
      };
    }

    return {
      wasReset: false,
      newLivesCount: status.livesAvailable
    };
  }, [userSubscription, actions]);

  // 🕐 Obter tempo formatado até o reset
  const getTimeUntilReset = useCallback((): string => {
    if (!livesInfo) return '--:--';

    const hours = livesInfo.hoursUntilReset;
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }, [livesInfo]);

  // 📊 Obter status detalhado das vidas
  const getDetailedStatus = useCallback(() => {
    if (!livesInfo || !userSubscription) return null;

    return {
      ...livesInfo,
      creditsBalance: userSubscription.credits_balance,
      creditsForOneLife: LIVES_AND_CREDITS_CONFIG.extraLifeCost,
      maxLivesCanBuy: Math.floor(userSubscription.credits_balance / LIVES_AND_CREDITS_CONFIG.extraLifeCost),
      timeUntilReset: getTimeUntilReset(),
      resetTime: '00:00',
      isResetTime: livesInfo.hoursUntilReset <= 1
    };
  }, [livesInfo, userSubscription, getTimeUntilReset]);

  // 🎮 Verificar se pode jogar (tem vidas ou créditos para comprar)
  const canPlay = useCallback((): {
    canPlay: boolean;
    reason?: string;
    suggestion?: string;
  } => {
    if (!livesInfo || !userSubscription) {
      return {
        canPlay: false,
        reason: 'Dados não carregados',
        suggestion: 'Aguarde o carregamento dos dados'
      };
    }

    if (livesInfo.available > 0) {
      return { canPlay: true };
    }

    if (livesInfo.canBuyExtra) {
      return {
        canPlay: true,
        reason: 'Sem vidas grátis',
        suggestion: `Compre vidas extras por ${livesInfo.extraLifeCost} créditos cada`
      };
    }

    return {
      canPlay: false,
      reason: 'Sem vidas e sem créditos',
      suggestion: `Aguarde o reset em ${getTimeUntilReset()} ou adicione créditos`
    };
  }, [livesInfo, userSubscription, getTimeUntilReset]);

  // Atualizar informações quando a assinatura mudar
  useEffect(() => {
    const newLivesInfo = calculateLivesInfo();
    setLivesInfo(newLivesInfo);
  }, [calculateLivesInfo]);

  // Auto-check para reset a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndResetLives();
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, [checkAndResetLives]);

  return {
    livesInfo,
    loading,
    error,
    actions: {
      useLife,
      buyExtraLives,
      checkAndResetLives
    },
    computed: {
      getTimeUntilReset,
      getDetailedStatus,
      canPlay
    }
  };
};
