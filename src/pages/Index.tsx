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
  Database,
  LogOut
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
import { PersistentBackgroundMusic } from '@/components/ui/persistent-background-music';
import { Card } from '@/components/ui/card';
import { TopCarousel } from '@/components/home/TopCarousel';
import { EraCarousel } from '@/components/arena/EraCarousel';

import arenaLogo from '@/assets/arena-logo.png';
import egyptArena from '@/assets/egypt-arena.png';
import egyptLandingBg from '@/assets/egypt-landing-bg.jpg';
import mesopotamiaLandingBg from '@/assets/mesopotamia-landing-bg.jpg';
import medievalLandingBg from '@/assets/medieval-landing-bg.jpg';
import digitalLandingBg from '@/assets/digital-landing-bg.jpg';

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
      icon: 'pyramid',
      background: egyptLandingBg,
      onClick: () => navigate('/training')
    },
    {
      id: 'mesopotamia',
      period: '2900-2800 a.C.',
      title: 'Mesopotâmia',
      ...mesopotamiaProgress,
      isActive: egyptProgress.progress >= 30, // Disponível se Egito >= 30%
      icon: 'scroll',
      background: mesopotamiaLandingBg,
      onClick: () => navigate('/mesopotamia')
    },
    {
      id: 'medieval',
      period: '1000-1100 d.C.',
      title: 'Era Medieval',
      ...medievalProgress,
      isActive: mesopotamiaProgress.progress >= 30, // Disponível se Mesopotâmia >= 30%
      icon: 'castle',
      background: medievalLandingBg,
      onClick: () => navigate('/medieval')
    },
    {
      id: 'future',
      period: '2000-2100 d.C.',
      title: 'Era Digital',
      ...digitalProgress,
      isActive: medievalProgress.progress >= 30, // Disponível se Medieval >= 30%
      icon: 'robot',
      background: digitalLandingBg,
      onClick: () => navigate('/digital')
    },
    {
      id: 'world',
      period: '2024 - Atual',
      title: 'Mundo Real',
      progress: 100, // Sempre ativo
      isCompleted: false,
      isActive: digitalProgress.progress >= 50, // Disponível se Digital >= 50%
      icon: 'globe',
      background: digitalLandingBg, // Usar mesmo background da era digital
      onClick: () => navigate('/world-quiz')
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
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} relative`}>
      {/* Background Temático Home - Arena Principal */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/egypt-arena.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <ParticleBackground />
      
      {/* Header */}
      <header className={`relative z-10 ${isMobile ? 'p-1' : 'p-6'} border-b border-card-border bg-background-soft/80 backdrop-blur-sm`}>
        <div className="max-w-6xl mx-auto">
          {isMobile ? (
            // Layout mobile - organizado e compacto
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <img src={arenaLogo} alt="Arena" className="w-5 h-5" />
                  <div>
                    <h1 className="text-epic text-sm font-bold">Arena</h1>
                    <p className="text-xs text-muted-foreground">Conhecimento</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {profile?.display_name || 'Guerreiro Demo'}
                  </p>
                  <p className="text-xs font-semibold text-epic">
                    Nv{Math.floor((profile?.total_xp || 0) / 100) + 1} • {(profile?.total_xp || 0).toLocaleString()}XP
                  </p>
                </div>
                
                <div className="flex items-center space-x-0.5">
                  <ActionButton 
                    variant="epic" 
                    onClick={() => navigate('/dashboard')}
                    className="text-xs px-1.5 py-0.5"
                  >
                    📊
                  </ActionButton>
                  <ActionButton 
                    variant="victory" 
                    onClick={() => navigate('/payment')}
                    className="text-xs px-1.5 py-0.5"
                  >
                    💳
                  </ActionButton>
                  <ActionButton 
                    variant="battle" 
                    onClick={() => navigate('/')}
                    className="text-xs px-1.5 py-0.5"
                  >
                    <LogOut className="w-3 h-3" />
                  </ActionButton>
                  <ActionButton 
                    variant="battle" 
                    onClick={resetAllData}
                    disabled={resetting}
                    className="text-xs px-1 py-0.5"
                  >
                    <span className="text-xs">{resetting ? '⏳' : '🗑️'}</span>
                  </ActionButton>
                </div>
              </div>
            </div>
          ) : (
            // Layout desktop - organizado
            <div className="flex items-center justify-between">
              {/* Logo, Título e Música */}
              <div className="flex items-center space-x-4">
                <img src={arenaLogo} alt="Arena do Conhecimento" className="w-10 h-10" />
                <div>
                  <h1 className="text-epic text-xl font-montserrat font-bold">Arena do Conhecimento</h1>
                  <p className="text-xs text-muted-foreground">Batalhas Educativas</p>
                </div>
                
                {/* Controle de Música - Movido do rodapé */}
                <div className="ml-6">
                  <PersistentBackgroundMusic autoPlay={true} className="relative" />
                </div>
              </div>
              
              {/* Informações do Usuário - Centro */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {profile?.display_name || 'Guerreiro Demo'}
                </p>
                <p className="text-sm font-semibold text-epic">
                  Nível {Math.floor((profile?.total_xp || 0) / 100) + 1} • {(profile?.total_xp || 0).toLocaleString()} XP
                </p>
              </div>
              
              {/* Botões de Ação - Direita */}
              <div className="flex items-center space-x-2">
                <ActionButton 
                  variant="epic" 
                  onClick={() => navigate('/dashboard')}
                  className="text-xs px-3 py-2"
                >
                  📊
                </ActionButton>

                <ActionButton 
                  variant="victory" 
                  onClick={() => navigate('/payment')}
                  className="text-xs px-3 py-2"
                >
                  💳
                </ActionButton>
                
                <ActionButton 
                  variant="epic" 
                  onClick={() => navigate('/admin')}
                  className="text-xs px-3 py-2"
                >
                  🛠️
                </ActionButton>

                <ActionButton 
                  variant="battle" 
                  onClick={() => navigate('/')}
                  className="text-xs px-3 py-2"
                >
                  <LogOut className="w-4 h-4" />
                </ActionButton>

                <ActionButton 
                  variant="battle" 
                  onClick={resetAllData}
                  disabled={resetting}
                  className="text-xs px-3 py-2"
                >
                  <span className="text-sm">{resetting ? '⏳' : '🗑️'}</span>
                </ActionButton>
                
                <Settings className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-epic transition-colors" />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className={`relative z-10 max-w-6xl mx-auto ${isMobile ? 'p-1 h-full overflow-y-auto' : 'p-6'}`}>
        {/* Top Carousel - Ranking + Notícias */}
        <TopCarousel isMobile={isMobile} />

        {/* Balance & Stats Row */}
        <div className={`${isMobile ? 'space-y-1 mb-2' : 'grid lg:grid-cols-3 gap-6 mb-8'}`}>
          {isMobile ? (
            // Mobile: Layout compacto empilhado
            <>
              <div className="grid grid-cols-4 gap-0.5">
                {stats.map((stat) => (
                  <div key={stat.title} className="arena-card p-1 text-center">
                    <p className="text-xs text-muted-foreground mb-0.5">{stat.title}</p>
                    <p className={`text-xs font-bold ${
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
        <section className={isMobile ? 'mb-2' : 'mb-6'}>
          {!isMobile && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-montserrat font-bold text-xl">Linha do Tempo</h2>
              <p className="text-muted-foreground text-sm">Domine a história e ganhe por habilidade</p>
            </div>
          )}
          
          <div className={`${isMobile ? 'grid grid-cols-5 gap-0.5' : 'flex overflow-x-auto pb-2 space-x-4 scrollbar-hide'} mb-2`}>
            {timelineModules.map((module) => (
              <div
                key={module.id}
                className={`${isMobile ? 'arena-card p-2 text-center cursor-pointer hover-scale' : ''}`}
                onClick={isMobile ? module.onClick : undefined}
              >
                {isMobile ? (
                  // Mobile: Cards compactos com background
                  <div 
                    className="relative overflow-hidden rounded-lg"
                    style={{
                      backgroundImage: `url(${module.background})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minHeight: '60px'
                    }}
                  >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
                    <div className="relative z-10 p-1 text-center">
                      <div className="text-sm mb-0.5">
                        {module.icon === 'pyramid' ? '🏛️' :
                         module.icon === 'scroll' ? '📜' :
                         module.icon === 'castle' ? '⚔️' :
                         module.icon === 'robot' ? '💻' : '🌍'}
                      </div>
                      <p className="text-xs font-semibold text-white drop-shadow-md">{module.title.split(' ')[0]}</p>
                      <div className="w-full bg-white/20 rounded-full h-0.5 mt-0.5">
                        <div 
                          className="bg-epic h-0.5 rounded-full transition-all duration-300" 
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Desktop: Component original
                  <TimelineModule {...module} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Era Carousel - Fundo animado que muda automaticamente */}
        <EraCarousel isMobile={isMobile} />



        {/* Quick Actions */}
        <section className={isMobile ? 'pb-1' : ''}>
          <div className={`grid ${isMobile ? 'grid-cols-4 gap-0.5' : 'grid-cols-1 md:grid-cols-4 gap-4'}`}>
            <div className={`arena-card text-center ${isMobile ? 'p-0.5' : 'p-4'}`}>
              <Users className={`text-battle mx-auto ${isMobile ? 'w-3 h-3' : 'w-8 h-8 mb-3'}`} />
              {!isMobile && <h4 className="font-montserrat font-bold mb-1 text-sm">Duelos Hoje</h4>}
              <p className={`font-bold text-battle ${isMobile ? 'text-xs' : 'text-xl'}`}>
                {Math.min(totalBattles, 5)}/5
              </p>
              {isMobile && <p className="text-xs text-muted-foreground">Duelos</p>}
              {!isMobile && (
                <p className="text-muted-foreground text-xs">
                  {totalBattles >= 5 ? 'Limite atingido' : 'Disponíveis'}
                </p>
              )}
            </div>
            
            <div className={`arena-card text-center ${isMobile ? 'p-0.5' : 'p-4'}`}>
              <Target className={`text-victory mx-auto ${isMobile ? 'w-3 h-3' : 'w-8 h-8 mb-3'}`} />
              {!isMobile && <h4 className="font-montserrat font-bold mb-1 text-sm">Taxa Vitória</h4>}
              <p className={`font-bold text-victory ${isMobile ? 'text-xs' : 'text-xl'}`}>{winRate}%</p>
              {isMobile && <p className="text-xs text-muted-foreground">Vitória</p>}
              {!isMobile && (
                <p className="text-muted-foreground text-xs">
                  {totalBattles > 0 ? `${Math.min(totalBattles, 50)} batalhas` : 'Nenhuma ainda'}
                </p>
              )}
            </div>
            
            <div className={`arena-card text-center cursor-pointer hover-scale ${isMobile ? 'p-0.5' : 'p-4'}`} onClick={() => navigate('/knowledge')}>
              <Database className={`text-primary-glow mx-auto ${isMobile ? 'w-3 h-3' : 'w-8 h-8 mb-3'}`} />
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
            
            <div className={`arena-card text-center ${isMobile ? 'p-0.5' : 'p-4'}`}>
              <UserPlus className={`text-epic mx-auto ${isMobile ? 'w-3 h-3' : 'w-8 h-8 mb-3'}`} />
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

