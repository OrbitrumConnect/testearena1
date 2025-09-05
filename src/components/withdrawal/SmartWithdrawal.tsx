import React, { useState } from 'react';
import { useMeritSystem } from '@/hooks/useMeritSystem';
import { useNewSubscription } from '@/hooks/useNewSubscription';
import { creditsToReais } from '@/utils/creditsIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet,
  TrendingUp,
  Star,
  Calculator,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Crown
} from 'lucide-react';

interface SmartWithdrawalProps {
  className?: string;
}

export const SmartWithdrawal: React.FC<SmartWithdrawalProps> = ({ className = '' }) => {
  const { userMerit, computed } = useMeritSystem();
  const { userSubscription, actions } = useNewSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawalResult, setWithdrawalResult] = useState<{
    success: boolean;
    amount?: number;
    message?: string;
  } | null>(null);

  const userStats = computed.getUserStats();

  if (!userMerit || !userSubscription || !userStats) {
    return (
      <Card className={`border-destructive ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Dados Não Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar os dados de saque inteligente.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Cálculos de saque inteligente
  const baseCredits = userSubscription.credits_balance;
  const baseAmount = baseCredits * 0.8; // 80% base
  const meritBonus = userStats.performance.isTopPerformer 
    ? baseAmount * (userStats.financial.merit_points - 1)
    : 0;
  const totalWithdrawable = baseAmount + meritBonus;
  
  // Taxa de saque (10%)
  const withdrawalFee = totalWithdrawable * 0.1;
  const netAmount = totalWithdrawable - withdrawalFee;
  
  const minWithdrawal = 200; // 200 créditos = R$ 2,00
  const canWithdraw = baseCredits >= minWithdrawal;

  const handleSmartWithdrawal = async () => {
    if (!canWithdraw) return;
    
    setIsProcessing(true);
    
    try {
      // Calcular quantidade ótima para saque
      const optimalCredits = Math.floor(totalWithdrawable);
      
      const result = await actions.processWithdrawal(optimalCredits);
      
      if (result.success) {
        setWithdrawalResult({
          success: true,
          amount: result.amount,
          message: `Saque processado com sucesso! ${creditsToReais(result.creditsWithdrawn || 0)} transferidos.`
        });
      } else {
        setWithdrawalResult({
          success: false,
          message: 'Erro ao processar saque. Tente novamente.'
        });
      }
    } catch (err) {
      setWithdrawalResult({
        success: false,
        message: 'Erro inesperado ao processar saque.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-epic" />
          💰 Saque Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status de Resultado de Saque */}
        {withdrawalResult && (
          <div className={`p-3 rounded border ${
            withdrawalResult.success 
              ? 'bg-victory/10 border-victory/30' 
              : 'bg-destructive/10 border-destructive/30'
          }`}>
            <div className="flex items-center gap-2">
              {withdrawalResult.success ? (
                <CheckCircle className="w-4 h-4 text-victory" />
              ) : (
                <AlertCircle className="w-4 h-4 text-destructive" />
              )}
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  withdrawalResult.success ? 'text-victory' : 'text-destructive'
                }`}>
                  {withdrawalResult.success ? 'Saque Realizado!' : 'Erro no Saque'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {withdrawalResult.message}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cálculo Inteligente */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calculator className="w-4 h-4" />
            Cálculo Inteligente do Saque
          </div>
          
          <div className="space-y-2 bg-muted/20 p-3 rounded border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Créditos disponíveis:</span>
              <span className="font-medium">{baseCredits.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base sacável (80%):</span>
              <span className="font-medium">{creditsToReais(baseAmount)}</span>
            </div>
            
            {meritBonus > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Star className="w-3 h-3 text-epic" />
                  Bônus mérito ({Math.round((userStats.financial.merit_points - 1) * 100)}%):
                </span>
                <span className="font-medium text-epic">{creditsToReais(meritBonus)}</span>
              </div>
            )}
            
            <hr className="border-muted" />
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">{creditsToReais(totalWithdrawable)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de saque (10%):</span>
              <span className="font-medium text-destructive">-{creditsToReais(withdrawalFee)}</span>
            </div>
            
            <hr className="border-muted" />
            
            <div className="flex justify-between font-bold">
              <span>Valor líquido:</span>
              <span className="text-victory text-lg">{creditsToReais(netAmount)}</span>
            </div>
          </div>
        </div>

        {/* Status do Mérito */}
        {userStats.performance.isTopPerformer ? (
          <div className="p-3 rounded bg-epic/10 border border-epic/30">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-epic" />
              <div className="flex-1">
                <div className="text-sm font-medium text-epic">
                  🌟 Usuário Top 5% - Bônus Ativo
                </div>
                <div className="text-xs text-muted-foreground">
                  Você está recebendo {Math.round((userStats.financial.merit_points - 1) * 100)}% extra nos saques
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded bg-orange-500/10 border border-orange-500/30">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-orange-500">
                  Potencial de Bônus
                </div>
                <div className="text-xs text-muted-foreground">
                  Entre no top 5% para receber +20% em todos os saques
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status de Disponibilidade */}
        {canWithdraw ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-victory">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Saque disponível</span>
            </div>
            
            <Button 
              onClick={handleSmartWithdrawal}
              disabled={isProcessing}
              className="w-full bg-victory hover:bg-victory/90"
              size="lg"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processando...' : `Sacar ${creditsToReais(netAmount)}`}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Saque indisponível</span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Mínimo para saque: {creditsToReais(minWithdrawal)}
            </div>
            
            <Progress 
              value={(baseCredits / minWithdrawal) * 100} 
              className="h-2"
            />
            
            <div className="text-xs text-center text-muted-foreground">
              Faltam {minWithdrawal - baseCredits} créditos para o saque mínimo
            </div>
          </div>
        )}

        {/* Informações do Sistema */}
        <div className="pt-3 border-t space-y-2">
          <div className="text-xs text-muted-foreground">
            <div className="mb-1">
              💡 <strong>Saque Inteligente:</strong> Calcula automaticamente o valor ótimo
            </div>
            <div className="mb-1">
              🎯 <strong>Bônus de Mérito:</strong> Top 5% ganham até +20% extra
            </div>
            <div>
              ⏱️ <strong>Processamento:</strong> PIX processado em até 24h úteis
            </div>
          </div>
          
          {/* Tier Atual */}
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={`${
                userStats.performance.tier === 'elite' ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' :
                userStats.performance.tier === 'gold' ? 'bg-yellow-600/20 text-yellow-700 border-yellow-600/30' :
                userStats.performance.tier === 'silver' ? 'bg-gray-400/20 text-gray-600 border-gray-400/30' :
                'bg-amber-600/20 text-amber-700 border-amber-600/30'
              }`}
            >
              {userStats.performance.tier.toUpperCase()}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Seu nível atual de mérito
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
