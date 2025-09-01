import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  source?: string; // Fonte da informação para credibilidade
}

export const useEraQuestions = (eraSlug: string, questionCount: number = 5) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Força nova busca a cada montagem

  const getRandomQuestions = async () => {
    try {
      setLoading(true);
      
      // Adicionar timestamp único para garantir que sempre busque perguntas diferentes
      const uniqueTimestamp = Date.now() + Math.random();
      console.log(`🎲 NOVA BUSCA de perguntas para ${eraSlug} - Timestamp: ${uniqueTimestamp} - RefreshKey: ${refreshKey}`);
      
      // Buscar a era pelo slug
      const { data: era, error: eraError } = await supabase
        .from('eras')
        .select('id')
        .eq('slug', eraSlug)
        .single();

      if (eraError || !era) {
        throw new Error('Era não encontrada');
      }

      // Buscar perguntas da era específica
      const { data: knowledgeItems, error: questionsError } = await supabase
        .from('knowledge_items')
        .select('*')
        .eq('era_id', era.id)
        .eq('item_type', 'qa')
        .not('question', 'is', null)
        .not('correct_answer', 'is', null);

      if (questionsError) {
        throw new Error('Erro ao buscar perguntas');
      }

      if (!knowledgeItems || knowledgeItems.length === 0) {
        // Fallback para perguntas padrão se não houver no banco
        console.log(`⚠️ Nenhuma pergunta no banco para ${eraSlug}, usando fallback com randomização`);
        const defaultQuestions = getDefaultQuestions(eraSlug);
        
        // RANDOMIZAÇÃO MELHORADA - Fisher-Yates shuffle com múltiplas passadas para variedade real
        const shuffleArray = (array: any[]) => {
          const shuffled = [...array];
          // Múltiplas passadas de shuffle para garantir randomização total
          for (let pass = 0; pass < 5; pass++) { // Aumentei para 5 passadas
            for (let i = shuffled.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
          }
          return shuffled;
        };
        
        // FORÇAR ENTROPIA MÁXIMA com timestamp e múltiplas sementes
        const timestamp = performance.now() + Math.random() * 1000 + Date.now();
        Math.seedrandom = Math.seedrandom || (() => Math.random()); // Fallback se não tiver seedrandom
        
        // Embaralhar várias vezes com diferentes seeds para máxima aleatoriedade  
        let multiShuffled = [...defaultQuestions];
        for (let i = 0; i < 12; i++) { // 12 shuffles para TOTAL aleatoriedade
          // Usar timestamp + iteration como seed para garantir diferença
          const seed = timestamp + i * 1000 + Math.random() * 10000;
          multiShuffled = shuffleArray(multiShuffled);
        }
        
        // RANDOMIZAÇÃO ADICIONAL: começar de posição aleatória do array
        const randomStart = Math.floor(Math.random() * multiShuffled.length);
        multiShuffled = [...multiShuffled.slice(randomStart), ...multiShuffled.slice(0, randomStart)];
        
        const randomizedQuestions = multiShuffled.slice(0, questionCount).map((question, index) => {
          const shuffledOptions = shuffleArray([...question.options]);
          const correctIndex = shuffledOptions.indexOf(question.options[question.correct]);
          
          return {
            ...question,
            id: `${question.id}-${timestamp}-${Math.random()}-${index}`, // ID único com timestamp para forçar re-render
            options: shuffledOptions,
            correct: correctIndex
          };
        });
        
        console.log(`✅ Selecionadas ${randomizedQuestions.length} perguntas embaralhadas:`, 
          randomizedQuestions.map(q => `"${q.question.substring(0, 30)}..."`));
        setQuestions(randomizedQuestions);
        return;
      }

      console.log(`📚 Encontradas ${knowledgeItems.length} perguntas para ${eraSlug}`);

      // RANDOMIZAÇÃO MELHORADA - Fisher-Yates shuffle com múltiplas passadas para variedade real
      const shuffleArray = (array: any[]) => {
        const shuffled = [...array];
        // Múltiplas passadas de shuffle para garantir randomização total
        for (let pass = 0; pass < 3; pass++) {
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
        }
        return shuffled;
      };

      const multiShuffled = shuffleArray(shuffleArray(shuffleArray(knowledgeItems)));
      const shuffledQuestions = multiShuffled;
      const selectedQuestions = shuffledQuestions.slice(0, Math.min(questionCount, shuffledQuestions.length));

      // Formatar perguntas para o formato esperado
      const formattedQuestions: Question[] = selectedQuestions.map((item, index) => {
        const wrongOptions = Array.isArray(item.wrong_options) ? 
          item.wrong_options.filter(opt => typeof opt === 'string') as string[] : [];
        const allOptions = [item.correct_answer, ...wrongOptions].filter(Boolean) as string[];
        
        // Embaralhar opções usando Fisher-Yates também  
        const shuffledOptions = shuffleArray(allOptions);
        const correctIndex = shuffledOptions.indexOf(item.correct_answer as string);

        return {
          id: `${item.id}-${Date.now()}-${Math.random()}-${index}`, // ID único com random para evitar cache
          question: item.question || '',
          options: shuffledOptions.slice(0, 4), // Máximo 4 opções
          correct: correctIndex,
          explanation: item.content || item.title || 'Explicação não disponível.',
          category: (['history', 'finance', 'technology', 'future'].includes(item.category) ? 
            item.category : 'history') as 'history' | 'finance' | 'technology' | 'future'
        };
      });

      // Se temos perguntas suficientes do banco, usar apenas elas
      if (formattedQuestions.length >= questionCount) {
        console.log(`✅ Usando ${formattedQuestions.length} perguntas do banco para ${eraSlug}:`, 
          formattedQuestions.map(q => `"${q.question.substring(0, 30)}..."`));
        setQuestions(formattedQuestions);
      } else {
        // Caso contrário, completar com perguntas padrão (fallback)
        const defaultQuestions = getDefaultQuestions(eraSlug);
        const remainingCount = questionCount - formattedQuestions.length;
        const additionalQuestions = shuffleArray(defaultQuestions).slice(0, remainingCount);
        
        const finalQuestions = shuffleArray([...formattedQuestions, ...additionalQuestions]);
        setQuestions(finalQuestions);
        console.log(`⚠️ Usando ${formattedQuestions.length} do banco + ${additionalQuestions.length} padrão para ${eraSlug}`);
      }
    } catch (err) {
      console.error('Erro ao carregar perguntas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setQuestions(getDefaultQuestions(eraSlug));
    } finally {
      setLoading(false);
    }
  };

  // Effect para gerar nova chave de refresh a cada montagem do componente
  useEffect(() => {
    const newKey = Date.now() + Math.random() * 1000000;
    console.log(`🔄 NOVA MONTAGEM do hook para ${eraSlug} - RefreshKey: ${newKey}`);
    setRefreshKey(newKey);
  }, []);

  useEffect(() => {
    if (refreshKey > 0) { // Só executa após o refreshKey ser inicializado
      console.log(`▶️ EXECUTANDO getRandomQuestions para ${eraSlug} com refreshKey: ${refreshKey}`);
      getRandomQuestions();
    }
  }, [eraSlug, questionCount, refreshKey]);

  const forceNewQuestions = () => {
    console.log(`🔄 FORÇANDO nova randomização para ${eraSlug}`);
    setQuestions([]); // Limpar perguntas atuais
    setRefreshKey(performance.now() + Math.random() * 1000000); // Nova chave força re-fetch
  };

  return { questions, loading, error, refetch: getRandomQuestions, forceNewQuestions };
};

// Perguntas padrão como fallback
const getDefaultQuestions = (eraSlug: string): Question[] => {
  const defaultSets = {
    'egito-antigo': [
      {
        id: 'default-1',
        question: "Qual era o principal rio que fertilizava o Egito Antigo?",
        options: ["Nilo", "Eufrates", "Tigre", "Jordão"],
        correct: 0,
        explanation: "O Rio Nilo era fundamental para a civilização egípcia, fornecendo água e solo fértil.",
        category: "history",
        source: "Heródoto. Histórias, Livro II (c. 440 a.C.)"
      },
      {
        id: 'default-2',
        question: "Em que período o Egito atingiu seu auge de poder?",
        options: ["Antigo Reino", "Médio Reino", "Novo Reino", "Período Tardio"],
        correct: 2,
        explanation: "O Novo Reino (1550-1077 a.C.) foi marcado pela expansão territorial e grandes faraós.",
        category: "history"
      },
      {
        id: 'default-3',
        question: "Qual era a moeda de troca mais comum no Egito Antigo?",
        options: ["Ouro", "Prata", "Grãos", "Papiro"],
        correct: 2,
        explanation: "Os grãos eram a base da economia egípcia e serviam como meio de troca.",
        category: "finance"
      },
      {
        id: 'default-4',
        question: "Qual faraó construiu a Grande Pirâmide de Gizé?",
        options: ["Khufu", "Tutancâmon", "Ramsés II", "Akhenaton"],
        correct: 0,
        explanation: "Khufu (ou Queóps) mandou construir a Grande Pirâmide por volta de 2580 a.C.",
        category: "history"
      },
      {
        id: 'default-5',
        question: "Qual processo os egípcios desenvolveram para preservar corpos?",
        options: ["Cremação", "Mumificação", "Enterro simples", "Exposição ao sol"],
        correct: 1,
        explanation: "A mumificação era um processo complexo para preservar corpos para a vida após a morte.",
        category: "technology"
      },
      {
        id: 'default-6',
        question: "Qual deus egípcio era associado ao sol e à criação?",
        options: ["Anúbis", "Rá", "Osíris", "Thoth"],
        correct: 1,
        explanation: "Rá era o principal deus egípcio associado ao sol e à criação.",
        category: "history"
      },
      {
        id: 'default-7',
        question: "Qual rainha egípcia assumiu o título de faraó?",
        options: ["Nefertiti", "Hatshepsut", "Cleópatra", "Tiy"],
        correct: 1,
        explanation: "Hatshepsut foi uma das rainhas mais poderosas do Egito, assumindo o título de faraó.",
        category: "history"
      },
      {
        id: 'default-8',
        question: "Qual animal era considerado sagrado pelos egípcios?",
        options: ["Cão", "Gato", "Cavalo", "Leão"],
        correct: 1,
        explanation: "Os gatos eram considerados sagrados e eram mumificados no Egito.",
        category: "history"
      },
      // NOVAS PERGUNTAS ADICIONADAS
      {
        id: 'default-9',
        question: "Quem era considerado um deus vivo no Egito?",
        options: ["Sacerdote", "Faraó", "Escriba", "Soldado"],
        correct: 1,
        explanation: "O Faraó era considerado uma divindade viva, intermediário entre deuses e humanos.",
        category: "history"
      },
      {
        id: 'default-10',
        question: "Como se chamava a escrita egípcia?",
        options: ["Cuneiforme", "Hieróglifos", "Grega", "Latina"],
        correct: 1,
        explanation: "Os hieróglifos eram o sistema de escrita sagrada dos egípcios.",
        category: "technology"
      },
      {
        id: 'default-11',
        question: "A Pedra de Roseta foi importante para:",
        options: ["Comércio", "Decifrar os hieróglifos", "Guerra", "Agricultura"],
        correct: 1,
        explanation: "A Pedra de Roseta permitiu a decodificação dos hieróglifos egípcios.",
        category: "technology"
      },
      {
        id: 'default-12',
        question: "Quem foi a famosa rainha que se relacionou com Júlio César?",
        options: ["Nefertiti", "Cleópatra", "Hatshepsut", "Ísis"],
        correct: 1,
        explanation: "Cleópatra VII teve relações políticas e amorosas com Júlio César e Marco Antônio.",
        category: "history"
      },
      {
        id: 'default-13',
        question: "O que representava o Olho de Hórus?",
        options: ["Riqueza", "Proteção", "Guerra", "Escrita"],
        correct: 1,
        explanation: "O Olho de Hórus era um símbolo de proteção, poder e boa saúde.",
        category: "history"
      },
      {
        id: 'default-14',
        question: "Qual era o calendário egípcio baseado em?",
        options: ["Fases da Lua", "Cheia do Nilo", "Movimentos das estrelas", "Estações"],
        correct: 1,
        explanation: "O calendário egípcio era baseado nas cheias anuais do Rio Nilo.",
        category: "technology"
      },
      {
        id: 'default-15',
        question: "Que faraó ficou famoso por seu túmulo intacto?",
        options: ["Ramsés II", "Tutancâmon", "Akhenaton", "Djoser"],
        correct: 1,
        explanation: "O túmulo de Tutancâmon foi descoberto intacto em 1922 por Howard Carter.",
        category: "history"
      },
      {
        id: 'default-16',
        question: "Como eram chamadas as casas de aprendizado no Egito?",
        options: ["Casas da Vida", "Templos do Sol", "Escolas do Papiro", "Ateliês do Nilo"],
        correct: 0,
        explanation: "As Casas da Vida eram centros de ensino e preservação do conhecimento.",
        category: "history"
      },
      {
        id: 'default-17',
        question: "A Esfinge de Gizé tem corpo de leão e cabeça de:",
        options: ["Deus", "Faraó", "Escrava", "Pássaro"],
        correct: 1,
        explanation: "A Esfinge representa um faraó com corpo de leão, simbolizando poder.",
        category: "history"
      },
      {
        id: 'default-18',
        question: "O Egito Antigo dividia-se em:",
        options: ["Norte e Sul", "Leste e Oeste", "Planalto e Vale", "Cidade e Campo"],
        correct: 0,
        explanation: "O Egito era dividido em Alto Egito (Sul) e Baixo Egito (Norte).",
        category: "history"
      },
      {
        id: 'default-19',
        question: "Quem era o deus dos mortos e da ressurreição?",
        options: ["Rá", "Osíris", "Anúbis", "Seth"],
        correct: 1,
        explanation: "Osíris era o deus dos mortos, da ressurreição e da vida após a morte.",
        category: "history"
      },
      {
        id: 'default-20',
        question: "Como eram chamados os governadores regionais do Egito?",
        options: ["Sátrapas", "Nomarcas", "Prefeitos", "Senhores feudais"],
        correct: 1,
        explanation: "Os nomarcas eram governadores das divisões territoriais (nomos) do Egito.",
        category: "history"
      }
    ],
    mesopotamia: [
      {
        id: 'default-1',
        question: "Qual foi a primeira forma de escrita desenvolvida na Mesopotâmia?",
        options: ["Hieróglifos", "Cuneiforme", "Alfabeto", "Pictogramas"],
        correct: 1,
        explanation: "A escrita cuneiforme foi desenvolvida pelos sumérios por volta de 3200 a.C.",
        category: "technology"
      },
      {
        id: 'default-2',
        question: "Qual rio não fazia parte da Mesopotâmia?",
        options: ["Tigre", "Eufrates", "Nilo", "Ambos Tigre e Eufrates"],
        correct: 2,
        explanation: "O Nilo fica no Egito. A Mesopotâmia ficava entre os rios Tigre e Eufrates.",
        category: "history"
      },
      {
        id: 'default-3',
        question: "Qual sistema matemático foi criado na Mesopotâmia?",
        options: ["Decimal", "Sexagesimal", "Binário", "Hexadecimal"],
        correct: 1,
        explanation: "O sistema sexagesimal (base 60) ainda é usado para medir tempo e ângulos.",
        category: "technology"
      },
      {
        id: 'default-4',
        question: "Qual código de leis foi criado na Babilônia?",
        options: ["Código de Hamurabi", "Lei das Doze Tábuas", "Código de Justiniano", "Magna Carta"],
        correct: 0,
        explanation: "O Código de Hamurabi (c. 1750 a.C.) foi um dos primeiros códigos de leis escritas.",
        category: "history"
      },
      {
        id: 'default-5',
        question: "Qual estrutura caracterizava as cidades mesopotâmicas?",
        options: ["Pirâmides", "Zigurates", "Templos Gregos", "Anfiteatros"],
        correct: 1,
        explanation: "Os zigurates eram templos em formato de torre escalonada, símbolos das cidades.",
        category: "history"
      },
      {
        id: 'default-6',
        question: "Qual civilização inventou a escrita cuneiforme?",
        options: ["Assírios", "Babilônios", "Sumérios", "Hititas"],
        correct: 2,
        explanation: "Os sumérios inventaram a escrita cuneiforme, um dos primeiros sistemas de escrita.",
        category: "technology"
      },
      {
        id: 'default-7',
        question: "Qual rei construiu os Jardins Suspensos?",
        options: ["Sargão", "Nabucodonosor II", "Assurbanipal", "Hamurabi"],
        correct: 1,
        explanation: "Nabucodonosor II construiu os famosos Jardins Suspensos de Babilônia.",
        category: "history"
      },
      {
        id: 'default-8',
        question: "Qual material era usado para escrever na Mesopotâmia?",
        options: ["Papiro", "Argila", "Pergaminho", "Madeira"],
        correct: 1,
        explanation: "A argila era o material principal para escrita, moldada em tábuas.",
        category: "technology"
      },
      // NOVAS PERGUNTAS ADICIONADAS 
      {
        id: 'default-9',
        question: "Que povo inventou a roda?",
        options: ["Sumérios", "Egípcios", "Assírios", "Persas"],
        correct: 0,
        explanation: "Os sumérios inventaram a roda por volta de 3500 a.C., revolucionando o transporte.",
        category: "technology"
      },
      {
        id: 'default-10',
        question: "Qual povo mesopotâmico foi conhecido por sua crueldade militar?",
        options: ["Sumérios", "Assírios", "Babilônios", "Hititas"],
        correct: 1,
        explanation: "Os assírios eram temidos por suas táticas militares brutais e eficientes.",
        category: "history"
      },
      {
        id: 'default-11',
        question: "Os mesopotâmicos observavam o céu para:",
        options: ["Religião e Agricultura", "Navegação", "Construção", "Guerra"],
        correct: 0,
        explanation: "A astronomia mesopotâmica servia para rituais religiosos e calendário agrícola.",
        category: "technology"
      },
      {
        id: 'default-12',
        question: "O Épico de Gilgamesh é considerado:",
        options: ["Primeira constituição", "Primeiro poema épico", "Primeiro romance", "Primeiro diário"],
        correct: 1,
        explanation: "O Épico de Gilgamesh é considerado a primeira obra épica da literatura mundial.",
        category: "history"
      },
      {
        id: 'default-13',
        question: "A Mesopotâmia significa literalmente:",
        options: ["Terra dos rios", "Entre rios", "Terra fértil", "Berço da civilização"],
        correct: 1,
        explanation: "Mesopotâmia significa 'entre rios', referindo-se à região entre Tigre e Eufrates.",
        category: "history"
      },
      {
        id: 'default-14',
        question: "Qual foi a primeira cidade-estado da história?",
        options: ["Ur", "Babilônia", "Uruk", "Nínive"],
        correct: 2,
        explanation: "Uruk é considerada a primeira cidade-estado verdadeira da história.",
        category: "history"
      },
      {
        id: 'default-15',
        question: "Os zigurates serviam como:",
        options: ["Residências reais", "Templos religiosos", "Fortalezas militares", "Mercados"],
        correct: 1,
        explanation: "Os zigurates eram templos em forma de pirâmide escalonada para adoração.",
        category: "history"
      }
    ],
    medieval: [
      {
        id: 'default-1',
        question: "Qual sistema econômico predominou na Europa Medieval?",
        options: ["Capitalismo", "Feudalismo", "Socialismo", "Mercantilismo"],
        correct: 1,
        explanation: "O feudalismo baseava-se na troca de terras por serviços e proteção.",
        category: "history"
      },
      {
        id: 'default-2',
        question: "Qual invenção revolucionou a agricultura medieval?",
        options: ["Arado de ferro", "Moinho de vento", "Rotação de culturas", "Todas as anteriores"],
        correct: 3,
        explanation: "Várias inovações agrícolas transformaram a produtividade medieval.",
        category: "technology"
      },
      {
        id: 'default-3',
        question: "Qual evento marcou o fim do Império Romano do Ocidente?",
        options: ["476 d.C.", "1066 d.C.", "1453 d.C.", "800 d.C."],
        correct: 0,
        explanation: "Em 476 d.C., o último imperador romano do ocidente foi deposto.",
        category: "history"
      },
      {
        id: 'default-4',
        question: "Qual instituição controlava a educação na Idade Média?",
        options: ["Universidades", "Igreja Católica", "Nobreza", "Guildas"],
        correct: 1,
        explanation: "A Igreja Católica era a principal responsável pela educação medieval.",
        category: "history"
      },
      {
        id: 'default-5',
        question: "Qual sistema de escrita se popularizou na Europa Medieval?",
        options: ["Uncial", "Carolíngia", "Gótica", "Todas as anteriores"],
        correct: 3,
        explanation: "Diferentes estilos de escrita evoluíram durante a Idade Média.",
        category: "technology"
      },
      {
        id: 'default-6',
        question: "Qual evento marcou o início da Idade Média?",
        options: ["Descoberta da América", "Queda de Roma", "Revolução Francesa", "Renascimento"],
        correct: 1,
        explanation: "A queda de Roma em 476 d.C. marcou o início da Idade Média.",
        category: "history"
      },
      {
        id: 'default-7',
        question: "Qual ordem militar protegia peregrinos nas Cruzadas?",
        options: ["Jesuítas", "Templários", "Franciscanos", "Dominicanos"],
        correct: 1,
        explanation: "Os Templários protegiam peregrinos e desenvolveram o sistema bancário.",
        category: "history"
      },
      {
        id: 'default-8',
        question: "Qual praga devastou a Europa em 1347?",
        options: ["Cólera", "Peste Negra", "Malária", "Tifo"],
        correct: 1,
        explanation: "A Peste Negra matou cerca de um terço da população europeia.",
        category: "history"
      },
      // NOVAS PERGUNTAS ADICIONADAS
      {
        id: 'default-9',
        question: "Qual era a principal função dos cavaleiros na Idade Média?",
        options: ["Cuidar das colheitas", "Proteger o feudo e servir ao senhor feudal", "Construir igrejas", "Redigir manuscritos"],
        correct: 1,
        explanation: "Os cavaleiros eram guerreiros que protegiam o feudo e serviam ao senhor feudal.",
        category: "history"
      },
      {
        id: 'default-10',
        question: "O que foram as Cruzadas?",
        options: ["Expedições militares para conquistar a Terra Santa", "Guerras entre feudos", "Explorações marítimas", "Revoltas camponesas"],
        correct: 0,
        explanation: "As Cruzadas foram expedições militares cristãs para reconquistar a Terra Santa.",
        category: "history"
      },
      {
        id: 'default-11',
        question: "Qual estilo arquitetônico marcou as grandes catedrais da Idade Média?",
        options: ["Clássico", "Românico", "Gótico", "Barroco"],
        correct: 2,
        explanation: "O estilo gótico caracterizou as grandes catedrais medievais com arcos ogivais.",
        category: "technology"
      },
      {
        id: 'default-12',
        question: "Qual universidade medieval é considerada uma das mais antigas?",
        options: ["Sorbonne (Paris)", "Harvard", "Oxford", "Salamanca"],
        correct: 0,
        explanation: "A Universidade de Paris (Sorbonne) foi fundada em 1150, sendo uma das mais antigas.",
        category: "history"
      },
      {
        id: 'default-13',
        question: "Quem foi Joana d'Arc?",
        options: ["Rainha da Inglaterra", "Guerreira que liderou tropas francesas", "Fundadora de ordem religiosa", "Inventora medieval"],
        correct: 1,
        explanation: "Joana d'Arc liderou tropas francesas contra os ingleses na Guerra dos Cem Anos.",
        category: "history"
      },
      {
        id: 'default-14',
        question: "Qual invenção de Gutenberg revolucionou a Idade Média?",
        options: ["Arado de ferro", "Imprensa", "Tear mecânico", "Relógio de sol"],
        correct: 1,
        explanation: "A imprensa de Gutenberg (1440) revolucionou a reprodução de livros.",
        category: "technology"
      },
      {
        id: 'default-15',
        question: "Qual classe social era dona das terras no feudalismo?",
        options: ["Burguesia", "Nobreza", "Clero baixo", "Camponeses"],
        correct: 1,
        explanation: "A nobreza (senhores feudais) possuía as terras no sistema feudal.",
        category: "history"
      },
      {
        id: 'default-16',
        question: "Os monges copistas trabalhavam principalmente em:",
        options: ["Moinhos", "Mosteiros", "Mercados", "Feudos"],
        correct: 1,
        explanation: "Os monges copistas preservavam conhecimento nos mosteiros medievais.",
        category: "history"
      },
      {
        id: 'default-17',
        question: "Qual arma era considerada símbolo dos cavaleiros?",
        options: ["Lança", "Espada longa", "Arco curto", "Machado"],
        correct: 1,
        explanation: "A espada longa era o símbolo de honra e status dos cavaleiros.",
        category: "history"
      },
      {
        id: 'default-18',
        question: "Quem eram os servos?",
        options: ["Trabalhadores livres", "Camponeses presos à terra", "Nobres sem título", "Estudantes"],
        correct: 1,
        explanation: "Os servos eram camponeses ligados à terra, sem liberdade para sair.",
        category: "history"
      },
      {
        id: 'default-19',
        question: "As guildas na Idade Média eram:",
        options: ["Associações de artesãos e comerciantes", "Grupos de guerreiros", "Escolas", "Monges"],
        correct: 0,
        explanation: "As guildas eram associações profissionais que regulamentavam ofícios.",
        category: "finance"
      },
      {
        id: 'default-20',
        question: "O que significava 'dízimo'?",
        options: ["Imposto pago ao rei", "Imposto pago à Igreja", "Imposto pago ao senhor feudal", "Imposto sobre comércio"],
        correct: 1,
        explanation: "O dízimo era o imposto de 10% da produção pago à Igreja Católica.",
        category: "finance"
      }
    ],
    digital: [
      {
        id: 'default-1',
        question: "Qual tecnologia revolucionou as transações financeiras?",
        options: ["Blockchain", "Wi-Fi", "GPS", "Realidade Virtual"],
        correct: 0,
        explanation: "A blockchain possibilitou criptomoedas e contratos inteligentes.",
        category: "technology",
        source: "Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System"
      },
      {
        id: 'default-2',
        question: "Quando foi criada a World Wide Web?",
        options: ["1989", "1991", "1995", "2000"],
        correct: 1,
        explanation: "Tim Berners-Lee criou a WWW em 1991 no CERN.",
        category: "history",
        source: "Berners-Lee, T. (1991). World Wide Web - CERN"
      },
      {
        id: 'default-3',
        question: "Qual empresa não é considerada Big Tech?",
        options: ["Google", "Amazon", "Microsoft", "IBM"],
        correct: 3,
        explanation: "IBM é mais antiga e não faz parte do grupo das Big Tech atuais.",
        category: "history"
      },
      {
        id: 'default-4',
        question: "O que significa IoT?",
        options: ["Internet of Things", "Internet of Technology", "Index of Technology", "Interface of Things"],
        correct: 0,
        explanation: "Internet das Coisas conecta objetos físicos à internet.",
        category: "technology"
      },
      {
        id: 'default-5',
        question: "Qual conceito define a economia digital?",
        options: ["Economia Circular", "Economia Compartilhada", "Economia de Dados", "Todas as anteriores"],
        correct: 3,
        explanation: "A economia digital combina sustentabilidade, colaboração e valorização de dados.",
        category: "future"
      },
      {
        id: 'default-6',
        question: "Quem fundou a Microsoft?",
        options: ["Steve Jobs", "Bill Gates", "Jeff Bezos", "Mark Zuckerberg"],
        correct: 1,
        explanation: "Bill Gates fundou a Microsoft em 1975, revolucionando a computação.",
        category: "technology",
        source: "Microsoft Corporation History (1975-present)"
      },
      {
        id: 'default-7',
        question: "Qual foi o primeiro smartphone moderno?",
        options: ["Blackberry", "iPhone", "Android", "Nokia"],
        correct: 1,
        explanation: "O iPhone, lançado em 2007, revolucionou a comunicação móvel.",
        category: "technology"
      },
      {
        id: 'default-8',
        question: "Qual rede social foi criada em 2004?",
        options: ["Twitter", "Facebook", "Instagram", "TikTok"],
        correct: 1,
        explanation: "O Facebook foi criado por Mark Zuckerberg em 2004.",
        category: "technology"
      },
      // NOVAS PERGUNTAS ATUALIZADAS ATÉ 2025
      {
        id: 'default-9',
        question: "O que é IA generativa?",
        options: ["IA que apenas organiza dados", "IA que cria novos conteúdos como texto e imagens", "IA que só responde perguntas", "IA que calcula números"],
        correct: 1,
        explanation: "IA generativa cria novos conteúdos originais usando aprendizado de máquina.",
        category: "technology"
      },
      {
        id: 'default-10',
        question: "Qual tecnologia permite criar objetos físicos a partir de modelos digitais?",
        options: ["Impressora 3D", "Computação em nuvem", "Blockchain", "Realidade virtual"],
        correct: 0,
        explanation: "Impressoras 3D transformam designs digitais em objetos físicos camada por camada.",
        category: "technology"
      },
      {
        id: 'default-11',
        question: "O que é metaverso?",
        options: ["Rede de computadores quânticos", "Espaço digital imersivo e interativo", "Criptomoeda", "Jogo medieval"],
        correct: 1,
        explanation: "Metaverso é um ambiente virtual imersivo onde pessoas interagem digitalmente.",
        category: "future"
      },
      {
        id: 'default-12',
        question: "Qual técnica permite editar genes de forma precisa?",
        options: ["IA generativa", "CRISPR", "Blockchain", "Impressora 3D"],
        correct: 1,
        explanation: "CRISPR é uma tecnologia revolucionária de edição genética precisa.",
        category: "technology"
      },
      {
        id: 'default-13',
        question: "O que são carros autônomos?",
        options: ["Carros movidos a eletricidade", "Carros sem motorista", "Carros com GPS", "Carros voadores"],
        correct: 1,
        explanation: "Carros autônomos dirigem sozinhos usando IA e sensores avançados.",
        category: "technology"
      },
      {
        id: 'default-14',
        question: "O que é computação em nuvem?",
        options: ["Processamento em computadores pessoais", "Armazenamento e processamento remoto", "Internet sem fio", "Conexão por satélite"],
        correct: 1,
        explanation: "Computação em nuvem oferece recursos computacionais via internet.",
        category: "technology"
      },
      {
        id: 'default-15',
        question: "O que é realidade aumentada (AR)?",
        options: ["Jogos em 3D", "Sobreposição de elementos digitais no mundo real", "Filmes em 4D", "Impressão digital"],
        correct: 1,
        explanation: "AR adiciona informações digitais ao ambiente físico real.",
        category: "technology"
      },
      {
        id: 'default-16',
        question: "Qual empresa lançou o ChatGPT?",
        options: ["Apple", "OpenAI", "Tesla", "Amazon"],
        correct: 1,
        explanation: "OpenAI desenvolveu e lançou o ChatGPT, revolucionando IA conversacional.",
        category: "technology"
      },
      {
        id: 'default-17',
        question: "O que são smart contracts?",
        options: ["Programas executados em blockchain", "Contratos em papel digitalizados", "Aplicativos de celular", "Documentos na nuvem"],
        correct: 0,
        explanation: "Smart contracts são contratos auto-executáveis programados em blockchain.",
        category: "finance"
      },
      {
        id: 'default-18',
        question: "O que é computação quântica?",
        options: ["Computadores comuns mais rápidos", "Computadores que usam princípios da mecânica quântica", "Jogos online", "Internet acelerada"],
        correct: 1,
        explanation: "Computação quântica usa propriedades quânticas para processamento exponencialmente mais rápido.",
        category: "future"
      },
      {
        id: 'default-19',
        question: "O que são wearables?",
        options: ["Roupas de época", "Dispositivos vestíveis como relógios inteligentes", "Chips de computador", "Óculos comuns"],
        correct: 1,
        explanation: "Wearables são dispositivos tecnológicos que podem ser vestidos ou usados no corpo.",
        category: "technology"
      },
      {
        id: 'default-20',
        question: "O que é AGI (Artificial General Intelligence)?",
        options: ["IA que só faz uma tarefa", "IA com capacidade cognitiva semelhante à humana", "IA que controla redes sociais", "IA usada apenas em jogos"],
        correct: 1,
        explanation: "AGI seria uma IA com inteligência geral comparável ou superior à humana.",
        category: "future"
      },
      {
        id: 'default-21',
        question: "Qual empresa desenvolveu o primeiro carro elétrico de massa?",
        options: ["Toyota", "Tesla", "Ford", "Volkswagen"],
        correct: 1,
        explanation: "A Tesla revolucionou o mercado de carros elétricos com modelos acessíveis.",
        category: "technology"
      },
      {
        id: 'default-22',
        question: "O que são NFTs?",
        options: ["Novos tipos de computador", "Tokens não fungíveis", "Redes de fibra óptica", "Sistemas operacionais"],
        correct: 1,
        explanation: "NFTs são certificados digitais únicos de propriedade em blockchain.",
        category: "finance"
      },
      {
        id: 'default-23',
        question: "Qual é a principal característica da Web3?",
        options: ["Internet mais rápida", "Descentralização baseada em blockchain", "Melhor design", "Menos anúncios"],
        correct: 1,
        explanation: "Web3 promete uma internet descentralizada sem controle de grandes empresas.",
        category: "future"
      },
      {
        id: 'default-24',
        question: "O que são biochips?",
        options: ["Chips de computador", "Chips implantados no corpo para monitorar saúde", "Cartões de crédito digitais", "Sensores solares"],
        correct: 1,
        explanation: "Biochips são dispositivos médicos implantáveis para monitoramento em tempo real.",
        category: "technology"
      },
      {
        id: 'default-25',
        question: "Qual país liderou o desenvolvimento do 5G?",
        options: ["Estados Unidos", "China", "Japão", "Coreia do Sul"],
        correct: 1,
        explanation: "A China teve um papel pioneiro no desenvolvimento e implementação do 5G.",
        category: "technology"
      }
    ]
  };

  return defaultSets[eraSlug as keyof typeof defaultSets] || defaultSets['egito-antigo'];
};