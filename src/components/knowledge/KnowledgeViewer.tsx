import { useState } from 'react';
import { useKnowledge, KnowledgeItem, Era } from '@/hooks/useKnowledge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Trophy, TrendingUp, Target, Calendar, Tag, BookOpen, Search, Filter } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const KnowledgeViewer = () => {
  const { eras, knowledgeItems, loading, error, getRandomQuestion } = useKnowledge();
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [randomQuestion, setRandomQuestion] = useState<KnowledgeItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const isMobile = useIsMobile();
  
  const ITEMS_PER_PAGE = 12;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-epic mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando base de conhecimento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive">Erro: {error}</p>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'history': return <Trophy className="w-4 h-4" />;
      case 'finance': return <TrendingUp className="w-4 h-4" />;
      case 'technology': return <Target className="w-4 h-4" />;
      case 'future': return <Brain className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'history': return 'bg-epic/20 text-epic';
      case 'finance': return 'bg-victory/20 text-victory';
      case 'technology': return 'bg-battle/20 text-battle';
      case 'future': return 'bg-primary-glow/20 text-primary-glow';
      default: return 'bg-muted';
    }
  };

  const filteredItems = knowledgeItems.filter(item => {
    // Filtro por era
    if (selectedEra !== 'all' && item.era_id !== selectedEra) return false;
    
    // Filtro por categoria
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    
    // Filtro por busca de texto
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesTitle = item.title?.toLowerCase().includes(searchLower);
      const matchesQuestion = item.question?.toLowerCase().includes(searchLower);
      const matchesContent = item.content?.toLowerCase().includes(searchLower);
      const matchesAnswer = item.correct_answer?.toLowerCase().includes(searchLower);
      const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchesTitle && !matchesQuestion && !matchesContent && !matchesAnswer && !matchesTags) {
        return false;
      }
    }
    
    return true;
    });

  // 📄 Cálculos da paginação
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset da página quando filtros mudam
  const resetPaginationAndFilter = (resetPage = true) => {
    if (resetPage) {
      setCurrentPage(1);
    }
  };

const handleRandomQuestion = () => {
    const eraSlug = selectedEra === 'all' ? undefined : eras.find(e => e.id === selectedEra)?.slug;
    const category = selectedCategory === 'all' ? undefined : selectedCategory;
    const question = getRandomQuestion(eraSlug, category as any);
    setRandomQuestion(question);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`text-center space-y-4 ${isMobile ? 'px-4' : ''}`}>
        <h1 className={`font-bold font-montserrat ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
          Base de Conhecimento
        </h1>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
          {filteredItems.length} {searchTerm ? 'resultados encontrados' : `itens de conhecimento em ${eras.length} eras históricas`}
          {totalPages > 1 && (
            <span className="block mt-1">
              📄 Página {currentPage} de {totalPages} • Mostrando {currentItems.length} de {filteredItems.length} itens
            </span>
          )}
        </p>
        {searchTerm && (
          <p className={`text-epic font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
            🔍 Buscando por: "{searchTerm}"
          </p>
        )}
      </div>

      {/* Search and Filters */}
      <div className={`space-y-4 ${isMobile ? 'px-4' : ''}`}>
        {/* Search Bar */}
        <div className="flex justify-center">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="🔍 Buscar por tema, pergunta ou resposta..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                resetPaginationAndFilter();
              }}
              className={`pl-10 pr-4 ${isMobile ? 'text-sm' : ''}`}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                ✕
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-wrap gap-4'} justify-center`}>
          <Select value={selectedEra} onValueChange={(value) => {
            setSelectedEra(value);
            resetPaginationAndFilter();
          }}>
            <SelectTrigger className={isMobile ? 'w-full' : 'w-48'}>
              <SelectValue placeholder="Selecione uma era" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as eras</SelectItem>
              {eras.map(era => (
                <SelectItem key={era.id} value={era.id}>
                  {era.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={(value) => {
            setSelectedCategory(value);
            resetPaginationAndFilter();
          }}>
            <SelectTrigger className={isMobile ? 'w-full' : 'w-48'}>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              <SelectItem value="history">História</SelectItem>
              <SelectItem value="finance">Finanças</SelectItem>
              <SelectItem value="technology">Tecnologia</SelectItem>
              <SelectItem value="future">Futuro</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={handleRandomQuestion} 
            variant="outline" 
            className={`gap-2 ${isMobile ? 'w-full' : ''}`}
          >
            <Brain className="w-4 h-4" />
            {randomQuestion ? 
              (isMobile ? '🎲 Nova' : '🎲 Nova Pergunta') : 
              (isMobile ? '🎯 Aleatória' : '🎯 Pergunta Aleatória')
            }
          </Button>
        </div>
      </div>

      {/* Random Question Display */}
      {randomQuestion && (
        <Card className={`border-epic/30 bg-epic/5 ${isMobile ? 'mx-4' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-epic" />
                <span className={isMobile ? 'text-base' : ''}>🎯 Pergunta Aleatória</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRandomQuestion(null)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-epic"
              >
                ✕
              </Button>
            </CardTitle>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
              💡 Clique em "🎲 Nova Pergunta" para gerar outra questão aleatória
            </p>
          </CardHeader>
          <CardContent className={`space-y-4 ${isMobile ? 'p-4' : ''}`}>
            <p className={`font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>{randomQuestion.question}</p>
            <div className="space-y-2">
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>✅ Resposta correta:</p>
              <Badge variant="default" className={`bg-victory/20 text-victory ${isMobile ? 'text-sm' : ''}`}>
                {randomQuestion.correct_answer}
              </Badge>
            </div>
            {randomQuestion.wrong_options.length > 0 && (
              <div className="space-y-2">
                <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>❌ Alternativas incorretas:</p>
                <div className="flex flex-wrap gap-2">
                  {randomQuestion.wrong_options.map((option, index) => (
                    <Badge key={index} variant="outline" className={isMobile ? 'text-xs' : ''}>
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {randomQuestion.content && (
              <div className={`bg-background/50 rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{randomQuestion.content}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Knowledge Items Grid - Paginado */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1 px-4' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {currentItems.map(item => (
          <Card key={item.id} className={`arena-card hover-scale ${isMobile ? 'transform scale-75' : 'transform scale-70'}`}>
            <CardHeader className={isMobile ? 'pb-2' : 'pb-3'}>
              <div className={`flex items-start ${isMobile ? 'flex-col gap-2' : 'justify-between'}`}>
                <CardTitle className={`font-montserrat ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {item.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(item.category)}>
                    {getCategoryIcon(item.category)}
                    <span className={`ml-1 capitalize ${isMobile ? 'text-xs' : ''}`}>
                      {isMobile ? item.category.substring(0, 4) : item.category}
                    </span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className={`space-y-3 ${isMobile ? 'p-3' : ''}`}>
              {item.item_type === 'qa' && item.question && (
                <div className="space-y-2">
                  <p className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{item.question}</p>
                  <Badge variant="default" className={`bg-victory/20 text-victory ${isMobile ? 'text-xs' : ''}`}>
                    {item.correct_answer}
                  </Badge>
                </div>
              )}
              
              {item.content && (
                <p className={`text-muted-foreground line-clamp-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {item.content}
                </p>
              )}
              
              <div className={`flex flex-wrap gap-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                {item.year_start && (
                  <Badge variant="outline" className={`gap-1 ${isMobile ? 'text-xs px-1 py-0' : ''}`}>
                    <Calendar className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`} />
                    {item.year_start > 0 ? `${item.year_start} d.C.` : `${Math.abs(item.year_start)} a.C.`}
                  </Badge>
                )}
                
                {item.tags.slice(0, isMobile ? 1 : 2).map(tag => (
                  <Badge key={tag} variant="outline" className={`gap-1 ${isMobile ? 'text-xs px-1 py-0' : ''}`}>
                    <Tag className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`} />
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-center gap-2 mt-8 ${isMobile ? 'px-4' : ''}`}>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={isMobile ? 'text-xs px-2' : ''}
          >
            ← Anterior
          </Button>
          
          <div className={`flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`${isMobile ? 'h-8 w-8 text-xs' : 'h-10 w-10'} ${
                    currentPage === pageNum ? 'bg-epic text-white' : ''
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={isMobile ? 'text-xs px-2' : ''}
          >
            Avançar →
          </Button>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            Nenhum item encontrado com os filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
};