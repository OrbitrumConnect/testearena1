import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Credenciais do administrador
const ADMIN_EMAIL = 'phpg69@gmail.com';
const ADMIN_PASSWORD = 'p6p7p8P9!'; // Senha fixa do admin

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        setAdminUser(session.user);
      } else {
        setIsAdmin(false);
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar auth admin:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async (email: string, password: string) => {
    try {
      // Verificar credenciais antes de tentar autenticar
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return { success: false, error: 'Credenciais inválidas. Acesso negado.' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Se der erro de autenticação, ainda verificar se são as credenciais certas
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          // Simular login admin local se Supabase falhar
          setIsAdmin(true);
          setAdminUser({ email: ADMIN_EMAIL, id: 'admin-local' });
          return { success: true };
        }
        throw error;
      }

      if (data.user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        setAdminUser(data.user);
        return { success: true };
      } else {
        // Logout se não for admin
        await supabase.auth.signOut();
        return { success: false, error: 'Acesso negado. Apenas administradores.' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logoutAdmin = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setAdminUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    isAdmin,
    isLoading,
    adminUser,
    loginAsAdmin,
    logoutAdmin,
    checkAdminAuth
  };
};
