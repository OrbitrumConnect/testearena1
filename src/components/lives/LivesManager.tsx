import React from 'react';
import { useNewLives } from '@/hooks/useNewLives';
import { creditsToReais } from '@/utils/creditsIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Plus, 
  Clock, 
  Zap,
  ShoppingCart,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface LivesManagerProps {
  className?: string;
  showBuyButton?: boolean;
}

export const LivesManager: React.FC<LivesManagerProps> = ({ 
  className = '', 
  showBuyButton = true 
}) => {
  const { livesInfo, loading, error, actions, computed } = useNewLives();

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Carregando vidas...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !livesInfo) {
    return (
      <Card className={`border-destructive ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Erro nas Vidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error || 'Não foi possível carregar as informações das vidas.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const detailedStatus = computed.getDetailedStatus();
  const canPlayInfo = computed.canPlay();

  const handleBuyLife = async () => {
    try {
      const result = await actions.buyExtraLives(1);
      if (result.success) {
        console.log(`✅ ${result.message}`);
      }
    } catch (err) {
      console.error('Erro ao comprar vida:', err);
    }
  };

  const handleBuyMultipleLives = async (quantity: number) => {
    try {
      const result = await actions.buyExtraLives(quantity);
      if (result.success) {
        console.log(`✅ ${result.message}`);
      }
    } catch (err) {
      console.error('Erro ao comprar vidas:', err);
    }
  };

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < livesInfo.maxFree; i++) {
      hearts.push(
        <Heart 
          key={`free-${i}`}
          className={`w-6 h-6 ${i < livesInfo.available ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
        />
      );
    }
    
    // Vidas extras (se houver)
    const extraLives = Math.max(0, livesInfo.available - livesInfo.maxFree);
    for (let i = 0; i < extraLives; i++) {
      hearts.push(
        <Heart 
          key={`extra-${i}`}
          className="w-6 h-6 text-epic fill-epic"
        />
      );
    }
    
    return hearts;
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          ❤️ Sistema de Vidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vidas Disponíveis */}
        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
          <div className="text-sm text-muted-foreground mb-2">Vidas Disponíveis</div>
          <div className="flex justify-center gap-1 mb-2">
            {renderHearts()}
          </div>
          <div className="text-2xl font-bold">
            {livesInfo.available}/{livesInfo.maxFree}
            {livesInfo.available > livesInfo.maxFree && (
              <Badge variant="secondary" className="ml-2">
                +{livesInfo.available - livesInfo.maxFree} extra
              </Badge>
            )}
          </div>
        </div>

        {/* Reset Timer */}
        <div className="flex items-center justify-between p-3 rounded border">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Reset em:</span>
          </div>
          <div className="text-sm font-mono">
            {computed.getTimeUntilReset()}
          </div>
        </div>

        {/* Status de Jogo */}
        <div className={`p-3 rounded border ${
          canPlayInfo.canPlay 
            ? 'border-victory bg-victory/5' 
            : 'border-destructive bg-destructive/5'
        }`}>
          <div className="flex items-center gap-2">
            {canPlayInfo.canPlay ? (
              <Zap className="w-4 h-4 text-victory" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-destructive" />
            )}
            <span className={`text-sm font-medium ${
              canPlayInfo.canPlay ? 'text-victory' : 'text-destructive'
            }`}>
              {canPlayInfo.canPlay ? 'Pronto para jogar!' : 'Não pode jogar'}
            </span>
          </div>
          {canPlayInfo.suggestion && (
            <div className="text-xs text-muted-foreground mt-1">
              {canPlayInfo.suggestion}
            </div>
          )}
        </div>

        {/* Comprar Vidas Extras */}
        {showBuyButton && livesInfo.canBuyExtra && detailedStatus && (
          <div className="space-y-3">
            <div className="text-sm font-medium">Comprar Vidas Extras</div>
            
            {/* Preço por vida */}
            <div className="text-xs text-muted-foreground text-center">
              {livesInfo.extraLifeCost} créditos = {creditsToReais(livesInfo.extraLifeCost)} por vida
            </div>
            
            {/* Botões de compra */}
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBuyLife()}
                disabled={!livesInfo.canBuyExtra}
              >
                <Plus className="w-3 h-3 mr-1" />
                1 vida
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBuyMultipleLives(5)}
                disabled={detailedStatus.maxLivesCanBuy < 5}
              >
                <Plus className="w-3 h-3 mr-1" />
                5 vidas
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBuyMultipleLives(10)}
                disabled={detailedStatus.maxLivesCanBuy < 10}
              >
                <Plus className="w-3 h-3 mr-1" />
                10 vidas
              </Button>
            </div>
            
            <div className="text-xs text-center text-muted-foreground">
              Você pode comprar até {detailedStatus.maxLivesCanBuy} vidas
            </div>
          </div>
        )}

        {/* Informações extras */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Vidas grátis/dia:</span>
            <span>{livesInfo.maxFree}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Reset diário:</span>
            <span>00:00</span>
          </div>
          {livesInfo.resetToday && (
            <div className="flex items-center gap-1 text-xs text-victory">
              <RefreshCw className="w-3 h-3" />
              Vidas foram resetadas hoje!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
