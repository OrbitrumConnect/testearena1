import React from 'react';
import { useNewSubscription } from '@/hooks/useNewSubscription';
import { creditsToReais } from '@/utils/creditsIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, 
  ArrowUpRight, 
  TrendingUp, 
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface NewWalletProps {
  className?: string;
}

export const NewWallet: React.FC<NewWalletProps> = ({ className = '' }) => {
  const { userSubscription, computed, loading, actions } = useNewSubscription();

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Carregando carteira...
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

  if (!userSubscription || !computed.withdrawalInfo || !computed.systemReport) {
    return (
      <Card className={`border-destructive ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Erro na Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar os dados da carteira.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { credits } = computed.systemReport;
  const withdrawalInfo = computed.withdrawalInfo;

  const handleWithdraw = async () => {
    if (!withdrawalInfo.canWithdraw) return;
    
    try {
      const result = await actions.processWithdrawal(credits.balance);
      if (result.success) {
        // Mostrar sucesso (toast seria ideal aqui)
        console.log(`✅ Saque processado: ${creditsToReais(result.creditsWithdrawn || 0)}`);
      }
    } catch (err) {
      console.error('Erro no saque:', err);
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-epic" />
          💎 Carteira de Créditos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saldo Principal */}
        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-epic/10 to-victory/10 border border-epic/20">
          <div className="text-sm text-muted-foreground mb-1">Saldo Disponível</div>
          <div className="text-3xl font-bold text-epic">
            {credits.balance.toLocaleString()} créditos
          </div>
          <div className="text-lg text-victory">
            {creditsToReais(credits.balance)} sacáveis
          </div>
        </div>

        {/* Informações de Saque */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded border">
            <div className="text-xs text-muted-foreground">Mínimo Saque</div>
            <div className="text-sm font-semibold">{creditsToReais(200)}</div>
            <div className="text-xs text-muted-foreground">200 créditos</div>
          </div>
          <div className="text-center p-3 rounded border">
                      <div className="text-xs text-muted-foreground">Taxa de Saque</div>
          <div className="text-sm font-semibold">15%</div>
          <div className="text-xs text-muted-foreground">sobre o valor</div>
          </div>
        </div>

        {/* Status do Saque */}
        {withdrawalInfo.canWithdraw ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-victory">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Disponível para saque</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Valor líquido: {creditsToReais(withdrawalInfo.netAmount)}
              {withdrawalInfo.fee > 0 && ` (taxa: ${creditsToReais(withdrawalInfo.fee)})`}
            </div>
            <Button 
              onClick={handleWithdraw}
              className="w-full bg-victory hover:bg-victory/90"
              size="sm"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Sacar {creditsToReais(withdrawalInfo.netAmount)}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Saque indisponível</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {withdrawalInfo.message}
            </div>
            <Progress 
              value={(credits.balance / 200) * 100} 
              className="h-2"
            />
            <div className="text-xs text-center text-muted-foreground">
              {200 - credits.balance} créditos para o mínimo
            </div>
          </div>
        )}

        {/* Conversão */}
        <div className="pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CreditCard className="w-3 h-3" />
            Sistema de créditos internos • Não constitui investimento
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
