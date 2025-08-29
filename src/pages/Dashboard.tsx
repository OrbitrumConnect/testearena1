import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Trophy, Wallet, BarChart3, Clock, Target, Star, TrendingUp, Calendar, Award } from 'lucide-react';
import { ActionButton } from '@/components/arena/ActionButton';
import { ParticleBackground } from '@/components/ui/particles';
import { AuthForm } from '@/components/auth/AuthForm';
import { useDashboard } from '@/hooks/useDashboard';
import { useResetData } from '@/hooks/useResetData';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const isMobile = useIsMobile();
  const { profile, wallet, battleHistory, transactions, loading, error } = useDashboard();
  const { resetAllData, forceReset, resetting } = useResetData();

  useEffect(() => {
    // Permitir acesso direto ao dashboard sem autenticação obrigatória
    setIsAuthenticated(true);
    setAuthLoading(false);

    // Opcional: verificar se há usuário logado para dados personalizados
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // Apenas para verificar se há sessão, mas não bloquear acesso
    };

    checkAuth();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10">
          <Skeleton className="h-16 w-64" />
        </div>
      </div>
    );
  }

  // Remover bloqueio de autenticação - acesso direto permitido

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEraEmoji = (era: string) => {
    const emojiMap: { [key: string]: string } = {
      'Egito Antigo': '🏺',
      'Mesopotâmia': '📜',
      'Era Medieval': '⚔️',
      'Era Digital': '💻',
    };
    return emojiMap[era] || '🎯';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-victory';
    if (accuracy >= 60) return 'text-epic';
    return 'text-destructive';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-12 w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center">
          <div className="arena-card-epic p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-montserrat font-bold text-destructive mb-4">
              Erro ao Carregar Dashboard
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <ActionButton variant="epic" onClick={() => navigate('/app')}>
              Voltar ao Menu
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  const winRate = profile?.total_battles ? (profile.battles_won / profile.total_battles * 100) : 0;
  const avgAccuracy = battleHistory.length ? 
    battleHistory.reduce((acc, battle) => acc + battle.accuracy_percentage, 0) / battleHistory.length : 0;

  return (
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background relative`}>
      <ParticleBackground />
      
      <div className={`relative z-10 max-w-7xl mx-auto ${isMobile ? 'p-3 h-full overflow-y-auto' : 'p-6'}`}>
        {/* Header */}
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className="flex items-center gap-3">
            <ActionButton 
              variant="battle" 
              icon={<ArrowLeft />}
              onClick={() => navigate('/app')}
              className={`backdrop-blur-sm bg-battle-dark/80 ${isMobile ? 'text-sm px-3 py-2' : ''}`}
            >
              Voltar
            </ActionButton>
            
            {/* Botões de Reset */}
            <ActionButton 
              variant="destructive" 
              onClick={resetAllData}
              disabled={resetting}
              className={`backdrop-blur-sm ${isMobile ? 'text-xs px-2 py-2' : 'text-sm px-3 py-2'}`}
              title="Zerar todos os dados"
            >
              {resetting ? '⏳' : '🗑️'} {!isMobile && 'Reset'}
            </ActionButton>
            
            <ActionButton 
              variant="outline" 
              onClick={forceReset}
              className={`backdrop-blur-sm ${isMobile ? 'text-xs px-2 py-2' : 'text-sm px-3 py-2'}`}
              title="Reset forçado (limpa cache)"
            >
              🔄 {!isMobile && 'Forçar'}
            </ActionButton>
          </div>
          
          <div className={`text-center arena-card-epic backdrop-blur-sm bg-card/80 ${isMobile ? 'px-4 py-3' : 'px-8 py-4'}`}>
            <h1 className={`font-montserrat font-bold text-epic flex items-center justify-center gap-3 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
              <User className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
              Dashboard{isMobile ? '' : ' do Guerreiro'}
            </h1>
            <p className={`text-muted-foreground ${isMobile ? 'mt-1 text-xs' : 'mt-2'}`}>
              {isMobile ? 'Suas conquistas' : 'Acompanhe suas conquistas e evolução'}
            </p>
          </div>
        </div>

        <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-3 gap-8'}`}>
          {/* Coluna Principal */}
          <div className={`${isMobile ? 'space-y-3' : 'lg:col-span-2 space-y-6'}`}>
            {/* Perfil do Usuário */}
            <Card className={`arena-card-epic ${isMobile ? 'p-4' : 'p-6'}`}>
              <div className={`flex items-center ${isMobile ? 'gap-3 mb-4' : 'gap-6 mb-6'}`}>
                <div className={`rounded-full bg-epic/20 flex items-center justify-center border-2 border-epic ${isMobile ? 'w-12 h-12 text-xl' : 'w-20 h-20 text-3xl'}`}>
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    '👤'
                  )}
                </div>
                <div>
                  <h2 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                    {profile?.display_name || 'Guerreiro Anônimo'}
                  </h2>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
                    Membro desde {profile ? formatDate(profile.created_at).split(' ')[0] : '---'}
                  </p>
                  {profile?.favorite_era && (
                    <Badge variant="secondary" className={`${isMobile ? 'mt-1 text-xs' : 'mt-2'}`}>
                      {isMobile ? profile.favorite_era : `Era Favorita: ${profile.favorite_era}`}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Estatísticas Principais */}
              <div className={`grid grid-cols-2 ${isMobile ? 'gap-2' : 'md:grid-cols-4 gap-4'}`}>
                <div className={`arena-card text-center ${isMobile ? 'p-2' : 'p-4'}`}>
                  <Trophy className={`text-victory mx-auto ${isMobile ? 'w-5 h-5 mb-1' : 'w-8 h-8 mb-2'}`} />
                  <p className={`font-bold text-victory ${isMobile ? 'text-lg' : 'text-2xl'}`}>{profile?.total_xp || 0}</p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>XP Total</p>
                </div>
                <div className={`arena-card text-center ${isMobile ? 'p-2' : 'p-4'}`}>
                  <Target className={`text-epic mx-auto ${isMobile ? 'w-5 h-5 mb-1' : 'w-8 h-8 mb-2'}`} />
                  <p className={`font-bold text-epic ${isMobile ? 'text-lg' : 'text-2xl'}`}>{profile?.total_battles || 0}</p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Batalhas</p>
                </div>
                <div className={`arena-card text-center ${isMobile ? 'p-2' : 'p-4'}`}>
                  <Award className={`text-battle mx-auto ${isMobile ? 'w-5 h-5 mb-1' : 'w-8 h-8 mb-2'}`} />
                  <p className={`font-bold text-battle ${isMobile ? 'text-lg' : 'text-2xl'}`}>{profile?.battles_won || 0}</p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Vitórias</p>
                </div>
                <div className={`arena-card text-center ${isMobile ? 'p-2' : 'p-4'}`}>
                  <TrendingUp className={`text-victory mx-auto ${isMobile ? 'w-5 h-5 mb-1' : 'w-8 h-8 mb-2'}`} />
                  <p className={`font-bold text-victory ${isMobile ? 'text-lg' : 'text-2xl'}`}>{winRate.toFixed(1)}%</p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{isMobile ? 'Taxa' : 'Taxa de Vitória'}</p>
                </div>
              </div>
            </Card>

            {/* Histórico de Batalhas */}
            <Card className="arena-card-epic p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-epic" />
                <h3 className="text-xl font-montserrat font-bold text-epic">Histórico de Batalhas</h3>
              </div>

              {battleHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Nenhuma batalha registrada ainda</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Comece sua jornada e conquiste as eras!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {battleHistory.map((battle) => (
                    <div key={battle.id} className="arena-card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getEraEmoji(battle.era_name)}</div>
                          <div>
                            <h4 className="font-semibold">{battle.era_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {battle.questions_correct}/{battle.questions_total} corretas
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getAccuracyColor(battle.accuracy_percentage)}`}>
                            {battle.accuracy_percentage}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            +{battle.xp_earned} XP
                          </p>
                          {battle.money_earned > 0 && (
                            <p className="text-sm text-victory">
                              +{formatCurrency(battle.money_earned)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(battle.completed_at)}
                        </span>
                        {battle.battle_duration_seconds && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.floor(battle.battle_duration_seconds / 60)}m {battle.battle_duration_seconds % 60}s
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Carteira */}
            <Card className="arena-card-epic p-6">
              <div className="flex items-center gap-3 mb-6">
                <Wallet className="w-6 h-6 text-epic" />
                <h3 className="text-xl font-montserrat font-bold text-epic">Carteira</h3>
              </div>

              <div className="space-y-4">
                <div className="arena-card p-4 text-center bg-victory/10 border-victory/30">
                  <p className="text-sm text-muted-foreground mb-1">Saldo Atual</p>
                  <p className="text-2xl font-bold text-victory">
                    {wallet ? `${Math.round(wallet.balance * 100)} créditos` : '0 créditos'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="arena-card p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Conquistado</p>
                    <p className="text-lg font-bold text-epic">
                      {wallet ? `${Math.round(wallet.total_earned * 100)} créditos` : '0 créditos'}
                    </p>
                  </div>
                  <div className="arena-card p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Gasto</p>
                    <p className="text-lg font-bold text-battle">
                      {wallet ? `${Math.round(wallet.total_spent * 100)} créditos` : '0 créditos'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Transações Recentes */}
            <Card className="arena-card-epic p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-epic" />
                <h3 className="text-xl font-montserrat font-bold text-epic">Transações Recentes</h3>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-4">
                  <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">Nenhuma transação ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="arena-card p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                        <div className={`text-right ${
                          transaction.transaction_type === 'earned' ? 'text-victory' : 
                          transaction.transaction_type === 'bonus' ? 'text-epic' : 'text-destructive'
                        }`}>
                          <p className="font-bold">
                            {transaction.transaction_type === 'spent' ? '-' : '+'}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Estatísticas Resumidas */}
            <Card className="arena-card-epic p-6">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-epic" />
                <h3 className="text-xl font-montserrat font-bold text-epic">Resumo</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Precisão Média</span>
                  <span className={`font-bold ${getAccuracyColor(avgAccuracy)}`}>
                    {avgAccuracy.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">XP por Batalha</span>
                  <span className="font-bold text-epic">
                    {profile?.total_battles ? Math.round(profile.total_xp / profile.total_battles) : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Créditos por Vitória</span>
                  <span className="font-bold text-victory">
                    {wallet && profile?.battles_won ? 
                      `${Math.round((wallet.total_earned / profile.battles_won) * 100)} créditos` : '0 créditos'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;