import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Crown, Medal, Award, Target, Zap } from 'lucide-react';
import { ActionButton } from '@/components/arena/ActionButton';
import { ParticleBackground } from '@/components/ui/particles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRanking, RankingUser, EraRanking } from '@/hooks/useRanking';
import { useIsMobile } from '@/hooks/use-mobile';

const Ranking = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { globalRanking, eraRankings, loading, error } = useRanking();
  const [selectedTab, setSelectedTab] = useState('global');

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <Trophy className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPositionBg = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30';
      case 3: return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30';
      default: return 'bg-background/50 border-border';
    }
  };

  const RankingUserCard = ({ user, showEraStats = false }: { user: RankingUser; showEraStats?: boolean }) => (
    <Card className={`${getPositionBg(user.position)} hover-scale transition-all duration-300`}>
      <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getPositionIcon(user.position)}
              <span className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>#{user.position}</span>
            </div>
            
            <div className={`w-10 h-10 rounded-full bg-epic/20 flex items-center justify-center text-lg border-2 border-epic ${isMobile ? 'w-8 h-8 text-sm' : ''}`}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            
            <div>
              <h4 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>{user.display_name}</h4>
              {user.favorite_era && (
                <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {user.favorite_era}
                </p>
              )}
            </div>
          </div>
          
                        <div className="text-right">
                <p className={`font-bold text-epic ${isMobile ? 'text-base' : 'text-xl'}`}>
                  {user.total_xp.toLocaleString()} XP
                </p>
                <div className="flex gap-2 justify-end">
                  <Badge variant="outline" className={isMobile ? 'text-xs px-1' : ''}>
                    {user.total_battles} batalhas
                  </Badge>
                  <Badge variant="secondary" className={`${user.win_rate >= 70 ? 'bg-victory/20 text-victory' : 'bg-muted'} ${isMobile ? 'text-xs px-1' : ''}`}>
                    {user.win_rate}% vitórias
                  </Badge>
                </div>
                {/* Bônus por ranking */}
                {user.position <= 1 && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 mt-1">
                    +45 créditos/mês
                  </Badge>
                )}
                {user.position > 1 && user.position <= 5 && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-500 mt-1">
                    +35 créditos/mês
                  </Badge>
                )}
                {user.position > 5 && user.position <= 10 && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-500 mt-1">
                    +25 créditos/mês
                  </Badge>
                )}
                {user.position > 10 && user.position <= 20 && (
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-500 mt-1">
                    +15 créditos/mês
                  </Badge>
                )}
              </div>
        </div>
      </CardContent>
    </Card>
  );

  const EraRankingSection = ({ eraRanking }: { eraRanking: EraRanking }) => (
    <div className={`relative overflow-hidden rounded-lg ${isMobile ? 'p-4' : 'p-6'}`}>
      {/* Background with era theme */}
      <div className={`absolute inset-0 ${eraRanking.background_theme} opacity-10`} />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      
      <div className="relative z-10">
        <div className={`flex items-center gap-3 ${isMobile ? 'mb-3' : 'mb-6'}`}>
          <div className={`text-4xl ${isMobile ? 'text-2xl' : ''}`}>{eraRanking.icon}</div>
          <div>
            <h3 className={`font-montserrat font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {eraRanking.era_name}
            </h3>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Top {eraRanking.top_users.length} especialistas da era
            </p>
          </div>
        </div>
        
        <div className={`space-y-3 ${isMobile ? 'space-y-2' : ''}`}>
          {eraRanking.top_users.map((user) => (
            <RankingUserCard key={user.id} user={user} showEraStats />
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background relative flex items-center justify-center`}>
        <ParticleBackground />
        <div className="relative z-10 text-center">
          <div className="arena-card-epic p-8">
            <div className="animate-pulse">
              <Trophy className="w-16 h-16 text-epic mx-auto mb-4" />
              <h2 className="text-xl font-montserrat font-bold text-epic mb-2">
                Carregando Rankings...
              </h2>
              <p className="text-muted-foreground">Preparando os melhores guerreiros</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background relative`}>
      <ParticleBackground />
      
      <div className={`relative z-10 max-w-7xl mx-auto ${isMobile ? 'p-3 h-full overflow-y-auto' : 'p-6'}`}>
        {/* Header */}
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <ActionButton 
            variant="battle" 
            icon={<ArrowLeft />}
            onClick={() => navigate('/app')}
            className={`backdrop-blur-sm bg-battle-dark/80 ${isMobile ? 'self-start text-sm px-3 py-2' : ''}`}
          >
            Voltar
          </ActionButton>
          
          <div className={`text-center arena-card-epic backdrop-blur-sm bg-card/80 ${isMobile ? 'px-4 py-3' : 'px-8 py-4'}`}>
            <h1 className={`font-montserrat font-bold text-epic flex items-center justify-center gap-3 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
              <Trophy className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
              Ranking Global
            </h1>
            <p className={`text-muted-foreground ${isMobile ? 'mt-1 text-xs' : 'mt-2'}`}>
              Os melhores guerreiros - ROI 120-250% anual
            </p>
          </div>
        </div>

        {/* Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className={`grid ${isMobile ? 'w-full grid-cols-2' : 'w-fit grid-cols-2'}`}>
            <TabsTrigger value="global" className={`gap-2 ${isMobile ? 'text-sm' : ''}`}>
              <Zap className="w-4 h-4" />
              {isMobile ? 'Global' : 'Ranking Global'}
            </TabsTrigger>
            <TabsTrigger value="eras" className={`gap-2 ${isMobile ? 'text-sm' : ''}`}>
              <Target className="w-4 h-4" />
              {isMobile ? 'Por Era' : 'Rankings por Era'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-4">
            <Card className="arena-card-epic">
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  <Crown className="w-6 h-6 text-epic" />
                  Top {globalRanking.length} Guerreiros
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-3 ${isMobile ? 'space-y-2 p-4' : ''}`}>
                {globalRanking.length > 0 ? (
                  globalRanking.map((user) => (
                    <RankingUserCard key={user.id} user={user} />
                  ))
                ) : (
                  <div className="text-center p-8">
                    <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Ainda não há guerreiros no ranking. Seja o primeiro!
                    </p>
                    <ActionButton 
                      variant="epic" 
                      onClick={() => navigate('/training')}
                      className="mt-4"
                    >
                      Começar a Treinar
                    </ActionButton>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eras" className="space-y-6">
            {eraRankings.length > 0 ? (
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                {eraRankings.map((eraRanking) => (
                  <Card key={eraRanking.era_slug} className="arena-card overflow-hidden">
                    <EraRankingSection eraRanking={eraRanking} />
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="arena-card-epic">
                <CardContent className="text-center p-8">
                  <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Os rankings por era ainda estão sendo calculados.
                  </p>
                  <ActionButton 
                    variant="epic" 
                    onClick={() => navigate('/training')}
                  >
                    Participar das Batalhas
                  </ActionButton>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Ranking;
