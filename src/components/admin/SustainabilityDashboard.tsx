import React, { useState, useEffect } from 'react';
import { simulateSustainability, projectMonthlyRevenue, PVP_ECONOMICS_CONFIG } from '@/utils/pvpEconomics';
import { supabase } from '@/integrations/supabase/client';
import { generateMeritReport } from '@/utils/meritSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Users,
  Calculator,
  Target,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface SustainabilityDashboardProps {
  className?: string;
}

// Dados reais dinâmicos - buscar do Supabase em tempo real
const fetchRealMetrics = async () => {
  try {
    // Buscar total de usuários
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Buscar usuários ativos (últimos 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', sevenDaysAgo.toISOString());

    // Buscar total de batalhas para calcular média
    const { count: totalBattles } = await supabase
      .from('battle_history')
      .select('*', { count: 'exact', head: true });

    // Buscar créditos em circulação (soma de todos os wallets)
    const { data: wallets } = await supabase
      .from('user_wallet')
      .select('balance, total_earned');

    const totalCredits = wallets?.reduce((sum, wallet) => sum + (wallet.balance || 0), 0) || 0;
    const totalEarned = wallets?.reduce((sum, wallet) => sum + (wallet.total_earned || 0), 0) || 0;

    return {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      avgPvPsPerUser: totalUsers ? (totalBattles || 0) / totalUsers : 0,
      totalCreditsInCirculation: totalCredits,
      monthlyRevenue: (totalEarned || 0) * 0.01, // Converter créditos para reais (1% = R$0,01)
      platformRetention: (totalEarned || 0) * 0.225 * 0.01 // 22,5% de retenção
    };
  } catch (error) {
    console.error('Erro ao buscar métricas reais:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      avgPvPsPerUser: 0,
      totalCreditsInCirculation: 0,
      monthlyRevenue: 0,
      platformRetention: 0
    };
  }
};

export const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({ 
  className = '' 
}) => {
  const [currentMetrics, setCurrentMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    avgPvPsPerUser: 0,
    totalCreditsInCirculation: 0,
    monthlyRevenue: 0,
    platformRetention: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'realistic' | 'optimistic'>('realistic');

  // Carregar dados reais ao iniciar
  useEffect(() => {
    handleRefreshMetrics();
  }, []);

  // Cálculos de sustentabilidade em tempo real
  const sustainabilityAnalysis = simulateSustainability(
    currentMetrics.totalUsers,
    currentMetrics.avgPvPsPerUser
  );

  // Projeções de crescimento
  const growthProjections = projectMonthlyRevenue({
    conservative: { users: currentMetrics.totalUsers * 1.1, avgPvPs: 6 },
    realistic: { users: currentMetrics.totalUsers * 1.5, avgPvPs: 8 },
    optimistic: { users: currentMetrics.totalUsers * 2.5, avgPvPs: 12 }
  });

  const handleRefreshMetrics = async () => {
    setIsRefreshing(true);
    
    try {
      console.log('🔄 Atualizando métricas reais do admin...');
      const realMetrics = await fetchRealMetrics();
      setCurrentMetrics(realMetrics);
      console.log('✅ Métricas reais carregadas:', realMetrics);
    } catch (error) {
      console.error('❌ Erro ao carregar métricas:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-victory border-victory bg-victory/10';
      case 'medium': return 'text-yellow-600 border-yellow-600 bg-yellow-600/10';
      case 'high': return 'text-destructive border-destructive bg-destructive/10';
      default: return 'text-muted-foreground border-muted bg-muted/10';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <TrendingDown className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com Refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🎯 Simulador de Sustentabilidade</h2>
        <Button
          onClick={handleRefreshMetrics}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar Dados'}
        </Button>
      </div>

      {/* Status Geral de Sustentabilidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Status de Sustentabilidade Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Principal */}
            <div className={`p-4 rounded-lg border ${getRiskLevelColor(sustainabilityAnalysis.riskLevel)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getRiskIcon(sustainabilityAnalysis.riskLevel)}
                <span className="font-semibold">
                  {sustainabilityAnalysis.isSustainable ? 'SUSTENTÁVEL' : 'ATENÇÃO'}
                </span>
              </div>
              <div className="text-2xl font-bold">
                {sustainabilityAnalysis.riskLevel.toUpperCase()}
              </div>
              <div className="text-sm opacity-75">
                Nível de risco
              </div>
            </div>

            {/* Margem de Lucro */}
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-victory" />
                <span className="font-semibold">Margem de Lucro</span>
              </div>
              <div className="text-2xl font-bold text-victory">
                {sustainabilityAnalysis.profitMargin.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Meta: ≥15%
              </div>
            </div>

            {/* Receita Líquida */}
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-epic" />
                <span className="font-semibold">Receita Líquida</span>
              </div>
              <div className="text-2xl font-bold text-epic">
                R$ {sustainabilityAnalysis.netPlatformRevenue.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Por mês
              </div>
            </div>

            {/* Usuários vs Break-even */}
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">Usuários</span>
              </div>
              <div className="text-2xl font-bold text-blue-500">
                {currentMetrics.totalUsers}
              </div>
              <div className="text-sm text-muted-foreground">
                Break-even: {sustainabilityAnalysis.breakEvenPoint}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fluxo Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Fluxo Financeiro Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total arrecadado (PvP):</span>
                <span className="font-semibold text-victory">
                  +R$ {sustainabilityAnalysis.totalEntryFees.toFixed(0)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prêmios pagos:</span>
                <span className="font-semibold text-destructive">
                  -R$ {sustainabilityAnalysis.totalPrizesAwarded.toFixed(0)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Retenção plataforma:</span>
                <span className="font-semibold text-epic">
                  +R$ {sustainabilityAnalysis.platformRetention.toFixed(0)}
                </span>
              </div>
              
              <hr className="border-muted" />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Lucro líquido:</span>
                <span className={sustainabilityAnalysis.netPlatformRevenue > 0 ? 'text-victory' : 'text-destructive'}>
                  R$ {sustainabilityAnalysis.netPlatformRevenue.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sustentabilidade:</span>
                <span>{sustainabilityAnalysis.profitMargin.toFixed(1)}% / 15%</span>
              </div>
              <Progress 
                value={Math.min(100, (sustainabilityAnalysis.profitMargin / 15) * 100)} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Projeções de Crescimento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Projeções de Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seletor de Cenário */}
            <div className="flex gap-2">
              {(['conservative', 'realistic', 'optimistic'] as const).map((scenario) => (
                <Button
                  key={scenario}
                  variant={selectedScenario === scenario ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedScenario(scenario)}
                >
                  {scenario === 'conservative' ? 'Conservador' :
                   scenario === 'realistic' ? 'Realista' : 'Otimista'}
                </Button>
              ))}
            </div>

            {/* Dados do Cenário Selecionado */}
            <div className="space-y-3">
              {(() => {
                const scenario = growthProjections.scenarios[selectedScenario];
                return (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Usuários projetados:</span>
                      <span className="font-semibold">{scenario.totalUsers.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PvPs/usuário/mês:</span>
                      <span className="font-semibold">{scenario.averagePvPsPerUser.toFixed(1)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Receita projetada:</span>
                      <span className="font-semibold text-victory">
                        R$ {scenario.netPlatformRevenue.toFixed(0)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Margem de lucro:</span>
                      <span className={`font-semibold ${scenario.profitMargin > 15 ? 'text-victory' : 'text-yellow-600'}`}>
                        {scenario.profitMargin.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sustentável:</span>
                      <span className={`font-semibold ${scenario.isSustainable ? 'text-victory' : 'text-destructive'}`}>
                        {scenario.isSustainable ? 'SIM' : 'NÃO'}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendações */}
      {sustainabilityAnalysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Recomendações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sustainabilityAnalysis.recommendations.map((recommendation, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 p-3 rounded bg-yellow-500/10 border border-yellow-500/30"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configurações do Sistema PvP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Configurações Atuais do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 rounded border">
              <div className="text-muted-foreground">Taxa de Entrada</div>
              <div className="text-lg font-bold">{PVP_ECONOMICS_CONFIG.entryFee}</div>
              <div className="text-xs text-muted-foreground">créditos</div>
            </div>
            
            <div className="text-center p-3 rounded border">
              <div className="text-muted-foreground">Prêmio Vencedor</div>
              <div className="text-lg font-bold">{PVP_ECONOMICS_CONFIG.winnerPrize}</div>
              <div className="text-xs text-muted-foreground">créditos</div>
            </div>
            
            <div className="text-center p-3 rounded border">
              <div className="text-muted-foreground">Retenção</div>
              <div className="text-lg font-bold">{PVP_ECONOMICS_CONFIG.platformRetention}</div>
              <div className="text-xs text-muted-foreground">créditos</div>
            </div>
            
            <div className="text-center p-3 rounded border">
              <div className="text-muted-foreground">Margem</div>
              <div className="text-lg font-bold">{PVP_ECONOMICS_CONFIG.profitMargin.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">por partida</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
