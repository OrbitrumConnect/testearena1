import { Coins, Wallet, Info, Calendar, TrendingUp, Gift } from 'lucide-react';
import { useState } from 'react';
import { formatCredits, getCreditsDisplayInfo, calculateWithdrawal } from '@/utils/creditsSystem';

interface CreditsDisplayProps {
  creditsBalance: number;
  earnedCredits: number;
  monthlyBonus: number;
  daysSinceDeposit: number;
  className?: string;
}

export const CreditsDisplay = ({ 
  creditsBalance, 
  earnedCredits, 
  monthlyBonus, 
  daysSinceDeposit,
  className = "" 
}: CreditsDisplayProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const withdrawalInfo = calculateWithdrawal(daysSinceDeposit);
  const displayInfo = getCreditsDisplayInfo();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Saldo Principal de Créditos */}
      <div className="arena-card p-4 bg-gradient-to-r from-epic/10 to-victory/10 border border-epic/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center text-epic">
            <Coins className="w-5 h-5 mr-2" />
            Saldo de Créditos
          </h3>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-muted-foreground hover:text-epic transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-epic mb-1">
            {formatCredits(creditsBalance)}
          </p>
          <p className="text-sm text-muted-foreground">
            créditos disponíveis
          </p>
        </div>

        {showDetails && (
          <div className="mt-4 p-3 bg-background/50 rounded-lg text-xs space-y-2">
            <p className="font-semibold text-epic">{displayInfo.systemName}</p>
            <p className="text-muted-foreground">{displayInfo.disclaimer}</p>
            <p className="text-muted-foreground">{displayInfo.usage}</p>
          </div>
        )}
      </div>

      {/* Grid de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Créditos Ganhos */}
        <div className="arena-card p-4">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-4 h-4 mr-2 text-victory" />
            <h4 className="font-semibold text-sm">Ganhos Totais</h4>
          </div>
          <p className="text-xl font-bold text-victory">
            +{formatCredits(earnedCredits)}
          </p>
          <p className="text-xs text-muted-foreground">
            créditos conquistados
          </p>
        </div>

        {/* Bônus Mensal */}
        <div className="arena-card p-4">
          <div className="flex items-center mb-2">
            <Gift className="w-4 h-4 mr-2 text-warning" />
            <h4 className="font-semibold text-sm">Bônus Mês</h4>
          </div>
          <p className="text-xl font-bold text-warning">
            +{formatCredits(monthlyBonus)}
          </p>
          <p className="text-xs text-muted-foreground">
            bônus misterioso
          </p>
        </div>

        {/* Saque Disponível */}
        <div className="arena-card p-4">
          <div className="flex items-center mb-2">
            <Wallet className="w-4 h-4 mr-2 text-muted-foreground" />
            <h4 className="font-semibold text-sm">Saque</h4>
          </div>
          {withdrawalInfo.canWithdraw ? (
            <>
              <p className="text-xl font-bold text-victory">
                {Math.round((withdrawalInfo.finalAmount || 0) * 100)} créditos
              </p>
              <p className="text-xs text-muted-foreground">
                disponível
              </p>
            </>
          ) : (
            <>
              <p className="text-xl font-bold text-muted-foreground">
                1.805 créditos
              </p>
              <p className="text-xs text-warning">
                em {withdrawalInfo.daysRemaining} dias
              </p>
            </>
          )}
        </div>
      </div>

      {/* Aviso Legal */}
      <div className="arena-card p-3 bg-muted/20 border border-muted">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <strong>Créditos internos:</strong> Uso exclusivo na plataforma para treinos, PvP e conteúdos.
            </p>
            <p>
              <strong>Devolução:</strong> Limitada ao valor pago original, disponível após 30 dias com taxa de 5%.
            </p>
            <p>
              <strong>Competições:</strong> Baseadas em habilidade e conhecimento, não constituem jogo de azar.
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown Detalhado (Expansível) */}
      {showDetails && (
        <div className="arena-card p-4 bg-background/50">
          <h4 className="font-semibold mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Detalhamento do Período
          </h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Dias na plataforma:</p>
              <p className="font-semibold">{daysSinceDeposit} dias</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status de saque:</p>
              <p className="font-semibold">
                {withdrawalInfo.canWithdraw ? 
                  <span className="text-victory">Disponível</span> : 
                  <span className="text-warning">Aguardando</span>
                }
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Taxa administrativa:</p>
              <p className="font-semibold">5% taxa</p>
            </div>
            <div>
              <p className="text-muted-foreground">Valor líquido:</p>
              <p className="font-semibold">1.805 créditos</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-epic/10 rounded-lg">
            <p className="text-xs text-epic font-semibold">
              💡 Lembre-se: Créditos ganhos em treinos e PvP são para uso interno e não podem ser sacados.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
