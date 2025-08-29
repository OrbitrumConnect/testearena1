import { Trophy, TrendingUp, Globe, Clock, Star, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ActionButton } from '@/components/arena/ActionButton';

interface WeeklyHighlightsProps {
  isMobile?: boolean;
}

export const WeeklyHighlights = ({ isMobile = false }: WeeklyHighlightsProps) => {
  // Dados simulados dos destaques da semana
  const weeklyHighlights = [
    {
      id: 'ranking',
      type: 'ranking',
      title: '🏆 Campeão da Semana',
      subtitle: 'Guerreiro Épico',
      description: '95% de precisão • 47 vitórias',
      value: '2.847 XP',
      trend: '+15%',
      color: 'epic',
      icon: <Trophy className="w-5 h-5" />
    },
    {
      id: 'trending',
      type: 'trending',
      title: '📈 Tópico em Alta',
      subtitle: 'Inteligência Artificial',
      description: 'IA generativa revoluciona trabalho',
      value: '847 perguntas',
      trend: 'Novo',
      color: 'victory',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: 'global',
      type: 'global',
      title: '🌍 Destaque Global',
      subtitle: 'Sustentabilidade',
      description: 'COP28: Acordos climáticos',
      value: 'Quiz Ativo',
      trend: 'Urgente',
      color: 'battle',
      icon: <Globe className="w-5 h-5" />
    }
  ];

  const worldNews = [
    {
      id: 'tech',
      category: 'Tecnologia',
      title: 'IA Generativa e o Futuro do Trabalho',
      summary: 'Como ChatGPT e similares estão transformando profissões e criando novas oportunidades.',
      impact: 'Alto',
      relevance: '95%',
      addedToQuiz: true,
      era: 'Digital'
    },
    {
      id: 'climate',
      category: 'Meio Ambiente',
      title: 'Acordo de Paris: Novos Compromissos',
      summary: 'Países estabelecem metas mais ambiciosas para redução de carbono até 2030.',
      impact: 'Crítico',
      relevance: '89%',
      addedToQuiz: true,
      era: 'Digital'
    },
    {
      id: 'economy',
      category: 'Economia',
      title: 'Moedas Digitais de Bancos Centrais',
      summary: 'CBDCs ganham força mundial como alternativa ao dinheiro físico.',
      impact: 'Médio',
      relevance: '78%',
      addedToQuiz: false,
      era: 'Digital'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Destaques da Semana */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-montserrat font-bold ${isMobile ? 'text-lg' : 'text-xl'} flex items-center`}>
            <Star className="w-5 h-5 mr-2 text-epic" />
            Destaques da Semana
          </h2>
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Atualizado hoje
          </span>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
          {weeklyHighlights.map((highlight) => (
            <Card 
              key={highlight.id} 
              className={`arena-card p-4 hover-scale transition-all border-${highlight.color}/30 hover:border-${highlight.color}/50`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-${highlight.color}/10`}>
                  {highlight.icon}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full bg-${highlight.color}/20 text-${highlight.color} font-medium`}>
                  {highlight.trend}
                </span>
              </div>
              
              <h3 className="font-semibold text-sm mb-1">{highlight.title}</h3>
              <p className={`text-${highlight.color} font-bold text-lg mb-1`}>{highlight.subtitle}</p>
              <p className="text-xs text-muted-foreground mb-2">{highlight.description}</p>
              <p className="text-sm font-bold">{highlight.value}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Novidades do Mundo Real */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-montserrat font-bold ${isMobile ? 'text-lg' : 'text-xl'} flex items-center`}>
            <Globe className="w-5 h-5 mr-2 text-battle" />
            Mundo Real • Quiz Atualizado
          </h2>
          <ActionButton 
            variant="battle" 
            className="text-xs px-3 py-1"
            onClick={() => {/* Navigate to current events quiz */}}
          >
            Ver Todos
          </ActionButton>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-3 gap-3'}`}>
          {worldNews.slice(0, 3).map((news) => (
            <Card 
              key={news.id} 
              className={`arena-card p-3 border-l-2 hover-scale cursor-pointer ${
                news.impact === 'Crítico' ? 'border-l-destructive' :
                news.impact === 'Alto' ? 'border-l-battle' : 'border-l-epic'
              }`}
              onClick={() => {/* Navigate to world quiz */}}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    news.category === 'Tecnologia' ? 'bg-epic/20 text-epic' :
                    news.category === 'Meio Ambiente' ? 'bg-victory/20 text-victory' :
                    'bg-battle/20 text-battle'
                  }`}>
                    {news.category}
                  </span>
                  {news.addedToQuiz && (
                    <span className="text-xs px-1 py-1 rounded bg-legendary/20 text-legendary">
                      ⚡
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold text-sm leading-tight">{news.title}</h3>
                
                <div className="flex items-center space-x-3 text-xs">
                  <span className={`${
                    news.impact === 'Crítico' ? 'text-destructive' :
                    news.impact === 'Alto' ? 'text-battle' : 'text-epic'
                  }`}>
                    {news.impact}
                  </span>
                  <span className="text-victory">{news.relevance}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>


    </div>
  );
};
