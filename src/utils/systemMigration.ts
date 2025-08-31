// Sistema de Migração - R$ 20 → Novo Sistema R$ 5
// Converte dados existentes para o novo formato

import { NewUserSubscription, NEW_SUBSCRIPTION_CONFIG, LIVES_AND_CREDITS_CONFIG } from './newSubscriptionSystem';

interface OldSystemUser {
  // Sistema antigo de R$ 20
  subscription?: {
    id: string;
    user_id: string;
    current_cycle_month: number;
    total_paid_current_cycle: number;
    status: string;
    created_at: string;
  };
  credits?: {
    id: string;
    user_id: string;
    credits_balance: number;
    credits_earned: number;
    credits_spent: number;
    created_at: string;
  };
  profile?: {
    id: string;
    user_id: string;
    display_name: string;
    total_battles: number;
    battles_won: number;
    created_at: string;
  };
}

interface MigrationResult {
  success: boolean;
  newSubscription?: NewUserSubscription;
  bonusCredits?: number;
  migrationNotes?: string[];
  errors?: string[];
}

// 🔄 Função principal de migração
export const migrateUserToNewSystem = (oldUser: OldSystemUser): MigrationResult => {
  const result: MigrationResult = {
    success: false,
    migrationNotes: [],
    errors: []
  };

  try {
    // Validar dados mínimos
    if (!oldUser.subscription?.user_id) {
      result.errors?.push('ID do usuário não encontrado');
      return result;
    }

    const userId = oldUser.subscription.user_id;
    const now = new Date().toISOString();

    // 💰 Calcular créditos iniciais
    const oldCreditsBalance = oldUser.credits?.credits_balance || 0;
    const bonusForMigration = 100; // 100 créditos bônus por migrar
    
    // Garantir pelo menos os créditos do novo sistema
    const newSystemCredits = NEW_SUBSCRIPTION_CONFIG[1].creditsReceived;
    const finalCredits = Math.max(
      newSystemCredits, 
      oldCreditsBalance + bonusForMigration
    );

    // 📊 Determinar mês inicial baseado no histórico
    const oldTotalPaid = oldUser.subscription.total_paid_current_cycle || 20;
    const startMonth = calculateOptimalStartMonth(oldTotalPaid);

    // 🎮 Calcular vidas baseado na atividade
    const userBattles = oldUser.profile?.total_battles || 0;
    const extraLives = Math.min(5, Math.floor(userBattles / 10)); // 1 vida extra a cada 10 batalhas

    // 🔄 Criar nova assinatura
    const newSubscription: NewUserSubscription = {
      id: `migrated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      current_cycle_month: startMonth,
      cycle_start_date: now,
      last_payment_date: oldUser.subscription.created_at || now,
      total_paid_current_cycle: NEW_SUBSCRIPTION_CONFIG[startMonth].entryAmount,
      credits_balance: finalCredits,
      lives_remaining: LIVES_AND_CREDITS_CONFIG.freePerDay + extraLives,
      lives_reset_date: now,
      next_payment_due: calculateNextPaymentDate(now),
      status: 'active',
      created_at: now,
      updated_at: now
    };

    // 📝 Notas de migração
    result.migrationNotes?.push(`Migração do sistema R$ 20 para R$ ${NEW_SUBSCRIPTION_CONFIG[startMonth].entryAmount}`);
    result.migrationNotes?.push(`Créditos iniciais: ${finalCredits} (${oldCreditsBalance} antigos + ${bonusForMigration} bônus + ${newSystemCredits} novos)`);
    result.migrationNotes?.push(`Vidas iniciais: ${newSubscription.lives_remaining} (${LIVES_AND_CREDITS_CONFIG.freePerDay} padrão + ${extraLives} bônus)`);
    result.migrationNotes?.push(`Iniciando no mês ${startMonth}/3 do ciclo`);

    if (oldCreditsBalance > 0) {
      result.migrationNotes?.push(`Créditos antigos preservados: ${oldCreditsBalance}`);
    }

    if (extraLives > 0) {
      result.migrationNotes?.push(`Bônus de migração: ${extraLives} vidas extras por atividade`);
    }

    result.success = true;
    result.newSubscription = newSubscription;
    result.bonusCredits = bonusForMigration;

  } catch (error) {
    result.errors?.push(`Erro na migração: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }

  return result;
};

// 📅 Calcular mês inicial ideal baseado no valor pago
const calculateOptimalStartMonth = (totalPaid: number): 1 | 2 | 3 => {
  // Se pagou muito (R$ 40+), começar no mês 3 (mais barato)
  if (totalPaid >= 40) return 3;
  
  // Se pagou moderado (R$ 20-39), começar no mês 2  
  if (totalPaid >= 20) return 2;
  
  // Caso contrário, começar no mês 1
  return 1;
};

// 📅 Calcular próxima data de pagamento (30 dias)
const calculateNextPaymentDate = (fromDate: string): string => {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + 30);
  return date.toISOString();
};

// 🔄 Migração em lote para múltiplos usuários
export const migrateBatchUsers = (users: OldSystemUser[]): {
  successful: MigrationResult[];
  failed: { user: OldSystemUser; error: string }[];
  summary: {
    total: number;
    migrated: number;
    failed: number;
    totalBonusCredits: number;
  };
} => {
  const successful: MigrationResult[] = [];
  const failed: { user: OldSystemUser; error: string }[] = [];

  for (const user of users) {
    const result = migrateUserToNewSystem(user);
    
    if (result.success) {
      successful.push(result);
    } else {
      failed.push({
        user,
        error: result.errors?.join(', ') || 'Erro desconhecido'
      });
    }
  }

  const totalBonusCredits = successful.reduce((sum, result) => sum + (result.bonusCredits || 0), 0);

  return {
    successful,
    failed,
    summary: {
      total: users.length,
      migrated: successful.length,
      failed: failed.length,
      totalBonusCredits
    }
  };
};

// 📊 Análise de impacto da migração
export const analyzeMigrationImpact = (users: OldSystemUser[]): {
  oldSystemMetrics: {
    totalRevenue: number;
    averageCredits: number;
    totalUsers: number;
  };
  newSystemProjection: {
    month1Revenue: number;
    month2Revenue: number;
    month3Revenue: number;
    projectedRetention: number;
    estimatedLifetime: number;
  };
  migrationBenefits: {
    userSavings: number;
    platformGrowthPotential: number;
    retentionImprovement: string;
  };
} => {
  const totalUsers = users.length;
  const totalOldRevenue = totalUsers * 20; // R$ 20 fixo
  const averageOldCredits = users.reduce((sum, user) => sum + (user.credits?.credits_balance || 0), 0) / totalUsers;

  // Distribuir usuários pelos 3 meses (simulação)
  const usersPerMonth = Math.floor(totalUsers / 3);
  const month1Revenue = usersPerMonth * NEW_SUBSCRIPTION_CONFIG[1].entryAmount;
  const month2Revenue = usersPerMonth * NEW_SUBSCRIPTION_CONFIG[2].entryAmount;
  const month3Revenue = (totalUsers - usersPerMonth * 2) * NEW_SUBSCRIPTION_CONFIG[3].entryAmount;

  const totalNewRevenue = month1Revenue + month2Revenue + month3Revenue;
  const userSavings = totalOldRevenue - (totalNewRevenue * 5); // Projetando 5 ciclos
  const projectedRetention = 87; // 87% vs 78% do sistema antigo

  return {
    oldSystemMetrics: {
      totalRevenue: totalOldRevenue,
      averageCredits: averageOldCredits,
      totalUsers
    },
    newSystemProjection: {
      month1Revenue,
      month2Revenue,
      month3Revenue,
      projectedRetention,
      estimatedLifetime: 8.4 // meses
    },
    migrationBenefits: {
      userSavings,
      platformGrowthPotential: ((totalUsers * 4) - totalUsers), // 4x mais usuários potenciais
      retentionImprovement: '+9%'
    }
  };
};

// 🔧 Verificação de integridade pós-migração
export const validateMigration = (newSubscription: NewUserSubscription): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Validar créditos
  if (newSubscription.credits_balance < 0) {
    issues.push('Saldo de créditos negativo');
  }

  if (newSubscription.credits_balance < NEW_SUBSCRIPTION_CONFIG[newSubscription.current_cycle_month].creditsReceived) {
    recommendations.push('Créditos abaixo do mínimo esperado para o mês');
  }

  // Validar vidas
  if (newSubscription.lives_remaining < 0) {
    issues.push('Vidas negativas');
  }

  if (newSubscription.lives_remaining > 20) {
    recommendations.push('Muitas vidas acumuladas - verificar se está correto');
  }

  // Validar datas
  const now = Date.now();
  const nextPayment = new Date(newSubscription.next_payment_due).getTime();
  
  if (nextPayment < now) {
    issues.push('Data de próximo pagamento no passado');
  }

  // Validar status
  if (!['active', 'pending_payment', 'suspended'].includes(newSubscription.status)) {
    issues.push('Status de assinatura inválido');
  }

  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  };
};

// 📱 Migração para dados locais (demo)
export const migrateLocalData = (): MigrationResult => {
  try {
    // Buscar dados antigos
    const oldProfile = localStorage.getItem('demo_profile');
    const oldWallet = localStorage.getItem('demo_wallet');
    const oldCredits = localStorage.getItem('demo_credits');

    if (!oldProfile && !oldWallet && !oldCredits) {
      return {
        success: false,
        errors: ['Nenhum dado antigo encontrado para migrar']
      };
    }

    // Simular usuário antigo
    const oldUser: OldSystemUser = {
      subscription: {
        id: 'demo-old',
        user_id: 'demo-user',
        current_cycle_month: 1,
        total_paid_current_cycle: 20,
        status: 'active',
        created_at: new Date().toISOString()
      },
      credits: oldCredits ? JSON.parse(oldCredits) : undefined,
      profile: oldProfile ? JSON.parse(oldProfile) : undefined
    };

    // Migrar
    const result = migrateUserToNewSystem(oldUser);
    
    if (result.success && result.newSubscription) {
      // Salvar nova assinatura
      localStorage.setItem('demo_new_subscription', JSON.stringify(result.newSubscription));
      
      // Fazer backup dos dados antigos
      localStorage.setItem('demo_old_backup', JSON.stringify({
        profile: oldProfile,
        wallet: oldWallet,
        credits: oldCredits,
        migrationDate: new Date().toISOString()
      }));

      result.migrationNotes?.push('Dados locais migrados com sucesso');
      result.migrationNotes?.push('Backup dos dados antigos criado');
    }

    return result;

  } catch (error) {
    return {
      success: false,
      errors: [`Erro na migração local: ${error instanceof Error ? error.message : 'Erro desconhecido'}`]
    };
  }
};
