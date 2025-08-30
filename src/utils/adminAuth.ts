// Lista de emails de administradores autorizados
const ADMIN_EMAILS = [
  'admin@arenadeconhecimento.com',
  'phpg6@example.com', // Adicione seu email aqui
  'seu-email@gmail.com', // Substitua pelo seu email real
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
  // Por enquanto, permitir acesso para desenvolvimento
  // Em produção, integrar com Supabase auth real
  return {
    isAdmin: true, // Mudar para false em produção
    loading: false,
    error: null
  };
};
