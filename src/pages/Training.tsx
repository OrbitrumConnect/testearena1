import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Target, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { ActionButton } from '@/components/arena/ActionButton';
import { ParticleBackground } from '@/components/ui/particles';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEraQuestions } from '@/hooks/useEraQuestions';
import { useBattleSave } from '@/hooks/useBattleSave';
import { useTrainingLimit } from '@/hooks/useTrainingLimit';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFreeLimit } from '@/hooks/useFreeLimit';
import { handleNewBattleCredits, getUserPlan } from '@/utils/creditsIntegration';
import BaseLayout from '@/components/BaseLayout';
// Função para calcular dano HP baseado no número de perguntas
const calculateHpDamage = (totalQuestions: number): number => {
  return Math.max(5, Math.floor(totalQuestions * 0.8));
};
import { calculateTrainingCredits } from '@/utils/creditsSystem';
import egyptArena from '@/assets/egypt-arena.png';

const Training = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gamePhase, setGamePhase] = useState<'start' | 'question' | 'result' | 'finished'>('start');
  const [showExplanation, setShowExplanation] = useState(false);
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [battleStartTime] = useState(Date.now());
  const [attackEffect, setAttackEffect] = useState<'player-attack' | 'enemy-attack' | null>(null);
  const [hitEffect, setHitEffect] = useState<'player' | 'enemy' | null>(null);
  const [rewards, setRewards] = useState({ xpEarned: 0, moneyEarned: 0, bonusApplied: false });

  // Usar o hook para buscar 5 perguntas aleatórias do Egito Antigo
  const { questions, loading, refetch, getCompletelyRandomQuestions } = useEraQuestions('egito-antigo', 5);
  
  // Hook para salvar dados da batalha
  const { saveBattleResult, saving } = useBattleSave();
  
    // Hook para controlar limite de treinamentos
const { canTrain, trainingCount, maxTrainings, remainingTrainings, incrementTrainingCount, resetTrainingCount } = useTrainingLimit();
  
  // Hook para controlar limite free (3 treinos sem pontos)
  const userType = 'free'; // TODO: pegar do perfil do usuário
  const { canTrainFree, incrementFreeTraining, getFreeTrainingInfo } = useFreeLimit(userType);
  const freeInfo = getFreeTrainingInfo();

  useEffect(() => {
    if (gamePhase === 'question' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'question') {
      handleAnswer(null);
    }
  }, [timeLeft, gamePhase]);

  // Effect para limpar o efeito de hit
  useEffect(() => {
    if (hitEffect) {
      const timer = setTimeout(() => setHitEffect(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [hitEffect]);

  const handleAnswer = (answerIndex: number | null) => {
    setSelectedAnswer(answerIndex);
    setGamePhase('result');
    setShowExplanation(true);
    
    // Calcular dano dinâmico baseado no número total de perguntas
    const damage = calculateHpDamage(questions.length);
    
    if (answerIndex === questions[currentQuestion]?.correct) {
      setScore(score + 1);
      // Bônus de tempo por resposta correta (+3s)
      setTimeLeft(prev => prev + 3);
      // Jogador acerta - Mostrar ataque do player e inimigo perde HP
      setAttackEffect('player-attack');
      // Ativar glow quando o raio chegar ao alvo (0.5s depois)
      setTimeout(() => setHitEffect('enemy'), 500);
      const enemyDamage = Math.round(damage * 1.05);
      setEnemyHp(prev => Math.max(0, prev - enemyDamage));
      
      // CALCULAR CRÉDITOS GANHOS (SISTEMA CORRETO)
      const userPlan = getUserPlan();
      const trainingCredits = calculateTrainingCredits(
        userPlan,
        'egito-antigo',
        score + 1,
        questions.length
      );
      console.log(`🎯 Treino: ${trainingCredits.creditsEarned} créditos ganhos!`);
    } else {
      // Jogador erra - Mostrar ataque do inimigo e player perde HP
      setAttackEffect('enemy-attack');
      // Ativar glow quando o raio chegar ao alvo (0.5s depois)
      setTimeout(() => setHitEffect('player'), 500);
      setPlayerHp(prev => Math.max(0, prev - damage));
    }

    // Limpar efeito após 4 segundos (para ver a animação completa de 3s)
    setTimeout(() => {
      setAttackEffect(null);
    }, 4000);
  };

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setGamePhase('question');
      setShowExplanation(false);
    } else {
      // Jogo terminou - salvar dados
      const battleDurationSeconds = Math.round((Date.now() - battleStartTime) / 1000);
      
      // Para usuários FREE: não ganham pontos/XP/créditos
      if (userType === 'free') {
        console.log('🆓 Usuário FREE: Treino concluído mas sem ganhos (apenas experiência)');
      } else {
        // Calcular recompensas usando novo sistema (apenas para usuários pagos)
        const userPlan = getUserPlan();
        const trainingCredits = calculateTrainingCredits(
          userPlan,
          'egito-antigo',
          score,
          questions.length
        );
        const rewards = {
          xpEarned: trainingCredits.xpEarned,
          moneyEarned: trainingCredits.creditsEarned / 100, // Converter para reais
          bonusApplied: trainingCredits.bonusApplied
        };
        
        await saveBattleResult({
          eraName: 'Egito Antigo',
          questionsTotal: questions.length,
          questionsCorrect: score,
          xpEarned: rewards.xpEarned,
          moneyEarned: rewards.moneyEarned,
          battleDurationSeconds: battleDurationSeconds,
        });

        // Novo Sistema de Créditos com Planos
        const accuracyPercentage = Math.round((score / questions.length) * 100);
        const creditsResult = handleNewBattleCredits({
          battleType: 'training',
          questionsCorrect: score,
          questionsTotal: questions.length,
          accuracyPercentage: accuracyPercentage,
          eraSlug: 'egito-antigo',
          usedExtraLife: false,
          planType: userPlan
        });
        
        console.log(`🎯 Treino concluído! ${creditsResult.message}`);
      }
      
      setGamePhase('finished');
    }
  };

  const startTraining = () => {
    // Verificar limite free primeiro
    if (userType === 'free' && !canTrainFree) {
      return; // Usuário free atingiu limite de 3 treinos
    }
    
    if (!canTrain) {
      return; // Não permitir iniciar se atingiu o limite geral
    }
    
    setGamePhase('question');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(60);
    setPlayerHp(100);
    setEnemyHp(100);
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    // Incrementar contadores
    incrementTrainingCount();
    if (userType === 'free') {
      incrementFreeTraining();
    }
  };

  const restartTraining = () => {
    if (!canTrain) {
      return; // Não permitir restart se atingiu o limite
    }
    
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(60);
    setGamePhase('question');
    setShowExplanation(false);
    setPlayerHp(100);
    setEnemyHp(100);
    // Buscar novas perguntas aleatórias
    refetch();
    
    // Incrementar contador de treinamentos
    incrementTrainingCount();
  };

  // Mostrar loading enquanto as perguntas carregam
  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center">
          <div className="arena-card-epic p-8">
            <div className="text-4xl mb-4">🏺</div>
            <h2 className="text-2xl font-montserrat font-bold text-epic mb-4">
              Carregando Desafios...
            </h2>
            <p className="text-muted-foreground">
              Preparando perguntas exclusivas do Egito Antigo
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tela inicial de treinamento
  if (gamePhase === 'start') {
    return (
      <BaseLayout>
        <div className="min-h-screen bg-background relative overflow-hidden">
          <ParticleBackground />
          
          <div className={`relative z-10 max-w-4xl mx-auto ${isMobile ? 'p-1 h-full overflow-y-auto' : 'p-6'}`}>
            <div className={`text-center ${isMobile ? 'mb-2' : 'mb-8'}`}>
              <ActionButton 
                variant="battle" 
                icon={<ArrowLeft />}
                onClick={() => navigate('/app')}
                className={isMobile ? 'mb-2 text-sm px-3 py-1' : 'mb-6'}
              >
                Voltar ao Menu
              </ActionButton>
            </div>

            <div className={`arena-card-epic text-center ${isMobile ? 'p-2' : 'p-4'}`}>
              <div className={`${isMobile ? 'text-2xl mb-1' : 'text-4xl mb-3'}`}>🏺</div>
              
              <h2 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-base mb-1' : 'text-2xl mb-2'}`}>
                Treinamento: Egito Antigo
              </h2>
              
              <p className={`text-muted-foreground ${isMobile ? 'text-xs mb-2' : 'text-base mb-4'}`}>
                Teste seus conhecimentos sobre a civilização egípcia e ganhe recompensas!
              </p>

              {/* Informações do limite de treinamento */}
              {userType === 'free' ? (
                <div className={`arena-card border-epic/30 ${isMobile ? 'p-1.5 mb-2' : 'p-3 mb-3'}`}>
                  <h3 className={`font-semibold text-epic ${isMobile ? 'text-xs mb-0.5' : 'text-sm mb-1'}`}>🆓 Modo FREE</h3>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Hoje: <span className="font-bold text-epic">{freeInfo.used}/{freeInfo.dailyLimit}</span>
                  </p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Restantes: <span className="font-bold text-victory">{freeInfo.remaining}</span>
                  </p>
                  <p className={`text-warning ${isMobile ? 'text-xs mt-1' : 'text-xs mt-2'}`}>
                    ⚠️ Gratuito: Não ganha XP/créditos
                  </p>
                  {!canTrainFree && (
                    <div className="mt-2 p-2 bg-warning/10 rounded border border-warning/20">
                      <p className="text-xs text-warning font-medium text-center">
                        ⏰ Limite diário atingido! Volte amanhã ou faça upgrade para modo PAGO
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="arena-card p-3 mb-3">
                  <h3 className="font-semibold mb-1 text-sm">📊 Limite Diário de Treinamento</h3>
                  <p className="text-sm text-muted-foreground">
                    Treinamentos realizados hoje: <span className="font-bold text-epic">{trainingCount}/{maxTrainings}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Treinamentos restantes: <span className="font-bold text-victory">{remainingTrainings}</span>
                  </p>
                </div>
              )}

              {/* Recompensas */}
              <div className={`arena-card ${isMobile ? 'p-1.5 mb-2' : 'p-3 mb-3'}`}>
                <h3 className={`font-semibold ${isMobile ? 'text-xs mb-0.5' : 'text-sm mb-1'}`}>💰 Recompensas</h3>
                <div className={`grid grid-cols-3 gap-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  <div className="text-center">
                    <p className={`text-epic font-bold ${isMobile ? 'text-xs' : ''}`}>🏆 90%+</p>
                    <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>0,5 créditos</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-victory font-bold ${isMobile ? 'text-xs' : ''}`}>✅ 70%+</p>
                    <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>0,5 créditos</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-warning font-bold ${isMobile ? 'text-xs' : ''}`}>📚 Base</p>
                    <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>0,5 créditos</p>
                  </div>
                </div>
              </div>

              {/* Alerta de limite atingido */}
              {!canTrain && (
                <Alert className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    ⚠️ Você atingiu o limite diário de {maxTrainings} treinamentos. 
                    Volte amanhã para continuar treinando!
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-4">
                <ActionButton 
                  variant="victory" 
                  icon={<Play />}
                  onClick={startTraining}
                  disabled={userType === 'free' ? !canTrainFree : !canTrain}
                  className="w-full"
                >
                  {userType === 'free' ? 
                    (canTrainFree ? '🆓 Iniciar Treino Gratuito' : 'Limite FREE Atingido') :
                    (canTrain ? 'Iniciar Treinamento' : 'Limite Atingido')
                  }
                </ActionButton>

                {trainingCount > 0 && (
                  <ActionButton 
                    variant="battle" 
                    icon={<Target />}
                    onClick={resetTrainingCount}
                    className="w-full"
                  >
                    🔄 Reset Contador (Teste)
                  </ActionButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    );
  }

  if (gamePhase === 'finished') {
    return (
      <BaseLayout>
        <div className="min-h-screen bg-background relative overflow-hidden">
          <ParticleBackground />
          
          <div className={`relative z-10 max-w-4xl mx-auto ${isMobile ? 'p-1 h-full overflow-y-auto' : 'p-6'}`}>
            <div className="text-center mb-8">
              <ActionButton 
                variant="battle" 
                icon={<ArrowLeft />}
                onClick={() => navigate('/app')}
                className="mb-6"
              >
                Voltar ao Menu
              </ActionButton>
            </div>

            <div className="arena-card-epic p-8 text-center">
              <div className="text-6xl mb-6">
                {score >= questions.length * 0.7 ? '🏆' : score >= questions.length * 0.5 ? '⚔️' : '📚'}
              </div>
              
              <h2 className="text-3xl font-montserrat font-bold text-epic mb-4">
                Treinamento Concluído!
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="arena-card p-4">
                  <h3 className="font-semibold mb-2">Pontuação</h3>
                  <p className="text-2xl font-bold text-victory">{score}/{questions.length}</p>
                </div>
                
                <div className="arena-card p-4">
                  <h3 className="font-semibold mb-2">Precisão</h3>
                  <p className="text-2xl font-bold text-epic">{Math.round((score/questions.length) * 100)}%</p>
                </div>
                
                <div className="arena-card p-4">
                  <h3 className="font-semibold mb-2">XP Ganho</h3>
                  <p className="text-2xl font-bold text-battle">+{rewards.xpEarned}</p>
                  {saving && <p className="text-sm text-epic animate-pulse">Salvando...</p>}
                  {!saving && <p className="text-sm text-victory">✅ Salvo!</p>}
                </div>

                <div className="arena-card p-4">
                  <h3 className="font-semibold mb-2">Recompensa</h3>
                  <p className="text-2xl font-bold text-victory">
                    +{calculateTrainingCredits(getUserPlan(), 'egito-antigo', score, questions.length).creditsEarned} créditos
                  </p>
                  <p className="text-xs text-muted-foreground">Contribuição diária</p>
                  {calculateTrainingCredits(getUserPlan(), 'egito-antigo', score, questions.length).bonusApplied && (
                    <p className="text-sm text-epic font-semibold">🏆 Bônus de Excelência!</p>
                  )}
                  {saving && <p className="text-sm text-epic animate-pulse">Salvando...</p>}
                  {!saving && <p className="text-sm text-victory">✅ Salvo!</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ActionButton 
                  variant="victory" 
                  onClick={restartTraining}
                  disabled={!canTrain}
                >
                  {canTrain ? '🔄 Treinar Novamente' : '❌ Limite Atingido'}
                </ActionButton>
                
                <ActionButton 
                  variant="epic" 
                  onClick={() => navigate('/labyrinth/egito-antigo')}
                  className={`bg-gradient-to-r from-epic to-victory ${isMobile ? 'transform -translate-y-[30%]' : ''}`}
                >
                  🏛️ Entrar no Labirinto do Egito
                </ActionButton>
                
                <ActionButton variant="battle" onClick={() => navigate('/app')}>
                  🏠 Voltar ao Menu
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    );
  }

  const question = questions[currentQuestion];

  return (
    <BaseLayout>
      <div className={`${isMobile ? 'h-screen overflow-hidden' : 'h-screen overflow-hidden'} bg-background relative`}>
        <div className={isMobile ? 'scale-[0.9] origin-center w-[111%] h-[111%]' : 'scale-[0.628] origin-top-left w-[159%] h-[159%]'}>
          <ParticleBackground />
          
          {/* Fundo Temático Egípcio Continuado */}
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-b from-epic/40 to-battle-dark/60" />
            <div className="absolute inset-0 opacity-40" style={isMobile ? {transform: 'translate(-5%, -10%) scale(1.2)'} : {}}>
              <div className="w-full h-full bg-cover bg-center" 
                   style={{ 
                     backgroundImage: `url(${egyptArena})`
                   }}>
              </div>
            </div>
            
            {/* Partículas douradas flutuantes - mais densas */}
            <div className="absolute inset-0">
              {Array.from({ length: 25 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-epic/70 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            {/* Efeitos de luz dinâmicos */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-20 w-32 h-32 bg-epic/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-16 w-40 h-40 bg-victory/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-10 w-24 h-24 bg-epic-bright/25 rounded-full blur-2xl animate-ping" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
          
          <div className={`relative z-10 max-w-4xl mx-auto ${isMobile ? 'p-1 h-screen overflow-y-auto w-full' : 'p-6'}`} style={isMobile ? {transform: 'translate(-4.5%, -5%)'} : {}}>
          {/* Header com navegação */}
          <div className={`${isMobile ? 'flex justify-between items-center mb-2 px-1' : 'flex items-center justify-between mb-8'}`}>
            <ActionButton 
              variant="battle" 
              icon={<ArrowLeft />}
              onClick={() => navigate('/app')}
              className={`backdrop-blur-sm bg-battle-dark/80 ${isMobile ? 'text-xs px-0.5 py-0.5 w-1/4' : ''}`}
            >
              {isMobile ? '←' : 'Voltar'}
            </ActionButton>
            
            <div className={`text-center arena-card-epic backdrop-blur-sm bg-card/80 ${isMobile ? 'px-1.5 py-0.5 flex-1 mx-1 w-4/5' : 'px-6 py-3'}`}>
              <h1 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-xs' : 'text-2xl'}`}>🏛️ BATALHA</h1>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs leading-none' : ''}`}>{currentQuestion + 1}/{questions.length}</p>
            </div>

            <div className={`text-right arena-card backdrop-blur-sm bg-card/80 ${isMobile ? 'px-1.5 py-0.5' : 'px-4 py-3'}`}>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs leading-none' : 'text-sm'}`}>Timer</p>
              <p className={`font-bold text-yellow-400 ${isMobile ? 'text-xs' : 'text-xl'}`}>{timeLeft}s</p>
            </div>
          </div>

          {/* Barra de Progresso Épica */}
          <div className={isMobile ? 'mb-1 mx-1' : 'mb-8'} style={isMobile ? {} : {marginTop: '5%'}}>
            <div className={`arena-card backdrop-blur-sm bg-card/80 ${isMobile ? 'p-1 scale-75 w-3/5 mx-auto' : 'p-4'}`}>
              <div className={`flex items-center justify-between ${isMobile ? 'mb-1' : 'mb-2'}`}>
                <span className={`font-semibold text-epic ${isMobile ? 'text-xs' : 'text-sm'}`}>Progresso</span>
                <span className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{Math.round(((currentQuestion) / questions.length) * 100)}%</span>
              </div>
              <div className="progress-epic relative">
                <div 
                  className="progress-epic-fill" 
                  style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                />
                {/* Pontos DENTRO da barra */}
                <div className={`absolute inset-0 flex items-center justify-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  <span className="text-white font-bold drop-shadow-lg">{score}/{currentQuestion + 1} pontos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arena de Combate Visual */}
          <div className={`relative ${isMobile ? 'mb-1 mx-1' : 'mb-4'}`}>
            <div className={`relative w-full flex items-center justify-between ${isMobile ? 'h-20 mb-1' : 'h-40 mb-6'}`}>
              {/* Jogador - Posição Esquerda */}
              <div className={`absolute text-center ${isMobile ? 'left-1 top-5' : 'left-[-15%] top-[60%]'}`}>
                <div className={`animate-bounce ${isMobile ? 'mb-0' : 'mb-0.5'} flex justify-center`} style={isMobile ? {} : {animationDuration: '3s'}}>
                  <img 
                    src="/hero-egypt.png" 
                    alt="Herói Egípcio" 
                    className={`${isMobile ? 'w-14 h-14' : 'w-56 h-56'} object-contain`}
                    style={{ 
                      filter: hitEffect === 'player' 
                        ? 'drop-shadow(0 0 20px rgba(255, 0, 0, 1)) drop-shadow(0 0 30px rgba(255, 0, 0, 0.8))' 
                        : 'drop-shadow(0 0 12px rgba(6, 182, 212, 1))'
                    }}
                  />
                </div>
                <div className={`arena-card backdrop-blur-sm bg-victory/20 ${isMobile ? 'p-0.5 min-w-12 scale-75' : 'p-2 min-w-28'}`}>
                  <h3 className={`font-montserrat font-bold text-victory ${isMobile ? 'text-xs' : 'text-sm'}`}>{isMobile ? 'VOCÊ' : 'VOCÊ'}</h3>
                  <div className={`progress-epic ${isMobile ? 'mt-0.5' : 'mt-2'}`}>
                    <div 
                      className={`bg-victory rounded-full transition-all duration-1000 ${isMobile ? 'h-1' : 'h-2'}`}
                      style={{ width: `${playerHp}%` }}
                    />
                  </div>
                  <p className={`font-semibold text-victory ${isMobile ? 'text-xs mt-0' : 'text-xs mt-1'}`}>{playerHp}</p>
                </div>
              </div>



              {/* Inimigo - Posição Direita */}
              <div className={`absolute text-center ${isMobile ? 'right-2 top-5' : 'right-[-15%] top-[37%]'}`}>
                <div className={`animate-bounce ${isMobile ? 'mb-0' : 'mb-0.5'} flex justify-center`} style={isMobile ? {} : {animationDuration: '3s'}}>
                  <img 
                    src="/enemy-egypt.png" 
                    alt="Inimigo Egípcio" 
                    className={`${isMobile ? 'w-14 h-14' : 'w-64 h-64'} object-contain`}
                    style={{ 
                      transform: 'scaleX(-1)',
                      filter: hitEffect === 'enemy' 
                        ? 'drop-shadow(0 0 20px rgba(255, 255, 0, 1)) drop-shadow(0 0 30px rgba(255, 255, 0, 0.8))' 
                        : 'drop-shadow(0 0 12px rgba(255, 140, 0, 1))'
                    }}
                  />
                </div>
                <div className={`arena-card backdrop-blur-sm bg-destructive/20 ${isMobile ? 'p-0.5 min-w-12 scale-75' : 'p-2 min-w-28'}`}>
                  <h3 className={`font-montserrat font-bold text-destructive ${isMobile ? 'text-xs' : 'text-sm'}`}>{isMobile ? 'ESFINGE' : 'ESFINGE SÁBIA'}</h3>
                  <div className={`progress-epic ${isMobile ? 'mt-0.5' : 'mt-2'}`}>
                    <div 
                      className={`bg-destructive rounded-full transition-all duration-1000 ${isMobile ? 'h-1' : 'h-2'}`}
                      style={{ width: `${enemyHp}%` }}
                    />
                  </div>
                  <p className={`font-semibold text-destructive ${isMobile ? 'text-xs mt-0' : 'text-xs mt-1'}`}>{enemyHp}</p>
                </div>
              </div>
            </div>

            {/* Efeito de Raio Apenas Durante Pergunta */}
            {!attackEffect && gamePhase === 'question' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="text-4xl animate-ping opacity-50">⚡</div>
            </div>
            )}

            {/* Fogo Viajando - ACERTO: Você → Inimigo */}
            {attackEffect === 'player-attack' && (
              <div className={`absolute pointer-events-none z-[9999] ${isMobile ? 'left-2 top-1/2 transform -translate-y-1/2' : 'left-[-15%] top-[95%]'}`}>
                <div 
                  className={`text-orange-500 ${isMobile ? 'text-2xl' : 'text-4xl'}`}
                  style={{
                    animation: 'fireFromPlayerToEnemy 3s ease-out forwards',
                    zIndex: 9999,
                    textShadow: isMobile ? 'none' : '0 0 10px #f97316, 0 0 20px #dc2626, 0 0 30px #fbbf24',
                    filter: isMobile ? 'none' : 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.8)) drop-shadow(0 0 15px rgba(220, 38, 38, 0.6))'
                  }}
                >
                  🔥💥
                </div>
              </div>
            )}

            {/* Fogo Viajando - ERRO: Inimigo → Você */}
            {attackEffect === 'enemy-attack' && (
              <div className={`absolute pointer-events-none z-[9999] ${isMobile ? 'right-2 top-1/2 transform -translate-y-1/2' : 'right-[-15%] top-[80%]'}`}>
                <div 
                  className={`text-red-500 ${isMobile ? 'text-2xl' : 'text-4xl'}`}
                  style={{
                    animation: 'fireFromEnemyToPlayer 3s ease-out forwards',
                    zIndex: 9999,
                    textShadow: isMobile ? 'none' : '0 0 10px #dc2626, 0 0 20px #b91c1c, 0 0 30px #fbbf24',
                    filter: isMobile ? 'none' : 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.8)) drop-shadow(0 0 15px rgba(185, 28, 28, 0.6))'
                  }}
                >
                  🔥💥
                </div>
              </div>
            )}

            {/* Adicionar CSS Keyframes */}
            <style>{`
              @keyframes fireFromPlayerToEnemy {
                0% {
                  transform: translateX(0px);
                  opacity: 1;
                  scale: 1;
                }
                25% {
                  transform: translateX(220px);
                  opacity: 0.9;
                  scale: 1.1;
                }
                50% {
                  transform: translateX(440px);
                  opacity: 0.8;
                  scale: 1.2;
                }
                75% {
                  transform: translateX(660px);
                  opacity: 0.7;
                  scale: 1.1;
                }
                100% {
                  transform: translateX(880px);
                  opacity: 0.5;
                  scale: 0.8;
                }
              }

              @keyframes fireFromEnemyToPlayer {
                0% {
                  transform: translateX(0px);
                  opacity: 1;
                  scale: 1;
                }
                25% {
                  transform: translateX(-220px);
                  opacity: 0.9;
                  scale: 1.1;
                }
                50% {
                  transform: translateX(-440px);
                  opacity: 0.8;
                  scale: 1.2;
                }
                75% {
                  transform: translateX(-660px);
                  opacity: 0.7;
                  scale: 1.1;
                }
                100% {
                  transform: translateX(-880px);
                  opacity: 0.5;
                  scale: 0.8;
                }
              }
            `}</style>
          </div>

          {/* Pergunta */}
          <div className={`arena-card-epic backdrop-blur-sm bg-epic/10 border border-epic ${isMobile ? 'p-1 mb-2 mx-1 w-9/10' : 'p-1 mb-2 mt-10 border-2 glow-epic scale-75'}`} style={isMobile ? {marginTop: '32%', width: '90%', marginLeft: 'auto', marginRight: 'auto', transform: 'scale(0.6)'} : {marginTop: '33%', width: '140%', marginLeft: '-20%', marginRight: '-20%'}}>
            <div className={`flex items-center justify-center ${isMobile ? 'mb-0.5' : 'mb-6'}`}>
              <div className={`inline-block bg-epic/30 rounded-full backdrop-blur-sm border border-epic ${isMobile ? 'px-1 py-0.5' : 'px-6 py-2'}`}>
                <span className={`text-epic font-bold uppercase tracking-wide ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  🧠 {question.category === 'history' ? 'História' : 
                   question.category === 'finance' ? 'Finanças' : 
                   question.category === 'technology' ? 'Tecnologia' : 'Futuro'}
                </span>
              </div>
            </div>

            <h2 className={`font-montserrat font-bold text-center text-foreground ${isMobile ? 'text-xs mb-0.5' : 'text-2xl mb-8'}`}>
              {question.question}
            </h2>

            <div className={`grid grid-cols-1 md:grid-cols-2 ${isMobile ? 'gap-1' : 'gap-4'}`}>
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => gamePhase === 'question' ? handleAnswer(index) : null}
                  disabled={gamePhase !== 'question'}
                  className={`rounded border transition-all text-left backdrop-blur-sm ${isMobile ? 'p-0.5 text-xs' : 'p-4 border-2 rounded-lg'} ${
                    gamePhase === 'question' 
                      ? 'border-border bg-card/80 hover:border-epic hover:bg-epic/20 hover:scale-105' 
                      : selectedAnswer === index
                        ? index === question.correct
                          ? 'border-victory bg-victory/30 text-victory scale-105'
                          : 'border-destructive bg-destructive/30 text-destructive'
                        : index === question.correct
                          ? 'border-victory bg-victory/30 text-victory scale-105'
                          : 'border-border bg-card/50 opacity-50'
                  }`}
                >
                  <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-3'}`}>
                    <div className={`rounded-full flex items-center justify-center font-bold ${isMobile ? 'w-4 h-4 text-xs' : 'w-8 h-8 text-sm'} ${
                      gamePhase === 'question' ? 'bg-muted text-muted-foreground' : 
                      index === question.correct ? 'bg-victory text-victory-foreground' :
                      selectedAnswer === index ? 'bg-destructive text-destructive-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {gamePhase === 'result' && index === question.correct ? 
                        <CheckCircle className={`${isMobile ? 'w-3 h-3' : 'w-5 h-5'}`} /> : 
                        String.fromCharCode(65 + index)
                      }
                    </div>
                    <span className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="mt-8 p-6 bg-background-soft/80 backdrop-blur-sm rounded-lg border border-card-border">
                <h4 className="font-semibold text-epic mb-3 flex items-center">
                  <div className="w-6 h-6 bg-epic rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs text-epic-foreground">!</span>
                  </div>
                  Explicação:
                </h4>
                <p className="text-muted-foreground">{question.explanation}</p>
                {question.source && (
                  <div className="mt-3 pt-3 border-t border-card-border/30">
                    <p className="text-xs text-muted-foreground/80 italic">
                      📚 Fonte: {question.source}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {gamePhase === 'result' && (
            <div className="text-center">
              <ActionButton 
                variant="epic" 
                onClick={nextQuestion}
                className="text-xl px-8 py-4 backdrop-blur-sm"
              >
                {currentQuestion < questions.length - 1 ? '⚡ Próxima Pergunta' : '🏆 Ver Resultado Final'}
              </ActionButton>
            </div>
          )}
        </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Training;