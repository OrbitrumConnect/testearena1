import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUserData {
  id: string;
  email: string;
  display_name: string;
  user_type: 'free' | 'paid' | 'vip' | 'banned';
  total_xp: number;
  total_battles: number;
  battles_won: number;
  created_at: string;
  last_seen: string;
  wallet_balance: number;
  total_earned: number;
  total_spent: number;
}

export interface AdminStats {
  totalUsers: number;
  freeUsers: number;
  paidUsers: number;
  vipUsers: number;
  bannedUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalBattles: number;
  avgSessionTime: number;
}

export const useAdminData = () => {
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Buscar usuários com dados da carteira
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_wallet (
            balance,
            total_earned,
            total_spent
          )
        `)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Processar dados dos usuários
      const processedUsers: AdminUserData[] = (usersData || []).map(user => ({
        id: user.id,
        email: user.user_id, // Placeholder - precisaria de join com auth.users
        display_name: user.display_name || 'Usuário',
        user_type: user.user_type || 'free',
        total_xp: user.total_xp || 0,
        total_battles: user.total_battles || 0,
        battles_won: user.battles_won || 0,
        created_at: user.created_at,
        last_seen: user.updated_at,
        wallet_balance: user.user_wallet?.balance || 0,
        total_earned: user.user_wallet?.total_earned || 0,
        total_spent: user.user_wallet?.total_spent || 0,
      }));

      setUsers(processedUsers);

      // Calcular estatísticas
      const totalUsers = processedUsers.length;
      const freeUsers = processedUsers.filter(u => u.user_type === 'free').length;
      const paidUsers = processedUsers.filter(u => u.user_type === 'paid').length;
      const vipUsers = processedUsers.filter(u => u.user_type === 'vip').length;
      const bannedUsers = processedUsers.filter(u => u.user_type === 'banned').length;
      
      const totalRevenue = processedUsers.reduce((sum, user) => sum + user.total_spent, 0);
      const totalBattles = processedUsers.reduce((sum, user) => sum + user.total_battles, 0);

      setStats({
        totalUsers,
        freeUsers,
        paidUsers,
        vipUsers,
        bannedUsers,
        totalRevenue,
        monthlyRevenue: totalRevenue * 0.3, // Simulado
        totalBattles,
        avgSessionTime: 8.5 // Simulado
      });

    } catch (err: any) {
      console.error('Erro ao buscar dados admin:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserType = async (userId: string, userType: 'free' | 'paid' | 'vip' | 'banned') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: userType })
        .eq('user_id', userId);

      if (error) throw error;

      // Atualizar localmente
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, user_type: userType } : user
      ));

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar tipo de usuário:', error);
      return { success: false, error: error.message };
    }
  };

  const banUser = async (userId: string) => {
    return updateUserType(userId, 'banned');
  };

  const makeUserVIP = async (userId: string) => {
    return updateUserType(userId, 'vip');
  };

  return {
    users,
    stats,
    loading,
    error,
    fetchAdminData,
    updateUserType,
    banUser,
    makeUserVIP
  };
};
