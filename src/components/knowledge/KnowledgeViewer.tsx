import { useState } from 'react';
import { useKnowledge, KnowledgeItem, Era } from '@/hooks/useKnowledge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Trophy, TrendingUp, Target, Calendar, Tag, BookOpen, Search, Filter, GitBranch, ArrowRight } from 'lucide-react';
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
   
  // NOVOS ESTADOS DO SISTEMA COLABORATIVO
  const [showCommunityChat, setShowCommunityChat] = useState<boolean>(false);
  const [showContributions, setShowContributions] = useState<boolean>(false);
  const [showAutoQuizzes, setShowAutoQuizzes] = useState<boolean>(false);
  const [communityChatInput, setCommunityChatInput] = useState<string>('');
  const [selectedChatEra, setSelectedChatEra] = useState<string>('geral');
  const [contributionContent, setContributionContent] = useState<string>('');
  const [contributionCategory, setContributionCategory] = useState<string>('resumo');
  const [contributionEra, setContributionEra] = useState<string>('digital');
  
  // Função para fechar todas as outras opções quando uma for aberta
  const closeAllOthers = (optionToKeep: string) => {
    if (optionToKeep !== 'connections') setShowConnections(false);
    if (optionToKeep !== 'chatbot') setShowChatbot(false);
    if (optionToKeep !== 'communityChat') setShowCommunityChat(false);
    if (optionToKeep !== 'contributions') setShowContributions(false);
    if (optionToKeep !== 'autoQuizzes') setShowAutoQuizzes(false);
  };

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
             {/* Header Principal */}
       <div className="text-center space-y-4 px-4 md:px-0">
         <div className="flex items-center justify-center gap-3 mb-2 mt-5">
           <div className="relative">
             {/* Efeito de neon envolvente */}
             <div className="absolute inset-0 bg-gradient-to-t from-transparent via-epic/30 to-epic/60 rounded-full blur-md"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-transparent via-victory/20 to-victory/40 rounded-full blur-sm"></div>
             
             {/* Imagem principal */}
             <img 
               src="/Mestredoconhecimento.png" 
               alt="Mestre do Conhecimento" 
               className="relative w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-[0_0_15px_rgba(139,69,19,0.8)]"
             />
             
             {/* Chamas de neon que sobem */}
             <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gradient-to-t from-epic/80 via-epic/40 to-transparent rounded-t-full blur-sm"></div>
             <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gradient-to-t from-victory/60 via-victory/30 to-transparent rounded-t-full blur-sm"></div>
             
             {/* 50 Micropartículas subindo */}
             {Array.from({ length: 50 }).map((_, i) => (
               <div
                 key={i}
                 className="absolute w-0.5 h-0.5 bg-gradient-to-t from-transparent via-epic/60 to-epic/80 rounded-full animate-pulse"
                 style={{
                   left: `${Math.random() * 100}%`,
                   top: `${Math.random() * 100}%`,
                   animationDelay: `${Math.random() * 2}s`,
                   animationDuration: `${1 + Math.random() * 1}s`,
                   transform: `translateY(-${30 + Math.random() * 40}px) translateX(${Math.random() * 20 - 10}px)`,
                   opacity: 0.3 + Math.random() * 0.7
                 }}
               />
             ))}
           </div>
           
           <h1 className="font-bold font-montserrat text-2xl md:text-3xl mt-4">
             📚 Base de Conhecimento
           </h1>
         </div>
         <p className="text-muted-foreground text-sm md:text-base">
           {filteredItems.length} itens • {eras.length} eras
           {totalPages > 1 && (
             <span className="block mt-1 text-sm md:text-base">
               📄 {currentPage}/{totalPages} • {currentItems.length}/{filteredItems.length}
             </span>
           )}
         </p>
         {searchTerm && (
           <p className="text-epic font-medium text-sm md:text-base">
             🔍 "{searchTerm}"
           </p>
         )}
       </div>

             {/* CABEÇALHO PRINCIPAL - ABAS ORGANIZADAS */}
       <div className="space-y-4 px-4 md:px-0">
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
               className="pl-10 pr-4 text-sm md:text-base"
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

         {/* ABAS PRINCIPAIS - MOBILE FIRST */}
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3 justify-center">
           {/* Filtros */}
           <Select value={selectedCategory} onValueChange={(value) => {
             setSelectedCategory(value);
             resetPaginationAndFilter();
           }}>
             <SelectTrigger className="w-full text-xs md:text-sm">
               <SelectValue placeholder="Todas categorias" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">Todas categorias</SelectItem>
               <SelectItem value="history">História</SelectItem>
               <SelectItem value="finance">Finanças</SelectItem>
               <SelectItem value="technology">Tecnologia</SelectItem>
               <SelectItem value="future">Futuro</SelectItem>
             </SelectContent>
           </Select>

           {/* Botões de Ação */}
           <Button 
             onClick={handleRandomQuestion} 
             variant="outline" 
             className="gap-2 text-xs md:text-sm bg-epic/50 border-epic/60 text-epic hover:bg-epic/60"
           >
             🎲 Nova Pergunta
           </Button>

           <Button 
             onClick={() => {
               closeAllOthers('connections');
               setShowConnections(!showConnections);
             }} 
             variant={showConnections ? "default" : "outline"}
             className={`gap-2 text-xs md:text-sm ${showConnections ? 'bg-epic text-white' : 'bg-victory/50 border-victory/60 text-victory hover:bg-victory/60'}`}
           >
             {showConnections ? '📚 Voltar aos Itens' : '🌍 Conexões Históricas'}
           </Button>

           <Button 
             onClick={() => {
               closeAllOthers('chatbot');
               setShowChatbot(!showChatbot);
               if (!showChatbot && chatMessages.length === 0) {
                 setChatMessages([
                   { role: 'assistant', content: '🧙‍♂️ **Bem-vindo, explorador!**\n\nSou o **Mestre do Conhecimento** da Arena! ✨\n\nPosso te ajudar com dicas de estudo, estratégias de PvP, curiosidades históricas e muito mais!\n\n💫 **Como posso te auxiliar hoje?**' }
                 ]);
               }
             }} 
             variant={showChatbot ? "default" : "outline"}
             className={`gap-2 text-xs md:text-sm ${showChatbot ? 'bg-victory text-white' : 'bg-victory/50 border-victory/60 text-victory hover:bg-victory/60'}`}
           >
             {showChatbot ? '❌ Fechar Chat' : '🤖 Mestre do Conhecimento'}
           </Button>

           <Button 
             onClick={() => {
               closeAllOthers('communityChat');
               setShowCommunityChat(!showCommunityChat);
             }} 
             variant={showCommunityChat ? "default" : "outline"}
             className={`gap-2 text-xs md:text-sm ${showCommunityChat ? 'bg-victory text-white' : 'bg-victory/50 border-victory/60 text-victory hover:bg-victory/60'}`}
           >
             💬 Chat da Comunidade
           </Button>

           <Button 
             onClick={() => {
               closeAllOthers('contributions');
               setShowContributions(!showContributions);
             }} 
             variant={showContributions ? "default" : "outline"}
             className={`gap-2 text-xs md:text-sm ${showContributions ? 'bg-epic text-white' : 'bg-epic/50 border-epic/60 text-epic hover:bg-epic/60'}`}
           >
             ✍️ Minhas Contribuições
           </Button>

           <Button 
             onClick={() => {
               closeAllOthers('autoQuizzes');
               setShowAutoQuizzes(!showAutoQuizzes);
             }} 
             variant={showAutoQuizzes ? "default" : "outline"}
             className={`gap-2 text-xs md:text-sm ${showAutoQuizzes ? 'bg-primary-glow text-white' : 'bg-primary-glow/50 border-primary-glow/60 text-primary-glow hover:bg-primary-glow/60'}`}
           >
             📊 Provas Automáticas
           </Button>
         </div>
       </div>

             {/* Random Question Display */}
       {randomQuestion && (
         <Card className="border-epic/30 bg-epic/5 mx-4 md:mx-0">
           <CardHeader>
             <CardTitle className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Brain className="w-5 h-5 text-epic" />
                 <span className="text-base md:text-lg">🎯 Pergunta Aleatória</span>
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
             <p className="text-muted-foreground text-xs md:text-sm">
               💡 Clique em "🎲 Nova Pergunta" para gerar outra questão aleatória
             </p>
           </CardHeader>
           <CardContent className="space-y-4 p-4 md:p-6">
             <p className="font-medium text-base md:text-lg">{randomQuestion.question}</p>
             <div className="space-y-2">
               <p className="text-muted-foreground text-xs md:text-sm">✅ Resposta correta:</p>
               <Badge variant="default" className="bg-victory/20 text-victory text-sm md:text-base">
                 {randomQuestion.correct_answer}
               </Badge>
             </div>
             {randomQuestion.wrong_options.length > 0 && (
               <div className="space-y-2">
                 <p className="text-muted-foreground text-xs md:text-sm">❌ Alternativas incorretas:</p>
                 <div className="flex flex-wrap gap-2">
                   {randomQuestion.wrong_options.map((option, index) => (
                     <Badge key={index} variant="outline" className="text-xs md:text-sm">
                       {option}
                     </Badge>
                   ))}
                 </div>
               </div>
             )}
             {randomQuestion.content && (
               <div className="bg-background/50 rounded-lg p-3 md:p-4">
                 <p className="text-xs md:text-sm">{randomQuestion.content}</p>
               </div>
             )}
           </CardContent>
         </Card>
       )}

      {/* Chatbot Mestre do Conhecimento */}
      {showChatbot && (
        <Card className="border-victory/30 bg-victory/5 mx-4 md:mx-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-victory" />
                <span className="text-base md:text-lg">🤖 Mestre do Conhecimento</span>
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
            <p className="text-muted-foreground text-xs md:text-sm">
              💫 Seu guia inteligente através das eras históricas
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            {/* Chat Messages */}
            <div className="max-h-64 overflow-y-auto space-y-3 text-sm md:text-base">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-epic/20 border border-epic/30 text-epic' 
                      : 'bg-victory/10 border border-victory/30 text-victory'
                  }`}>
                    <div className="whitespace-pre-line text-xs md:text-sm">
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
                className="text-sm md:text-base"
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
                  className="text-xs md:text-sm px-2 py-1 hover:bg-victory/10"
                >
                  {action}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

             {/* 💬 Chat da Comunidade */}
       {showCommunityChat && (
         <Card className="arena-card hover-scale border-victory/30 mx-4 md:mx-0">
           <CardHeader className="p-4 md:p-6">
             <CardTitle className="flex items-center justify-between text-lg md:text-xl">
               <div className="flex items-center gap-2">
                 💬 Chat da Comunidade
                 <Badge variant="outline" className="bg-victory/20 text-victory text-xs">
                   {selectedChatEra === 'geral' ? 'Chat Geral' : `Era ${selectedChatEra}`}
                 </Badge>
               </div>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => setShowCommunityChat(false)}
                 className="h-6 w-6 p-0 text-muted-foreground hover:text-victory"
               >
                 ✕
               </Button>
             </CardTitle>
             <p className="text-muted-foreground text-xs md:text-sm">
               Converse com outros usuários sobre conhecimento e estudos
             </p>
           </CardHeader>
           <CardContent className="space-y-4 p-4 md:p-6">
             {/* Seleção de Chat */}
             <div className="flex flex-wrap gap-2">
               {['geral', 'digital', 'medieval', 'egito-antigo', 'mesopotamia'].map((era) => (
                 <Button
                   key={era}
                   variant={selectedChatEra === era ? "default" : "outline"}
                   size="sm"
                   onClick={() => setSelectedChatEra(era)}
                   className={`text-xs px-2 py-1 md:text-sm md:px-3 md:py-2 ${
                     selectedChatEra === era ? 'bg-victory text-white' : 'hover:bg-victory/10'
                   }`}
                 >
                   {era === 'geral' ? '🌍 Geral' : 
                    era === 'digital' ? '💻 Digital' :
                    era === 'medieval' ? '⚔️ Medieval' :
                    era === 'egito-antigo' ? '🏺 Egito' : '🏛️ Mesopotâmia'}
                 </Button>
               ))}
             </div>

             {/* Chat Messages (placeholder) */}
             <div className="max-h-64 overflow-y-auto space-y-3 text-sm bg-muted/20 rounded-lg p-4">
               <div className="text-center text-muted-foreground text-sm">
                 💬 Chat da comunidade em desenvolvimento...
                 <br />
                 <span className="text-xs">Em breve: conversas em tempo real entre usuários!</span>
               </div>
             </div>
             
             {/* Chat Input */}
             <div className="flex gap-2">
               <Input
                 placeholder="💬 Digite sua mensagem..."
                 value={communityChatInput}
                 onChange={(e) => setCommunityChatInput(e.target.value)}
                 className="text-sm md:text-base"
               />
               <Button
                 variant="outline"
                 disabled={!communityChatInput.trim()}
                 className="px-3 bg-victory/10 border-victory/30 text-victory hover:bg-victory/20"
               >
                 <ArrowRight className="w-4 h-4" />
               </Button>
             </div>
             
             {/* Regras do Chat */}
             <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
               <strong>📋 Regras do Chat:</strong>
               <br />• Respeite outros usuários
               <br />• Mantenha foco no conhecimento
               <br />• 1ª advertencia → Aviso
               <br />• 2ª advertencia → Ban 15 min
               <br />• 3ª advertencia → Ban 1 dia
             </div>
           </CardContent>
         </Card>
       )}

             {/* ✍️ Sistema de Contribuições */}
       {showContributions && (
         <Card className="arena-card hover-scale border-epic/30 mx-4 md:mx-0">
           <CardHeader className="p-4 md:p-6">
             <CardTitle className="flex items-center justify-between text-lg md:text-xl">
               <div className="flex items-center gap-2">
                 ✍️ Sistema de Contribuições
                 <Badge variant="outline" className="bg-epic/20 text-epic text-xs">
                   Limite: 3x por dia
                 </Badge>
               </div>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => setShowContributions(false)}
                 className="h-6 w-6 p-0 text-muted-foreground hover:text-epic"
               >
                 ✕
               </Button>
             </CardTitle>
             <p className="text-muted-foreground text-xs md:text-sm">
               Adicione resumos e contribuições para ganhar créditos e XP
             </p>
           </CardHeader>
           <CardContent className="space-y-4 p-4 md:p-6">
             {/* Formulário de Contribuição - MELHORADO */}
             <div className="space-y-4">
               {/* Seletores em linha */}
               <div className="flex flex-wrap gap-3">
                 <Select value={contributionEra} onValueChange={setContributionEra}>
                   <SelectTrigger className="w-full md:w-40">
                     <SelectValue placeholder="🌍 Selecionar Era" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="digital">💻 Era Digital</SelectItem>
                     <SelectItem value="medieval">⚔️ Era Medieval</SelectItem>
                     <SelectItem value="egito-antigo">🏺 Egito Antigo</SelectItem>
                     <SelectItem value="mesopotamia">🏛️ Mesopotâmia</SelectItem>
                   </SelectContent>
                 </Select>

                 <Select value={contributionCategory} onValueChange={setContributionCategory}>
                   <SelectTrigger className="w-full md:w-40">
                     <SelectValue placeholder="📝 Tipo de Contribuição" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="resumo">📝 Resumo</SelectItem>
                     <SelectItem value="questao">❓ Questão</SelectItem>
                     <SelectItem value="curiosidade">💡 Curiosidade</SelectItem>
                     <SelectItem value="anotacao">📌 Anotação</SelectItem>
                   </SelectContent>
                 </Select>
               </div>

               {/* Área de texto MAIOR para contribuições */}
               <div className="space-y-2">
                 <label className="text-sm font-medium text-epic">
                   ✍️ Sua Contribuição:
                 </label>
                 <textarea
                   placeholder="📝 Digite aqui sua contribuição... (resumo, questão, curiosidade ou anotação)"
                   value={contributionContent}
                   onChange={(e) => setContributionContent(e.target.value)}
                   className="w-full min-h-32 p-3 rounded-lg border border-epic/30 bg-background/50 text-foreground placeholder:text-muted-foreground resize-y focus:border-epic focus:ring-2 focus:ring-epic/20 transition-all text-sm md:text-base"
                 />
                 <div className="text-xs text-muted-foreground text-right">
                   {contributionContent.length}/1000 caracteres
                 </div>
               </div>

               {/* Botão de envio melhorado */}
               <Button
                 variant="outline"
                 disabled={!contributionContent.trim()}
                 className="w-full bg-epic/10 border-epic/30 text-epic hover:bg-epic/20 hover:bg-epic/20 transition-all py-3"
               >
                 📤 Enviar Contribuição
               </Button>
             </div>

             {/* Informações do Sistema */}
             <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
               <strong>💰 Sistema de Recompensas:</strong>
               <br />• 3+ votos positivos = +0,25 créditos + 10 XP
               <br />• Limite: 3 contribuições validadas por dia
               <br />• Total máximo: 0,75 créditos + 30 XP por dia
               <br />• Mestre IA analisa e sugere melhorias
             </div>

             {/* Minhas Contribuições (placeholder) */}
             <div className="bg-muted/20 rounded-lg p-4">
               <h4 className="font-medium text-sm mb-2">📚 Minhas Contribuições</h4>
               <div className="text-center text-muted-foreground text-sm">
                 ✍️ Sistema de contribuições em desenvolvimento...
                 <br />
                 <span className="text-xs">Em breve: suas contribuições e histórico!</span>
               </div>
             </div>
           </CardContent>
         </Card>
       )}

             {/* 📊 Provas Automáticas */}
       {showAutoQuizzes && (
         <Card className="arena-card hover-scale border-primary-glow/30 mx-4 md:mx-0">
           <CardHeader className="p-4 md:p-6">
             <CardTitle className="flex items-center justify-between text-lg md:text-xl">
               <div className="flex items-center gap-2">
                 📊 Provas Automáticas
                 <Badge variant="outline" className="bg-primary-glow/20 text-primary-glow text-xs">
                   IA Personalizada
                 </Badge>
               </div>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => setShowAutoQuizzes(false)}
                 className="h-6 w-6 p-0 text-muted-foreground hover:text-primary-glow"
               >
                 ✕
               </Button>
             </CardTitle>
             <p className="text-muted-foreground text-xs md:text-sm">
               Provas personalizadas criadas pela IA baseadas no seu desempenho
             </p>
           </CardHeader>
           <CardContent className="space-y-4 p-4 md:p-6">
             {/* Seleção de Era para Prova */}
             <div className="flex flex-wrap gap-2">
               {['digital', 'medieval', 'egito-antigo', 'mesopotamia'].map((era) => (
                 <Button
                   key={era}
                   variant="outline"
                   size="sm"
                   className="text-xs px-2 py-1 md:text-sm md:px-3 md:py-2 hover:bg-primary-glow/10"
                 >
                   {era === 'digital' ? '💻 Digital' :
                    era === 'medieval' ? '⚔️ Medieval' :
                    era === 'egito-antigo' ? '🏺 Egito' : '🏛️ Mesopotâmia'}
                 </Button>
               ))}
             </div>

             {/* Prova Atual (placeholder) */}
             <div className="bg-muted/20 rounded-lg p-4">
               <h4 className="font-medium text-sm mb-2">🎯 Prova Atual</h4>
               <div className="text-center text-muted-foreground text-sm">
                 📊 Sistema de provas automáticas em desenvolvimento...
                 <br />
                 <span className="text-xs">Em breve: provas personalizadas pela IA!</span>
               </div>
             </div>

             {/* Análise de Desempenho (placeholder) */}
             <div className="bg-muted/20 rounded-lg p-4">
               <h4 className="font-medium text-sm mb-2">📈 Análise de Desempenho</h4>
               <div className="text-center text-muted-foreground text-sm">
                 🧠 Análise IA em desenvolvimento...
                 <br />
                 <span className="text-xs">Em breve: insights personalizados sobre seu estudo!</span>
               </div>
             </div>

             {/* Informações do Sistema */}
             <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
               <strong>🤖 Funcionalidades da IA:</strong>
               <br />• Cria provas baseadas no seu histórico
               <br />• Identifica pontos fortes e fracos
               <br />• Sugere melhorias de estudo
               <br />• Recomendações personalizadas
             </div>
           </CardContent>
         </Card>
       )}

             {/* Conexões Históricas */}
       {showConnections ? (
         <div className="space-y-6 px-4 md:px-0">
           <div className="text-center">
             <h2 className="font-bold font-montserrat text-xl md:text-2xl text-epic mb-2">
               🌍 Conexões Históricas
             </h2>
             <p className="text-muted-foreground text-sm md:text-base">
               Descubra como as civilizações antigas influenciaram o mundo digital de hoje
             </p>
           </div>

           <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
             {historicalConnections
               .filter(connection => selectedCategory === 'all' || connection.category === selectedCategory)
               .map(connection => (
                               <Card key={connection.id} className="arena-card hover-scale transform scale-90 md:scale-75 border-epic/30">
                 <CardHeader className="pb-2 md:pb-3">
                   <CardTitle className="font-montserrat text-sm md:text-base flex items-center gap-2">
                     {connection.title}
                   </CardTitle>
                   <div className="flex items-center gap-2 text-epic font-medium">
                     <ArrowRight className="w-4 h-4" />
                     <span className="text-xs md:text-sm font-mono">
                       {connection.origin}
                     </span>
                   </div>
                 </CardHeader>
                 
                 <CardContent className="space-y-3 p-3 md:p-4">
                   <p className="text-muted-foreground text-xs md:text-sm">
                     {connection.description}
                   </p>
                   
                   <div className="bg-victory/10 border border-victory/30 rounded-lg p-2 md:p-3">
                     <p className="text-victory font-medium text-xs md:text-sm mb-1">
                       💡 Exemplos Modernos:
                     </p>
                     <p className="text-victory text-xs md:text-sm">
                       {connection.modernExample}
                     </p>
                   </div>
                   
                   <div className="flex items-center gap-2">
                     <Badge className={getCategoryColor(connection.category)}>
                       {getCategoryIcon(connection.category)}
                       <span className="ml-1 capitalize text-xs md:text-sm">
                         {connection.category.substring(0, 4)}
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
                                          {/* Knowledge Items Grid - MELHORADO e ORGANIZADO */}
            <div className="grid gap-4 grid-cols-1 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-3">
              {currentItems.map(item => (
                <Card key={item.id} className="arena-card hover-scale border-epic/60 hover:border-epic/80 transition-all duration-300 transform scale-95 md:scale-90">
                  <CardHeader className="pb-3 md:pb-4 bg-gradient-to-br from-epic/25 to-transparent">
                    <div className="flex items-start flex-col gap-3 md:justify-between">
                      <CardTitle className="font-montserrat font-bold text-base md:text-lg text-epic leading-tight">
                        {item.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getCategoryColor(item.category)} font-medium shadow-sm`}>
                          {getCategoryIcon(item.category)}
                          <span className="ml-1 capitalize text-xs md:text-sm">
                            {item.category.substring(0, 4)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 p-4 md:p-5">
                    {/* Questão e Resposta */}
                    {item.item_type === 'qa' && item.question && (
                      <div className="space-y-3 bg-victory/25 rounded-lg p-3 border border-victory/40">
                        <p className="font-medium text-victory text-sm md:text-base">
                          ❓ {item.question}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">✅ Resposta:</span>
                          <Badge variant="default" className="bg-victory/40 text-victory font-medium text-xs md:text-sm">
                            {item.correct_answer}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {/* Conteúdo Principal */}
                    {item.content && (
                      <div className="bg-background/60 rounded-lg p-3 border border-muted/50">
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                          📚 {item.content}
                        </p>
                      </div>
                    )}
                    
                    {/* Metadados e Tags */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-muted/40">
                      {item.year_start && (
                        <Badge variant="outline" className="gap-1 bg-epic/30 border-epic/60 text-epic text-xs px-2 py-1 md:text-sm md:px-3 md:py-1">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                          {item.year_start > 0 ? `${item.year_start} d.C.` : `${Math.abs(item.year_start)} a.C.`}
                        </Badge>
                      )}
                      
                      {item.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="gap-1 bg-muted/40 border-muted/50 text-muted-foreground text-xs px-2 py-1 md:text-sm md:px-3 md:py-1">
                          <Tag className="w-3 h-3 md:w-4 md:h-4" />
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
        <div className="flex items-center justify-center gap-2 mt-8 px-4 md:px-0">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="text-xs px-2 md:text-sm md:px-3"
          >
            ← Anterior
          </Button>
          
          <div className="flex items-center gap-1 text-xs md:text-sm">
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
                  className={`h-8 w-8 text-xs md:h-10 md:w-10 md:text-sm ${
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
            className="text-xs px-2 md:text-sm md:px-3"
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