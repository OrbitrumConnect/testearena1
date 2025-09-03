import { useState } from 'react';
import { useKnowledge, KnowledgeItem, Era } from '@/hooks/useKnowledge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Trophy, TrendingUp, Target, Calendar, Tag, BookOpen, Search, Filter, GitBranch, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const KnowledgeViewer = () => {
  const { eras, knowledgeItems, loading, error, getRandomQuestion } = useKnowledge();
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [randomQuestion, setRandomQuestion] = useState<KnowledgeItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showConnections, setShowConnections] = useState<boolean>(false);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const isMobile = useIsMobile();
  
  const ITEMS_PER_PAGE = 12;

  // 🌍 Dados de influências históricas
  const historicalConnections = [
    {
      id: 'writing-systems',
      title: '📝 Sistemas de Escrita',
      origin: 'Mesopotâmia → Egito → Medieval → Digital',
      description: 'A escrita cuneiforme mesopotâmica (3200 a.C.) evoluiu para hieróglifos egípcios, depois alfabetos medievais, até chegar aos teclados e interfaces digitais de hoje.',
      modernExample: 'WhatsApp, emails, códigos de programação',
      category: 'technology'
    },
    {
      id: 'banking-finance',
      title: '💰 Sistema Bancário',
      origin: 'Mesopotâmia → Medieval → Digital',
      description: 'Os primeiros bancos surgiram na Mesopotâmia com empréstimos de grãos. Na era medieval, os templários criaram transferências internacionais. Hoje temos bancos digitais.',
      modernExample: 'PIX, Bitcoin, fintechs, cartões digitais',
      category: 'finance'
    },
    {
      id: 'construction-architecture',
      title: '🏗️ Arquitetura e Construção',
      origin: 'Egito → Medieval → Digital',
      description: 'Técnicas de construção das pirâmides egípcias influenciaram castelos medievais e hoje inspiram arranha-céus e modelagem 3D.',
      modernExample: 'AutoCAD, BIM, impressão 3D de casas',
      category: 'technology'
    },
    {
      id: 'trade-commerce',
      title: '🏪 Comércio Global',
      origin: 'Mesopotâmia → Medieval → Digital',
      description: 'As rotas comerciais mesopotâmicas evoluíram para feiras medievais e hoje se tornaram e-commerce global 24/7.',
      modernExample: 'Amazon, AliExpress, marketplace digital',
      category: 'finance'
    },
    {
      id: 'medicine-health',
      title: '⚕️ Medicina e Saúde',
      origin: 'Egito → Medieval → Digital',
      description: 'A medicina egípcia com múmias e ervas medicinais evoluiu através dos mosteiros medievais até a telemedicina atual.',
      modernExample: 'Consultas online, apps de saúde, IA médica',
      category: 'technology'
    },
    {
      id: 'education-knowledge',
      title: '📚 Educação e Conhecimento',
      origin: 'Egito → Medieval → Digital',
      description: 'Das casas de vida egípcias às universidades medievais, chegamos às plataformas de ensino online e IA educacional.',
      modernExample: 'Coursera, YouTube, ChatGPT educativo',
      category: 'history'
    },
    {
      id: 'governance-democracy',
      title: '🏛️ Governança e Democracia',
      origin: 'Mesopotâmia → Medieval → Digital',
      description: 'O código de Hammurabi influenciou leis medievais que evoluíram para democracias digitais e voto eletrônico.',
      modernExample: 'Urnas eletrônicas, petições online, e-gov',
      category: 'history'
    },
    {
      id: 'agriculture-food',
      title: '🌾 Agricultura e Alimentação',
      origin: 'Egito → Medieval → Digital',
      description: 'Técnicas de irrigação do Nilo e rotação de culturas medievais hoje usam drones, sensores IoT e agricultura de precisão.',
      modernExample: 'Agricultura 4.0, apps de delivery, vertical farms',
      category: 'technology'
    }
  ];

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

  // 🤖 Chatbot Mestre do Conhecimento
  const handleChatbotResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    let response = '';

    // Respostas baseadas no conhecimento da plataforma
    if (message.includes('pvp') || message.includes('arena') || message.includes('batalha')) {
      response = `⚔️ **Dicas para PvP/Arena:**\n\n🎯 **Estratégias:**\n• Estude primeiro no Treino Gratuito\n• Foque nas eras que você domina\n• Custo: 7 créditos, ganho: 9,5 créditos na vitória\n• Taxa de retenção da plataforma: 15%\n\n💡 **Pro Tip:** Domine uma era específica para ter vantagem!`;
    } else if (message.includes('egito') || message.includes('faraó') || message.includes('pirâmide')) {
      response = `🏺 **Egito Antigo - Dicas de Estudo:**\n\n📚 **Temas principais:**\n• Faraós: Rá (deus sol), Hatshepsut (rainha faraó)\n• Geografia: Rio Nilo (inundações anuais)\n• Construções: Pirâmides de Giza (2630 a.C.)\n• Religião: Gatos sagrados, mumificação\n\n🎯 **Curiosidade:** O Egito influenciou a arquitetura moderna!`;
    } else if (message.includes('medieval') || message.includes('templários') || message.includes('idade média')) {
      response = `⚔️ **Era Medieval - Guia de Estudos:**\n\n🏰 **Focos essenciais:**\n• Documentos: Magna Carta (liberdades)\n• Organizações: Ordem dos Templários\n• Sistema: Feudalismo e vassalagem\n• Economia: Feiras medievais, guildas\n\n💰 **Conexão:** Templários criaram o primeiro sistema bancário internacional!`;
    } else if (message.includes('mesopotamia') || message.includes('hamurabi') || message.includes('suméria')) {
      response = `🏛️ **Mesopotâmia - Centro do Conhecimento:**\n\n📜 **Essenciais:**\n• Leis: Código de Hamurabi, Ur-Nammu\n• Escrita: Cuneiforme (primeira escrita)\n• Economia: Primeiros bancos e empréstimos\n• Geografia: Entre rios Tigre e Eufrates\n\n🌟 **Impact:** Criou as bases da civilização ocidental!`;
    } else if (message.includes('digital') || message.includes('bitcoin') || message.includes('tecnologia')) {
      response = `💻 **Era Digital - Futuro em Ação:**\n\n🚀 **Temas quentes:**\n• Cripto: Bitcoin (primeira moeda digital)\n• E-commerce: Amazon (Jeff Bezos, 1994)\n• Social: TikTok (vídeos curtos, algoritmos)\n• Tech: VR, IA, blockchain\n\n🔗 **Conexão:** Tudo tem raiz nas eras antigas!`;
    } else if (message.includes('crédito') || message.includes('ponto') || message.includes('ganhar')) {
      response = `💰 **Sistema de Créditos:**\n\n🎯 **Como ganhar mais:**\n• Treino diário: 3 sessões grátis\n• PvP Arena: 7 créditos entrada, 9,5 ganho\n• Ranking Top 10%: Bônus especiais\n• Estudar base de conhecimento: +XP\n\n💡 **Saque:** Disponível dia 1° do mês, mín. 200 créditos!`;
    } else if (message.includes('estudo') || message.includes('aprender') || message.includes('estudar')) {
      response = `📚 **Guia de Estudos Eficazes:**\n\n🎓 **Método recomendado:**\n1. Explore Base de Conhecimento (138 itens)\n2. Use filtros por era e categoria\n3. Teste com Pergunta Aleatória\n4. Pratique no Treino Gratuito\n5. Desafie-se na Arena\n\n🌍 **Extra:** Veja Conexões Históricas para entender influências!`;
    } else if (message.includes('oi') || message.includes('olá') || message.includes('hello')) {
      response = `🧙‍♂️ **Olá, jovem explorador do tempo!**\n\nSou o **Mestre do Conhecimento**, seu guia através das eras! ✨\n\n🎯 **Posso te ajudar com:**\n• Dicas de estudo para cada era\n• Estratégias para PvP/Arena\n• Curiosidades históricas\n• Sistema de créditos\n• Conexões entre eras\n\n💫 **Pergunta algo sobre Egito, Mesopotâmia, Medieval ou Era Digital!**`;
    } else {
      response = `🤔 **Interessante pergunta!**\n\n🧙‍♂️ Como Mestre do Conhecimento, sugiro explorar:\n\n📚 **Temas disponíveis:**\n• História das 4 eras (Egito, Mesopotâmia, Medieval, Digital)\n• Estratégias de PvP e Arena\n• Sistema de créditos e ranking\n• Conexões históricas fascinantes\n\n💡 **Tente perguntar:** "Como melhorar no PvP?" ou "Conte sobre o Egito"`;
    }

    // Adicionar mensagens ao chat
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: response }
    ]);
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

          <Button 
            onClick={() => setShowConnections(!showConnections)} 
            variant={showConnections ? "default" : "outline"}
            className={`gap-2 ${isMobile ? 'w-full' : ''} ${showConnections ? 'bg-epic text-white' : ''}`}
          >
            <GitBranch className="w-4 h-4" />
            {isMobile ? 
              (showConnections ? '📚 Itens' : '🌍 Conexões') : 
              (showConnections ? '📚 Voltar aos Itens' : '🌍 Conexões Históricas')
            }
          </Button>

          <Button 
            onClick={() => {
              setShowChatbot(!showChatbot);
              if (!showChatbot && chatMessages.length === 0) {
                setChatMessages([
                  { role: 'assistant', content: '🧙‍♂️ **Bem-vindo, explorador!**\n\nSou o **Mestre do Conhecimento** da Arena! ✨\n\nPosso te ajudar com dicas de estudo, estratégias de PvP, curiosidades históricas e muito mais!\n\n💫 **Como posso te auxiliar hoje?**' }
                ]);
              }
            }} 
            variant={showChatbot ? "default" : "outline"}
            className={`gap-2 ${isMobile ? 'w-full' : ''} ${showChatbot ? 'bg-victory text-white' : ''}`}
          >
            <Brain className="w-4 h-4" />
            {isMobile ? 
              (showChatbot ? '❌ Chat' : '🤖 Mestre') : 
              (showChatbot ? '❌ Fechar Chat' : '🤖 Mestre do Conhecimento')
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

      {/* Chatbot Mestre do Conhecimento */}
      {showChatbot && (
        <Card className={`border-victory/30 bg-victory/5 ${isMobile ? 'mx-4' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-victory" />
                <span className={isMobile ? 'text-base' : ''}>🤖 Mestre do Conhecimento</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChatbot(false)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-victory"
              >
                ✕
              </Button>
            </CardTitle>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
              💫 Seu guia inteligente através das eras históricas
            </p>
          </CardHeader>
          <CardContent className={`space-y-4 ${isMobile ? 'p-4' : ''}`}>
            {/* Chat Messages */}
            <div className={`max-h-64 overflow-y-auto space-y-3 ${isMobile ? 'text-sm' : ''}`}>
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-epic/20 border border-epic/30 text-epic' 
                      : 'bg-victory/10 border border-victory/30 text-victory'
                  }`}>
                    <div className={`whitespace-pre-line ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="🧙‍♂️ Pergunte sobre estudos, PvP, eras históricas..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    handleChatbotResponse(chatInput.trim());
                    setChatInput('');
                  }
                }}
                className={`${isMobile ? 'text-sm' : ''}`}
              />
              <Button
                onClick={() => {
                  if (chatInput.trim()) {
                    handleChatbotResponse(chatInput.trim());
                    setChatInput('');
                  }
                }}
                variant="outline"
                disabled={!chatInput.trim()}
                className="px-3"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {[
                '🏺 Dicas Egito',
                '⚔️ Estratégia PvP',
                '💰 Como ganhar créditos',
                '🌍 Conexões históricas'
              ].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => handleChatbotResponse(action)}
                  className={`${isMobile ? 'text-xs px-2 py-1' : 'text-sm'} hover:bg-victory/10`}
                >
                  {action}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conexões Históricas */}
      {showConnections ? (
        <div className={`space-y-6 ${isMobile ? 'px-4' : ''}`}>
          <div className="text-center">
            <h2 className={`font-bold font-montserrat ${isMobile ? 'text-xl' : 'text-2xl'} text-epic mb-2`}>
              🌍 Conexões Históricas
            </h2>
            <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
              Descubra como as civilizações antigas influenciaram o mundo digital de hoje
            </p>
          </div>

          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-2'}`}>
            {historicalConnections
              .filter(connection => selectedCategory === 'all' || connection.category === selectedCategory)
              .map(connection => (
                              <Card key={connection.id} className={`arena-card hover-scale ${isMobile ? 'transform scale-90' : 'transform scale-75'} border-epic/30`}>
                <CardHeader className={isMobile ? 'pb-2' : 'pb-3'}>
                  <CardTitle className={`font-montserrat ${isMobile ? 'text-sm' : 'text-base'} flex items-center gap-2`}>
                    {connection.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-epic font-medium">
                    <ArrowRight className="w-4 h-4" />
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-mono`}>
                      {connection.origin}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className={`space-y-3 ${isMobile ? 'p-3' : ''}`}>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {connection.description}
                  </p>
                  
                  <div className={`bg-victory/10 border border-victory/30 rounded-lg ${isMobile ? 'p-2' : 'p-3'}`}>
                    <p className={`text-victory font-medium ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                      💡 Exemplos Modernos:
                    </p>
                    <p className={`text-victory ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {connection.modernExample}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(connection.category)}>
                      {getCategoryIcon(connection.category)}
                      <span className={`ml-1 capitalize ${isMobile ? 'text-xs' : ''}`}>
                        {isMobile ? connection.category.substring(0, 4) : connection.category}
                      </span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Knowledge Items Grid - Paginado */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1 px-4' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {currentItems.map(item => (
                          <Card key={item.id} className={`arena-card hover-scale ${isMobile ? 'transform scale-75' : 'transform scale-50'}`}>
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
        </>
      )}
    </div>
  );
};