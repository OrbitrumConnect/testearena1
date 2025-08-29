import { useState, useEffect } from 'react';

interface PromotionInfo {
  isActive: boolean;
  discountPercent: number;
  originalPrice: number;
  currentPrice: number;
  savings: number;
  daysRemaining: number;
  endDate: Date;
  startDate: Date;
}

export const usePromotion = () => {
  const [promotionInfo, setPromotionInfo] = useState<PromotionInfo | null>(null);

  useEffect(() => {
    // Data de início da promoção: 29/08/2024
    const promoStartDate = new Date('2024-08-29');
    // Duração: 6 meses
    const promoEndDate = new Date(promoStartDate.getTime() + (6 * 30 * 24 * 60 * 60 * 1000));
    const today = new Date();
    
    const isActive = today >= promoStartDate && today <= promoEndDate;
    const originalPrice = 20.00;
    const discountPercent = isActive ? 50 : 0;
    const currentPrice = isActive ? originalPrice * 0.5 : originalPrice;
    const savings = originalPrice - currentPrice;
    
    // Calcular dias restantes
    const timeDiff = promoEndDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

    setPromotionInfo({
      isActive,
      discountPercent,
      originalPrice,
      currentPrice,
      savings,
      daysRemaining,
      endDate: promoEndDate,
      startDate: promoStartDate
    });
  }, []);

  const getPromotionMessage = () => {
    if (!promotionInfo?.isActive) {
      return 'Preço normal vigente';
    }

    if (promotionInfo.daysRemaining > 30) {
      return `Promoção válida por mais ${Math.floor(promotionInfo.daysRemaining / 30)} meses`;
    } else if (promotionInfo.daysRemaining > 0) {
      return `Últimos ${promotionInfo.daysRemaining} dias da promoção!`;
    } else {
      return 'Promoção encerrada';
    }
  };

  const getUrgencyLevel = (): 'low' | 'medium' | 'high' => {
    if (!promotionInfo?.isActive) return 'low';
    
    if (promotionInfo.daysRemaining <= 7) return 'high';
    if (promotionInfo.daysRemaining <= 30) return 'medium';
    return 'low';
  };

  return {
    promotionInfo,
    getPromotionMessage,
    getUrgencyLevel,
    isLoading: !promotionInfo
  };
};
