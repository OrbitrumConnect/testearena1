import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, BookOpen, Users } from 'lucide-react';
import { ActionButton } from '@/components/arena/ActionButton';
import { getPvPValues } from '@/utils/creditsIntegration';

// Dados das eras para o carousel
const eraData = [
  {
    id: 'egypt',
    title: 'Egito Antigo',
    subtitle: 'Arena Ativa',
    description: 'Domine os mistérios do Nilo e conquiste conhecimento sobre economia antiga',
    period: '3000-2900 a.C.',
    emoji: '🏛️',
    background: '/egypt-landing-bg.jpg',
    color: 'epic',
    routes: {
      training: '/training',
      arena: '/arena',
      ranking: '/ranking',
      knowledge: '/knowledge'
    }
  },
  {
    id: 'mesopotamia',
    title: 'Mesopotâmia',
    subtitle: 'Arena Ativa',
    description: 'Explore a terra entre rios e desvende os segredos da escrita cuneiforme',
    period: '2900-2800 a.C.',
    emoji: '📜',
    background: '/mesopotamia-landing-bg.jpg',
    color: 'battle',
    routes: {
      training: '/mesopotamia',
      arena: '/arena',
      ranking: '/ranking',
      knowledge: '/knowledge'
    }
  },
  {
    id: 'medieval',
    title: 'Era Medieval',
    subtitle: 'Arena Ativa',
    description: 'Navegue pela política feudal e conquiste conhecimento sobre economia medieval',
    period: '1000-1100 d.C.',
    emoji: '⚔️',
    background: '/medieval-landing-bg.jpg',
    color: 'victory',
    routes: {
      training: '/medieval',
      arena: '/arena',
      ranking: '/ranking',
      knowledge: '/knowledge'
    }
  },
  {
    id: 'digital',
    title: 'Era Digital',
    subtitle: 'Arena Ativa',
    description: 'Domine tecnologia moderna e conquiste conhecimento sobre economia digital',
    period: '2000-2100 d.C.',
    emoji: '💻',
    background: '/digital-landing-bg.jpg',
    color: 'legendary',
    routes: {
      training: '/digital',
      arena: '/arena',
      ranking: '/ranking',
      knowledge: '/knowledge'
    }
  },
  {
    id: 'world',
    title: 'Mundo Real',
    subtitle: 'Arena Ativa',
    description: 'Explore eventos atuais que moldam nossa sociedade e economia global',
    period: '2024 - Atual',
    emoji: '🌍',
    background: '/digital-landing-bg.jpg',
    color: 'destructive',
    routes: {
      training: '/world-quiz',
      arena: '/arena',
      ranking: '/ranking',
      knowledge: '/knowledge'
    }
  }
];

interface EraCarouselProps {
  isMobile?: boolean;
}

export const EraCarousel = ({ isMobile = false }: EraCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  
  // Obter valores do PvP dinâmicos
  const pvpValues = getPvPValues();
  
  // Verificar tipo de usuário para bloquear Quiz Mundo Real para FREE
  const userType = 'free'; // TODO: pegar do perfil do usuário real

  // Auto-rotation a cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % eraData.length);
        setIsTransitioning(false);
      }, 300); // 300ms para transição suave
      
    }, 4000); // 4 segundos por era

    return () => clearInterval(interval);
  }, []);

  const currentEra = eraData[currentIndex];
  const isWorldQuiz = currentEra.id === 'world';
  const isBlocked = userType === 'free' && isWorldQuiz;

  return (
    <section className={isMobile ? 'mb-3' : 'mb-6'}>
      <div 
        className={`arena-card ${isMobile ? 'p-3' : 'p-6'} relative overflow-hidden transition-all duration-500 ${isTransitioning ? 'opacity-90' : 'opacity-100'}`}
      >
        {/* Background animado */}
        <div 
          className="absolute inset-0 transition-all duration-1000 ease-in-out bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${currentEra.background})`,
            filter: 'brightness(0.5)'
          }}
        />
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/40 to-transparent" />
        
        {/* Conteúdo */}
        <div className="relative z-10">
          {isMobile ? (
            // Mobile: Layout compacto
            <div className="text-center mb-3">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-2xl">{currentEra.emoji}</span>
                <div>
                  <h3 className={`text-base font-montserrat font-bold text-${currentEra.color} transition-colors duration-500`}>
                    {currentEra.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{currentEra.period}</p>
                </div>
              </div>
              
              {/* Indicadores de era */}
              <div className="flex justify-center space-x-1 mb-3">
                {eraData.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? `bg-${currentEra.color}` : 'bg-muted/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            // Desktop: Layout original com animação
            <div className="flex items-center justify-between mb-8">
              <div className="max-w-2xl">
                <h3 className={`text-4xl font-montserrat font-bold text-${currentEra.color} mb-3 transition-all duration-500`}>
                  {currentEra.title} - {currentEra.subtitle}
                </h3>
                <p className="text-lg text-muted-foreground mb-2 transition-all duration-500">
                  {currentEra.description}
                </p>
                <p className="text-sm text-muted-foreground/80">
                  {currentEra.period}
                </p>
                
                {/* Indicadores discretos */}
                <div className="flex space-x-2 mt-4">
                  {eraData.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
                        index === currentIndex ? `bg-${currentEra.color}` : 'bg-muted/40'
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
              </div>
              
              <div className={`text-7xl opacity-80 transition-all duration-500 ${isTransitioning ? 'scale-90' : 'scale-100'}`}>
                {currentEra.emoji}
              </div>
            </div>
          )}
          
          {/* Botões de ação - SEMPRE na mesma posição */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 lg:grid-cols-4 gap-3'} w-full`} style={isMobile ? {transform: 'scale(1.05) scaleY(1.05)'} : {}}>
            <ActionButton 
              variant={isBlocked ? 'secondary' : 'victory'} 
              icon={<Play />}
              onClick={() => isBlocked ? null : navigate(currentEra.routes.training)}
              disabled={isBlocked}
              className={`${isMobile ? 'text-xs py-2' : 'text-sm py-3'} w-full transition-all duration-300 ${isBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isBlocked ? 
                (isMobile ? '🔒 Pago' : '🔒 Quiz Pago') : 
                (isMobile ? 'Treinar' : 'Treinar Gratuito')
              }
            </ActionButton>
            
            <ActionButton 
              variant="epic" 
              icon={<Trophy />}
              onClick={() => navigate(currentEra.routes.arena)}
              className={`${isMobile ? 'text-xs py-2' : 'text-sm py-3'} w-full transition-all duration-300`}
            >
              {isMobile ? 'Arena' : `Arena (${pvpValues.betAmount} créditos)`}
            </ActionButton>
            
            {!isMobile && (
              <>
                <ActionButton 
                  variant="battle" 
                  icon={<Users />}
                  onClick={() => navigate(currentEra.routes.ranking)}
                  className="text-sm py-3 w-full transition-all duration-300"
                >
                  Ranking Global
                </ActionButton>
                
                <ActionButton 
                  variant="legendary" 
                  icon={<BookOpen />}
                  onClick={() => navigate(currentEra.routes.knowledge)}
                  className="text-sm py-3 w-full transition-all duration-300"
                >
                  Base Conhecimento
                </ActionButton>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
