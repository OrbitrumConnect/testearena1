import { useState } from 'react';
import { Clock, Star, Trophy, Book } from 'lucide-react';

interface TimelineModuleProps {
  period: string;
  title: string;
  progress: number;
  isCompleted: boolean;
  isActive: boolean;
  icon: string;
  onClick: () => void;
}

export const TimelineModule = ({ 
  period, 
  title, 
  progress, 
  isCompleted, 
  isActive, 
  icon,
  onClick 
}: TimelineModuleProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (icon) {
      case 'pyramid':
        return '🏛️';
      case 'castle':
        return '🏰';
      case 'robot':
        return '🤖';
      case 'scroll':
        return '📜';
      default:
        return '⚔️';
    }
  };

  return (
    <div
      className={`timeline-item cursor-pointer min-w-60 mx-2 ${
        isCompleted ? 'completed' : ''
      } ${isActive ? 'ring-2 ring-epic' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-xl">{getIcon()}</div>
        {isCompleted && (
          <Trophy className="w-4 h-4 text-victory" />
        )}
      </div>
      
      <h3 className="font-montserrat font-bold text-base mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3">{period}</p>
      
      <div className="progress-epic mb-2">
        <div 
          className="progress-epic-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{progress}% completo</span>
        {isHovered && (
          <span className="text-epic">Entrar</span>
        )}
      </div>
    </div>
  );
};