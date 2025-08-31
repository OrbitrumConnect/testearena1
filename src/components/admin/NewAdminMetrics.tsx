import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  CreditCard,
  Calendar,
  Heart,
  ArrowUpDown,
  Target
} from 'lucide-react';

// Mock data - em produção viria do backend
const mockNewSystemMetrics = {
  financialSummary: {
    monthlyRevenue: 2847.50,
    totalUsers: 4205,
    retentionRate: 87,
    averageLifetime: 8.4
  },
  cycleDistribution: {
    month1Users: 1402, // R$ 5,00
    month2Users: 1398, // R$ 3,50  
    month3Users: 1405  // R$ 2,00
  },
  livesUsage: {
    freeUsageDaily: 9846,  // vidas grátis usadas
    extraPurchased: 2134,  // vidas extras compradas
    conversionRate: 21.7   // % que compra vidas extras
  },
  creditsFlow: {
    totalCreditsBalance: 1_678_450, // créditos em circulação
    weeklyEarned: 45_230,          // créditos ganhos por semana
    weeklySpent: 38_940,           // créditos gastos por semana
    pendingWithdrawals: 234_567    // créditos aguardando saque
  },
  systemComparison: {
    oldSystemUsers: 856,    // usuários que migraram
    newSystemUsers: 3349,   // usuários diretos no novo
    migrationRate: 20.4     // % de conversão
  }
};

interface NewAdminMetricsProps {
  className?: string;
}

export const NewAdminMetrics: React.FC<NewAdminMetricsProps> = ({ className = '' }) => {
  const metrics = mockNewSystemMetrics;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('pt-BR').format(value);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-victory">
              {formatCurrency(metrics.financialSummary.monthlyRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              20% de {formatCurrency(metrics.financialSummary.monthlyRevenue * 5)} total pago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-epic">
              {formatNumber(metrics.financialSummary.totalUsers)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.systemComparison.migrationRate}% são migrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Retenção</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-victory">
              {metrics.financialSummary.retentionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              +{metrics.financialSummary.retentionRate - 78}% vs sistema antigo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Médio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-epic">
              {metrics.financialSummary.averageLifetime} meses
            </div>
            <p className="text-xs text-muted-foreground">
              Valor médio por usuário
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cycle Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Distribuição por Mês do Ciclo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded border">
              <div className="text-sm text-muted-foreground">Mês 1 - R$ 5,00</div>
              <div className="text-2xl font-bold text-epic">
                {formatNumber(metrics.cycleDistribution.month1Users)}
              </div>
              <div className="text-xs text-muted-foreground">usuários</div>
              <Badge variant="secondary" className="mt-2">
                {((metrics.cycleDistribution.month1Users / metrics.financialSummary.totalUsers) * 100).toFixed(1)}%
              </Badge>
            </div>
            
            <div className="text-center p-4 rounded border">
              <div className="text-sm text-muted-foreground">Mês 2 - R$ 3,50</div>
              <div className="text-2xl font-bold text-victory">
                {formatNumber(metrics.cycleDistribution.month2Users)}
              </div>
              <div className="text-xs text-muted-foreground">usuários</div>
              <Badge variant="secondary" className="mt-2">
                {((metrics.cycleDistribution.month2Users / metrics.financialSummary.totalUsers) * 100).toFixed(1)}%
              </Badge>
            </div>
            
            <div className="text-center p-4 rounded border">
              <div className="text-sm text-muted-foreground">Mês 3 - R$ 2,00</div>
              <div className="text-2xl font-bold text-purple-500">
                {formatNumber(metrics.cycleDistribution.month3Users)}
              </div>
              <div className="text-xs text-muted-foreground">usuários</div>
              <Badge variant="secondary" className="mt-2">
                {((metrics.cycleDistribution.month3Users / metrics.financialSummary.totalUsers) * 100).toFixed(1)}%
              </Badge>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Distribuição equilibrada indica ciclo saudável (~33% cada mês)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lives & Credits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lives Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Sistema de Vidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vidas grátis usadas/dia</span>
                <span className="font-medium">{formatNumber(metrics.livesUsage.freeUsageDaily)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vidas extras compradas</span>
                <span className="font-medium text-victory">{formatNumber(metrics.livesUsage.extraPurchased)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Taxa de conversão</span>
                <span className="font-medium text-epic">{metrics.livesUsage.conversionRate}%</span>
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <div className="text-xs text-muted-foreground mb-2">Taxa de Conversão Vidas Extras</div>
              <Progress value={metrics.livesUsage.conversionRate} className="h-2" />
              <div className="text-xs text-center text-muted-foreground mt-1">
                Meta: 25% • Atual: {metrics.livesUsage.conversionRate}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credits Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-epic" />
              Fluxo de Créditos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total em circulação</span>
                <span className="font-medium">{formatNumber(metrics.creditsFlow.totalCreditsBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ganhos/semana</span>
                <span className="font-medium text-victory">+{formatNumber(metrics.creditsFlow.weeklyEarned)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Gastos/semana</span>
                <span className="font-medium text-destructive">-{formatNumber(metrics.creditsFlow.weeklySpent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Aguardando saque</span>
                <span className="font-medium text-epic">{formatNumber(metrics.creditsFlow.pendingWithdrawals)}</span>
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <div className="text-xs text-muted-foreground">
                Saldo semanal: +{formatNumber(metrics.creditsFlow.weeklyEarned - metrics.creditsFlow.weeklySpent)} créditos
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Comparação de Sistemas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded bg-destructive/10 border border-destructive/20">
              <div className="text-sm text-muted-foreground">Sistema Antigo (R$ 20)</div>
              <div className="text-2xl font-bold text-destructive">
                {formatNumber(metrics.systemComparison.oldSystemUsers)}
              </div>
              <div className="text-xs text-muted-foreground">usuários migrados</div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl">→</div>
                <div className="text-sm font-medium text-epic">MIGRAÇÃO</div>
                <div className="text-xs text-muted-foreground">
                  {metrics.systemComparison.migrationRate}% taxa
                </div>
              </div>
            </div>
            
            <div className="text-center p-4 rounded bg-victory/10 border border-victory/20">
              <div className="text-sm text-muted-foreground">Sistema Novo (R$ 5-2)</div>
              <div className="text-2xl font-bold text-victory">
                {formatNumber(metrics.systemComparison.newSystemUsers)}
              </div>
              <div className="text-xs text-muted-foreground">usuários novos</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 rounded bg-epic/10 border border-epic/20">
            <div className="text-sm font-medium text-epic">Impacto do Novo Sistema:</div>
            <div className="text-xs text-muted-foreground mt-1">
              • {((metrics.systemComparison.newSystemUsers / metrics.systemComparison.oldSystemUsers) * 100 - 100).toFixed(0)}% mais usuários que o sistema antigo
              • Preço 75% mais acessível no mês 3
              • Taxa de retenção {metrics.financialSummary.retentionRate}% (+9% vs antigo)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
