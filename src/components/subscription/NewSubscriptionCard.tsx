import React from 'react';
import { useNewSubscription } from '@/hooks/useNewSubscription';
import { getNewSystemDisplayInfo } from '@/utils/newSubscriptionSystem';
import { creditsToReais } from '@/utils/creditsIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Calendar, 
  TrendingDown, 
  Gift, 
  CreditCard,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface NewSubscriptionCardProps {
  className?: string;
  showPaymentButton?: boolean;
}

export const NewSubscriptionCard: React.FC<NewSubscriptionCardProps> = ({ 
  className = '', 
  showPaymentButton = true 
}) => {
  const { userSubscription, computed, loading, actions } = useNewSubscription();

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Carregando plano...
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

  if (!userSubscription || !computed.paymentInfo || !computed.systemReport) {
    return (
      <Card className={`border-destructive ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Crown className="w-5 h-5" />
            Erro no Plano
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar os dados da assinatura.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { subscription } = computed.systemReport;
  const paymentInfo = computed.paymentInfo;
  const displayInfo = getNewSystemDisplayInfo(subscription.currentMonth);

  const handleNextPayment = async () => {
    try {
      const result = await actions.processNextPayment();
      if (result.success) {
        console.log(`✅ Pagamento processado! Novo mês: ${result.newMonth}`);
      }
    } catch (err) {
      console.error('Erro no pagamento:', err);
    }
  };

  const cycleProgress = (subscription.currentMonth / 3) * 100;

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-epic" />
          {displayInfo.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Atual */}
        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-epic/10 to-purple-500/10 border border-epic/20">
          <div className="text-sm text-muted-foreground mb-1">Plano Atual</div>
          <div className="text-2xl font-bold text-epic">
            {displayInfo.price}
          </div>
          <div className="text-sm text-muted-foreground">
            {displayInfo.credits} • {displayInfo.lives}
          </div>
        </div>

        {/* Progresso do Ciclo */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso do Ciclo</span>
            <span className="font-medium">{paymentInfo.cycleProgress}</span>
          </div>
          <Progress value={cycleProgress} className="h-2" />
          <div className="text-xs text-center text-muted-foreground">
            {displayInfo.userMessage}
          </div>
        </div>

        {/* Economia */}
        {subscription.savings > 0 && (
          <div className="flex items-center gap-2 p-3 rounded border border-victory bg-victory/5">
            <TrendingDown className="w-4 h-4 text-victory" />
            <div className="flex-1">
              <div className="text-sm font-medium text-victory">
                Economia este mês: R$ {subscription.savings.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Em relação ao primeiro mês
              </div>
            </div>
          </div>
        )}

        {/* Próximo Pagamento */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            Próximo Pagamento
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded border">
              <div className="text-xs text-muted-foreground">Data</div>
              <div className="text-sm font-semibold">{paymentInfo.nextPaymentDate}</div>
              <div className="text-xs text-muted-foreground">
                {paymentInfo.daysUntilPayment} dias
              </div>
            </div>
            <div className="text-center p-3 rounded border">
              <div className="text-xs text-muted-foreground">Valor</div>
              <div className="text-sm font-semibold">
                R$ {paymentInfo.nextAmount.toFixed(2)}
              </div>
              {paymentInfo.savings > 0 && (
                <div className="text-xs text-victory">
                  -R$ {paymentInfo.savings.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botão de Pagamento (se habilitado) */}
        {showPaymentButton && paymentInfo.daysUntilPayment <= 5 && (
          <Button 
            onClick={handleNextPayment}
            className="w-full bg-epic hover:bg-epic/90"
            size="sm"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pagar R$ {paymentInfo.nextAmount.toFixed(2)}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}

        {/* Reinício de Ciclo */}
        {paymentInfo.cycleRestart && (
          <div className="flex items-center gap-2 p-3 rounded border border-purple-500 bg-purple-500/5">
            <Gift className="w-4 h-4 text-purple-500" />
            <div className="flex-1">
              <div className="text-sm font-medium text-purple-500">
                Novo ciclo iniciando!
              </div>
              <div className="text-xs text-muted-foreground">
                Voltando para R$ 5,00 no próximo mês
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="pt-3 border-t">
          <div className="text-sm font-medium mb-2">Incluído no seu plano:</div>
          <div className="space-y-1">
            {displayInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-3 h-3 text-victory" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversão */}
        <div className="pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CreditCard className="w-3 h-3" />
            Conversão: 100 créditos = R$ 1,00
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
