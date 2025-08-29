import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sword, 
  Users, 
  Trophy, 
  BookOpen, 
  Play, 
  Target,
  UserPlus,
  Settings,
  Database
} from 'lucide-react';
import { ParticleBackground } from '@/components/ui/particles';
import { TimelineModule } from '@/components/arena/TimelineModule';
import { StatsCard } from '@/components/arena/StatsCard';
import { CreditsBalanceCard } from '@/components/arena/CreditsBalanceCard';
import { ActionButton } from '@/components/arena/ActionButton';
import { useDashboard } from '@/hooks/useDashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResetData } from '@/hooks/useResetData';
import { useCredits } from '@/hooks/useCredits';
import { useSubscription } from '@/hooks/useSubscription';
import { calculateWithdrawal } from '@/utils/creditsSystem';
import { SystemInfoCard } from '@/components/subscription/SystemInfoCard';

import arenaLogo from '@/assets/arena-logo.png';
import egyptArena from '@/assets/egypt-arena.png';

const Index = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState('egypt');
  const isMobile = useIsMobile();
  
  // Buscar dados reais do usuário
  const { profile, wallet, battleHistory, loading } = useDashboard();
  const { userCredits, loading: creditsLoading, computed } = useCredits();
  const { userSubscription, computed: subscriptionInfo } = useSubscription();
  const { resetAllData, resetting } = useResetData();

  // Calcular progresso real baseado nas batalhas por era
  const getEraProgress = (eraName: string) => {
    const eraBattles = battleHistory.filter(battle => 
      battle.era_name.toLowerCase().includes(eraName.toLowerCase()) ||
      (eraName === 'egypt' && battle.era_name.includes('Egito')) ||
      (eraName === 'mesopotamia' && battle.era_name.includes('Mesopotâmia')) ||
      (eraName === 'medieval' && battle.era_name.includes('Medieval')) ||
      (eraName === 'digital' && battle.era_name.includes('Digital'))
    );
    
    if (eraBattles.length === 0) return { progress: 0, isCompleted: false };
    
    // Calcular precisão média da era
    const avgAccuracy = eraBattles.reduce((sum, battle) => sum + battle.accuracy_percentage, 0) / eraBattles.length;
    const battlesCount = eraBattles.length;
    
    // Progresso baseado em: número de batalhas (60%) + precisão média (40%)
    const battleProgress = Math.min(100, (battlesCount * 20)); // 5 batalhas = 100%
    const accuracyProgress = avgAccuracy;
    const totalProgress = Math.round((battleProgress * 0.6) + (accuracyProgress * 0.4));
    
    return {
      progress: totalProgress,
      isCompleted: totalProgress >= 80 && battlesCount >= 3 // Completo se 80%+ precisão e 3+ batalhas
    };
  };

  // Pré-calcular progressos para evitar recálculos
  const egyptProgress = getEraProgress('egypt');
  const mesopotamiaProgress = getEraProgress('mesopotamia');
  const medievalProgress = getEraProgress('medieval');
  const digitalProgress = getEraProgress('digital');

  const timelineModules = [
    {
      id: 'egypt',
      period: '3000-2900 a.C.',
      title: 'Egito Antigo',
      ...egyptProgress,
      isActive: true,
      icon: 'pyramid'
    },
    {
      id: 'mesopotamia',
      period: '2900-2800 a.C.',
      title: 'Mesopotâmia',
      ...mesopotamiaProgress,
      isActive: egyptProgress.progress >= 30, // Disponível se Egito >= 30%
      icon: 'scroll'
    },
    {
      id: 'medieval',
      period: '1000-1100 d.C.',
      title: 'Era Medieval',
      ...medievalProgress,
      isActive: mesopotamiaProgress.progress >= 30, // Disponível se Mesopotâmia >= 30%
      icon: 'castle'
    },
    {
      id: 'future',
      period: '2000-2100 d.C.',
      title: 'Era Digital',
      ...digitalProgress,
      isActive: medievalProgress.progress >= 30, // Disponível se Medieval >= 30%
      icon: 'robot'
    }
  ];

  // Calcular estatísticas reais baseadas nos dados
  const totalBattles = profile?.total_battles || 0;
  const battlesWon = profile?.battles_won || 0;
  const winRate = totalBattles > 0 ? Math.round((battlesWon / totalBattles) * 100) : 0;
  
  // Calcular precisão média dos últimos jogos
  const recentBattles = battleHistory.slice(-10); // Últimos 10 jogos
  const avgAccuracy = recentBattles.length > 0 
    ? Math.round(recentBattles.reduce((sum, battle) => sum + battle.accuracy_percentage, 0) / recentBattles.length)
    : 0;

  const stats = [
    { 
      title: 'Taxa Vitória', 
      value: `${winRate}%`, 
      type: 'history' as const, 
      percentage: winRate, 
      isImproving: winRate >= 70 
    },
    { 
      title: 'Saldo Total', 
      value: `${(userCredits?.credits_balance || 2000).toLocaleString()} créditos`, 
      type: 'finance' as const, 
      percentage: Math.min(100, Math.round((wallet?.balance || 0) * 2)), // Conversão para %
      isImproving: (wallet?.balance || 0) > 0 
    },
    { 
      title: 'Precisão', 
      value: `${avgAccuracy}%`, 
      type: 'technology' as const, 
      percentage: avgAccuracy, 
      isImproving: avgAccuracy >= 70 
    },
    { 
      title: 'Batalhas', 
      value: totalBattles.toString(), 
      type: 'future' as const, 
      percentage: Math.min(100, totalBattles * 5), // 20 batalhas = 100%
      isImproving: totalBattles > 0 
    }
  ];

  // Mostrar loading enquanto carrega dados
  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center">
          <div className="arena-card-epic p-8">
            <div className="animate-pulse">
              <div className="text-4xl mb-4">⚔️</div>
              <h2 className="text-xl font-montserrat font-bold text-epic mb-2">
                Carregando Arena...
              </h2>
              <p className="text-muted-foreground">Preparando seus dados</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background relative`}>
      <ParticleBackground />
      
      {/* Header */}
      <header className={`relative z-10 ${isMobile ? 'p-2' : 'p-6'} border-b border-card-border bg-background-soft/80 backdrop-blur-sm`}>
        <div className="max-w-6xl mx-auto">
          {isMobile ? (
            // Layout mobile - simplificado e empilhado
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img src={arenaLogo} alt="Arena" className="w-8 h-8" />
                  <div>
                    <h1 className="text-epic text-lg font-bold">Arena</h1>
                    <p className="text-xs text-muted-foreground">Conhecimento</p>
                  </div>
                </div>
                <Settings className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-epic transition-colors" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">
                    {profile?.display_name || 'Guerreiro'}
                  </p>
                  <p className="text-xs font-semibold text-epic">
                    Nível {Math.floor((profile?.total_xp || 0) / 100) + 1} • {(profile?.total_xp || 0).toLocaleString()} XP
                  </p>
                </div>
                <div className="flex space-x-2">
                  <ActionButton 
                    variant="epic" 
                    onClick={() => navigate('/dashboard')}
                    className="text-xs px-2 py-1"
                  >
                    📊
                  </ActionButton>
                  <ActionButton 
                    variant="battle" 
                    onClick={() => navigate('/')}
                    className="text-xs px-2 py-1"
                  >
                    🏠
                  </ActionButton>
                  <ActionButton 
                    variant="destructive" 
                    onClick={resetAllData}
                    disabled={resetting}
                    className="text-xs px-2 py-1"
                    title="Zerar dados de teste"
                  >
                    {resetting ? '⏳' : '🗑️'}
                  </ActionButton>
                </div>
              </div>
            </div>
          ) : (
            // Layout desktop - original
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={arenaLogo} alt="Arena do Conhecimento" className="w-12 h-12" />
                <div>
                  <h1 className="text-epic text-2xl">Arena do Conhecimento</h1>
                  <p className="text-sm text-muted-foreground">Batalhas Educativas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <ActionButton 
                  variant="epic" 
                  onClick={() => navigate('/dashboard')}
                  className="text-sm px-4 py-2"
                >
                  📊 Dashboard
                </ActionButton>
                <ActionButton 
                  variant="battle" 
                  onClick={() => navigate('/')}
                  className="text-sm px-4 py-2"
                >
                  🏠 Landing
                </ActionButton>
                <ActionButton 
                  variant="destructive" 
                  onClick={resetAllData}
                  disabled={resetting}
                  className="text-sm px-4 py-2"
                  title="Zerar dados de teste"
                >
                  {resetting ? '⏳ Resetando...' : '🗑️ Reset'}
                </ActionButton>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Bem-vindo, {profile?.display_name || 'Guerreiro'}!
                  </p>
                  <p className="text-sm font-semibold text-epic">
                    Nível {Math.floor((profile?.total_xp || 0) / 100) + 1} • XP: {(profile?.total_xp || 0).toLocaleString()}
                  </p>
                </div>
                <Settings className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-epic transition-colors" />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className={`relative z-10 max-w-6xl mx-auto ${isMobile ? 'p-2 h-full overflow-y-auto' : 'p-6'}`}>
        {/* Sistema de 3 - Informações da Assinatura */}
        {!isMobile && userSubscription && subscriptionInfo?.systemDisplayInfo && (
          <SystemInfoCard
            currentMonth={userSubscription.current_cycle_month}
            entryAmount={userSubscription.current_cycle_month === 1 ? 20 : userSubscription.current_cycle_month === 2 ? 16 : 12}
            maxWithdrawal={20}
            nextAmount={subscriptionInfo.nextPaymentInfo?.nextAmount || 20}
            daysUntilPayment={subscriptionInfo.nextPaymentInfo?.daysUntilPayment || 30}
            savings={subscriptionInfo.nextPaymentInfo?.savings || 0}
            className="mb-6"
          />
        )}

        {/* Balance & Stats Row */}
        <div className={`${isMobile ? 'space-y-2 mb-3' : 'grid lg:grid-cols-3 gap-6 mb-8'}`}>
          {isMobile ? (
            // Mobile: Layout compacto empilhado
            <>
              <div className="grid grid-cols-4 gap-1">
                {stats.map((stat) => (
                  <div key={stat.title} className="arena-card p-2 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{stat.title}</p>
                    <p className={`text-sm font-bold ${
                      stat.type === 'history' ? 'text-victory' :
                      stat.type === 'finance' ? 'text-epic' :
                      stat.type === 'technology' ? 'text-battle' : 'text-legendary'
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <CreditsBalanceCard 
                creditsBalance={userCredits?.credits_balance || 2000}
                xp={profile?.total_xp || 0}
                canWithdraw={computed.daysSinceDeposit >= 30}
                withdrawAmount={18.05}
                nextWithdraw={`${30 - computed.daysSinceDeposit} dias restantes`}
                earnedCredits={userCredits?.credits_earned || 0}
              />
            </>
          ) : (
            // Desktop: Layout original
            <>
              <div className="lg:col-span-1">
                <CreditsBalanceCard 
                  creditsBalance={userCredits?.credits_balance || 2000}
                  xp={profile?.total_xp || 0}
                  canWithdraw={computed.daysSinceDeposit >= 30}
                  withdrawAmount={18.05}
                  nextWithdraw={`${30 - computed.daysSinceDeposit} dias restantes`}
                  earnedCredits={userCredits?.credits_earned || 0}
                />
              </div>
              
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Timeline Section */}
        <section className={isMobile ? 'mb-2' : 'mb-8'}>
          {!isMobile && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-montserrat font-bold text-xl">Linha do Tempo</h2>
              <p className="text-muted-foreground text-sm">Domine a história e ganhe por habilidade</p>
            </div>
          )}
          
          <div className={`${isMobile ? 'grid grid-cols-4 gap-1' : 'flex overflow-x-auto pb-4 space-x-4'} mb-2`}>
            {timelineModules.map((module) => (
              <div
                key={module.id}
                className={`${isMobile ? 'arena-card p-2 text-center cursor-pointer hover-scale' : ''}`}
                onClick={() => {
                  if (module.id === 'egypt') navigate('/training');
                  else if (module.id === 'mesopotamia') navigate('/mesopotamia');
                  else if (module.id === 'medieval') navigate('/medieval');
                  else if (module.id === 'future') navigate('/digital');
                  else setSelectedModule(module.id);
                }}
              >
                {isMobile ? (
                  // Mobile: Cards compactos
                  <>
                    <div className="text-lg mb-1">
                      {module.icon === 'pyramid' ? '🏛️' :
                       module.icon === 'scroll' ? '📜' :
                       module.icon === 'castle' ? '⚔️' : '💻'}
                    </div>
                    <p className="text-xs font-semibold">{module.title.split(' ')[0]}</p>
                    <div className="w-full bg-muted/20 rounded-full h-1 mt-1">
                      <div 
                        className="bg-epic h-1 rounded-full transition-all duration-300" 
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </>
                ) : (
                  // Desktop: Component original
                  <TimelineModule {...module} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Current Arena */}
        <section className={isMobile ? 'mb-2' : 'mb-8 mt-4'}>
          <div className={`arena-card ${isMobile ? 'p-3' : 'p-8'} relative overflow-hidden`}>
            {!isMobile && (
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: `url(${egyptArena})` }}
              />
            )}
            
            <div className="relative z-10">
              {isMobile ? (
                // Mobile: Layout compacto
                <div className="text-center mb-3">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-2xl">🏛️</span>
                    <h3 className="text-lg font-montserrat font-bold text-epic">Arena Egito</h3>
                  </div>
                </div>
              ) : (
                // Desktop: Layout original
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-4xl font-montserrat font-bold text-epic mb-3">
                      Egito Antigo - Arena Ativa
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      Domine os mistérios do Nilo e conquiste conhecimento sobre economia antiga
                    </p>
                  </div>
                  <div className="text-7xl opacity-80">🏛️</div>
                </div>
              )}
              
              <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'} max-w-full`}>
                <ActionButton 
                  variant="victory" 
                  icon={<Play />}
                  onClick={() => navigate('/training')}
                  className={`${isMobile ? 'text-xs py-2' : 'text-base py-3'} w-full`}
                >
                  {isMobile ? 'Treinar' : 'Treinar Gratuito'}
                </ActionButton>
                
                <ActionButton 
                  variant="battle" 
                  icon={<Sword />}
                  onClick={() => navigate('/arena')}
                  className={`${isMobile ? 'text-xs py-2' : 'text-base py-3'} w-full`}
                >
                  {isMobile ? 'Arena' : 'Entrar na Arena (900 créditos)'}
                </ActionButton>
                
                <ActionButton 
                  variant="epic" 
                  icon={<Trophy />} 
                  onClick={() => navigate('/ranking')}
                  className={`${isMobile ? 'text-xs py-2' : 'text-base py-3'} w-full`}
                >
                  {isMobile ? 'Ranking' : 'Ranking Global'}
                </ActionButton>
                
                <ActionButton 
                  variant="epic" 
                  icon={<BookOpen />} 
                  onClick={() => navigate('/knowledge')}
                  className={`${isMobile ? 'text-xs py-2' : 'text-base py-3'} w-full`}
                >
                  {isMobile ? 'Acervo' : 'Acervo Conhecimento'}
                </ActionButton>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className={isMobile ? 'pb-2' : ''}>
          <div className={`grid ${isMobile ? 'grid-cols-4 gap-1' : 'grid-cols-1 md:grid-cols-4 gap-4'}`}>
            <div className={`arena-card text-center ${isMobile ? 'p-1' : 'p-4'}`}>
              <Users className={`text-battle mx-auto ${isMobile ? 'w-4 h-4' : 'w-8 h-8 mb-3'}`} />
              {!isMobile && <h4 className="font-montserrat font-bold mb-1 text-sm">Duelos Hoje</h4>}
              <p className={`font-bold text-battle ${isMobile ? 'text-sm' : 'text-xl'}`}>
                {Math.min(totalBattles, 5)}/5
              </p>
              {isMobile && <p className="text-xs text-muted-foreground">Duelos</p>}
              {!isMobile && (
                <p className="text-muted-foreground text-xs">
                  {totalBattles >= 5 ? 'Limite atingido' : 'Disponíveis'}
                </p>
              )}
            </div>
            
            <div className={`arena-card text-center ${isMobile ? 'p-1' : 'p-4'}`}>
              <Target className={`text-victory mx-auto ${isMobile ? 'w-4 h-4' : 'w-8 h-8 mb-3'}`} />
              {!isMobile && <h4 className="font-montserrat font-bold mb-1 text-sm">Taxa Vitória</h4>}
              <p className={`font-bold text-victory ${isMobile ? 'text-sm' : 'text-xl'}`}>{winRate}%</p>
              {isMobile && <p className="text-xs text-muted-foreground">Vitória</p>}
              {!isMobile && (
                <p className="text-muted-foreground text-xs">
                  {totalBattles > 0 ? `${Math.min(totalBattles, 50)} batalhas` : 'Nenhuma ainda'}
                </p>
              )}
            </div>
            
            <div className={`arena-card text-center cursor-pointer hover-scale ${isMobile ? 'p-1' : 'p-4'}`} onClick={() => navigate('/knowledge')}>
              <Database className={`text-primary-glow mx-auto ${isMobile ? 'w-4 h-4' : 'w-8 h-8 mb-3'}`} />
              {!isMobile && <h4 className="font-montserrat font-bold mb-1 text-sm">Conhecimento</h4>}
              {isMobile ? (
                <p className="text-xs text-muted-foreground">Acervo</p>
              ) : (
                <>
                  <p className="text-primary-glow text-xs mb-2">Ver itens</p>
                  <ActionButton variant="epic" className="w-full text-sm py-2">
                    Explorar
                  </ActionButton>
                </>
              )}
            </div>
            
            <div className={`arena-card text-center ${isMobile ? 'p-1' : 'p-4'}`}>
              <UserPlus className={`text-epic mx-auto ${isMobile ? 'w-4 h-4' : 'w-8 h-8 mb-3'}`} />
              {!isMobile && <h4 className="font-montserrat font-bold mb-1 text-sm">Indicar Amigo</h4>}
              {isMobile ? (
                <p className="text-xs text-muted-foreground">Indicar</p>
              ) : (
                <>
                  <p className="text-epic text-xs mb-2">Ganhe 5%</p>
                  <ActionButton variant="epic" className="w-full text-sm py-2">
                    Compartilhar
                  </ActionButton>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
