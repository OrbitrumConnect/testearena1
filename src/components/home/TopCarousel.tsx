import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, TrendingUp, Star, Crown, Medal, Award } from 'lucide-react';

interface TopPlayer {
  id: string;
  name: string;
  xp: number;
  level: number;
  rank: number;
  avatar?: string;
}

interface ImpactNews {
  id: string;
  title: string;
  category: string;
  impact: 'Crítico' | 'Alto' | 'Médio';
  relevance: number;
  trending: boolean;
}

interface TopCarouselProps {
  isMobile?: boolean;
}

export const TopCarousel = ({ isMobile = false }: TopCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock data para o ranking
  const topPlayers: TopPlayer[] = [
    { id: '1', name: 'Alexandre Magnus', xp: 15420, level: 154, rank: 1 },
    { id: '2', name: 'Cleópatra VII', xp: 14890, level: 148, rank: 2 },
    { id: '3', name: 'Leonardo da Vinci', xp: 13567, level: 135, rank: 3 },
    { id: '4', name: 'Napoleão Bonaparte', xp: 12890, level: 128, rank: 4 },
    { id: '5', name: 'Ada Lovelace', xp: 11234, level: 112, rank: 5 }
  ];

  // Mock data para notícias impactantes
  const impactNews: ImpactNews[] = [
    {
      id: '1',
      title: 'IA Generativa revoluciona mercado de trabalho',
      category: 'Tecnologia',
      impact: 'Crítico',
      relevance: 95,
      trending: true
    },
    {
      id: '2',
      title: 'Acordo climático define futuro energético mundial',
      category: 'Meio Ambiente',
      impact: 'Crítico',
      relevance: 89,
      trending: true
    },
    {
      id: '3',
      title: 'Computação quântica atinge marco histórico',
      category: 'Ciência',
      impact: 'Alto',
      relevance: 78,
      trending: false
    }
  ];

  // Combinar dados para o carousel
  const carouselItems = [
    ...topPlayers.map(player => ({ type: 'ranking' as const, data: player })),
    ...impactNews.map(news => ({ type: 'news' as const, data: news }))
  ];

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 3000); // Troca a cada 3 segundos

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const currentItem = carouselItems[currentIndex];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-4 h-4 text-legendary" />;
      case 2: return <Medal className="w-4 h-4 text-epic" />;
      case 3: return <Award className="w-4 h-4 text-battle" />;
      default: return <Trophy className="w-4 h-4 text-victory" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Crítico': return 'text-destructive';
      case 'Alto': return 'text-battle';
      case 'Médio': return 'text-epic';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <section className={isMobile ? 'mb-3' : 'mb-4'}>
      <Card className="arena-card-epic p-3 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {currentItem?.type === 'ranking' ? (
              <>
                <Trophy className="w-4 h-4 text-epic" />
                <span className="text-sm font-semibold text-epic">Top Guerreiros</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 text-battle" />
                <span className="text-sm font-semibold text-battle">Impacto Global</span>
              </>
            )}
          </div>

          {/* Indicadores */}
          <div className="flex space-x-1">
            {carouselItems.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-epic' : 'bg-muted/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[60px] flex items-center">
          {currentItem?.type === 'ranking' ? (
            <div className="flex items-center space-x-3 w-full">
              <div className="flex items-center space-x-2">
                {getRankIcon((currentItem.data as TopPlayer).rank)}
                <span className="text-lg font-bold">#{(currentItem.data as TopPlayer).rank}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{(currentItem.data as TopPlayer).name}</h3>
                <p className="text-xs text-muted-foreground">
                  Nível {(currentItem.data as TopPlayer).level} • {(currentItem.data as TopPlayer).xp.toLocaleString()} XP
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">Domínio</p>
                <div className="w-16 bg-muted/20 rounded-full h-2">
                  <div 
                    className="bg-epic h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (currentItem.data as TopPlayer).level)}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  (currentItem.data as ImpactNews).category === 'Tecnologia' ? 'bg-epic/20 text-epic' :
                  (currentItem.data as ImpactNews).category === 'Meio Ambiente' ? 'bg-victory/20 text-victory' :
                  'bg-battle/20 text-battle'
                }`}>
                  {(currentItem.data as ImpactNews).category}
                </span>
                
                <div className="flex items-center space-x-2">
                  {(currentItem.data as ImpactNews).trending && (
                    <Star className="w-3 h-3 text-legendary" />
                  )}
                  <span className={`text-xs font-medium ${getImpactColor((currentItem.data as ImpactNews).impact)}`}>
                    {(currentItem.data as ImpactNews).impact}
                  </span>
                </div>
              </div>
              
              <h3 className="font-semibold text-sm leading-tight mb-1">
                {(currentItem.data as ImpactNews).title}
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Relevância: {(currentItem.data as ImpactNews).relevance}%
                </span>
                <span className="text-xs text-epic">Quiz disponível</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
};
