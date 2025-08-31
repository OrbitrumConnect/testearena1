import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTermsAcceptance } from '@/hooks/useTermsAcceptance';
import { TermsAcceptance } from './TermsAcceptance';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { termsAccepted, loading, acceptTerms } = useTermsAcceptance();
  const [user, setUser] = React.useState<any>(null);
  const [userLoading, setUserLoading] = React.useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Erro ao verificar usuário:', error);
        // Se não conseguir verificar, assume usuário demo
        setUser({ user_metadata: { full_name: 'Guerreiro Demo' } });
      } else if (user) {
        setUser(user);
      } else {
        // Usuário não logado, assume demo
        setUser({ user_metadata: { full_name: 'Guerreiro Demo' } });
      }
    } catch (err) {
      console.error('Erro na verificação de usuário:', err);
      setUser({ user_metadata: { full_name: 'Guerreiro Demo' } });
    } finally {
      setUserLoading(false);
    }
  };

  // Se ainda está carregando, mostrar loading
  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-soft to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-epic mx-auto mb-4"></div>
          <p className="text-epic">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se está na landing page, não precisa verificar termos
  if (location.pathname === '/') {
    return <>{children}</>;
  }

  // Se termos não foram aceitos, mostrar tela de aceite
  if (termsAccepted === false) {
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guerreiro';
    
    return (
      <TermsAcceptance
        userName={userName}
        onAccept={() => {
          acceptTerms();
          // Forçar re-render para mostrar o conteúdo principal
          window.location.reload();
        }}
      />
    );
  }

  // Se termos foram aceitos, mostrar conteúdo normal
  return <>{children}</>;
};
