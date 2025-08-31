import { Calendar, TrendingDown, Gift, Info } from 'lucide-react';
import { useState } from 'react';

interface SystemInfoCardProps {
  currentMonth: 1 | 2 | 3;
  entryAmount: number;
  maxWithdrawal: number;
  nextAmount: number;
  daysUntilPayment: number;
  savings: number;
  className?: string;
}

export const SystemInfoCard = ({
  currentMonth,
  entryAmount,
  maxWithdrawal,
  nextAmount,
  daysUntilPayment,
  savings,
  className = ""
}: SystemInfoCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const getMonthColor = (month: 1 | 2 | 3) => {
    switch (month) {
      case 1: return 'text-epic';
      case 2: return 'text-warning';
      case 3: return 'text-victory';
    }
  };

  const getMonthIcon = (month: 1 | 2 | 3) => {
    switch (month) {
      case 1: return '🚀';
      case 2: return '💰';
      case 3: return '🎯';
    }
  };

  return (
    <div className={`arena-card p-4 bg-gradient-to-r from-epic/5 to-victory/5 border border-epic/20 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-epic" />
          Sistema de 3 - Mês {currentMonth}/3
        </h3>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-muted-foreground hover:text-epic transition-colors"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Valor Atual */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Este Mês</p>
          <p className={`text-lg font-bold ${getMonthColor(currentMonth)}`}>
            {Math.round(entryAmount * 100)} créditos
          </p>
          <p className="text-xs">{getMonthIcon(currentMonth)} Atual</p>
        </div>

        {/* Devolução Máxima */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Devolução</p>
          <p className="text-lg font-bold text-victory">
            Até {Math.round(maxWithdrawal * 100)} créditos
          </p>
          <p className="text-xs">💸 Disponível</p>
        </div>

        {/* Próximo Mês */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Próximo</p>
          <p className="text-lg font-bold text-warning">
            {Math.round(nextAmount * 100)} créditos
          </p>
          <p className="text-xs">📅 {daysUntilPayment}d</p>
        </div>
      </div>

      {/* Economia */}
      {savings > 0 && (
        <div className="bg-victory/10 p-3 rounded-lg border border-victory/20 mb-3">
          <div className="flex items-center justify-center space-x-2">
            <TrendingDown className="w-4 h-4 text-victory" />
            <span className="text-sm font-semibold text-victory">
              Economia de {Math.round(savings * 100)} créditos este mês!
            </span>
          </div>
        </div>
      )}

      {/* Vantagem do Sistema */}
      {maxWithdrawal > entryAmount && (
        <div className="bg-epic/10 p-3 rounded-lg border border-epic/20">
          <div className="flex items-center justify-center space-x-2">
            <Gift className="w-4 h-4 text-epic" />
            <span className="text-sm font-semibold text-epic">
              Vantagem: +{Math.round((maxWithdrawal - entryAmount) * 100)} créditos
            </span>
          </div>
        </div>
      )}

      {/* Detalhes Expandidos */}
      {showDetails && (
        <div className="mt-4 p-3 bg-background/50 rounded-lg text-xs space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="font-semibold text-epic">Mês 1</p>
              <p>500 créditos</p>
              <p className="text-muted-foreground">Padrão</p>
            </div>
            <div>
              <p className="font-semibold text-warning">Mês 2</p>
              <p>350 créditos</p>
              <p className="text-victory">-R$ 1,50</p>
            </div>
            <div>
              <p className="font-semibold text-victory">Mês 3</p>
              <p>200 créditos</p>
              <p className="text-victory">-R$ 3,00</p>
            </div>
          </div>
          
          <div className="border-t pt-2 mt-2">
            <p className="font-semibold text-epic">💡 Como funciona:</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Valor diminui a cada mês do ciclo</li>
              <li>• Devolução sempre limitada ao valor pago</li>
              <li>• Ciclo reinicia após 3 meses</li>
              <li>• Prazo de 30 dias para cada saque</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
