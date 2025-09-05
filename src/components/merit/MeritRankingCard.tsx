import React from 'react';
import { useMeritSystem } from '@/hooks/useMeritSystem';
import { MERIT_CONFIG } from '@/utils/meritSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  Zap, 
  Target,
  Star,
  Crown,
  Flame
} from 'lucide-react';

interface MeritRankingCardProps {
  className?: string;
  showFullRanking?: boolean;
}

export const MeritRankingCard: React.FC<MeritRankingCardProps> = ({ 
  className = '', 
  showFullRanking = false 
}) => {
  const { userMerit, globalRanking, loading, computed } = useMeritSystem();
  const userStats = computed.getUserStats();

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Carregando ranking...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userMerit || !userStats) {
    return (
      <Card className={`border-destructive ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trophy className="w-5 h-5" />
            Erro no Mérito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar os dados de mérito.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'elite': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'gold': return <Medal className="w-4 h-4 text-yellow-600" />;
      case 'silver': return <Medal className="w-4 h-4 text-gray-400" />;
      default: return <Medal className="w-4 h-4 text-amber-600" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'elite': return 'from-yellow-400 to-yellow-600';
      case 'gold': return 'from-yellow-500 to-yellow-700';
      case 'silver': return 'from-gray-300 to-gray-500';
      default: return 'from-amber-500 to-amber-700';
    }
  };

  const getBonusDisplay = () => {
    const bonusPercentage = Math.round((userStats.financial.merit_points - 1) * 100);
    if (bonusPercentage > 0) {
      return (
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
          <Star className="w-3 h-3 mr-1" />
          +{bonusPercentage}% bônus
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-epic" />
          🏆 Ranking Meritocrático
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status do Usuário */}
        <div className={`p-4 rounded-lg bg-gradient-to-r ${getTierColor(userStats.performance.tier)} bg-opacity-20 border`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getTierIcon(userStats.performance.tier)}
              <span className="font-semibold text-white uppercase tracking-wide">
                {userStats.performance.tier}
              </span>
            </div>
            {getBonusDisplay()}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-300">Posição no Ranking</div>
              <div className="text-xl font-bold text-white">
                #{userStats.performance.rankPosition || '—'}
              </div>
            </div>
            <div>
              <div className="text-gray-300">Pontuação de Mérito</div>
              <div className="text-xl font-bold text-white">
                {userStats.performance.meritScore.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas de Performance */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded border">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Target className="w-3 h-3" />
              Taxa de Vitória
            </div>
            <div className="text-lg font-bold">{userStats.pvp.winRate.toFixed(1)}%</div>
            <Progress value={userStats.pvp.winRate} className="h-1 mt-1" />
          </div>
          
          <div className="text-center p-3 rounded border">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Zap className="w-3 h-3" />
              Precisão Média
            </div>
            <div className="text-lg font-bold">{userStats.accuracy.average.toFixed(1)}%</div>
            <Progress value={userStats.accuracy.average} className="h-1 mt-1" />
          </div>
        </div>

        {/* Sequência de Vitórias */}
        {userStats.pvp.merit_points > 0 && (
          <div className="flex items-center gap-2 p-3 rounded bg-victory/10 border border-victory/30">
            <Flame className="w-4 h-4 text-victory" />
            <div className="flex-1">
              <div className="text-sm font-medium text-victory">
                Sequência Atual: {userStats.pvp.merit_points} vitórias
              </div>
              <div className="text-xs text-muted-foreground">
                Recorde: {userStats.pvp.maxStreak} vitórias
              </div>
            </div>
          </div>
        )}

        {/* Status Top Performer */}
        {userStats.performance.isTopPerformer && (
          <div className="p-3 rounded bg-epic/10 border border-epic/30">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-epic" />
              <div className="flex-1">
                <div className="text-sm font-medium text-epic">
                  🌟 TOP 5% - Usuário Elite
                </div>
                <div className="text-xs text-muted-foreground">
                  Bônus de {Math.round((userStats.financial.merit_points - 1) * 100)}% em créditos
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progresso para Próximo Tier */}
        {userStats.performance.tier !== 'elite' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progresso para próximo tier:</span>
              <span className="font-medium">
                {userStats.performance.meritScore.toFixed(1)}/
                {userStats.performance.tier === 'bronze' ? '50' : 
                 userStats.performance.tier === 'silver' ? '70' : '85'}
              </span>
            </div>
            <Progress 
              value={
                userStats.performance.tier === 'bronze' 
                  ? (userStats.performance.meritScore / 50) * 100
                  : userStats.performance.tier === 'silver'
                  ? ((userStats.performance.meritScore - 50) / 20) * 100
                  : ((userStats.performance.meritScore - 70) / 15) * 100
              } 
              className="h-2" 
            />
          </div>
        )}

        {/* Qualificação para Ranking */}
        {userStats.pvp.totalGames < MERIT_CONFIG.minGamesForRanking && (
          <div className="p-3 rounded bg-orange-500/10 border border-orange-500/30">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-orange-500">
                  Qualificação para Ranking
                </div>
                <div className="text-xs text-muted-foreground">
                  Jogue {MERIT_CONFIG.minGamesForRanking - userStats.pvp.totalGames} PvPs para entrar no ranking
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top do Ranking Global (se habilitado) */}
        {showFullRanking && globalRanking.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium">🏆 Top Performers</div>
            <div className="space-y-2">
              {globalRanking.slice(0, 5).map((user, index) => (
                <div 
                  key={user.userId}
                  className={`flex items-center gap-3 p-2 rounded ${
                    user.userId === userMerit.userId ? 'bg-epic/10 border border-epic/30' : 'bg-muted/30'
                  }`}
                >
                  <div className="text-center w-8">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {user.displayName}
                      {user.userId === userMerit.userId && ' (Você)'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.meritScore.toFixed(1)} pts • {user.winRate.toFixed(1)}% vitórias
                    </div>
                  </div>
                  <div className="text-right">
                    {getTierIcon(user.meritTier)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info sobre o Sistema */}
        <div className="pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            <div className="mb-1">
              📊 Mérito calculado por: vitórias (30%), precisão (25%), atividade (20%), sequência (15%), volume (10%)
            </div>
            <div>
              🎯 Top 5% recebem +20% bônus • Reset mensal no dia 1
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
