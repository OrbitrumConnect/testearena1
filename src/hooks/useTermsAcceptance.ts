import { useState, useEffect } from 'react';

export const useTermsAcceptance = () => {
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTermsAcceptance();
  }, []);

  const checkTermsAcceptance = () => {
    try {
      const acceptedDate = localStorage.getItem('terms_accepted');
      const acceptedVersion = localStorage.getItem('terms_version');
      const currentVersion = '1.0';

      // Verificar se o usuário já aceitou a versão atual
      if (acceptedDate && acceptedVersion === currentVersion) {
        const acceptDate = new Date(acceptedDate);
        const now = new Date();
        const daysSinceAccept = (now.getTime() - acceptDate.getTime()) / (1000 * 3600 * 24);
        
        // Termos válidos por 365 dias (1 ano)
        if (daysSinceAccept < 365) {
          setTermsAccepted(true);
        } else {
          // Termos expirados, precisa aceitar novamente
          setTermsAccepted(false);
          localStorage.removeItem('terms_accepted');
          localStorage.removeItem('terms_version');
        }
      } else {
        // Nunca aceitou ou versão diferente
        setTermsAccepted(false);
      }
    } catch (error) {
      console.error('Erro ao verificar aceite de termos:', error);
      setTermsAccepted(false);
    } finally {
      setLoading(false);
    }
  };

  const acceptTerms = () => {
    try {
      const now = new Date().toISOString();
      localStorage.setItem('terms_accepted', now);
      localStorage.setItem('terms_version', '1.0');
      setTermsAccepted(true);
      
      // Log para auditoria (em produção, enviar para backend)
      console.log('✅ Termos aceitos:', {
        timestamp: now,
        version: '1.0',
        userAgent: navigator.userAgent
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao aceitar termos:', error);
      return false;
    }
  };

  const revokeTerms = () => {
    try {
      localStorage.removeItem('terms_accepted');
      localStorage.removeItem('terms_version');
      setTermsAccepted(false);
      
      console.log('❌ Aceite de termos revogado');
      return true;
    } catch (error) {
      console.error('Erro ao revogar aceite:', error);
      return false;
    }
  };

  const getAcceptanceInfo = () => {
    try {
      const acceptedDate = localStorage.getItem('terms_accepted');
      const acceptedVersion = localStorage.getItem('terms_version');
      
      if (acceptedDate && acceptedVersion) {
        return {
          date: new Date(acceptedDate),
          version: acceptedVersion,
          daysAgo: Math.floor((new Date().getTime() - new Date(acceptedDate).getTime()) / (1000 * 3600 * 24))
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao obter info de aceite:', error);
      return null;
    }
  };

  return {
    termsAccepted,
    loading,
    acceptTerms,
    revokeTerms,
    getAcceptanceInfo,
    checkTermsAcceptance
  };
};
