import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { ActionButton } from '@/components/arena/ActionButton';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  DollarSign,
  CreditCard,
  Download
} from 'lucide-react';
import { useMonthlyDecay } from '@/hooks/useMonthlyDecay';

interface WalletDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditsBalance: number;
  canWithdraw: boolean;
  withdrawAmount: number;
}

export const WalletDetailsModal = ({ 
  isOpen, 
  onClose, 
  creditsBalance, 
  canWithdraw, 
  withdrawAmount 
}: WalletDetailsModalProps) => {
  const [requestingWithdraw, setRequestingWithdraw] = useState(false);
  const { getDecayInfo } = useMonthlyDecay();
  const decayInfo = getDecayInfo();

  // Simular dados do Sistema de 3
  const systemData = {
    currentMonth: 1,
    totalMonths: 3,
    currentPayment: 5.00,
    maxWithdrawal: 5.00,
    nextPayment: 3.50,
    daysUntilNext: 30,
    daysSinceDeposit: 15
  };

  const handleWithdrawRequest = () => {
    setRequestingWithdraw(true);
    // Simular processo de saque
    setTimeout(() => {
      setRequestingWithdraw(false);
      // Aqui você adicionaria a lógica real de saque
      alert('Solicitação de saque enviada! Será processada em até 48h.');
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-epic" />
            <span>Detalhes da Carteira</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Balance Overview */}
          <Card className="arena-card p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-epic mb-1">
                  {Math.round(creditsBalance)} créditos
                </div>
                <p className="text-sm text-muted-foreground">Saldo Interno</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-victory mb-1">
                  {withdrawAmount.toFixed(0)} créditos
                </div>
                <p className="text-sm text-muted-foreground">Valor Sacável</p>
              </div>
            </div>
          </Card>

          {/* Sistema de 3 Details */}
          <Card className="arena-card p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-epic" />
              Sistema de 3 Meses
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Mês Atual */}
              <div className="text-center p-3 rounded-lg border-l-4 border-l-epic bg-epic/5">
                <div className="text-lg font-bold text-epic">Mês {systemData.currentMonth}/3</div>
                <div className="text-sm text-muted-foreground mb-2">Atual</div>
                                  <Badge variant="outline" className="text-xs">
                    🚀 {systemData.currentPayment.toFixed(0)} créditos
                  </Badge>
              </div>

              {/* Devolução */}
              <div className="text-center p-3 rounded-lg border-l-4 border-l-victory bg-victory/5">
                <div className="text-lg font-bold text-victory">Devolução</div>
                <div className="text-sm text-muted-foreground mb-2">Disponível</div>
                                  <Badge variant="outline" className="text-xs">
                    💸 {systemData.maxWithdrawal.toFixed(0)} créditos
                  </Badge>
              </div>

              {/* Próximo */}
              <div className="text-center p-3 rounded-lg border-l-4 border-l-battle bg-battle/5">
                <div className="text-lg font-bold text-battle">Próximo</div>
                <div className="text-sm text-muted-foreground mb-2">Em {systemData.daysUntilNext}d</div>
                                  <Badge variant="outline" className="text-xs">
                    📅 {systemData.nextPayment.toFixed(0)} créditos
                  </Badge>
              </div>
            </div>

            <div className="bg-muted/10 rounded-lg p-3">
              <p className="text-sm text-center text-victory font-medium">
                💰 Economia de {(systemData.currentPayment - systemData.nextPayment).toFixed(0)} créditos este mês!
              </p>
            </div>
          </Card>

          {/* Withdrawal Section */}
          <Card className="arena-card p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Download className="w-5 h-5 mr-2 text-battle" />
              Solicitação de Saque
            </h3>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                <div className="flex items-center space-x-3">
                  {canWithdraw ? (
                    <CheckCircle className="w-5 h-5 text-victory" />
                  ) : (
                    <Clock className="w-5 h-5 text-epic" />
                  )}
                  <div>
                    <p className="font-medium">
                      {canWithdraw ? 'Saque Liberado' : 'Aguardando Período'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {canWithdraw 
                        ? 'Você pode solicitar o saque do valor depositado'
                        : `Aguarde mais ${30 - systemData.daysSinceDeposit} dias para liberar saque`
                      }
                    </p>
                  </div>
                </div>
                <Badge variant={canWithdraw ? 'default' : 'secondary'}>
                  {canWithdraw ? 'Disponível' : 'Bloqueado'}
                </Badge>
              </div>

              {/* Withdrawal Rules */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-epic" />
                  Regras de Saque
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Valor depositado + créditos ganhos são sacáveis</li>
                  <li>• Período mínimo: 30 dias após depósito</li>
                  <li>• Taxa administrativa: 22.5%</li>
                  <li>• Créditos de PvP e treinos acumulam</li>
                  <li>• Processamento: 24-48h úteis</li>
                </ul>
              </div>

              {/* Withdraw Button */}
              <div className="pt-4 border-t">
                <ActionButton
                  variant={canWithdraw ? 'victory' : 'secondary'}
                  className="w-full"
                  disabled={!canWithdraw || requestingWithdraw}
                  onClick={handleWithdrawRequest}
                >
                  {requestingWithdraw ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : canWithdraw ? (
                    <>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Solicitar Saque de R$ {withdrawAmount.toFixed(2)}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Saque Bloqueado (Aguarde {30 - systemData.daysSinceDeposit} dias)
                    </>
                  )}
                </ActionButton>
              </div>
            </div>
          </Card>

          {/* Credits Breakdown */}
          <Card className="arena-card p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-legendary" />
              Breakdown de Créditos
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-epic/10">
                <div className="text-lg font-bold text-epic">500</div>
                <div className="text-sm text-muted-foreground">Créditos Depositados</div>
                <div className="text-xs text-epic mt-1">✅ Sacáveis</div>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-legendary/10">
                <div className="text-lg font-bold text-legendary">
                  {Math.round(creditsBalance - 500)}
                </div>
                <div className="text-sm text-muted-foreground">Créditos Ganhos</div>
                <div className="text-xs text-legendary mt-1">⚠️ Apenas Internos</div>
              </div>
            </div>

            {/* Decay Info - Só aparece se ativo */}
            {decayInfo && decayInfo.isDecayActive && (
              <div className="mt-4 p-3 bg-battle/5 border border-battle/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-battle">Mês Anterior</span>
                  <Badge variant="outline" className="text-xs text-battle">
                    {decayInfo.statusText}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {decayInfo.decayedCredits} de {decayInfo.previousMonthCredits} créditos
                  </span>
                  <span className="text-battle">
                    -{decayInfo.decayRateFormatted}%/dia
                  </span>
                </div>
                <div className="w-full bg-battle/20 rounded-full h-1 mt-2">
                  <div 
                    className="bg-battle h-1 rounded-full transition-all" 
                    style={{ width: `${100 - decayInfo.decayPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
