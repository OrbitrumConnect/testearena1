import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Lista de emails de administradores autorizados
const ADMIN_EMAILS = [
  'admin@arenadeconhecimento.com',
  'phpg69@gmail.com', // Email admin real
  'phpg6@example.com', // Email admin backup
];

// Lista de user IDs de admin (caso use UUID específico)
const ADMIN_USER_IDS = [
  '12345678-1234-1234-1234-123456789012', // ID demo admin
  // Adicione outros IDs de admin aqui
];

export const isAdmin = (email?: string, userId?: string): boolean => {
  // Verificar por email
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) {
    return true;
  }
  
  // Verificar por user ID
  if (userId && ADMIN_USER_IDS.includes(userId)) {
    return true;
  }
  
  // Verificar se é o usuário demo padrão (para desenvolvimento)
  if (userId === 'demo-user' || email === 'admin@demo.com') {
    return true;
  }
  
  return false;
};

export const requireAdmin = (email?: string, userId?: string): void => {
  if (!isAdmin(email, userId)) {
    throw new Error('Acesso negado: Apenas administradores podem acessar esta área');
  }
};

// Hook para verificar se o usuário atual é admin
export const useAdminAuth = () => {
  const [adminStatus, setAdminStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        
        // Buscar usuário atual do Supabase
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.log('🔒 Usuário não autenticado, não é admin');
          setAdminStatus(false);
          return;
        }

        // Verificar se é admin
        const adminStatus = isAdmin(user.email, user.id);
        console.log(`🔐 Verificação admin para ${user.email}: ${adminStatus ? 'SIM' : 'NÃO'}`);
        setAdminStatus(adminStatus);
        
      } catch (err) {
        console.error('❌ Erro ao verificar admin:', err);
        setError('Erro ao verificar permissões');
        setAdminStatus(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
    
    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await checkAdminStatus();
        } else if (event === 'SIGNED_OUT') {
          setAdminStatus(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { isAdmin: adminStatus, loading, error };
};
