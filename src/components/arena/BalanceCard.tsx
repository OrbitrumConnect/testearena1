import { Wallet, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BalanceCardProps {
  balance: number;
  xp: number;
  canWithdraw: boolean;
  nextWithdraw?: string;
}

export const BalanceCard = ({ balance, xp, canWithdraw, nextWithdraw }: BalanceCardProps) => {
  return (
    <div className="arena-card-epic p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-epic" />
          <h3 className="font-montserrat font-bold text-base">Carteira Arena</h3>
        </div>
        <div className="glow-epic rounded-full p-1.5">
          <TrendingUp className="w-4 h-4 text-epic" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Saldo Disponível</p>
          <p className="text-epic text-xl font-bold">{Math.round(balance * 100)} créditos</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">XP Total</p>
          <p className="text-victory text-xl font-bold">{xp.toLocaleString()}</p>
        </div>
      </div>
      
      {canWithdraw ? (
        <Button className="btn-epic w-full">
          Sacar via Pix
        </Button>
      ) : (
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1.5">Próximo saque disponível:</p>
          <div className="flex items-center justify-center space-x-1 text-epic">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-semibold text-sm">{nextWithdraw}</span>
          </div>
        </div>
      )}
    </div>
  );
};