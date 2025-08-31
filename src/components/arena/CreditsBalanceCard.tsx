import { Coins, TrendingUp, Clock, Wallet, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { WalletDetailsModal } from '@/components/wallet/WalletDetailsModal';
import { useCreditsPerception } from '@/hooks/useCreditsPerception';
import { useMonthlyDecay } from '@/hooks/useMonthlyDecay';
import { useIsMobile } from '@/hooks/use-mobile';

interface CreditsBalanceCardProps {
  creditsBalance: number;
  xp: number;
  canWithdraw: boolean;
  withdrawAmount: number;
  nextWithdraw?: string;
  earnedCredits?: number;
}

export const CreditsBalanceCard = ({ 
  creditsBalance, 
  xp, 
  canWithdraw, 
  withdrawAmount,
  nextWithdraw,
  earnedCredits = 0
}: CreditsBalanceCardProps) => {
  const isMobile = useIsMobile();
  const [showInfo, setShowInfo] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showPerceptionDetails, setShowPerceptionDetails] = useState(false);
  const { data: perceptionData, calculatePerceptionValue } = useCreditsPerception();
  const { getDecayInfo } = useMonthlyDecay();
  const decayInfo = getDecayInfo();

  return (
    <div className={`arena-card-epic ${isMobile ? 'p-2 scale-75 max-h-[155px] overflow-hidden' : 'p-5'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-epic" />
          <h3 className="font-montserrat font-bold text-base">Créditos Arena</h3>
        </div>
        <button 
          onClick={() => setShowWalletModal(true)}
          className="glow-epic rounded-full p-1.5 hover:bg-epic/10 transition-colors"
          title="Ver detalhes da carteira"
        >
          <Wallet className="w-4 h-4 text-epic" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Créditos Internos</p>
          <p className="text-epic text-xl font-bold">{creditsBalance.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground/60">Apenas uso interno</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">XP Total</p>
          <p className="text-victory text-xl font-bold">{xp.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground/60">
            Nível {Math.floor(xp / 100) + 1}
          </p>
        </div>
      </div>

      {/* Sistema de Percepção - Só aparece se há créditos ganhos */}
      {perceptionData.totalCredits > 0 && (
        <div className="bg-epic/5 border border-epic/20 rounded-lg mb-3 overflow-hidden">
          {/* Header Compacto - Sempre Visível */}
          <div 
            className="p-3 cursor-pointer hover:bg-epic/10 transition-colors"
            onClick={() => setShowPerceptionDetails(!showPerceptionDetails)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-xs text-epic font-medium">Créditos Ganhos</p>
                <span className="text-epic font-bold">{perceptionData.totalCredits.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">≈ R$ {perceptionData.perceptionValue.toFixed(2)}</span>
                {showPerceptionDetails ? (
                  <ChevronUp className="w-4 h-4 text-epic" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-epic" />
                )}
              </div>
            </div>
          </div>

          {/* Detalhes Expansíveis */}
          {showPerceptionDetails && (
            <div className="px-3 pb-3 border-t border-epic/10">
              <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Treinos</p>
                  <p className="text-sm font-bold text-epic">{perceptionData.creditsFromTraining}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">PvP</p>
                  <p className="text-sm font-bold text-battle">{perceptionData.creditsFromPvP}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Torneios</p>
                  <p className="text-sm font-bold text-victory">{perceptionData.creditsFromTournaments}</p>
                </div>
              </div>
              
              {decayInfo && decayInfo.isDecayActive && (
                <div className="bg-battle/5 border border-battle/20 rounded p-2 mb-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-battle font-medium">Mês Anterior</span>
                    <span className="text-muted-foreground">{decayInfo.statusText}</span>
                  </div>
                  <div className="w-full bg-battle/20 rounded-full h-1 mt-1">
                    <div 
                      className="bg-battle h-1 rounded-full transition-all" 
                      style={{ width: `${100 - decayInfo.decayPercentage}%` }}
                    />
                  </div>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                💡 Valor de percepção R$ 0,05/crédito • Não sacável
                {decayInfo && decayInfo.isExpiringSoon && (
                  <span className="text-battle ml-2">• {decayInfo.statusText}</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {earnedCredits > 0 && (
        <div className="mb-3 p-2 bg-victory/10 rounded-lg border border-victory/20">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-victory" />
            <span className="text-sm text-victory font-semibold">
              +{earnedCredits.toLocaleString()} créditos ganhos
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            ⚠️ Créditos ganhos não são sacáveis
          </p>
        </div>
      )}

      {/* Saque (Devolução) */}
      <div className="border-t border-muted/20 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Saque Disponível</span>
          </div>
          <span className="text-sm font-bold">{Math.round(withdrawAmount * 100)} créditos</span>
        </div>
        
        {canWithdraw ? (
          <Button className="btn-epic w-full text-sm">
            Solicitar Devolução
          </Button>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-warning">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-semibold text-xs">{nextWithdraw}</span>
            </div>
          </div>
        )}
      </div>

      {/* Informações Detalhadas */}
      {showInfo && (
        <div className="mt-4 p-3 bg-muted/20 rounded-lg text-xs space-y-2">
          <p className="font-semibold text-epic">💎 Sistema de Créditos Internos</p>
          <div className="space-y-1 text-muted-foreground">
            <p>• Créditos são para uso exclusivo na plataforma</p>
            <p>• Use em treinos, PvP e conteúdos premium</p>
            <p>• Saque limitado ao valor pago original (R$ 20,00)</p>
            <p>• Disponível após 30 dias com taxa de 5%</p>
          </div>
          <div className="bg-epic/10 p-2 rounded text-epic">
            <p className="font-semibold">⚡ Ganhe mais créditos:</p>
            <p>Participe de treinos e batalhas PvP!</p>
          </div>
        </div>
      )}

      {/* Wallet Details Modal */}
      <WalletDetailsModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        creditsBalance={creditsBalance}
        canWithdraw={canWithdraw}
        withdrawAmount={withdrawAmount}
      />
    </div>
  );
};
