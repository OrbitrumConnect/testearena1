import { useState } from 'react';
import { Clock, Star, Trophy, Book } from 'lucide-react';

interface TimelineModuleProps {
  period: string;
  title: string;
  progress: number;
  isCompleted: boolean;
  isActive: boolean;
  icon: string;
  background?: string;
  onClick: () => void;
}

export const TimelineModule = ({ 
  period, 
  title, 
  progress, 
  isCompleted, 
  isActive, 
  icon,
  background,
  onClick 
}: TimelineModuleProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (icon) {
      case 'pyramid':
        return '🏛️';
      case 'castle':
        return '⚔️';
      case 'robot':
        return '💻';
      case 'scroll':
        return '📜';
      case 'globe':
        return '🌍';
      default:
        return '⚔️';
    }
  };

  return (
    <div
      className={`timeline-item cursor-pointer min-w-60 mx-2 relative overflow-hidden rounded-lg ${
        isCompleted ? 'completed' : ''
      } ${isActive ? 'ring-2 ring-epic' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={background ? {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : undefined}
    >
      {/* Background Overlay */}
      {background && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xl">{getIcon()}</div>
          {isCompleted && (
            <Trophy className="w-4 h-4 text-victory" />
          )}
        </div>
        
        <h3 className={`font-montserrat font-bold text-base mb-1 ${background ? 'text-white drop-shadow-md' : ''}`}>
          {title}
        </h3>
        <p className={`text-xs mb-3 ${background ? 'text-white/80 drop-shadow-md' : 'text-muted-foreground'}`}>
          {period}
        </p>
        
        <div className="progress-epic mb-2">
          <div 
            className="progress-epic-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className={`flex justify-between text-xs ${background ? 'text-white/70' : 'text-muted-foreground'}`}>
          <span>{progress}% completo</span>
          {isHovered && (
            <span className="text-epic">Entrar</span>
          )}
        </div>
      </div>
    </div>
  );
};