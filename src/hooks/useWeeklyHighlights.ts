import { useState, useEffect } from 'react';

interface RankingHighlight {
  id: string;
  type: 'ranking';
  title: string;
  subtitle: string;
  description: string;
  value: string;
  trend: string;
  color: string;
}

interface WorldNews {
  id: string;
  category: string;
  title: string;
  summary: string;
  impact: 'Crítico' | 'Alto' | 'Médio';
  relevance: string;
  addedToQuiz: boolean;
  era: string;
  publishedAt: string;
  source: string;
}

interface TrendingTopic {
  id: string;
  type: 'trending';
  title: string;
  subtitle: string;
  description: string;
  value: string;
  trend: string;
  color: string;
}

export const useWeeklyHighlights = () => {
  const [rankingHighlights, setRankingHighlights] = useState<RankingHighlight[]>([]);
  const [worldNews, setWorldNews] = useState<WorldNews[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    const loadHighlights = async () => {
      setLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados - em produção viriam de APIs reais
      const mockRankingData: RankingHighlight[] = [
        {
          id: 'weekly-champion',
          type: 'ranking',
          title: '🏆 Campeão Semanal',
          subtitle: 'Guerreiro Épico',
          description: '96% precisão • 52 vitórias',
          value: '3.247 XP',
          trend: '+18%',
          color: 'epic'
        }
      ];

      const mockWorldNews: WorldNews[] = [
        {
          id: 'ai-revolution',
          category: 'Tecnologia',
          title: 'Revolução da IA: GPT-4 Turbo e Novos Modelos',
          summary: 'OpenAI lança versão mais eficiente do GPT-4, enquanto Google apresenta Gemini. A corrida da IA acelera transformações no trabalho e educação.',
          impact: 'Crítico',
          relevance: '94%',
          addedToQuiz: true,
          era: 'Digital',
          publishedAt: '2024-01-29',
          source: 'TechCrunch'
        },
        {
          id: 'climate-summit',
          category: 'Meio Ambiente',
          title: 'COP28: Acordo Histórico sobre Combustíveis Fósseis',
          summary: 'Países aprovam transição gradual para energias renováveis. Primeira vez que combustíveis fósseis são mencionados explicitamente em acordo global.',
          impact: 'Alto',
          relevance: '91%',
          addedToQuiz: true,
          era: 'Digital',
          publishedAt: '2024-01-28',
          source: 'Reuters'
        },
        {
          id: 'quantum-computing',
          category: 'Ciência',
          title: 'Computação Quântica: IBM Atinge Marco de 1000 Qubits',
          summary: 'Novo processador quântico promete resolver problemas impossíveis para computadores clássicos, revolucionando criptografia e simulações.',
          impact: 'Alto',
          relevance: '87%',
          addedToQuiz: false,
          era: 'Digital',
          publishedAt: '2024-01-27',
          source: 'Nature'
        },
        {
          id: 'space-exploration',
          category: 'Espaço',
          title: 'Artemis II: Primeira Missão Tripulada à Lua em 50 Anos',
          summary: 'NASA anuncia cronograma final para retorno humano à Lua. Missão marca nova era da exploração espacial com participação internacional.',
          impact: 'Médio',
          relevance: '82%',
          addedToQuiz: false,
          era: 'Digital',
          publishedAt: '2024-01-26',
          source: 'NASA'
        }
      ];

      const mockTrendingTopics: TrendingTopic[] = [
        {
          id: 'ai-ethics',
          type: 'trending',
          title: '📈 Tópico em Alta',
          subtitle: 'Ética em IA',
          description: 'Regulamentação global de IA generativa',
          value: '1.247 perguntas',
          trend: 'Emergente',
          color: 'victory'
        }
      ];

      setRankingHighlights(mockRankingData);
      setWorldNews(mockWorldNews);
      setTrendingTopics(mockTrendingTopics);
      setLoading(false);
    };

    loadHighlights();
  }, []);

  const getTopNews = (limit: number = 3) => {
    return worldNews
      .sort((a, b) => {
        // Priorizar por impacto e relevância
        const impactWeight = { 'Crítico': 3, 'Alto': 2, 'Médio': 1 };
        const aScore = impactWeight[a.impact] * parseFloat(a.relevance);
        const bScore = impactWeight[b.impact] * parseFloat(b.relevance);
        return bScore - aScore;
      })
      .slice(0, limit);
  };

  const getQuizReadyNews = () => {
    return worldNews.filter(news => news.addedToQuiz);
  };

  const getPendingQuizNews = () => {
    return worldNews.filter(news => !news.addedToQuiz);
  };

  const addToQuiz = (newsId: string) => {
    setWorldNews(prev => 
      prev.map(news => 
        news.id === newsId 
          ? { ...news, addedToQuiz: true }
          : news
      )
    );
  };

  return {
    rankingHighlights,
    worldNews,
    trendingTopics,
    loading,
    getTopNews,
    getQuizReadyNews,
    getPendingQuizNews,
    addToQuiz
  };
};
