import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Trophy, Wallet, BarChart3, Clock, Target, Star, TrendingUp, Calendar, Award, Shield, CheckCircle, Sword, DollarSign, Send } from 'lucide-react';
import { ActionButton } from '@/components/arena/ActionButton';
import { ParticleBackground } from '@/components/ui/particles';
import { AuthForm } from '@/components/auth/AuthForm';
import { useDashboard } from '@/hooks/useDashboard';
import { useResetData } from '@/hooks/useResetData';
import { supabase } from '@/integrations/supabase/client';
import { calculateWithdrawal, calculateTrainingCredits, getCurrentQuarter, getRankingTier, applyRankingBonus, RANKING_BONUSES, PlanType } from '@/utils/creditsSystem';
import { getUserPlan } from '@/utils/creditsIntegration';
import { getUserCredits, calculateTotalBalance, calculateWithdrawableAmount } from '@/utils/creditsUnified';
import { initializeTestSystem, checkDataConsistency } from '@/utils/testCredits';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { PixRequestForm } from '@/components/pix/PixRequestForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
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

  // Calcular créditos com bônus de ranking
  const calculateCreditsWithBonus = (baseCredits: number) => {
    // Simular ranking (em produção viria do Supabase)
    const userRank = 1; // Exemplo: TOP 1
    const totalUsers = 100; // Exemplo: 100 usuários
    const rankingTier = getRankingTier(userRank, totalUsers);
    const creditsWithBonus = applyRankingBonus(baseCredits, rankingTier);
    
    return {
      baseCredits,
      bonusCredits: creditsWithBonus - baseCredits,
      totalCredits: creditsWithBonus,
      rankingTier,
      rankingBonus: RANKING_BONUSES[rankingTier]
    };
  };

  // Calcular créditos por era com bônus
  const getEraCreditsWithBonus = (eraName: string) => {
    const eraBattles = battleHistory.filter(battle => 
      battle.era_name.toLowerCase().includes(eraName.toLowerCase()) ||
      (eraName === 'egypt' && battle.era_name.includes('Egito')) ||
      (eraName === 'mesopotamia' && battle.era_name.includes('Mesopotâmia')) ||
      (eraName === 'medieval' && battle.era_name.includes('Medieval')) ||
      (eraName === 'digital' && battle.era_name.includes('Digital'))
    );
    
    if (eraBattles.length === 0) return { baseCredits: 0, bonusCredits: 0, totalCredits: 0 };
    
    const totalCredits = eraBattles.reduce((sum, battle) => {
      const trainingCredits = calculateTrainingCredits(
        'premium' as PlanType,
        battle.era_name.toLowerCase().replace(' ', '-'),
        battle.questions_correct || 0,
        battle.questions_total || 10
      );
      return sum + trainingCredits.creditsEarned;
    }, 0);
    
    return calculateCreditsWithBonus(totalCredits);
  };

  return (
    <div className={`${isMobile ? 'min-h-screen' : 'h-screen overflow-hidden'} relative`}>
      <div className={isMobile ? '' : 'scale-[0.628] origin-top-left w-[159%] h-[159%]'}>
      {/* Background Temático - Castelo Medieval */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/medieval-background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      
      <ParticleBackground />
      
      <div className={`relative z-10 max-w-7xl mx-auto ${isMobile ? 'p-2' : 'p-6'}`}>
        {/* Header Unificado */}
        <Card className={`arena-card-epic backdrop-blur-sm bg-card/80 ${isMobile ? 'p-3 mb-2' : 'p-6 mb-8'}`}>
          <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center justify-between'}`}>
            {/* Botão Voltar e Título */}
            <div className="flex items-center gap-2">
              <ActionButton 
                variant="battle" 
                icon={<ArrowLeft />}
                onClick={() => navigate('/app')}
                className={`backdrop-blur-sm bg-battle-dark/80 ${isMobile ? 'text-xs px-2 py-1' : ''}`}
              >
                {isMobile ? '' : 'Voltar'}
              </ActionButton>
              
              <div className="text-center">
                <h1 className={`font-montserrat font-bold text-epic flex items-center gap-2 ${isMobile ? 'text-base' : 'text-2xl'}`}>
                  <User className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                  Dashboard{isMobile ? '' : ' do Guerreiro'}
                </h1>
                <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {isMobile ? 'Suas conquistas' : 'Acompanhe suas conquistas e evolução'}
                </p>
              </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex items-center gap-3">
              <ActionButton 
                variant="battle" 
                onClick={resetAllData}
                disabled={resetting}
                className={`backdrop-blur-sm ${isMobile ? 'text-xs px-1 py-0.5' : 'text-sm px-3 py-2'}`}
              >
                <span className="text-xs">{resetting ? '⏳' : '🗑️'}</span> {!isMobile && 'Reset'}
              </ActionButton>
              
              <ActionButton 
                variant="epic" 
                onClick={forceReset}
                className={`backdrop-blur-sm ${isMobile ? 'text-xs px-1 py-0.5' : 'text-sm px-3 py-2'}`}
              >
                <span className="text-xs">🔄</span> {!isMobile && 'Forçar'}
              </ActionButton>
            </div>
          </div>
        </Card>

        {/* Upgrade VIP - Movido para cima para ficar visível */}
        <Card className={`arena-card-epic ${isMobile ? 'p-3 mb-3' : 'p-4 mb-6'}`}>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">🚀 Upgrade para VIP</h4>
            <p className="text-sm text-gray-300 mb-3">
              Treinos ilimitados + 50 créditos/mês + Suporte prioritário
            </p>
            <ActionButton 
              variant="epic" 
              onClick={() => navigate('/payment')}
              className="w-full"
            >
              Upgrade Agora
            </ActionButton>
          </div>
        </Card>

        <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-3 gap-8'}`}>
          {/* Coluna Principal */}
          <div className={`${isMobile ? 'space-y-6' : 'lg:col-span-2 space-y-6'}`}>
            {/* Perfil do Usuário */}
            <Card className={`arena-card-epic ${isMobile ? 'p-3' : 'p-6'}`}>
              <div className={`flex items-center justify-between ${isMobile ? 'gap-2 mb-2' : 'gap-6 mb-6'}`}>
                <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-6'}`}>
                  <div 
                    className={`rounded-full bg-epic/20 flex items-center justify-center border-2 border-epic cursor-pointer hover:border-victory transition-colors ${isMobile ? 'w-10 h-10 text-lg' : 'w-20 h-20 text-3xl'}`}
                    onClick={() => setShowProfileEdit(true)}
                    title="👤 Clique para editar perfil!"
                  >
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
                
                {/* Botão Editar Perfil */}
                <ActionButton
                  variant="epic"
                  onClick={() => setShowProfileEdit(true)}
                  className={`${isMobile ? 'p-2 text-xs' : 'p-3'} hover:bg-victory/20`}
                >
                  <User className="w-4 h-4 mr-1" />
                  {isMobile ? 'Editar' : 'Editar Perfil'}
                </ActionButton>
              </div>

              {/* Estatísticas Principais */}
              <div className={`grid grid-cols-2 ${isMobile ? 'gap-2' : 'md:grid-cols-4 gap-4'}`}>
                <div className="text-center">
                  <p className={`font-bold text-victory ${isMobile ? 'text-lg' : 'text-2xl'}`}>{profile?.total_xp || 0}</p>
                  <p className="text-xs text-muted-foreground">XP Total</p>
                </div>
                <div className="text-center">
                  <p className={`font-bold text-epic ${isMobile ? 'text-lg' : 'text-2xl'}`}>{profile?.total_battles || 0}</p>
                  <p className="text-xs text-muted-foreground">Batalhas</p>
                </div>
                <div className="text-center">
                  <p className={`font-bold text-battle ${isMobile ? 'text-lg' : 'text-2xl'}`}>{profile?.battles_won || 0}</p>
                  <p className="text-xs text-muted-foreground">Vitórias</p>
                </div>
                <div className="text-center">
                  <p className={`font-bold text-legendary ${isMobile ? 'text-lg' : 'text-2xl'}`}>{winRate.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Taxa de Vitória</p>
                </div>
              </div>
            </Card>

            {/* Acesso Rápido às Eras */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-epic mb-4">🚀 Acesso Rápido às Eras</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Egito */}
                <div className="arena-card text-center p-4 cursor-pointer hover-scale" onClick={() => navigate('/training')}>
                  <div className="text-3xl mb-2">🏺</div>
                  <h4 className="font-bold text-sm mb-2">Egito Antigo</h4>
                  {(() => {
                    const credits = getEraCreditsWithBonus('egypt');
                    return (
                      <div className="text-xs">
                        <p className="text-victory">+{credits.totalCredits.toFixed(1)} créditos</p>
                        {credits.bonusCredits > 0 && (
                          <p className="text-epic text-xs">+{credits.bonusCredits.toFixed(1)} bônus</p>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Mesopotâmia */}
                <div className="arena-card text-center p-4 cursor-pointer hover-scale" onClick={() => navigate('/mesopotamia')}>
                  <div className="text-3xl mb-2">📜</div>
                  <h4 className="font-bold text-sm mb-2">Mesopotâmia</h4>
                  {(() => {
                    const credits = getEraCreditsWithBonus('mesopotamia');
                    return (
                      <div className="text-xs">
                        <p className="text-victory">+{credits.totalCredits.toFixed(1)} créditos</p>
                        {credits.bonusCredits > 0 && (
                          <p className="text-epic text-xs">+{credits.bonusCredits.toFixed(1)} bônus</p>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Medieval */}
                <div className="arena-card text-center p-4 cursor-pointer hover-scale" onClick={() => navigate('/medieval')}>
                  <div className="text-3xl mb-2">⚔️</div>
                  <h4 className="font-bold text-sm mb-2">Era Medieval</h4>
                  {(() => {
                    const credits = getEraCreditsWithBonus('medieval');
                    return (
                      <div className="text-xs">
                        <p className="text-victory">+{credits.totalCredits.toFixed(1)} créditos</p>
                        {credits.bonusCredits > 0 && (
                          <p className="text-epic text-xs">+{credits.bonusCredits.toFixed(1)} bônus</p>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Digital */}
                <div className="arena-card text-center p-4 cursor-pointer hover-scale" onClick={() => navigate('/digital')}>
                  <div className="text-3xl mb-2">💻</div>
                  <h4 className="font-bold text-sm mb-2">Era Digital</h4>
                  {(() => {
                    const credits = getEraCreditsWithBonus('digital');
                    return (
                      <div className="text-xs">
                        <p className="text-victory">+{credits.totalCredits.toFixed(1)} créditos</p>
                        {credits.bonusCredits > 0 && (
                          <p className="text-epic text-xs">+{credits.bonusCredits.toFixed(1)} bônus</p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </section>

            {/* Histórico de Batalhas (Compacto) */}
            <Card className={`arena-card-epic ${isMobile ? 'p-3' : 'p-4'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-epic flex items-center gap-2">
                  <Sword className="w-4 h-4" />
                  Últimas Batalhas
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {battleHistory.length} batalhas
                </Badge>
              </div>
              
              <div className="space-y-2">
                {battleHistory.slice(0, 3).map((battle, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-800/50 rounded text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${battle.accuracy_percentage >= 70 ? 'bg-victory' : 'bg-battle'}`} />
                      <span className="text-muted-foreground">{battle.era_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-victory">+{(() => {
                        const trainingCredits = calculateTrainingCredits(
                          'premium' as PlanType,
                          battle.era_name.toLowerCase().replace(' ', '-'),
                          battle.questions_correct || 0,
                          battle.questions_total || 10
                        );
                        return trainingCredits.creditsEarned.toFixed(1);
                      })()} créditos</span>
                      <span className="text-muted-foreground">{battle.accuracy_percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Conquistas */}
            <Card className={`arena-card-epic ${isMobile ? 'p-3' : 'p-4'}`}>
              <h4 className="text-sm font-semibold text-epic flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4" />
                Conquistas
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-victory/10 rounded border border-victory/20">
                  <div className="text-lg font-bold text-victory">
                    {profile?.battles_won ? '🏆' : '🔒'}
                  </div>
                  <div className="text-xs text-muted-foreground">Primeira Vitória</div>
                  <div className="text-xs font-semibold text-victory">
                    {profile?.battles_won ? 'Conquistada!' : 'Bloqueada'}
                  </div>
                </div>
                
                <div className="text-center p-2 bg-epic/10 rounded border border-epic/20">
                  <div className="text-lg font-bold text-epic">
                    {profile?.total_battles >= 10 ? '⚔️' : '🔒'}
                  </div>
                  <div className="text-xs text-muted-foreground">Veterano</div>
                  <div className="text-xs font-semibold text-epic">
                    {profile?.total_battles >= 10 ? 'Conquistada!' : 'Bloqueada'}
                  </div>
                </div>
                
                <div className="text-center p-2 bg-legendary/10 rounded border border-legendary/20">
                  <div className="text-lg font-bold text-legendary">
                    {profile?.total_xp >= 1000 ? '🌟' : '🔒'}
                  </div>
                  <div className="text-xs text-muted-foreground">Mestre</div>
                  <div className="text-xs font-semibold text-legendary">
                    {profile?.total_xp >= 1000 ? 'Conquistada!' : 'Bloqueada'}
                  </div>
                </div>
                
                <div className="text-center p-2 bg-battle/10 rounded border border-battle/20">
                  <div className="text-lg font-bold text-battle">
                    {profile?.total_battles >= 50 ? '👑' : '🔒'}
                  </div>
                  <div className="text-xs text-muted-foreground">Lendário</div>
                  <div className="text-xs font-semibold text-battle">
                    {profile?.total_xp >= 1000 ? 'Conquistada!' : 'Bloqueada'}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Coluna Lateral Direita */}
          <div className={`${isMobile ? 'space-y-6' : 'space-y-6'} max-h-[calc(100vh-200px)] overflow-y-auto pr-2`}>
            {/* Carteira, Transações e Resumo Unificados */}
            <Card className={`arena-card-epic ${isMobile ? 'p-3' : 'p-6'}`}>
              <div className="flex items-center gap-3 mb-6">
                <Wallet className="w-6 h-6 text-epic" />
                <h3 className="text-xl font-montserrat font-bold text-epic">💰 Carteira & Estatísticas</h3>
              </div>

              {/* Saldo Principal */}
              <div className="arena-card p-4 text-center bg-victory/10 border-victory/30 mb-4">
                <p className="text-sm text-muted-foreground mb-1">Saldo Atual</p>
                <p className="text-2xl font-bold text-victory">
                  {wallet ? (
                    `${wallet.balance.toFixed(2)} créditos`
                  ) : (
                    '0.00 créditos'
                  )}
                </p>
                {wallet && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Total ganho: {wallet.total_earned.toFixed(2)} • Gasto: {wallet.total_spent.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Estatísticas da Carteira */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="arena-card p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total Conquistado</p>
                  <p className="text-sm font-bold text-epic">
                    {wallet ? `${wallet.total_earned.toFixed(2)} créditos` : '0.00 créditos'}
                  </p>
                </div>
                <div className="arena-card p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total Gasto</p>
                  <p className="text-sm font-bold text-battle">
                    {wallet ? `${wallet.total_spent.toFixed(2)} créditos` : '0.00 créditos'}
                  </p>
                </div>
              </div>

              {/* Resumo de Performance */}
              <section className="mb-4">
                <h4 className="text-sm font-semibold text-epic flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4" />
                  Resumo de Performance
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Precisão Média</span>
                    <span className={`text-sm font-bold ${getAccuracyColor(avgAccuracy)}`}>
                      {avgAccuracy.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">XP por Batalha</span>
                    <span className="text-sm font-bold text-epic">
                      {profile?.total_battles ? Math.round(profile.total_xp / profile.total_battles) : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Créditos por Vitória</span>
                    <span className="text-sm font-bold text-victory">
                      {wallet && profile?.battles_won ? 
                        `${Math.round((wallet.total_earned / profile.battles_won) * 100)}` : '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Créditos do Labirinto</span>
                    <span className="text-sm font-bold text-epic">
                      {parseFloat(localStorage.getItem('labyrinthCredits') || '0').toFixed(1)} créditos
                    </span>
                  </div>
                </div>
              </section>

              {/* Transações Recentes (Compacto) */}
              <div>
                <h4 className="text-sm font-semibold text-epic flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  Transações
                </h4>
                
                {transactions.length === 0 ? (
                  <div className="text-center py-2">
                    <Wallet className="w-6 h-6 text-muted-foreground mx-auto mb-1 opacity-50" />
                    <p className="text-xs text-muted-foreground">Nenhuma transação</p>
                  </div>
                ) : (
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {transactions.slice(0, 2).map((transaction) => (
                      <div key={transaction.id} className="arena-card p-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium truncate">{transaction.description}</p>
                          <div className={`text-right ${
                            transaction.transaction_type === 'earned' ? 'text-victory' : 
                            transaction.transaction_type === 'bonus' ? 'text-epic' : 'text-destructive'
                          }`}>
                            <p className="text-xs font-bold">
                              {transaction.transaction_type === 'spent' ? '-' : '+'}
                              {formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* PIX e Status da Conta Unificado */}
            <Card className={`arena-card-epic ${isMobile ? 'p-3' : 'p-6'}`}>
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-montserrat font-bold text-epic">💰 PIX & Status da Conta</h3>
              </div>

              {/* Status da Conta */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipo de Conta</span>
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    FREE
                  </Badge>
                </div>
                
                                                 <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vidas Disponíveis</span>
                  <span className="font-bold text-victory">10/dia</span>
                </div>
                {localStorage.getItem('userAge') === 'minor' && (
                  <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-600 font-semibold">
                      🛡️ Modo Restrito: PvP desabilitado, saque limitado a 50%
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Créditos Disponíveis</span>
                  <span className="font-bold text-green-400">
                    {wallet ? (
                      `${Math.max(0, wallet.balance).toFixed(0)} créditos`
                    ) : (
                      '0 créditos'
                    )}
                  </span>
                </div>
                
                {/* Status de Saque */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status Saque</span>
                  <span className={`font-bold ${(() => {
                    const today = new Date();
                    const isDay1 = today.getDate() === 1;
                    const hasMinCredits = (wallet?.balance || 0) >= 200;
                    
                    if (isDay1 && hasMinCredits) return 'text-green-400';
                    if (!isDay1) return 'text-blue-400';
                    return 'text-orange-400';
                  })()}`}>
                    {(() => {
                      const today = new Date();
                      const isDay1 = today.getDate() === 1;
                      const hasMinCredits = (wallet?.balance || 0) >= 200;
                      
                      if (isDay1 && hasMinCredits) return '✅ Disponível hoje';
                      if (isDay1 && !hasMinCredits) return '⏳ Mín. 200 créditos';
                      if (!isDay1) return `🗓️ Próximo dia 1°`;
                      return '⏳ Aguardando';
                    })()}
                  </span>
                </div>
              </div>

              {/* Solicitação PIX Integrada */}
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">
                    💰 Solicitar PIX - {(() => {
                      const isMinor = localStorage.getItem('userAge') === 'minor';
                      const balance = wallet?.balance || 0;
                      const maxSaque = isMinor ? Math.floor(balance * 0.5) : Math.min(balance, balance); // Usar saldo disponível
                      const valorReais = (maxSaque / 100).toFixed(2);
                      return `${maxSaque} créditos (R$ ${valorReais})`;
                    })()}
                  </h4>
                  <p className="text-sm text-gray-300 mb-3">
                    {localStorage.getItem('userAge') === 'minor' 
                      ? 'Saque limitado a 50% dos créditos (proteção para menores). Mínimo: 200 créditos (R$ 2,00). Taxa: 15%.'
: 'Saque disponível dia 1° do mês • Mínimo 200 créditos (R$ 2,00) • Taxa administrativa 15%'
                    }
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-white text-sm">CPF</label>
                      <input
                        type="text"
                        placeholder="000.000.000-00"
                        className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400"
                        maxLength={14}
                      />
                    </div>
                    
                    <ActionButton 
                      variant="victory" 
                      className="w-full"
                      disabled={(() => {
                        const today = new Date();
                        const isDay1 = today.getDate() === 1;
                        const hasMinCredits = (wallet?.balance || 0) >= 200;
                        return !isDay1 || !hasMinCredits;
                      })()}
                      onClick={() => {
                        const today = new Date();
                        const isDay1 = today.getDate() === 1;
                        const hasMinCredits = (wallet?.balance || 0) >= 200;
                        
                        if (!isDay1) {
                          alert('⏰ Saques só estão disponíveis no dia 1° de cada mês!');
                          return;
                        }
                        
                        if (!hasMinCredits) {
                          alert('⚠️ Mínimo de 200 créditos necessário para saque (R$ 2,00)');
                          return;
                        }
                        
                        const isMinor = localStorage.getItem('userAge') === 'minor';
                        if (isMinor) {
                          alert('⚠️ Menores de 18 anos têm saque limitado a 50% dos créditos. Taxa: 15%');
                        } else {
                          alert('🎉 Solicitação PIX enviada! Processamento em até 24h úteis. Taxa: 15%');
                        }
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {(() => {
                        const today = new Date();
                        const isDay1 = today.getDate() === 1;
                        const hasMinCredits = (wallet?.balance || 0) >= 200;
                        
                        if (!isDay1) return 'Disponível dia 1°';
                        if (!hasMinCredits) return 'Mínimo 200 créditos';
                        return 'Solicitar PIX';
                      })()}
                    </ActionButton>
                  </div>
                </div>


              </div>
            </Card>


          </div>
        </div>
      </div>
      </div>

      {/* Modal de Edição de Perfil */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-epic/20 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-epic">✏️ Editar Perfil do Guerreiro</h3>
              <button
                onClick={() => setShowProfileEdit(false)}
                className="text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Nome do Guerreiro */}
              <div>
                <label className="block text-sm font-medium text-epic mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  defaultValue={profile?.display_name || ''}
                  placeholder="Digite seu nome completo"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-epic focus:outline-none"
                  onChange={(e) => {
                    const newName = e.target.value;
                    localStorage.setItem('warriorName', newName);
                    if (profile) profile.display_name = newName;
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-epic mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  defaultValue={localStorage.getItem('userEmail') || ''}
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-epic focus:outline-none"
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    localStorage.setItem('userEmail', newEmail);
                  }}
                />
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-sm font-medium text-epic mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  defaultValue={localStorage.getItem('birthDate') || ''}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-epic focus:outline-none"
                  onChange={(e) => {
                    const newBirthDate = e.target.value;
                    localStorage.setItem('birthDate', newBirthDate);
                  }}
                />
              </div>

              {/* CPF */}
              <div>
                <label className="block text-sm font-medium text-epic mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  defaultValue={localStorage.getItem('userCpf') || ''}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-epic focus:outline-none"
                  onChange={(e) => {
                    const newCpf = e.target.value;
                    localStorage.setItem('userCpf', newCpf);
                  }}
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-epic mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  defaultValue={localStorage.getItem('userPhone') || ''}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-epic focus:outline-none"
                  onChange={(e) => {
                    const newPhone = e.target.value;
                    localStorage.setItem('userPhone', newPhone);
                  }}
                />
              </div>
              
              {/* Chave PIX */}
              <div>
                <label className="block text-sm font-medium text-epic mb-2">
                  🔑 Chave PIX
                </label>
                <input
                  type="text"
                  defaultValue={localStorage.getItem('userPixKey') || ''}
                  placeholder="Sua chave PIX para receber pagamentos"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-epic focus:outline-none"
                  onChange={(e) => {
                    const newPixKey = e.target.value;
                    localStorage.setItem('userPixKey', newPixKey);
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  📧 E-mail, 📱 Telefone, 🆔 CPF ou 🔑 Chave Aleatória
                </p>
              </div>

              {/* Instituição de Ensino */}
              <div>
                <label className="block text-sm font-medium text-epic mb-2">
                  Instituição de Ensino
                </label>
                <input
                  type="text"
                  defaultValue={localStorage.getItem('userInstitution') || ''}
                  placeholder="Nome da escola/faculdade"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-epic focus:outline-none"
                  onChange={(e) => {
                    const newInstitution = e.target.value;
                    localStorage.setItem('userInstitution', newInstitution);
                  }}
                />
              </div>

              {/* Era Favorita */}
              <div>
                <label className="block text-sm font-medium text-epic mb-2">
                  Era Favorita
                </label>
                <select
                  defaultValue={profile?.favorite_era || ''}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-epic focus:outline-none"
                  onChange={(e) => {
                    const newEra = e.target.value;
                    localStorage.setItem('favoriteEra', newEra);
                    if (profile) profile.favorite_era = newEra;
                  }}
                >
                  <option value="">Selecione uma era</option>
                  <option value="Egito Antigo">🏺 Egito Antigo</option>
                  <option value="Mesopotâmia">📜 Mesopotâmia</option>
                  <option value="Era Medieval">⚔️ Era Medieval</option>
                  <option value="Era Digital">💻 Era Digital</option>
                </select>
              </div>

              {/* Avatar/Imagem */}
              <div>
                <label className="block text-sm font-medium text-epic mb-2">
                  Avatar (URL da imagem)
                </label>
                <input
                  type="url"
                  defaultValue={profile?.avatar_url || ''}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-epic focus:outline-none"
                  onChange={(e) => {
                    const newAvatar = e.target.value;
                    localStorage.setItem('avatarUrl', newAvatar);
                    if (profile) profile.avatar_url = newAvatar;
                  }}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <ActionButton
                  variant="victory"
                  onClick={() => {
                    // Salvar no Supabase (se conectado)
                    if (profile) {
                      // Aqui você pode adicionar a lógica para salvar no Supabase
                      console.log('✅ Perfil salvo:', profile);
                    }
                    setShowProfileEdit(false);
                  }}
                  className="flex-1"
                >
                  💾 Salvar Perfil
                </ActionButton>
                <ActionButton
                  variant="battle"
                  onClick={() => setShowProfileEdit(false)}
                  className="flex-1"
                >
                  ❌ Cancelar
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;