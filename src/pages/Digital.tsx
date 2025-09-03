import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Play, Target, AlertTriangle } from 'lucide-react';
import { ActionButton } from '@/components/arena/ActionButton';
import { ParticleBackground } from '@/components/ui/particles';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEraQuestions } from '@/hooks/useEraQuestions';
import { useBattleSave } from '@/hooks/useBattleSave';
import { useTrainingLimit } from '@/hooks/useTrainingLimit';
import { useFreeTrainingLimit } from '@/hooks/useFreeTrainingLimit';

import { useDailyCreditsLimit } from '@/hooks/useDailyCreditsLimit';
import { handleNewBattleCredits, getUserPlan } from '@/utils/creditsIntegration';
// Função para calcular dano HP baseado no número de perguntas
const calculateHpDamage = (totalQuestions: number): number => {
  return Math.max(5, Math.floor(totalQuestions * 0.8));
};
import { calculateTrainingCredits } from '@/utils/creditsSystem';

// CSS customizado para remover scroll no web
const digitalStyles = `
  @media (min-width: 768px) {
    .digital-container {
      overflow: hidden !important;
      transform: translate(-2%, -2%) !important;
    }
    .digital-question-card {
      margin-top: 5% !important;
      width: 85% !important;
      margin-left: 7.5% !important;
      margin-right: 7.5% !important;
      transform: none !important;
    }
  }
`;

const Digital = () => {
  // Vercel update trigger - Era Digital mobile layout fix
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gamePhase, setGamePhase] = useState<'start' | 'question' | 'result' | 'finished'>('start');
  const [showExplanation, setShowExplanation] = useState(false);
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [battleStartTime] = useState(Date.now());
  const [attackEffect, setAttackEffect] = useState<'player' | 'enemy' | null>(null);
  const [laserShots, setLaserShots] = useState<Array<{id: number, type: 'player' | 'enemy'}>>([]);
  const [hitEffect, setHitEffect] = useState<'player' | 'enemy' | null>(null);
  const [rewards, setRewards] = useState({ xpEarned: 0, moneyEarned: 0, bonusApplied: false });
  const [userHasSubscription, setUserHasSubscription] = useState(false);

  // Usar o hook para buscar 25 perguntas aleatórias da Era Digital
  const { questions, loading, refetch, getCompletelyRandomQuestions } = useEraQuestions('digital', 25);
  
  // Hook para salvar dados da batalha
  const { saveBattleResult, saving } = useBattleSave();
  
  // Hook para controlar limite de treinamentos (diferente para FREE e assinantes)
  const paidTrainingLimit = useTrainingLimit();
  const freeTrainingLimit = useFreeTrainingLimit('digital');
  
  // Usar o hook correto baseado no tipo de usuário
  const { canTrain, trainingCount, maxTrainings, remainingTrainings, incrementTrainingCount, resetTrainingCount } = 
    userHasSubscription ? paidTrainingLimit : freeTrainingLimit;
  
  // Hook para controlar limite diário de créditos (apenas para assinantes)
  const { creditsEarned, canEarnCredits, remainingCredits } = useDailyCreditsLimit();

  // Verificar se o usuário tem assinatura
  useEffect(() => {
    const subscription = localStorage.getItem('demo_new_subscription');
    setUserHasSubscription(!!subscription);
  }, []);

  useEffect(() => {
    if (gamePhase === 'question' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'question') {
      handleAnswer(null);
    }
  }, [timeLeft, gamePhase]);

  // Effect para limpar o efeito de ataque
  useEffect(() => {
    if (attackEffect) {
      const timer = setTimeout(() => setAttackEffect(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [attackEffect]);

  // Effect para limpar os tiros de laser
  useEffect(() => {
    if (laserShots.length > 0) {
      const timer = setTimeout(() => {
        setLaserShots([]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [laserShots]);

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
      // Jogador acerta - 3 tiros de laser do jogador para o inimigo
      const shots = Array.from({length: 3}, (_, i) => ({id: Date.now() + i, type: 'player' as const}));
      setLaserShots(shots);
      // Ativar glow quando os lasers chegarem ao alvo (0.5s depois)
      setTimeout(() => setHitEffect('enemy'), 500);
      // Jogador acerta - Inimigo perde HP (5% a mais de dano)
      const enemyDamage = Math.round(damage * 1.05);
      setEnemyHp(prev => Math.max(0, prev - enemyDamage));
      
      // CALCULAR CRÉDITOS GANHOS (SISTEMA CORRETO)
      const userPlan = getUserPlan();
      const trainingCredits = calculateTrainingCredits(
        userPlan,
        'digital',
        score + 1,
        questions.length
      );
      console.log(`💻 Digital: ${trainingCredits.creditsEarned} créditos ganhos!`);
    } else {
      // Jogador erra - 3 tiros de laser do inimigo para o jogador
      const shots = Array.from({length: 3}, (_, i) => ({id: Date.now() + i, type: 'enemy' as const}));
      setLaserShots(shots);
      // Ativar glow quando os lasers chegarem ao alvo (0.5s depois)
      setTimeout(() => setHitEffect('player'), 500);
      setPlayerHp(prev => Math.max(0, prev - damage));
    }
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
      
      // Verificar se o usuário tem assinatura
      if (userHasSubscription) {
        // Usuário com assinatura - calcular recompensas usando novo sistema
        const userPlan = getUserPlan();
        const trainingCredits = calculateTrainingCredits(
          userPlan,
          'digital',
          score,
          questions.length
        );
        const newRewards = {
          xpEarned: trainingCredits.xpEarned,
          moneyEarned: trainingCredits.creditsEarned / 100, // Converter para reais
          bonusApplied: trainingCredits.bonusApplied
        };
        setRewards(newRewards);
        
        await saveBattleResult({
          eraName: 'Era Digital',
          questionsTotal: questions.length,
          questionsCorrect: score,
          xpEarned: newRewards.xpEarned,
          moneyEarned: newRewards.moneyEarned,
          battleDurationSeconds: battleDurationSeconds,
        });

        // Novo Sistema de Créditos
        const accuracyPercentage = Math.round((score / questions.length) * 100);
        const creditsResult = handleNewBattleCredits({
          battleType: 'training',
          questionsCorrect: score,
          questionsTotal: questions.length,
          accuracyPercentage: accuracyPercentage,
          eraSlug: 'digital',
          usedExtraLife: false,
          planType: userPlan
        });
        
        console.log(`🎯 Treino Digital concluído! ${creditsResult.message}`);
      } else {
        // Usuário FREE - apenas visualização, sem recompensas
        const newRewards = {
          xpEarned: 0, // FREE não ganha XP
          moneyEarned: 0, // FREE não ganha créditos
          bonusApplied: false
        };
        setRewards(newRewards);
        
        // FREE não salva dados de batalha (apenas visualiza)
        console.log(`🎯 Treino Digital FREE concluído! Apenas visualização.`);
      }
      
      setGamePhase('finished');
    }
  };

  const startTraining = () => {
    if (!canTrain) {
      return; // Não permitir iniciar se atingiu o limite
    }
    
    // 🎲 RANDOMIZAÇÃO EXTRA: Cada treino terá perguntas diferentes!
    getCompletelyRandomQuestions();
    
    setGamePhase('question');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(60);
    setPlayerHp(100);
    setEnemyHp(100);
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    // Incrementar contador de treinamentos
    incrementTrainingCount();
  };

  const restartTraining = () => {
    if (!canTrain) {
      return; // Não permitir restart se atingiu o limite
    }
    
    // 🎲 RANDOMIZAÇÃO EXTRA: Cada restart terá perguntas diferentes!
    getCompletelyRandomQuestions();
    
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(60);
    setGamePhase('question');
    setShowExplanation(false);
    setPlayerHp(100);
    setEnemyHp(100);
    
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
            <div className="text-4xl mb-4">💻</div>
            <h2 className="text-2xl font-montserrat font-bold text-epic mb-4">
              Carregando Desafios...
            </h2>
            <p className="text-muted-foreground">
              Preparando perguntas exclusivas da Era Digital
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tela inicial de treinamento
  if (gamePhase === 'start') {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <ParticleBackground />
        
        <div className="relative z-10 max-w-4xl mx-auto p-1 h-full overflow-y-auto md:p-6">
          <div className="text-center mb-2 md:mb-8">
            <ActionButton 
              variant="battle" 
              icon={<ArrowLeft />}
              onClick={() => navigate('/app')}
              className="mb-2 text-sm px-3 py-1 md:mb-6"
            >
              Voltar ao Menu
            </ActionButton>
          </div>

          <div className="arena-card-epic text-center p-2 md:p-4">
            <div className="text-2xl mb-1 md:text-4xl md:mb-3">💻</div>
            
            <h2 className="font-montserrat font-bold text-epic text-base mb-1 md:text-2xl md:mb-2">
              Treinamento: Era Digital
            </h2>
            
            <p className="text-muted-foreground text-xs mb-2 md:text-base md:mb-4">
              Domine os conhecimentos da era digital e tecnológica!
            </p>

            {/* Informações do limite de treinamento */}
            <div className="arena-card p-1.5 mb-2 md:p-3 md:mb-3">
              <h3 className="font-semibold text-xs mb-0.5 md:text-sm md:mb-1">📊 Limite Diário</h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                Hoje: <span className="font-bold text-epic">{trainingCount}/{maxTrainings}</span>
              </p>
              <p className="text-muted-foreground text-xs md:text-sm">
                Restantes: <span className="font-bold text-victory">{remainingTrainings}</span>
              </p>
            </div>

            {/* Informações de recompensas */}
            <div className="arena-card p-1.5 mb-2 md:p-3 md:mb-3">
              <h3 className="font-semibold text-xs mb-0.5 md:text-sm md:mb-1">💰 Recompensas</h3>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="text-center">
                  <p className="text-epic font-bold text-xs">🏆 90%+</p>
                  <p className="text-muted-foreground text-xs">0,5 créditos</p>
                </div>
                <div className="text-center">
                  <p className="text-victory font-bold text-xs">✅ 70%+</p>
                  <p className="text-muted-foreground text-xs">0,5 créditos</p>
                </div>
                <div className="text-center">
                  <p className="text-warning font-bold text-xs">📚 Base</p>
                  <p className="text-muted-foreground text-xs">0,5 créditos</p>
                </div>
              </div>
            </div>

            {/* Informações do limite diário de créditos */}
            <div className="arena-card p-1.5 mb-2 md:p-3 md:mb-3">
              <h3 className="font-semibold text-xs mb-0.5 md:text-sm md:mb-1">🎯 Limite Diário de Créditos</h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                Hoje: <span className="font-bold text-epic">{creditsEarned.toFixed(1)}/22,5</span>
              </p>
              <p className="text-muted-foreground text-xs md:text-sm">
                Restantes: <span className={`font-bold ${canEarnCredits ? 'text-victory' : 'text-destructive'}`}>
                  {remainingCredits.toFixed(1)} créditos
                </span>
              </p>
              {!canEarnCredits && (
                <p className="text-xs text-destructive font-medium mt-1">
                  ⚠️ Limite diário de créditos atingido!
                </p>
              )}
            </div>

            {/* Alerta de limite atingido */}
            {!canTrain && (
              <Alert className="mb-3 p-2 md:mb-6">
                <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
                <AlertDescription className="text-xs">
                  {userHasSubscription ? (
                    `⚠️ Você atingiu o limite diário de ${maxTrainings} treinamentos. Volte amanhã para continuar treinando!`
                  ) : (
                    `⚠️ Você já treinou na Era Digital hoje! Volte amanhã ou treine em outra era.`
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2 md:gap-4">
              <ActionButton 
                variant="victory" 
                icon={<Play />}
                onClick={startTraining}
                disabled={!canTrain}
                className="w-full text-sm py-2"
              >
                {canTrain ? 'Iniciar Treinamento' : 'Limite Atingido'}
              </ActionButton>


            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'finished') {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <ParticleBackground />
        
        <div className="relative z-10 max-w-4xl mx-auto p-1 h-screen overflow-y-auto w-full md:p-6">
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
              {score >= questions.length * 0.7 ? '🚀' : score >= questions.length * 0.5 ? '💻' : '📱'}
            </div>
            
            <h2 className="text-3xl font-montserrat font-bold text-epic mb-4">
              Era Digital Dominada!
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
                {userHasSubscription ? (
                  <>
                    <p className="text-2xl font-bold text-battle">+{rewards.xpEarned}</p>
                    {saving && <p className="text-sm text-epic animate-pulse">Salvando...</p>}
                    {!saving && <p className="text-sm text-victory">✅ Salvo!</p>}
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-muted-foreground">0 XP</p>
                    <p className="text-sm text-muted-foreground">Modo FREE</p>
                  </>
                )}
              </div>

              <div className="arena-card p-4">
                <h3 className="font-semibold mb-2">Recompensa</h3>
                {userHasSubscription ? (
                  <>
                    <div className="text-2xl font-bold text-victory">
                      +{Math.round((rewards.moneyEarned || 0) * 100)} créditos
                    </div>
                    {rewards.bonusApplied && (
                      <p className="text-sm text-epic font-semibold">🏆 Bônus de Excelência +20%!</p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-muted-foreground">
                      Modo FREE
                    </div>
                    <p className="text-sm text-muted-foreground">
                      💰 Apenas visualização - Assine para ganhar!
                    </p>
                  </>
                )}
                {userHasSubscription && (
                  <>
                    {saving && <p className="text-sm text-epic animate-pulse">Salvando...</p>}
                    {!saving && <p className="text-sm text-victory">✅ Salvo!</p>}
                  </>
                )}
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
                onClick={() => navigate('/labyrinth/digital')}
                className="bg-gradient-to-r from-epic to-victory transform -translate-y-[30%] md:transform-none"
              >
                🏛️ Entrar no Labirinto Digital
              </ActionButton>
              
              <ActionButton variant="battle" onClick={() => navigate('/app')}>
                🏠 Voltar ao Menu
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

     // DEBUG: Log do estado atual
   console.log('🔍 DEBUG Digital.tsx:', {
     gamePhase,
     currentQuestion,
     questionsLength: questions.length,
     question: question,
     loading
   });

     return (
     <div className="h-screen overflow-hidden bg-background relative">
       <style>{digitalStyles}</style>
       <div className="scale-[0.75] origin-top-left w-[133%] h-[133%] md:scale-75 md:w-[133%] md:h-[133%]">
      {/* Fundo Temático Digital */}
      <div className="absolute inset-0 z-0" style={{transform: 'translate(-5%, -10%) scale(1.2)'}}>
        <img 
          src="/digital-background.png" 
          alt="Digital Background" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-300/30 to-blue-600/50" />
      </div>
      
      <ParticleBackground />
      
             <div className="relative z-10 max-w-4xl mx-auto p-1 h-screen overflow-y-auto w-full md:p-6 md:overflow-hidden digital-container" style={{transform: 'translate(-4.5%, -5%)'}}>
        {/* Header com navegação */}
        <div className="flex justify-between items-center mb-2 px-1 md:flex md:items-center md:justify-between md:mb-8">
          <ActionButton 
            variant="battle" 
            icon={<ArrowLeft />}
            onClick={() => navigate('/app')}
            className="backdrop-blur-sm bg-battle-dark/80 text-xs px-0.5 py-0.5 w-1/4 md:text-base md:px-3 md:py-2 md:w-auto"
          >
            ←
          </ActionButton>
          
          <div className="text-center arena-card-epic backdrop-blur-sm bg-card/80 px-1.5 py-0.5 flex-1 mx-1 w-4/5 md:px-6 md:py-3">
            <h1 className="font-montserrat font-bold text-epic text-xs md:text-2xl">💻 BATALHA</h1>
            <p className="text-muted-foreground text-xs leading-none md:text-base">{currentQuestion + 1}/{questions.length}</p>
          </div>

          <div className="text-right arena-card backdrop-blur-sm bg-card/80 px-1.5 py-0.5 md:px-4 md:py-3">
            <p className="text-muted-foreground text-xs leading-none md:text-sm">Timer</p>
            <p className="font-bold text-cyan-400 text-xs md:text-xl">{timeLeft}s</p>
          </div>
        </div>
        
                 {/* Barra de Progresso Épica */}
         <div className="mb-1 mx-1 md:mb-8" style={{marginTop: '20%'}}>
           <div className="arena-card backdrop-blur-sm bg-card/80 p-1 scale-75 w-3/5 mx-auto md:p-4 md:scale-100 md:w-auto">
             <div className="flex items-center justify-between mb-1 md:mb-2">
               <span className="font-semibold text-epic text-xs md:text-sm">Progresso</span>
               <span className="text-muted-foreground text-xs md:text-sm">{Math.round(((currentQuestion) / questions.length) * 100)}%</span>
             </div>
             <div className="progress-epic relative">
               <div 
                 className="progress-epic-fill" 
                 style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
               />
               {/* Pontos DENTRO da barra */}
               <div className="absolute inset-0 flex items-center justify-center text-xs md:text-sm">
                 <span className="text-white font-bold drop-shadow-lg">{score}/{currentQuestion + 1} pontos</span>
               </div>
             </div>
           </div>
         </div>

                 {/* Arena de Combate */}
         <div className="relative mb-1 mx-1 md:mb-4">
           <div className="relative w-full flex items-center justify-between h-20 mb-1 md:h-40 md:mb-6">
                           {/* Jogador - Posição Esquerda */}
              <div className="absolute left-1 text-center top-5 md:left-[-10%] md:top-[50%]">
             <div className="animate-bounce mb-0 flex justify-center md:mb-0.5" style={{animationDuration: '3s'}}>
               <img 
                 src="/guerreirodigital.png" 
                 alt="Guerreiro Digital" 
                 className="w-14 h-14 object-contain md:w-56 md:h-56"
                 style={{ 
                   filter: hitEffect === 'player' 
                     ? 'drop-shadow(0 0 20px rgba(255, 0, 0, 1)) drop-shadow(0 0 30px rgba(255, 0, 0, 0.8))' 
                     : 'drop-shadow(0 0 12px rgba(14, 165, 233, 1))'
                 }}
               />
             </div>
             <div className="arena-card backdrop-blur-sm bg-victory/20 p-0.5 min-w-12 scale-75 md:p-2 md:min-w-28 md:scale-100">
               <h3 className="font-montserrat font-bold text-victory text-xs md:text-sm">VOCÊ</h3>
               <div className="progress-epic mt-0.5 md:mt-2">
                 <div 
                   className="bg-victory rounded-full transition-all duration-1000 h-1 md:h-2"
                   style={{ width: `${playerHp}%` }}
                 />
               </div>
               <p className="font-semibold text-victory text-xs mt-0 md:text-xs md:mt-1">{playerHp}</p>
             </div>
             </div>

                           {/* Inimigo - Posição Direita */}
              <div className="absolute right-2 text-center top-5 md:right-[-10%] md:top-[45%]">
             <div className="mb-0 flex justify-center md:mb-0.5">
               <img 
                 src="/bossdigital.png" 
                 alt="Boss Digital" 
                 className="w-14 h-14 object-contain md:w-64 md:h-64"
                 style={{ 
                   filter: hitEffect === 'enemy' 
                     ? 'drop-shadow(0 0 20px rgba(255, 255, 0, 1)) drop-shadow(0 0 30px rgba(255, 255, 0, 0.8))' 
                     : 'drop-shadow(0 0 12px rgba(239, 68, 68, 1))'
                 }}
               />
             </div>
             <div className="arena-card backdrop-blur-sm bg-destructive/20 p-0.5 min-w-12 scale-75 md:p-2 md:min-w-28 md:scale-100">
               <h3 className="font-montserrat font-bold text-destructive text-xs md:text-sm">IA</h3>
               <div className="progress-epic mt-0.5 md:mt-2">
                 <div 
                   className="bg-destructive rounded-full transition-all duration-1000 h-1 md:h-2"
                   style={{ width: `${enemyHp}%` }}
                 />
               </div>
               <p className="font-semibold text-destructive text-xs mt-0 md:text-xs md:mt-1">{enemyHp}</p>
             </div>
             </div>
           </div>
         </div>

                     {/* Efeito de 3 Tiros de Laser Neon Laranja */}
           {laserShots.map((shot, index) => {
             // Tamanhos diferentes para cada laser (30% menores)
             const laserSizes = ['━━━', '━━', '━━━━'];
             const laserSize = laserSizes[index % 3];
             
             // Posições verticais diferentes com mais espaçamento
             const verticalPositions = [35, 40, 45]; // Mobile: nível dos heróis
             const verticalPos = verticalPositions[index % 3];
             
             return (
               <div 
                 key={shot.id}
                 className="absolute pointer-events-none text-xs md:text-lg"
                 style={{
                   left: shot.type === 'player' ? '12%' : 'auto',
                   right: shot.type === 'enemy' ? '12%' : 'auto',
                   top: `${verticalPos}%`,
                   transform: 'translateY(-50%)',
                   animation: `${shot.type === 'player' ? 'laser-travel-right' : 'laser-travel-left'} 1s ease-out forwards`,
                   animationDelay: `${index * 0.2}s`,
                   color: '#ff6b35',
                   textShadow: '0 0 10px #ff6b35, 0 0 20px #ff6b35, 0 0 30px #ff6b35',
                   filter: 'drop-shadow(0 0 8px #ff6b35)',
                   fontSize: index === 1 ? '0.85em' : index === 2 ? '0.65em' : '0.7em'
                 }}
               >
                 {laserSize}
               </div>
             );
           })}
        </div>

                 {/* Pergunta */}
         <div className="arena-card-epic backdrop-blur-sm bg-cyan-500/10 border border-cyan-500 digital-question-card p-1 mb-2 mx-1 w-9/10 md:p-6 md:mb-6 md:mt-5 md:border-2 md:glow-epic md:scale-100 md:w-4/5 md:mx-auto" style={{marginTop: '8%', width: '110%', marginLeft: '-5%', marginRight: '-5%', transform: 'scale(0.6)'}}>
           <div className="flex items-center justify-center mb-0.5 md:mb-6">
             <div className="inline-block bg-cyan-500/30 rounded-full backdrop-blur-sm border border-cyan-500 px-1 py-0.5 md:px-6 md:py-2">
               <span className="text-cyan-400 font-bold uppercase tracking-wide text-xs md:text-sm">
                 🤖 {question.category === 'history' ? 'História Digital' : 
                  question.category === 'finance' ? 'Fintech' : 
                  question.category === 'technology' ? 'Tecnologia' : 'Futuro'}
               </span>
             </div>
           </div>

           <h2 className="font-montserrat font-bold text-center text-foreground text-xs mb-0.5 md:text-2xl md:mb-8">
             {question.question}
           </h2>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4">
             {question.options.map((option, index) => (
               <button
                 key={index}
                 onClick={() => gamePhase === 'question' ? handleAnswer(index) : null}
                 disabled={gamePhase !== 'question'}
                 className={`rounded border transition-all text-left backdrop-blur-sm p-2 text-xs min-h-[44px] md:p-4 md:border-2 md:rounded-lg ${
                   gamePhase === 'question' 
                     ? 'border-border bg-card/80 hover:border-cyan-500 hover:bg-cyan-500/20 hover:scale-105' 
                     : selectedAnswer === index
                       ? index === question.correct
                         ? 'border-victory bg-victory/30 text-victory scale-105'
                         : 'border-destructive bg-destructive/30 text-destructive'
                       : index === question.correct
                         ? 'border-victory bg-victory/30 text-victory scale-105'
                         : 'border-border bg-card/50 opacity-50'
                 }`}
               >
                 <div className="flex items-center space-x-1 md:space-x-4">
                    <div className={`rounded-full flex items-center justify-center font-bold w-4 h-4 text-xs md:w-10 md:h-10 md:text-lg ${
                     gamePhase === 'question' ? 'bg-muted text-muted-foreground' : 
                     index === question.correct ? 'bg-victory text-victory-foreground' :
                     selectedAnswer === index ? 'bg-destructive text-destructive-foreground' :
                     'bg-muted text-muted-foreground'
                   }`}>
                     {gamePhase === 'result' && index === question.correct ? 
                       <CheckCircle className="w-6 h-6" /> : 
                       String.fromCharCode(65 + index)
                     }
                   </div>
                   <span className="font-semibold text-xs md:text-lg">{option}</span>
                 </div>
               </button>
             ))}
           </div>

          {showExplanation && (
            <div className="mt-8 p-6 bg-background-soft/80 backdrop-blur-sm rounded-lg border border-card-border">
              <h4 className="font-semibold text-cyan-400 mb-3 flex items-center">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs text-cyan-900">!</span>
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
          <div className="flex justify-center items-center mt-8 mb-8">
            <ActionButton 
              variant="epic" 
              onClick={nextQuestion}
              className="text-xl px-8 py-4 backdrop-blur-sm"
            >
              {currentQuestion < questions.length - 1 ? '⚡ Próxima Pergunta' : '🚀 Ver Resultado Final'}
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Digital;