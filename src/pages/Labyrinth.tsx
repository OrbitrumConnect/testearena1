import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Clock, Trophy, Key, Gift, Zap } from 'lucide-react';
import { ActionButton } from '@/components/arena/ActionButton';
import { ParticleBackground } from '@/components/ui/particles';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEraQuestions } from '@/hooks/useEraQuestions';
import { handleNewBattleCredits, getUserPlan } from '@/utils/creditsIntegration';
import { calculateTrainingCredits } from '@/utils/creditsSystem';
import { useBattleSave } from '@/hooks/useBattleSave';

type Era = 'egito-antigo' | 'mesopotamia' | 'medieval' | 'digital';
type GamePhase = 'exploring' | 'question' | 'victory' | 'defeat';
type ChestType = 'question';

interface PlayerPosition {
  x: number;
  y: number;
}

interface Enemy {
  id: string;
  x: number;
  y: number;
  direction: number; // 0-360 degrees
  speed: number;
  lastUpdate: number;
}

interface GameState {
  phase: GamePhase;
  timeLeft: number;
  lives: number;
  chestsOpened: number;
  totalChests: number;
  keysCollected: number;
  score: number;
  playerPosition: PlayerPosition;
  gameStarted: boolean;
  currentQuestion: any;
  selectedAnswer: number | null;
  showExplanation: boolean;
  isInvulnerable: boolean;
  lastHitTime: number;
}

interface Chest {
  id: string;
  type: ChestType;
  isOpen: boolean;
  position: { x: number; y: number };
  era: Era;
  question?: any;
}

interface EraConfig {
  name: string;
  background: string;
  primaryColor: string;
  maxTime: number;
}

const Labyrinth = () => {
  const navigate = useNavigate();
  const { era = 'egito-antigo' } = useParams<{ era: Era }>();
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Hook para salvar dados da batalha
  const { saveBattleResult, saving } = useBattleSave();

  // Função para determinar a próxima era
  const getNextEra = (currentEra: Era): string => {
    switch (currentEra) {
      case 'egito-antigo':
        return '/mesopotamia';
      case 'mesopotamia':
        return '/medieval';
      case 'medieval':
        return '/digital';
      case 'digital':
        return '/app'; // Volta ao menu principal após completar todas as eras
      default:
        return '/app';
    }
  };

        // Funções de touch para mobile
         const handleTouchStart = async (e: React.TouchEvent) => {
       if (!isMobile || gameState.phase !== 'exploring') return;
       e.preventDefault(); // Prevenir movimento da página
       e.stopPropagation(); // Parar propagação do evento
      
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // Converter coordenadas do touch para coordenadas do canvas
      const canvasX = (x / rect.width) * 400;
      const canvasY = (y / rect.height) * 400;
      
      // Verificar se tocou no portal (PRIORIDADE)
      const portalRange = 40; // Raio do portal para touch
      const portalDistance = Math.sqrt(
        Math.pow(canvasX - portalPosition.x, 2) + Math.pow(canvasY - portalPosition.y, 2)
      );
      
      if (portalDistance < portalRange && gameState.keysCollected >= 3) {
        console.log('🚪 Portal tocado no mobile! Chaves:', gameState.keysCollected);
        
        // Calcular créditos baseado nas chaves coletadas
        const questionsCorrect = gameState.keysCollected; // 4 máximo
        const totalQuestions = 4; // 4 baús total
        const accuracyPercentage = (questionsCorrect / totalQuestions) * 100;
        
        // SALVAR DADOS COMPLETOS DA BATALHA (como outras eras)
        const battleDurationSeconds = Math.round((Date.now() - Date.now()) / 1000) || 180; // ~3 min padrão
        const userPlan = getUserPlan();
        const rewards = calculateTrainingCredits(userPlan, era, questionsCorrect, totalQuestions);
        
        await saveBattleResult({
          eraName: `Labirinto ${era === 'egito-antigo' ? 'Egito' : era === 'mesopotamia' ? 'Mesopotâmia' : era === 'medieval' ? 'Medieval' : 'Digital'}`,
          questionsTotal: totalQuestions,
          questionsCorrect: questionsCorrect,
          xpEarned: rewards.xpEarned,
          moneyEarned: rewards.creditsEarned,
          battleDurationSeconds: battleDurationSeconds,
        });
        
        // Sistema de créditos
        handleNewBattleCredits({
          battleType: 'training',
          questionsCorrect,
          questionsTotal: totalQuestions,
          accuracyPercentage,
          eraSlug: era,
          usedExtraLife: false,
          planType: userPlan
        });
        
        console.log(`🏛️ Labirinto ${era}: ${rewards.creditsEarned} créditos salvos na carteira!`);
        
        // Mudar para vitória e auto-navegar
        setGameState(prev => ({ ...prev, phase: 'victory', score: prev.score + 300 }));
        
        // Auto-navegar após 2 segundos no mobile (mais rápido)
        setTimeout(() => {
          const nextRoute = getNextEra(era as Era);
          console.log('🚀 Mobile: Auto-navegando para:', nextRoute);
          navigate(nextRoute);
        }, 2000);
        
        return;
      }
      
      // Verificar se tocou em um baú (distância maior para facilitar)
      const touchedChest = chests.find(chest => {
        const distance = Math.sqrt(
          Math.pow(canvasX - chest.position.x, 2) + Math.pow(canvasY - chest.position.y, 2)
        );
        console.log('🎯 Distância para baú:', chest.id, distance, 'posição:', chest.position.x, chest.position.y);
        return distance < 50 && !chest.isOpen; // Aumentado de 30 para 50
      });
      
      if (touchedChest && touchedChest.question) {
        console.log('📦 Abrindo baú:', touchedChest.id);
        // Abrir baú diretamente
        setGameState(prev => ({
          ...prev,
          phase: 'question',
          currentQuestion: touchedChest.question,
          selectedAnswer: null,
          showExplanation: false
        }));
        
        // Marcar baú como aberto
        setChests(prev => prev.map(chest => 
          chest.id === touchedChest.id 
            ? { ...chest, isOpen: true }
            : chest
        ));
        
                 // Atualizar contadores
         setGameState(prev => ({
           ...prev,
           chestsOpened: prev.chestsOpened + 1,
           score: prev.score + 50 // 50 pontos por baú = alinhado com sistema web
         }));
         
         // Apenas atualizar estatísticas locais (créditos salvos apenas no final)
         console.log(`📦 Baú aberto: +50 pontos de exploração`);
        
        return; // Não mover o jogador se tocou em um baú
      }
      
      // Verificar colisão antes de mover
      const walls = [
        // Paredes externas
        { x: 0, y: 0, width: 400, height: 20 },
        { x: 0, y: 380, width: 400, height: 20 },
        { x: 0, y: 0, width: 20, height: 400 },
        { x: 380, y: 0, width: 20, height: 400 },
        
        // Labirinto com muros variados
        { x: 100, y: 100, width: 40, height: 10 },
        { x: 80, y: 180, width: 30, height: 10 },
        { x: 70, y: 260, width: 35, height: 10 },
        { x: 150, y: 120, width: 10, height: 40 },
        { x: 250, y: 140, width: 10, height: 35 },
        { x: 180, y: 200, width: 45, height: 10 },
        { x: 120, y: 300, width: 10, height: 30 },
        { x: 280, y: 280, width: 25, height: 10 }
      ];
      
      const isCollision = (x: number, y: number) => {
        if (x < 30 || x > 370 || y < 30 || y > 370) return true;
        return walls.some(wall =>
          x + 20 > wall.x && x - 20 < wall.x + wall.width &&
          y + 20 > wall.y && y - 20 < wall.y + wall.height
        );
      };
      
      // Mover jogador para a posição do touch (movimento gradual)
      const currentX = gameState.playerPosition.x;
      const currentY = gameState.playerPosition.y;
      
      // Calcular direção e mover gradualmente
      const deltaX = canvasX - currentX;
      const deltaY = canvasY - currentY;
      const speed = 0.5; // Movimento inicial mais suave (50% da distância)
      
      const newX = Math.max(20, Math.min(380, currentX + deltaX * speed));
      const newY = Math.max(20, Math.min(380, currentY + deltaY * speed));
      
      // Verificar colisão antes de aplicar movimento
      if (!isCollision(newX, newY)) {
        setGameState(prev => ({
          ...prev,
          playerPosition: { x: newX, y: newY }
        }));
      }
    };

                       const handleTouchMove = (e: React.TouchEvent) => {
       if (!isMobile || gameState.phase !== 'exploring') return;
       e.preventDefault();
       e.stopPropagation(); // Parar propagação do evento
      
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // Converter coordenadas do touch para coordenadas do canvas
      const canvasX = (x / rect.width) * 400;
      const canvasY = (y / rect.height) * 400;
      
      // Verificar colisão antes de mover
      const walls = [
        // Paredes externas
        { x: 0, y: 0, width: 400, height: 20 },
        { x: 0, y: 380, width: 400, height: 20 },
        { x: 0, y: 0, width: 20, height: 400 },
        { x: 380, y: 0, width: 20, height: 400 },
        
        // Labirinto com muros variados
        { x: 100, y: 100, width: 40, height: 10 },
        { x: 80, y: 180, width: 30, height: 10 },
        { x: 70, y: 260, width: 35, height: 10 },
        { x: 150, y: 120, width: 10, height: 40 },
        { x: 250, y: 140, width: 10, height: 35 },
        { x: 180, y: 200, width: 45, height: 10 },
        { x: 120, y: 300, width: 10, height: 30 },
        { x: 280, y: 280, width: 25, height: 10 }
      ];
      
      const isCollision = (x: number, y: number) => {
        if (x < 30 || x > 370 || y < 30 || y > 370) return true;
        return walls.some(wall =>
          x + 20 > wall.x && x - 20 < wall.x + wall.width &&
          y + 20 > wall.y && y - 20 < wall.y + wall.height
        );
      };
      
      // Mover jogador mais suavemente (movimento gradual)
      const currentX = gameState.playerPosition.x;
      const currentY = gameState.playerPosition.y;
      
      // Calcular direção e mover gradualmente
      const deltaX = canvasX - currentX;
      const deltaY = canvasY - currentY;
      const speed = 0.3; // Movimento mais suave (30% da distância)
      
      const newX = Math.max(20, Math.min(380, currentX + deltaX * speed));
      const newY = Math.max(20, Math.min(380, currentY + deltaY * speed));
      
      // Verificar colisão antes de aplicar movimento
      if (!isCollision(newX, newY)) {
        setGameState(prev => ({
          ...prev,
          playerPosition: { x: newX, y: newY }
        }));
      }
    };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Finalizar movimento
  };

  const eraConfigs: Record<Era, EraConfig> = {
    'egito-antigo': {
      name: 'Labirinto do Faraó',
      background: '/egypt-arena.png',
      primaryColor: '#ecc94b',
      maxTime: 180
    },
    'mesopotamia': {
      name: 'Zigurate dos Mistérios',
      background: '/mesopotamia-background.png',
      primaryColor: '#ed8936',
      maxTime: 180
    },
    'medieval': {
      name: 'Castelo das Sombras',
      background: '/medieval-background.png',
      primaryColor: '#9f7aea',
      maxTime: 180
    },
    'digital': {
      name: 'Labirinto Cibernético',
      background: '/digital-background.png',
      primaryColor: '#06b6d4',
      maxTime: 180
    }
  };

  const currentEra = eraConfigs[era as Era];

  const [gameState, setGameState] = useState<GameState>({
    phase: 'exploring',
    timeLeft: currentEra.maxTime,
    lives: 10,
    chestsOpened: 0,
    totalChests: 4,
    keysCollected: 0,
    score: 0,
    playerPosition: { x: 50, y: 350 },
    gameStarted: false,
    currentQuestion: null,
    selectedAnswer: null,
    showExplanation: false,
    isInvulnerable: false,
    lastHitTime: 0
  });

  const [chests, setChests] = useState<Chest[]>([]);
  
     // Hero image state
      const [heroImage, setHeroImage] = useState<HTMLImageElement | null>(null);
    const [stoneFloorImage, setStoneFloorImage] = useState<HTMLImageElement | null>(null);
     const [enemies, setEnemies] = useState<Enemy[]>([]);
   const [portalPosition, setPortalPosition] = useState({ x: 350, y: 320 });
   
   // Meteoros para o fundo
   const [meteors, setMeteors] = useState<Array<{
     id: number;
     x: number;
     y: number;
     size: number;
     speed: number;
     angle: number;
     color: string;
     trail: Array<{ x: number; y: number; alpha: number }>;
   }>>([]);
  
  // Load hero and background images
  useEffect(() => {
    const heroImg = new Image();
    heroImg.onload = () => setHeroImage(heroImg);
    heroImg.src = '/heroi labirinto2.png';
    
    
    
         // Criar textura de terra e grama verde com pedrinhas programaticamente
     const createStoneTexture = () => {
       const canvas = document.createElement('canvas');
       canvas.width = 400;
       canvas.height = 400;
       const ctx = canvas.getContext('2d');
       if (!ctx) return;
       
       // Base verde grama
       ctx.fillStyle = '#4A7C59'; // Verde médio
       ctx.fillRect(0, 0, 400, 400);
       
       // Adicionar variações de tom para textura de grama
       for (let i = 0; i < 200; i++) {
         const x = Math.random() * 400;
         const y = Math.random() * 400;
         const size = Math.random() * 8 + 2;
         const alpha = Math.random() * 0.3 + 0.1;
         
         // Tons mais escuros (verde escuro)
         ctx.fillStyle = `rgba(47, 79, 47, ${alpha})`; // Dark green
         ctx.beginPath();
         ctx.arc(x, y, size, 0, Math.PI * 2);
         ctx.fill();
       }
       
       // Tons mais claros (verde claro)
       for (let i = 0; i < 150; i++) {
         const x = Math.random() * 400;
         const y = Math.random() * 400;
         const size = Math.random() * 6 + 1;
         const alpha = Math.random() * 0.2 + 0.05;
         
         ctx.fillStyle = `rgba(143, 188, 143, ${alpha})`; // Dark sea green
         ctx.beginPath();
         ctx.arc(x, y, size, 0, Math.PI * 2);
         ctx.fill();
       }
       
       // Adicionar pedrinhas marrons
       for (let i = 0; i < 80; i++) {
         const x = Math.random() * 400;
         const y = Math.random() * 400;
         const size = Math.random() * 4 + 1; // Pedrinhas menores
         const alpha = Math.random() * 0.4 + 0.2;
         
         // Pedrinhas marrons
         ctx.fillStyle = `rgba(139, 69, 19, ${alpha})`; // Saddle brown
         ctx.beginPath();
         ctx.arc(x, y, size, 0, Math.PI * 2);
         ctx.fill();
       }
       
       // Adicionar pedrinhas cinzas
       for (let i = 0; i < 60; i++) {
         const x = Math.random() * 400;
         const y = Math.random() * 400;
         const size = Math.random() * 3 + 1; // Pedrinhas cinzas menores
         const alpha = Math.random() * 0.3 + 0.15;
         
         // Pedrinhas cinzas
         ctx.fillStyle = `rgba(128, 128, 128, ${alpha})`; // Gray
         ctx.beginPath();
         ctx.arc(x, y, size, 0, Math.PI * 2);
         ctx.fill();
       }
      
      // Converter canvas para imagem
      const img = new Image();
      img.onload = () => setStoneFloorImage(img);
      img.src = canvas.toDataURL();
    };
    
                   createStoneTexture();
   }, []);
   
   // Sistema de meteoros
   useEffect(() => {
     if (!gameState.gameStarted) return;
     
           // Criar novos meteoros aleatoriamente
      const createMeteor = () => {
        // Novas combinações de cores com porcentagens
        const colorCombinations = [
          // Amarelo 60% + Vermelho 40%
          { primary: '#FFD700', secondary: '#FF4444', ratio: 0.6 },
          // Verde 70% + Roxo 30%
          { primary: '#00FF00', secondary: '#800080', ratio: 0.7 },
          // Ciano 70% + Laranja 30%
          { primary: '#00FFFF', secondary: '#FFA500', ratio: 0.7 }
        ];
        
        const selectedCombo = colorCombinations[Math.floor(Math.random() * colorCombinations.length)];
        const usePrimary = Math.random() < selectedCombo.ratio;
        const meteorColor = usePrimary ? selectedCombo.primary : selectedCombo.secondary;
        
                 const meteor = {
           id: Date.now() + Math.random(),
           x: Math.random() * (window.innerWidth * 0.3), // 30% da largura da tela (mais à esquerda)
           y: -100, // Começar mais acima da tela
           size: (Math.random() * 8 + 2) * 0.8, // 20% mais finos (0.8x)
           speed: (Math.random() * 4 + 3) * 1.5, // 50% mais rápidos (1.5x)
           angle: Math.random() * 30 + 15, // Ângulos de 15 a 45 graus
           color: meteorColor,
           trail: []
         };
        
        setMeteors(prev => [...prev, meteor]);
      };
     
           // Criar meteoros a cada 1-3 segundos (mais frequente para 5 meteoros extras)
      const meteorInterval = setInterval(() => {
        if (Math.random() < 0.5) { // 50% de chance a cada intervalo (mais meteoros)
          createMeteor();
        }
      }, 800); // Intervalo menor para mais meteoros
     
     // Atualizar posição dos meteoros
     const updateMeteors = () => {
       setMeteors(prev => 
         prev.map(meteor => {
           const radians = (meteor.angle * Math.PI) / 180;
           const newX = meteor.x + Math.cos(radians) * meteor.speed;
           const newY = meteor.y + Math.sin(radians) * meteor.speed;
           
                       // Adicionar posição atual ao trail (30% mais longo)
            const newTrail = [
              { x: meteor.x, y: meteor.y, alpha: 1.0 },
              ...meteor.trail.slice(0, 12) // Manter 13 posições no trail (30% mais longo)
            ].map((pos, index) => ({
              ...pos,
              alpha: Math.max(0, pos.alpha - 0.08) // Diminuir alpha mais lentamente para trail mais longo
            }));
           
           return {
             ...meteor,
             x: newX,
             y: newY,
             trail: newTrail
           };
         }).filter(meteor => 
                   // Remover meteoros que saíram da tela
        meteor.y < window.innerHeight + 150 && meteor.x < window.innerWidth + 150
         )
       );
     };
     
     const updateInterval = setInterval(updateMeteors, 50);
     
     return () => {
       clearInterval(meteorInterval);
       clearInterval(updateInterval);
     };
   }, [gameState.gameStarted]);
  
  // Hooks para perguntas de cada era
  const { questions: egyptQuestions } = useEraQuestions('egito-antigo', 1);
  const { questions: mesopotamiaQuestions } = useEraQuestions('mesopotamia', 1);
  const { questions: medievalQuestions } = useEraQuestions('medieval', 1);
  const { questions: digitalQuestions } = useEraQuestions('digital', 1);

  const initializeChests = useCallback(() => {
    const allQuestions = [
      { era: 'egito-antigo' as Era, questions: egyptQuestions },
      { era: 'mesopotamia' as Era, questions: mesopotamiaQuestions },
      { era: 'medieval' as Era, questions: medievalQuestions },
      { era: 'digital' as Era, questions: digitalQuestions }
    ];

    // Função para obter pergunta aleatória
    const getRandomQuestion = (questions: any[]) => {
      if (!questions || questions.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * questions.length);
      return questions[randomIndex];
    };

         // Posições possíveis para baús (em áreas totalmente livres do labirinto)
     const possiblePositions = [
       { x: 80, y: 80 },   // Área livre superior esquerda
       { x: 320, y: 80 },  // Área livre superior direita
       { x: 80, y: 320 },  // Área livre inferior esquerda
       { x: 320, y: 320 }, // Área livre inferior direita
       { x: 200, y: 80 },  // Centro superior (entre muros)
       { x: 200, y: 320 }, // Centro inferior (entre muros)
       { x: 80, y: 200 },  // Centro esquerdo (entre muros)
       { x: 320, y: 200 }  // Centro direito (entre muros)
     ];
    
         // Randomizar posições garantindo distância mínima entre baús
     const shuffledPositions = [...possiblePositions].sort(() => Math.random() - 0.5);
     
     // Randomizar posição do portal PRIMEIRO (em áreas totalmente livres)
     const portalPositions = [
       { x: 80, y: 80 },   // Área livre superior esquerda
       { x: 320, y: 80 },  // Área livre superior direita
       { x: 80, y: 320 },  // Área livre inferior esquerda
       { x: 320, y: 320 }, // Área livre inferior direita
       { x: 200, y: 80 },  // Centro superior (entre muros)
       { x: 200, y: 320 }, // Centro inferior (entre muros)
       { x: 80, y: 200 },  // Centro esquerdo (entre muros)
       { x: 320, y: 200 }  // Centro direito (entre muros)
     ];
     const randomPortal = portalPositions[Math.floor(Math.random() * portalPositions.length)];
     setPortalPosition(randomPortal);
     
     // Filtrar posições que não colidem com o portal
     const portalRange = 35; // Distância mínima do portal aumentada
     const validPositions = shuffledPositions.filter(pos => {
       const distance = Math.sqrt(
         Math.pow(pos.x - randomPortal.x, 2) + Math.pow(pos.y - randomPortal.y, 2)
       );
       return distance > portalRange;
     });
     
     // Selecionar posições válidas para baús
     const selectedPositions = [];
     
     for (let i = 0; i < validPositions.length && selectedPositions.length < 4; i++) {
       const pos = validPositions[i];
       const isTooClose = selectedPositions.some(selected => {
         const distance = Math.sqrt(
           Math.pow(pos.x - selected.x, 2) + Math.pow(pos.y - selected.y, 2)
         );
         return distance < 80; // Distância mínima de 80px entre baús
       });
       
       if (!isTooClose) {
         selectedPositions.push(pos);
       }
     }
     
     // Se não conseguir 4 posições, adicionar as restantes (que não colidem com portal)
     while (selectedPositions.length < 4 && validPositions.length > selectedPositions.length) {
       const remainingPos = validPositions.find(pos => 
         !selectedPositions.some(selected => 
           selected.x === pos.x && selected.y === pos.y
         )
       );
       if (remainingPos) {
         selectedPositions.push(remainingPos);
       } else {
         break;
       }
     }

     const newChests: Chest[] = [
       { id: 'c1', type: 'question', isOpen: false, position: selectedPositions[0], era: 'egito-antigo', question: getRandomQuestion(allQuestions[0].questions) },
       { id: 'c2', type: 'question', isOpen: false, position: selectedPositions[1], era: 'mesopotamia', question: getRandomQuestion(allQuestions[1].questions) },
       { id: 'c3', type: 'question', isOpen: false, position: selectedPositions[2], era: 'medieval', question: getRandomQuestion(allQuestions[2].questions) },
       { id: 'c4', type: 'question', isOpen: false, position: selectedPositions[3], era: 'digital', question: getRandomQuestion(allQuestions[3].questions) }
     ];
    setChests(newChests);
    
                             // 4 inimigos: posições em áreas livres do labirinto (evitando posição inicial do jogador)
        const newEnemies: Enemy[] = [
          { id: 'e1', x: 80, y: 80, direction: 0, speed: 1.5, lastUpdate: Date.now() },   // Área superior esquerda
          { id: 'e2', x: 320, y: 80, direction: 1, speed: 1.5, lastUpdate: Date.now() },  // Área superior direita
          { id: 'e3', x: 80, y: 320, direction: 2, speed: 1.5, lastUpdate: Date.now() },  // Área inferior esquerda (longe do jogador)
          { id: 'e4', x: 320, y: 320, direction: 3, speed: 1.5, lastUpdate: Date.now() }  // Área inferior direita
        ];
     console.log('👹 Inimigos criados:', newEnemies); // Debug
     setEnemies(newEnemies);
  }, [egyptQuestions, mesopotamiaQuestions, medievalQuestions, digitalQuestions]);

  const startGame = () => {
    initializeChests();
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      phase: 'exploring',
      timeLeft: currentEra.maxTime,
      lives: 10,
      chestsOpened: 0,
      keysCollected: 0,
      score: 0,
      playerPosition: { x: 50, y: 350 },
      currentQuestion: null,
      selectedAnswer: null,
      showExplanation: false,
      isInvulnerable: false,
      lastHitTime: 0
    }));
  };

  const quitGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: false,
      phase: 'exploring'
    }));
  };

  // Timer
  useEffect(() => {
    if (gameState.gameStarted && gameState.phase === 'exploring' && gameState.timeLeft > 0) {
      const timer = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            return { ...prev, timeLeft: 0, phase: 'defeat' };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState.phase, gameState.gameStarted, gameState.timeLeft]);

  // Game Over Conditions
  useEffect(() => {
    if (gameState.lives <= 0 && gameState.phase === 'exploring') {
      setGameState(prev => ({ ...prev, phase: 'defeat' }));
    }
  }, [gameState.lives, gameState.phase]);

  // Invulnerability timer
  useEffect(() => {
    if (gameState.isInvulnerable) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, isInvulnerable: false }));
      }, 2000); // 2 segundos de invencibilidade
      
      return () => clearTimeout(timer);
    }
  }, [gameState.isInvulnerable]);

  // Keyboard Controls
  useEffect(() => {
    if (!gameState.gameStarted || gameState.phase !== 'exploring') return;

    // Labirinto complexo com muitos blocos
    const walls = [
      // Paredes externas
      { x: 0, y: 0, width: 400, height: 20 },
      { x: 0, y: 380, width: 400, height: 20 },
      { x: 0, y: 0, width: 20, height: 400 },
      { x: 380, y: 0, width: 20, height: 400 },
      
            // Labirinto mais espaçoso - removidos alguns muros para melhor navegação
      { x: 100, y: 100, width: 40, height: 10 },  // Pequeno horizontal
      { x: 80, y: 180, width: 30, height: 10 },   // Pequeno horizontal
      { x: 70, y: 260, width: 35, height: 10 }   // Pequeno horizontal
      
      // Portal de saída será posicionado dinamicamente (removido daqui)
    ];

    const isCollision = (x: number, y: number) => {
      // Aumentar margem de segurança para evitar colisões injustas
      if (x < 30 || x > 370 || y < 30 || y > 370) return true;
      return walls.some(wall =>
        x + 20 > wall.x && x - 20 < wall.x + wall.width &&
        y + 20 > wall.y && y - 20 < wall.y + wall.height
      );
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (['w', 'a', 's', 'd'].includes(key)) {
        setGameState(prev => {
          const speed = isMobile ? 8 : 6;
          let newX = prev.playerPosition.x;
          let newY = prev.playerPosition.y;

          switch (key) {
            case 'w': newY -= speed; break;
            case 's': newY += speed; break;
            case 'a': newX -= speed; break;
            case 'd': newX += speed; break;
          }

          if (isCollision(newX, newY)) return prev;

                     // Verificar se chegou no portal de saída (área 40x40 centrada na posição do portal)
           const portalRange = 25; // Raio do portal aumentado para facilitar ainda mais
           const isNearPortal = newX >= portalPosition.x - portalRange && newX <= portalPosition.x + portalRange && 
                               newY >= portalPosition.y - portalRange && newY <= portalPosition.y + portalRange;
           
           if (isNearPortal && prev.keysCollected >= 3) {
             
             console.log('🚪 Portal alcançado! Chaves:', prev.keysCollected, 'Fase:', prev.phase, 'Posição jogador:', newX, newY, 'Portal:', portalPosition.x, portalPosition.y);
             
             // Calcular créditos baseado nas chaves coletadas (performance)
             const questionsCorrect = prev.keysCollected; // 4 máximo
             const totalQuestions = 4; // 4 baús total
             const accuracyPercentage = (questionsCorrect / totalQuestions) * 100;
             
             // Obter plano do usuário e integrar com sistema de créditos
             const userPlan = getUserPlan();
             handleNewBattleCredits({
               battleType: 'training',
               questionsCorrect,
               questionsTotal: totalQuestions,
               accuracyPercentage,
               eraSlug: 'digital',
               usedExtraLife: false,
               planType: userPlan
             });
             
                         // Forçar mudança para fase de vitória
            console.log('🏆 Mudando para fase de vitória!');
            
            // Auto-navegar após 3 segundos para não travar
            setTimeout(() => {
              const nextRoute = getNextEra(era as Era);
              console.log('🚀 Auto-navegando para:', nextRoute);
              navigate(nextRoute);
            }, 3000);
            
            return { ...prev, phase: 'victory', score: prev.score + 300 }; // Ajustado para alinhar com sistema PvP
           }

          return {
            ...prev,
            playerPosition: { x: newX, y: newY }
          };
        });
      }

      if (key === 'e') {
        const nearChest = chests.find(chest => {
          const distance = Math.sqrt(
            Math.pow(chest.position.x - gameState.playerPosition.x, 2) +
            Math.pow(chest.position.y - gameState.playerPosition.y, 2)
          );
          return distance < 30 && !chest.isOpen;
        });
        
        if (nearChest && nearChest.question) {
          setGameState(prev => ({
            ...prev,
            phase: 'question',
            currentQuestion: nearChest.question,
            selectedAnswer: null,
            showExplanation: false
          }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameStarted, gameState.phase, gameState.playerPosition, chests, isMobile]);

     // Lógica dos inimigos estilo Pac-Man
   useEffect(() => {
     if (!gameState.gameStarted || gameState.phase !== 'exploring') return;
     
     console.log('🎮 Inimigos ativos:', enemies.length); // Debug
    
    // Todas as paredes do labirinto
    const allWalls = [
      // Paredes externas
      { x: 0, y: 0, width: 400, height: 20 },
      { x: 0, y: 380, width: 400, height: 20 },
      { x: 0, y: 0, width: 20, height: 400 },
      { x: 380, y: 0, width: 20, height: 400 },
      
      // Labirinto com muros variados para melhor estrutura
      { x: 100, y: 100, width: 40, height: 10 },  // Horizontal superior
      { x: 80, y: 180, width: 30, height: 10 },   // Horizontal central
      { x: 70, y: 260, width: 35, height: 10 },   // Horizontal inferior
      
      // NOVOS MUROS ADICIONADOS
      { x: 150, y: 120, width: 10, height: 40 },  // Vertical esquerdo
      { x: 250, y: 140, width: 10, height: 35 },  // Vertical direito
      { x: 180, y: 200, width: 45, height: 10 },  // Horizontal largo
      { x: 120, y: 300, width: 10, height: 30 },  // Vertical baixo
      { x: 280, y: 280, width: 25, height: 10 }   // Horizontal pequeno
    ];
    
         const isCollisionEnemy = (x: number, y: number) => {
       // Bordas externas com margem adequada
       if (x < 25 || x > 375 || y < 25 || y > 375) return true;
       
       // Verificar colisão com TODAS as paredes (incluindo externas)
       return allWalls.some(wall =>
         x + 8 > wall.x && x - 8 < wall.x + wall.width &&
         y + 8 > wall.y && y - 8 < wall.y + wall.height
       );
     };
    
         const updateEnemies = () => {
       console.log('🔄 Atualizando inimigos...'); // Debug
       setEnemies(prevEnemies => 
         prevEnemies.map(enemy => {
           const now = Date.now();
           const deltaTime = now - enemy.lastUpdate;
          
                     // Movimento linear simples (não persegue o player)  
           const speed = enemy.speed * 0.9; // Velocidade aumentada para 90% (25% mais rápido que antes)
          
          // Direções: 0=cima, 1=baixo, 2=esquerda, 3=direita
          const directions = [
            { x: 0, y: -speed }, // Cima
            { x: 0, y: speed },  // Baixo  
            { x: -speed, y: 0 }, // Esquerda
            { x: speed, y: 0 }   // Direita
          ];
          
          // Usar direção atual do inimigo (0, 1, 2 ou 3)
          const currentDir = enemy.direction % 4;
          const move = directions[currentDir];
          
          // Tentar mover na direção atual
          let newX = enemy.x + move.x;
          let newY = enemy.y + move.y;
          let newDirection = enemy.direction;
          
                     // Se colidir com parede, variar direção aleatoriamente
           if (isCollisionEnemy(newX, newY)) {
             // Escolher nova direção aleatória (diferente da atual)
             const possibleDirections = [0, 1, 2, 3].filter(dir => dir !== currentDir);
             newDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
             
             // Aplicar nova direção
             const newMove = directions[newDirection % 4];
             newX = enemy.x + newMove.x;
             newY = enemy.y + newMove.y;
             
             // Se ainda colidir, tentar outras direções
             if (isCollisionEnemy(newX, newY)) {
               const remainingDirections = possibleDirections.filter(dir => dir !== newDirection);
               if (remainingDirections.length > 0) {
                 const backupDirection = remainingDirections[Math.floor(Math.random() * remainingDirections.length)];
                 const backupMove = directions[backupDirection % 4];
                 newX = enemy.x + backupMove.x;
                 newY = enemy.y + backupMove.y;
                 newDirection = backupDirection;
               }
             }
             
             // Se ainda colidir, manter posição atual
             if (isCollisionEnemy(newX, newY)) {
               newX = enemy.x;
               newY = enemy.y;
             }
           }
          
          // Verificar colisão com player
          const playerDistance = Math.sqrt(
            Math.pow(newX - gameState.playerPosition.x, 2) +
            Math.pow(newY - gameState.playerPosition.y, 2)
          );
          
          if (playerDistance < 25 && !gameState.isInvulnerable) { // Distância mais precisa para colisão
            const now = Date.now();
            setGameState(prev => ({ 
              ...prev, 
              lives: Math.max(0, prev.lives - 1),
              isInvulnerable: true,
              lastHitTime: now
            }));
          }
          
          return {
            ...enemy,
            x: newX,
            y: newY,
            direction: newDirection,
            lastUpdate: now
          };
        })
      );
    };

         const enemyInterval = setInterval(updateEnemies, 100); // 100ms = movimento mais lento e previsível
     return () => clearInterval(enemyInterval);
   }, [gameState.gameStarted, gameState.phase]); // Dependências corretas

  // Função para encontrar posição segura para baú (sem colisão com muros ou outros baús)
  const findSafePosition = (excludeChestId?: string) => {
         const walls = [
       // Paredes externas
       { x: 0, y: 0, width: 400, height: 20 },
       { x: 0, y: 380, width: 400, height: 20 },
       { x: 0, y: 0, width: 20, height: 400 },
       { x: 380, y: 0, width: 20, height: 400 },
       
               // Labirinto com muros variados para melhor estrutura
        { x: 100, y: 100, width: 40, height: 10 },
        { x: 80, y: 180, width: 30, height: 10 },
        { x: 70, y: 260, width: 35, height: 10 },
        
        // NOVOS MUROS ADICIONADOS
        { x: 150, y: 120, width: 10, height: 40 },
        { x: 250, y: 140, width: 10, height: 35 },
        { x: 180, y: 200, width: 45, height: 10 },
        { x: 120, y: 300, width: 10, height: 30 },
        { x: 280, y: 280, width: 25, height: 10 }
     ];

    const coconutTrees = [
      { x: 50, y: 50 },
      { x: 350, y: 50 },
      { x: 50, y: 350 },
      { x: 350, y: 350 },
      { x: 200, y: 200 }
    ];

    // Tentar 50 posições aleatórias
    for (let attempt = 0; attempt < 50; attempt++) {
      const x = Math.random() * 300 + 50; // Entre 50 e 350
      const y = Math.random() * 300 + 50; // Entre 50 e 350
      
      // Verificar se não colide com paredes
      const collidesWithWall = walls.some(wall =>
        x + 20 > wall.x && x - 20 < wall.x + wall.width &&
        y + 20 > wall.y && y - 20 < wall.y + wall.height
      );
      
      if (collidesWithWall) continue;
      
      // Verificar se não colide com árvores
      const collidesWithTree = coconutTrees.some(tree => {
        const distance = Math.sqrt(Math.pow(x - tree.x, 2) + Math.pow(y - tree.y, 2));
        return distance < 30; // Distância mínima de 30px das árvores
      });
      
      if (collidesWithTree) continue;
      
      // Verificar se não colide com outros baús (exceto o atual)
      const collidesWithOtherChest = chests.some(chest => {
        if (chest.id === excludeChestId) return false; // Ignorar o baú atual
        const distance = Math.sqrt(Math.pow(x - chest.position.x, 2) + Math.pow(y - chest.position.y, 2));
        return distance < 80; // Distância mínima de 80px entre baús
      });
      
      if (collidesWithOtherChest) continue;
      
                      // Verificar se não colide com o portal
                const portalRange = 35;
                const collidesWithPortal =
                  x >= portalPosition.x - portalRange && x <= portalPosition.y - portalRange &&
                  y >= portalPosition.y - portalRange && y <= portalPosition.y + portalRange;
      
      if (collidesWithPortal) continue;
      
      // Posição segura encontrada!
      return { x, y };
    }
    
    // Se não encontrar posição segura, retornar posição padrão
    return { x: 200, y: 200 };
  };

  const handleAnswer = (answerIndex: number) => {
    if (!gameState.currentQuestion) return;
    
    setGameState(prev => ({ ...prev, selectedAnswer: answerIndex, showExplanation: true }));
    
    const isCorrect = answerIndex === gameState.currentQuestion.correct;
    
    setTimeout(() => {
      if (isCorrect) {
                 // Resposta correta - ganhar chave e pontos
         setGameState(prev => ({
           ...prev,
           keysCollected: prev.keysCollected + 1,
           chestsOpened: prev.chestsOpened + 1,
           score: prev.score + 200, // Ajustado para alinhar com sistema PvP
          phase: 'exploring',
          currentQuestion: null,
          selectedAnswer: null,
          showExplanation: false
        }));
        
        // Marcar baú como aberto
        const currentChest = chests.find(chest => 
          chest.question && chest.question.id === gameState.currentQuestion.id
        );
        if (currentChest) {
          setChests(prev => prev.map(c => 
            c.id === currentChest.id ? { ...c, isOpen: true } : c
          ));
        }
      } else {
        // Resposta errada - perder vida E reposicionar baú
        setGameState(prev => ({
          ...prev,
          lives: Math.max(0, prev.lives - 1),
          phase: 'exploring',
          currentQuestion: null,
          selectedAnswer: null,
          showExplanation: false
        }));
        
        // Encontrar o baú atual e reposicioná-lo
        const currentChest = chests.find(chest => 
          chest.question && chest.question.id === gameState.currentQuestion.id
        );
        
        if (currentChest) {
          const newPosition = findSafePosition(currentChest.id);
          
          setChests(prev => prev.map(c => 
            c.id === currentChest.id 
              ? { ...c, position: newPosition }
              : c
          ));
        }
      }
    }, 1500); // Retorno mais rápido (1.5s ao invés de 3s)
  };



  // Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState.gameStarted) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Hero image is loaded from state

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
                           // 1. Fundo estilizado do labirinto (apenas o canvas do jogo)
         const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
         gradient.addColorStop(0, '#2F4F2F'); // Centro verde escuro
         gradient.addColorStop(0.4, '#4A7C59'); // Meio verde médio
         gradient.addColorStop(0.7, '#6B8E23'); // Meio claro verde oliva
         gradient.addColorStop(1, '#8FBC8F'); // Bordas verde claro (dark sea green)
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 2. Textura de areia e terra sobre o gradiente
        if (stoneFloorImage) {
          ctx.globalAlpha = 0.4; // Transparência para textura sutil
          ctx.drawImage(stoneFloorImage, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1.0; // Restaurar opacidade
        }
      
      

             // Draw maze walls with brick pattern and glow effect
       const walls = [
         // Paredes externas
         { x: 0, y: 0, width: 400, height: 20 },
         { x: 0, y: 380, width: 400, height: 20 },
         { x: 0, y: 0, width: 20, height: 400 },
         { x: 380, y: 0, width: 20, height: 400 },
         
                      // Labirinto com muros variados para melhor estrutura
      { x: 100, y: 100, width: 40, height: 10 },  // Horizontal superior
      { x: 80, y: 180, width: 30, height: 10 },   // Horizontal central
      { x: 70, y: 260, width: 35, height: 10 },   // Horizontal inferior
      
      // NOVOS MUROS ADICIONADOS
      { x: 150, y: 120, width: 10, height: 40 },  // Vertical esquerdo
      { x: 250, y: 140, width: 10, height: 35 },  // Vertical direito
      { x: 180, y: 200, width: 45, height: 10 },  // Horizontal largo
      { x: 120, y: 300, width: 10, height: 30 },  // Vertical baixo
      { x: 280, y: 280, width: 25, height: 10 }   // Horizontal pequeno
       ];

       // Animated light position for glow effect
       const time = Date.now() * 0.001; // Time in seconds
       const lightY = (Math.sin(time * 2) * 0.5 + 0.5) * 400; // Light moves up and down
       
               // Função para desenhar padrão de tijolos simples
        const drawBrickPattern = (x: number, y: number, width: number, height: number) => {
          const brickSize = 5; // Tamanho do tijolo 5x5
          
          // Cor base do tijolo
          ctx.fillStyle = '#8B4513'; // Saddle brown
          ctx.fillRect(x, y, width, height);
          
          // Listras horizontais (cortes horizontais)
          ctx.fillStyle = '#654321'; // Marrom mais escuro para as listras
          for (let row = 0; row < height; row += brickSize) {
            ctx.fillRect(x, y + row, width, 1); // Linha horizontal de 1px
          }
          
          // Listras verticais (cortes verticais) - alternadas para simular tijolos
          for (let col = 0; col < width; col += brickSize) {
            // Alternar posição para simular padrão de tijolos
            const offset = Math.floor((y / brickSize) % 2) * (brickSize / 2);
            const adjustedCol = col + offset;
            
            if (adjustedCol < width) {
              ctx.fillRect(x + adjustedCol, y, 1, height); // Linha vertical de 1px
            }
          }
        };

               // Desenhar muros internos (apenas padrão de tijolos, sem glow)
        walls.slice(4).forEach(wall => {
          const brickSize = 5; // Tamanho do tijolo 5x5
          
          // Cor base do tijolo
          ctx.fillStyle = '#8B4513'; // Saddle brown
          ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
          
          // Listras horizontais (cortes horizontais)
          ctx.fillStyle = '#654321'; // Marrom mais escuro para as listras
          for (let row = 0; row < wall.height; row += brickSize) {
            ctx.fillRect(wall.x, wall.y + row, wall.width, 1); // Linha horizontal de 1px
          }
          
          // Listras verticais (cortes verticais) - alternadas para simular tijolos
          for (let col = 0; col < wall.width; col += brickSize) {
            // Alternar posição para simular padrão de tijolos
            const offset = Math.floor((wall.y / brickSize) % 2) * (brickSize / 2);
            const adjustedCol = col + offset;
            
            if (adjustedCol < wall.width) {
              ctx.fillRect(wall.x + adjustedCol, wall.y, 1, wall.height); // Linha vertical de 1px
            }
          }
        });
        
        // Desenhar bordas externas com glow e efeitos especiais
        walls.slice(0, 4).forEach(wall => {
          drawBrickPattern(wall.x, wall.y, wall.width, wall.height);
        });

      // Draw exit portal
      if (gameState.keysCollected >= 3) {
        ctx.fillStyle = '#48bb78'; // Verde quando desbloqueado
      } else {
        ctx.fillStyle = '#e53e3e'; // Vermelho quando bloqueado
      }
      ctx.fillRect(portalPosition.x, portalPosition.y, 30, 30);
      ctx.fillStyle = '#1a202c';
      ctx.font = '20px Arial';
      ctx.fillText('🚪', portalPosition.x + 5, portalPosition.y + 20);

      // Draw chests
      chests.forEach(chest => {
        if (!chest.isOpen) {
          // Cores por era
          const eraColors = {
            'egito-antigo': '#ecc94b',
            'mesopotamia': '#ed8936', 
            'medieval': '#9f7aea',
            'digital': '#06b6d4'
          };
          
          ctx.fillStyle = eraColors[chest.era];
          ctx.fillRect(chest.position.x - 15, chest.position.y - 15, 30, 30);
          
          // Era icon
          const eraIcons = {
            'egito-antigo': '🏺',
            'mesopotamia': '🏛️',
            'medieval': '⚔️', 
            'digital': '🤖'
          };
          
          ctx.fillStyle = '#1a202c';
          ctx.font = '20px Arial';
          ctx.fillText(eraIcons[chest.era], chest.position.x - 10, chest.position.y + 5);
        }
      });

             // Draw enemies
       enemies.forEach(enemy => {
         ctx.fillStyle = '#e53e3e';
         ctx.beginPath();
         ctx.arc(enemy.x, enemy.y, 12, 0, Math.PI * 2);
         ctx.fill();
         
         ctx.fillStyle = '#1a202c';
         ctx.font = '16px Arial';
         ctx.fillText('👹', enemy.x - 8, enemy.y + 5);
       });

                               // Draw 5 coconut trees scattered around the map
         const coconutTrees = [
           { x: 50, y: 50 },   // Canto superior esquerdo
           { x: 350, y: 50 },  // Canto superior direito
           { x: 50, y: 350 },  // Canto inferior esquerdo
           { x: 350, y: 350 }, // Canto inferior direito
           { x: 200, y: 200 }  // Centro do labirinto
         ];

       // Função para desenhar coqueiro
       const drawCoconutTree = (x: number, y: number) => {
         // Tronco do coqueiro (marrom)
         ctx.fillStyle = '#8B4513'; // Saddle brown
         ctx.fillRect(x - 3, y + 8, 6, 12);
         
         // Folhas do coqueiro (verde)
         ctx.fillStyle = '#228B22'; // Forest green
         ctx.beginPath();
         ctx.arc(x, y, 8, 0, Math.PI * 2);
         ctx.fill();
         
         // Detalhes das folhas (verde mais claro)
         ctx.fillStyle = '#32CD32'; // Lime green
         ctx.beginPath();
         ctx.arc(x - 3, y - 2, 3, 0, Math.PI * 2);
         ctx.fill();
         ctx.beginPath();
         ctx.arc(x + 3, y - 2, 3, 0, Math.PI * 2);
         ctx.fill();
         ctx.beginPath();
         ctx.arc(x, y - 4, 2, 0, Math.PI * 2);
         ctx.fill();
         
         // Coco (marrom claro)
         ctx.fillStyle = '#D2691E'; // Chocolate
         ctx.beginPath();
         ctx.arc(x, y + 2, 2, 0, Math.PI * 2);
         ctx.fill();
       };

       // Desenhar todos os coqueiros
       coconutTrees.forEach(tree => {
         drawCoconutTree(tree.x, tree.y);
       });

       // Player is now rendered as HTML overlay, not in canvas
     };

         draw();
   }, [gameState, chests, enemies, currentEra, heroImage, stoneFloorImage]);



  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

           {/* Mobile controls removidos - usando touch direto */}

     return (
     <div className="min-h-screen bg-background relative overflow-hidden">
       <style>
         {`
           @keyframes blink {
             0%, 50% { opacity: 0.7; }
             51%, 100% { opacity: 1; }
           }
         `}
       </style>
      {/* Labyrinth Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/Labirint.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
             <div className="absolute inset-0 bg-black/35" />
       
       {/* Chuva de Meteoros */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden">
         {meteors.map(meteor => (
           <div key={meteor.id}>
             {/* Trail do meteoro */}
             {meteor.trail.map((trailPos, index) => (
               <div
                 key={`${meteor.id}-trail-${index}`}
                 className="absolute rounded-full"
                 style={{
                   left: trailPos.x,
                   top: trailPos.y,
                   width: meteor.size * (1 - index * 0.1),
                   height: meteor.size * (1 - index * 0.1),
                   backgroundColor: meteor.color,
                   opacity: trailPos.alpha,
                   boxShadow: `0 0 ${meteor.size * 2}px ${meteor.color}`,
                   filter: 'blur(1px)',
                   transform: 'translate(-50%, -50%)'
                 }}
               />
             ))}
             
             {/* Meteoro principal */}
             <div
               className="absolute rounded-full"
               style={{
                 left: meteor.x,
                 top: meteor.y,
                 width: meteor.size,
                 height: meteor.size,
                 backgroundColor: meteor.color,
                 boxShadow: `
                   0 0 ${meteor.size * 3}px ${meteor.color},
                   0 0 ${meteor.size * 6}px ${meteor.color}40,
                   0 0 ${meteor.size * 9}px ${meteor.color}20
                 `,
                 filter: 'blur(0.5px)',
                 transform: 'translate(-50%, -50%)'
               }}
             />
           </div>
         ))}
       </div>
       
       <ParticleBackground />
      
      <div className={`relative z-10 max-w-6xl mx-auto ${isMobile ? 'p-2' : 'p-6'}`}>
        {!gameState.gameStarted ? (
          // Start Screen
          <div className="text-center">
            <ActionButton 
              variant="battle" 
              icon={<ArrowLeft />}
              onClick={() => navigate('/app')}
              className="mb-6"
            >
              Voltar ao Menu
            </ActionButton>
            
                         <div className={`arena-card-epic text-center mb-6 ${isMobile ? 'p-4' : 'p-6'}`}>
               <div className={`${isMobile ? 'text-4xl mb-2' : 'text-5xl mb-3'}`}>🏛️</div>
               <h1 className={`text-epic font-bold mb-3 ${isMobile ? 'text-xl' : 'text-2xl'}`}>{currentEra.name}</h1>
               <p className={`text-muted-foreground mb-4 ${isMobile ? 'text-sm' : 'text-base'}`}>
                 Explore o labirinto, responda perguntas, colete chaves e escape pelo portal!
               </p>
               
               <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                 <div className="bg-card/50 p-2 rounded">
                   <Clock className={`mx-auto mb-1 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                   <p><strong>Tempo:</strong> {Math.floor(currentEra.maxTime / 60)} min</p>
                 </div>
                 <div className="bg-card/50 p-2 rounded">
                   <Heart className={`mx-auto mb-1 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                   <p><strong>Vidas:</strong> 10</p>
                 </div>
                 <div className="bg-card/50 p-2 rounded">
                   <Trophy className={`mx-auto mb-1 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                   <p><strong>Objetivo:</strong> 4 perguntas, 3+ chaves</p>
                 </div>
               </div>
               
               <ActionButton variant="epic" onClick={startGame} className={`${isMobile ? 'text-base px-6 py-3' : 'text-lg px-8 py-4'}`}>
                 🚀 Iniciar Aventura
               </ActionButton>
             </div>
            
                         <div className={`arena-card text-left ${isMobile ? 'p-3' : 'p-4'}`}>
               <h3 className={`font-bold mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>Como Jogar:</h3>
               <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                 <div>
                   <p><strong>WASD:</strong> Mover pelo labirinto</p>
                   <p><strong>E:</strong> Abrir baús próximos</p>
                 </div>
                 <div>
                   <p><strong>🏺 Egito:</strong> Pergunta de história</p>
                   <p><strong>🏛️ Mesopotâmia:</strong> Pergunta de ciência</p>
                   <p><strong>⚔️ Medieval:</strong> Pergunta de guerra</p>
                   <p><strong>🤖 Digital:</strong> Pergunta de tecnologia</p>
                   <p><strong>🚪 Portal:</strong> Precisa de 3 chaves para escapar</p>
                 </div>
               </div>
             </div>
          </div>
        ) : (
          // Game Screen
          <div>
                                                   <div className="flex justify-center items-center mb-4 gap-4" style={{ marginTop: '20px' }}>
                <ActionButton 
                  variant="battle" 
                  icon={<ArrowLeft />}
                  onClick={quitGame}
                  className={isMobile ? 'text-xs px-3 py-2' : ''}
                >
                  {isMobile ? '←' : 'Sair'}
                </ActionButton>
                
                <div className="arena-card p-3 flex items-center gap-2">
                  <Clock size={18} />
                  <span className="font-bold">{formatTime(gameState.timeLeft)}</span>
                </div>
                
                <div className="arena-card p-3 flex items-center gap-2">
                  <Heart size={18} className="text-destructive" />
                  <span className="font-bold">{gameState.lives}</span>
                </div>
                
                <div className="arena-card p-3 flex items-center gap-2">
                  <Trophy size={18} className="text-victory" />
                  <span className="font-bold">{gameState.score}</span>
                </div>
              </div>
            
                                                                                                                                                                                                                                                                  <div className="arena-card p-4" style={{ 
                                 transform: 'scale(0.6) translateY(40px)', 
                                 transformOrigin: 'center', 
                                 margin: isMobile ? '-165px auto -126px auto' : '-138px auto -126px auto', // Mobile: subir 20% (de -138px para -165px)
                                 backgroundColor: 'rgba(0, 0, 0, 0.33)', 
                                 width: isMobile ? '150%' : '130%', // Mobile: 150%, Web: 130%
                                 marginLeft: isMobile ? '-30%' : '-15%', // Mobile: -30% (15% mais à esquerda), Web: -15%
                                 marginRight: 'auto',
                                 boxShadow: '0 0 20px rgba(255, 0, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 0, 0, 0.1)',
                                 border: '2px solid rgba(255, 215, 0, 0.6)'
                               }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ 
                justifyContent: isMobile ? 'center' : 'start', 
                alignItems: isMobile ? 'center' : 'start' 
              }}>
                {/* Game Canvas */}
                <div className="lg:col-span-2">
                  <div style={{ 
                    position: 'relative', 
                    display: 'inline-block', 
                    width: isMobile ? '90%' : '80%', 
                    margin: '0 auto', 
                    textAlign: isMobile ? 'center' : 'left' 
                  }}>
                                         <canvas 
                       ref={canvasRef} 
                       width={400} 
                       height={400} 
                       className="w-full border-2 border-card-border rounded cursor-pointer"
                       style={{ 
                         touchAction: 'none', // Desabilitar gestos do navegador
                         userSelect: 'none'   // Prevenir seleção de texto
                       }}
                       onTouchStart={handleTouchStart}
                       onTouchMove={handleTouchMove}
                       onTouchEnd={handleTouchEnd}
                     />
                    
                                                              {/* Hero image overlay */}
                       <img
                         src="/heroi labirinto2.png"
                         alt="Herói do Labirinto"
                         style={{
                           position: 'absolute',
                           left: `${(gameState.playerPosition.x / 400) * 100}%`,
                           top: `${(gameState.playerPosition.y / 400) * 100}%`,
                           width: 35,
                           height: 35,
                           transform: 'translate(-50%, -50%)',
                           pointerEvents: 'none',
                           zIndex: 10,
                           filter: gameState.isInvulnerable 
                             ? 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.9)) brightness(1.5)' 
                             : 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
                           imageRendering: 'pixelated',
                           opacity: gameState.isInvulnerable ? 0.7 : 1,
                           animation: gameState.isInvulnerable ? 'blink 0.5s infinite' : 'none'
                         }}
                       />
                  </div>
                  
                                     {/* Mobile controls removidos - usando touch direto */}
                </div>
                
                                 {/* Status Panel & Rules - Movido para dentro do card principal */}
                <div className="space-y-4" style={{ 
                  textAlign: isMobile ? 'center' : 'left', 
                  padding: isMobile ? '0 10px' : '0' 
                }}>
                  {/* Status */}
                  <div>
                    <h3 className="font-bold mb-3 text-victory">Status</h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Chaves:</span>
                        <span className="font-bold">{gameState.keysCollected}/4</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Baús:</span>
                        <span className="font-bold">{gameState.chestsOpened}/{gameState.totalChests}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Portal:</span>
                        <span className="font-bold">{gameState.keysCollected >= 3 ? '🟢' : '🔴'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className={`text-muted-foreground mb-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>Progresso da Exploração</div>
                      <div className={`bg-muted rounded-full ${isMobile ? 'h-0.5' : 'h-1'}`}>
                        <div 
                          className={`bg-victory rounded-full transition-all duration-300 ${isMobile ? 'h-0.5' : 'h-1'}`}
                          style={{ width: `${(gameState.chestsOpened / gameState.totalChests) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Game Rules */}
                  <div>
                    <h3 className="font-bold mb-2 text-legendary">Como Jogar</h3>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-400">👆</span>
                        <span>Toque para mover</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">📦</span>
                        <span>Toque nos baús</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-red-400">👹</span>
                        <span>Evite inimigos</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-green-400">🗝️</span>
                        <span>3+ chaves</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-purple-400">🚪</span>
                        <span>Saia pelo portal</span>
                      </div>
                      
                      <div className="mt-2 p-2 bg-muted rounded text-center">
                        <div className="text-xs font-bold">Responda e escape!</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
                                                   {!isMobile && (
                <div className="mt-12 text-center text-sm text-muted-foreground">
                  <p>Use <strong>WASD</strong> para mover e <strong>E</strong> para interagir com baús</p>
                </div>
              )}
          </div>
        )}
        
        {/* Question Screen */}
        {gameState.phase === 'question' && gameState.currentQuestion && (
          <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="arena-card-epic p-6 max-w-2xl mx-4" style={{ transform: 'scale(0.6)', transformOrigin: 'center' }}>
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">
                  {gameState.currentQuestion.era === 'egito-antigo' && '🏺'}
                  {gameState.currentQuestion.era === 'mesopotamia' && '🏛️'}
                  {gameState.currentQuestion.era === 'medieval' && '⚔️'}
                  {gameState.currentQuestion.era === 'digital' && '🤖'}
                </div>
                <h2 className="text-xl font-bold text-epic mb-2">
                  {gameState.currentQuestion.era === 'egito-antigo' && 'Pergunta do Egito Antigo'}
                  {gameState.currentQuestion.era === 'mesopotamia' && 'Pergunta da Mesopotâmia'}
                  {gameState.currentQuestion.era === 'medieval' && 'Pergunta Medieval'}
                  {gameState.currentQuestion.era === 'digital' && 'Pergunta Digital'}
                </h2>
                <p className="text-lg mb-6">{gameState.currentQuestion.question}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3 mb-6">
                {gameState.currentQuestion.options.map((option: string, index: number) => (
                  <ActionButton
                    key={index}
                    variant={
                      gameState.selectedAnswer === index
                        ? gameState.showExplanation
                          ? index === gameState.currentQuestion.correct
                            ? 'victory'
                            : 'battle'
                          : 'epic'
                        : 'battle'
                    }
                    onClick={() => !gameState.showExplanation && handleAnswer(index)}
                    disabled={gameState.showExplanation}
                    className="text-left p-4"
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + index)})</span>
                    {option}
                  </ActionButton>
                ))}
              </div>
              
              {gameState.showExplanation && (
                <div className="arena-card p-4 bg-muted/50">
                  <h4 className="font-bold mb-2">
                    {gameState.selectedAnswer === gameState.currentQuestion.correct ? '✅ Correto!' : '❌ Incorreto!'}
                  </h4>
                  <p className="text-muted-foreground mb-2">{gameState.currentQuestion.explanation}</p>
                  {gameState.currentQuestion.source && (
                    <div className="mt-3 pt-3 border-t border-card-border/30">
                      <p className="text-xs text-muted-foreground/80 italic">
                        📚 Fonte: {gameState.currentQuestion.source}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Victory/Defeat Screens */}
        {(gameState.phase === 'victory' || gameState.phase === 'defeat') && (
          <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="arena-card-epic p-8 text-center max-w-md mx-4" style={{ transform: 'scale(0.6)', transformOrigin: 'center' }}>
              <div className="text-6xl mb-4">
                {gameState.phase === 'victory' ? '🏆' : '💀'}
              </div>
              
              <h2 className={`text-3xl font-bold mb-4 ${
                gameState.phase === 'victory' ? 'text-victory' : 'text-destructive'
              }`}>
                {gameState.phase === 'victory' ? 'Vitória!' : 'Derrota!'}
              </h2>
              
              {gameState.phase === 'victory' ? (
                <div className="text-muted-foreground mb-6">
                  <p className="mb-2">Você escapou do {currentEra.name}!</p>
                  <p className="text-2xl font-bold text-victory">
                    Pontuação Final: {gameState.score}
                  </p>
                  <p className="text-lg font-bold text-epic">
                    💰 Créditos Ganhos: {(() => {
                      const userPlan = getUserPlan();
                      const labyrinthCredits = calculateTrainingCredits(
                        userPlan,
                        era,
                        gameState.chestsOpened,
                        gameState.totalChests
                      );
                      return labyrinthCredits.creditsEarned.toFixed(1);
                    })()} créditos
                  </p>
                  {era !== 'digital' && (
                    <p className="text-sm text-epic mt-2">
                      🎯 Próximo desafio: {era === 'egito-antigo' ? 'Mesopotâmia' : 
                                         era === 'mesopotamia' ? 'Era Medieval' : 
                                         era === 'medieval' ? 'Era Digital' : ''}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground mb-6">
                  <p>
                                    {gameState.timeLeft <= 0 ? 'Tempo esgotado!' : 'Você foi derrotado pelos inimigos!'}
              </p>
              <p>Pontuação: {gameState.score}</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <ActionButton variant="epic" onClick={startGame} className="flex-1">
                  🔄 Tentar Novamente
                </ActionButton>
                {era !== 'digital' ? (
                  <ActionButton 
                    variant="victory" 
                    onClick={() => navigate(getNextEra(era as Era))} 
                    className="flex-1"
                  >
                    🚀 Próxima Era
                  </ActionButton>
                ) : (
                  <ActionButton variant="battle" onClick={() => navigate('/app')} className="flex-1">
                    🏆 Completar Jornada
                  </ActionButton>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Labyrinth;
