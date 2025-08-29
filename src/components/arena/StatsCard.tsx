import { TrendingUp, Trophy, Target, Brain } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  type: 'history' | 'finance' | 'technology' | 'future';
  percentage: number;
  isImproving?: boolean;
}

export const StatsCard = ({ title, value, type, percentage, isImproving = true }: StatsCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'history':
        return <Trophy className="w-5 h-5" />;
      case 'finance':
        return <TrendingUp className="w-5 h-5" />;
      case 'technology':
        return <Target className="w-5 h-5" />;
      case 'future':
        return <Brain className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'history':
        return 'text-epic';
      case 'finance':
        return 'text-victory';
      case 'technology':
        return 'text-battle';
      case 'future':
        return 'text-primary-glow';
    }
  };

  return (
    <div className="arena-card p-4 hover-scale">
      <div className="flex items-center justify-between mb-3">
        <div className={`${getColor()}`}>
          {getIcon()}
        </div>
        <div className={`text-xs ${isImproving ? 'text-victory' : 'text-destructive'}`}>
          {isImproving ? '+' : '-'}{percentage}%
        </div>
      </div>
      
      <h4 className="font-montserrat font-semibold text-sm mb-1">{title}</h4>
      <p className={`text-2xl font-bold ${getColor()}`}>{value}</p>
      
      <div className="mt-3">
        <div className="progress-epic">
          <div 
            className="progress-epic-fill" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};