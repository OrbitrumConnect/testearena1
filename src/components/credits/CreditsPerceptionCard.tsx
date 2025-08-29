import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Lock, Info, Trophy, Target, Sword } from 'lucide-react';
import { useCreditsPerception } from '@/hooks/useCreditsPerception';

interface CreditsPerceptionCardProps {
  showDetails?: boolean;
  compact?: boolean;
}

export const CreditsPerceptionCard = ({ showDetails = false, compact = false }: CreditsPerceptionCardProps) => {
  const { data, getDetailedInfo, getMonthlyProjection } = useCreditsPerception();
  const detailedInfo = getDetailedInfo();
  const monthlyProjection = getMonthlyProjection();

  if (compact) {
    return (
      <Card className="arena-card p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="w-4 h-4 text-epic" />
            <div>
              <p className="text-sm font-semibold">
                {data.totalCredits.toLocaleString()} créditos
              </p>
              <p className="text-xs text-muted-foreground">
                ≈ R$ {data.perceptionValue.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-victory">
              R$ {data.sacableValue.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">Sacável</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="arena-card-epic p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-epic" />
          <h3 className="font-montserrat font-bold text-lg">Percepção de Valor</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          <Info className="w-3 h-3 mr-1" />
          R$ {detailedInfo.creditRate.toFixed(2)}/crédito
        </Badge>
      </div>

      {/* Overview Principal */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 rounded-lg bg-epic/10 border border-epic/30">
          <div className="text-2xl font-bold text-epic mb-1">
            {data.totalCredits.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mb-2">Créditos Acumulados</p>
          <p className="text-lg font-semibold text-epic">
            ≈ R$ {data.perceptionValue.toFixed(2)}
          </p>
        </div>
        
        <div className="text-center p-4 rounded-lg bg-victory/10 border border-victory/30">
          <div className="text-2xl font-bold text-victory mb-1">
            R$ {data.sacableValue.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground mb-2">Valor Sacável</p>
          <div className="flex items-center justify-center">
            <Lock className="w-4 h-4 mr-1 text-victory" />
            <span className="text-sm text-victory font-medium">Limitado</span>
          </div>
        </div>
      </div>

      {/* Breakdown por Atividade */}
      {showDetails && (
        <div className="space-y-4 mb-6">
          <h4 className="font-semibold text-sm text-muted-foreground">Breakdown por Atividade</h4>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Treinos */}
            <div className="p-3 rounded-lg bg-muted/10">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-epic" />
                <span className="text-sm font-medium">Treinos</span>
              </div>
              <p className="text-lg font-bold">{detailedInfo.breakdown.training.credits}</p>
              <p className="text-xs text-muted-foreground">
                R$ {detailedInfo.breakdown.training.value.toFixed(2)} ({detailedInfo.breakdown.training.percentage.toFixed(1)}%)
              </p>
            </div>

            {/* PvP */}
            <div className="p-3 rounded-lg bg-muted/10">
              <div className="flex items-center space-x-2 mb-2">
                <Sword className="w-4 h-4 text-battle" />
                <span className="text-sm font-medium">PvP</span>
              </div>
              <p className="text-lg font-bold">{detailedInfo.breakdown.pvp.credits}</p>
              <p className="text-xs text-muted-foreground">
                R$ {detailedInfo.breakdown.pvp.value.toFixed(2)} ({detailedInfo.breakdown.pvp.percentage.toFixed(1)}%)
              </p>
            </div>

            {/* Torneios */}
            <div className="p-3 rounded-lg bg-muted/10">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="w-4 h-4 text-legendary" />
                <span className="text-sm font-medium">Torneios</span>
              </div>
              <p className="text-lg font-bold">{detailedInfo.breakdown.tournaments.credits}</p>
              <p className="text-xs text-muted-foreground">
                R$ {detailedInfo.breakdown.tournaments.value.toFixed(2)} ({detailedInfo.breakdown.tournaments.percentage.toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Projeção Mensal */}
      <div className="bg-muted/5 border border-muted/20 rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-epic" />
          Potencial Mensal
        </h4>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-epic">
              {monthlyProjection.total.credits.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Créditos/mês</p>
          </div>
          <div>
            <p className="text-xl font-bold text-epic">
              R$ {monthlyProjection.total.value.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">Percepção/mês</p>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-center">
          <p className="text-muted-foreground">
            9 treinos/dia + 3 PvPs/dia + 10 torneios/mês
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-muted/10 border border-muted/20 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          ⚠️ <strong>Importante:</strong> Créditos ganhos são para uso interno do jogo. 
          O valor sacável está limitado ao valor pago (R$ 20,00).
        </p>
      </div>
    </Card>
  );
};
