import { supabase } from '@/integrations/supabase/client';

/**
 * Configurações para habilitar registro com email no Supabase
 * 
 * Para habilitar completamente:
 * 1. No dashboard do Supabase > Authentication > Settings
 * 2. Enable email confirmations: OFF (para desenvolvimento)
 * 3. Email auth providers: ON
 * 4. Auto confirm users: ON (para desenvolvimento)
 */

// Função para registrar usuário com email
export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
          display_name: displayName,
        },
      },
    });

    if (error) throw error;

    // Automaticamente criar perfil na tabela profiles
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          display_name: displayName,
          user_type: 'free', // Novo usuário sempre começa como free
          total_xp: 0,
          total_battles: 0,
          battles_won: 0,
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
      }

      // Criar carteira inicial
      const { error: walletError } = await supabase
        .from('user_wallet')
        .insert({
          user_id: data.user.id,
          balance: 0.00,
          total_earned: 0.00,
          total_spent: 0.00,
        });

      if (walletError) {
        console.error('Erro ao criar carteira:', walletError);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Erro no registro:', error);
    return { data: null, error };
  }
};

// Função para login com email
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro no login:', error);
    return { data: null, error };
  }
};

// Função para logout
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Limpar dados locais também
    localStorage.removeItem('demo_profile');
    localStorage.removeItem('demo_wallet');
    localStorage.removeItem('demo_battles');
    
    return { error: null };
  } catch (error) {
    console.error('Erro no logout:', error);
    return { error };
  }
};

// Função para verificar se usuário está logado
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return { user: null, error };
  }
};

// Função para obter perfil completo do usuário
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return { profile: null, error };
  }
};
