import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Play, Target, AlertTriangle } from 'lucide-react';
import { ActionButton } from '@/components/arena/ActionButton';
import { ParticleBackground } from '@/components/ui/particles';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEraQuestions } from '@/hooks/useEraQuestions';
import { useBattleSave } from '@/hooks/useBattleSave';
import { useTrainingLimit } from '@/hooks/useTrainingLimit';
import { useIsMobile } from '@/hooks/use-mobile';
import { handleNewBattleCredits } from '@/utils/creditsIntegration';
import { calculateHpDamage, getTrainingRewards } from '@/utils/gameBalance';
import { getRewardDisplayValues } from '@/utils/rewardDisplay';

const Mesopotamia = () => {
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

  // Usar o hook para buscar 10 perguntas aleatórias da Mesopotâmia
  const { questions, loading, refetch } = useEraQuestions('mesopotamia', 10);
  
  // Hook para salvar dados da batalha
  const { saveBattleResult, saving } = useBattleSave();
  
  // Hook para controlar limite de treinamentos
  const { canTrain, trainingCount, maxTrainings, remainingTrainings, incrementTrainingCount, resetTrainingCount } = useTrainingLimit();

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
      // Jogador acerta - Inimigo perde HP (5% a mais de dano)
      const enemyDamage = Math.round(damage * 1.05);
      setEnemyHp(prev => Math.max(0, prev - enemyDamage));
      
      // Efeito de ataque: Herói → Enkidu
      setAttackEffect('player-attack');
      // Ativar glow quando a lança chegar ao alvo (0.5s depois)
      setTimeout(() => setHitEffect('enemy'), 500);
    } else {
      setPlayerHp(prev => Math.max(0, prev - damage));
      
      // Efeito de ataque: Enkidu → Herói
      setAttackEffect('enemy-attack');
      // Ativar glow quando a lança chegar ao alvo (0.5s depois)
      setTimeout(() => setHitEffect('player'), 500);
    }
    
    // Limpar efeito após animação
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
      
      // Calcular recompensas usando novo sistema
      const rewards = getTrainingRewards('mesopotamia', score, questions.length);
      
      await saveBattleResult({
        eraName: 'Mesopotâmia',
        questionsTotal: questions.length,
        questionsCorrect: score,
        xpEarned: rewards.xpEarned,
        moneyEarned: rewards.moneyEarned,
        battleDurationSeconds: battleDurationSeconds,
      });

      // Novo Sistema de Créditos
      const accuracyPercentage = Math.round((score / questions.length) * 100);
      const creditsResult = handleNewBattleCredits({
        battleType: 'training',
        questionsCorrect: score,
        questionsTotal: questions.length,
        accuracyPercentage: accuracyPercentage,
        eraSlug: 'mesopotamia',
        usedExtraLife: false
      });
      
      console.log(`🎯 Treino Mesopotâmia concluído! ${creditsResult.message}`);
      
      setGamePhase('finished');
    }
  };

  const startTraining = () => {
    if (!canTrain) {
      return; // Não permitir iniciar se atingiu o limite
    }
    
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
            <div className="text-4xl mb-4">🏛️</div>
            <h2 className="text-2xl font-montserrat font-bold text-epic mb-4">
              Carregando Desafios...
            </h2>
            <p className="text-muted-foreground">
              Preparando perguntas exclusivas da Mesopotâmia
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
            <div className={`${isMobile ? 'text-2xl mb-1' : 'text-4xl mb-3'}`}>🏛️</div>
            
            <h2 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-base mb-1' : 'text-2xl mb-2'}`}>
              Treinamento: Mesopotâmia
            </h2>
            
            <p className={`text-muted-foreground ${isMobile ? 'text-xs mb-2' : 'text-base mb-4'}`}>
              Explore os conhecimentos da antiga civilização mesopotâmica!
            </p>

            {/* Informações do limite de treinamento */}
            <div className={`arena-card ${isMobile ? 'p-1.5 mb-2' : 'p-3 mb-3'}`}>
              <h3 className={`font-semibold ${isMobile ? 'text-xs mb-0.5' : 'text-sm mb-1'}`}>📊 Limite Diário</h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Hoje: <span className="font-bold text-epic">{trainingCount}/{maxTrainings}</span>
              </p>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Restantes: <span className="font-bold text-victory">{remainingTrainings}</span>
              </p>
            </div>

            {/* Informações de recompensas */}
            <div className={`arena-card ${isMobile ? 'p-1.5 mb-2' : 'p-3 mb-3'}`}>
              <h3 className={`font-semibold ${isMobile ? 'text-xs mb-0.5' : 'text-sm mb-1'}`}>💰 Recompensas</h3>
              <div className={`grid grid-cols-3 gap-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                <div className="text-center">
                  <p className={`text-epic font-bold ${isMobile ? 'text-xs' : ''}`}>🏆 90%+</p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>6 créditos</p>
                </div>
                <div className="text-center">
                  <p className={`text-victory font-bold ${isMobile ? 'text-xs' : ''}`}>✅ 70%+</p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>5 créditos</p>
                </div>
                <div className="text-center">
                  <p className={`text-warning font-bold ${isMobile ? 'text-xs' : ''}`}>📚 Base</p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>3 créditos</p>
                </div>
              </div>
            </div>

            {/* Alerta de limite atingido */}
            {!canTrain && (
              <Alert className={isMobile ? 'mb-2 p-1.5' : 'mb-3 p-3'}>
                <AlertTriangle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                <AlertDescription className={isMobile ? 'text-xs' : 'text-sm'}>
                  ⚠️ Você atingiu o limite diário de {maxTrainings} treinamentos. 
                  Volte amanhã para continuar treinando!
                </AlertDescription>
              </Alert>
            )}

            <div className={`flex flex-col ${isMobile ? 'gap-1.5' : 'gap-3'}`}>
              <ActionButton 
                variant="victory" 
                icon={<Play />}
                onClick={startTraining}
                disabled={!canTrain}
                className={`w-full ${isMobile ? 'text-sm py-2' : ''}`}
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
              {score >= questions.length * 0.7 ? '🏆' : score >= questions.length * 0.5 ? '📜' : '📚'}
            </div>
            
            <h2 className="text-3xl font-montserrat font-bold text-epic mb-4">
              Mesopotâmia Dominada!
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
                <p className="text-2xl font-bold text-battle">+{getTrainingRewards('mesopotamia', score, questions.length).xpEarned}</p>
                {saving && <p className="text-sm text-epic animate-pulse">Salvando...</p>}
                {!saving && <p className="text-sm text-victory">✅ Salvo!</p>}
              </div>

              <div className="arena-card p-4">
                <h3 className="font-semibold mb-2">Recompensa</h3>
                <p className="text-2xl font-bold text-victory">
                  +{Math.round((getTrainingRewards('mesopotamia', score, questions.length).moneyEarned || 0) * 100)} créditos
                </p>
                {getTrainingRewards('mesopotamia', score, questions.length).bonusApplied && (
                  <p className="text-sm text-epic font-semibold">🏆 Bônus de Excelência +20%!</p>
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
                onClick={() => navigate('/medieval')}
                className="bg-gradient-to-r from-epic to-victory"
              >
                🚀 Próximo Nível: Medieval
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

  return (
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'h-screen overflow-hidden'} bg-background relative`}>
      <div className={isMobile ? 'scale-[0.9] origin-center w-[111%] h-[111%]' : 'scale-[0.628] origin-top-left w-[159%] h-[159%]'}>
      {/* Fundo Temático Mesopotâmia */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/mesopotamia-background.png" 
          alt="Mesopotamia Background" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 to-orange-900/50" />
      </div>
      
      <ParticleBackground />
      
      <div className={`relative z-10 max-w-4xl mx-auto ${isMobile ? 'p-1 h-full overflow-y-auto' : 'p-6'}`}>
        {/* Botão Voltar */}
        <div className={`${isMobile ? 'grid grid-cols-3 gap-1 mb-3' : 'flex items-center justify-between mb-8'}`}>
          <ActionButton 
            variant="battle" 
            icon={<ArrowLeft />}
            onClick={() => navigate('/app')}
            className={`backdrop-blur-sm bg-battle-dark/80 ${isMobile ? 'text-xs px-2 py-1' : ''}`}
          >
            {isMobile ? '←' : 'Voltar'}
          </ActionButton>
          
          <div className={`text-center arena-card-epic backdrop-blur-sm bg-card/80 ${isMobile ? 'px-2 py-1' : 'px-6 py-3'}`}>
            <h1 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-sm' : 'text-2xl'}`}>🏛️ BATALHA EM CURSO</h1>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>Mesopotâmia - {currentQuestion + 1}/{questions.length}</p>
          </div>

          <div className={`text-right arena-card backdrop-blur-sm bg-card/80 ${isMobile ? 'px-2 py-1' : 'px-4 py-3'}`}>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Pontos</p>
            <p className={`font-bold text-victory ${isMobile ? 'text-sm' : 'text-xl'}`}>{score}/{currentQuestion + 1}</p>
          </div>
        </div>
        
        {/* Barra de Progresso Épica - Padrão Egito */}
        <div className={isMobile ? 'mb-2 -mt-6' : 'mb-8'}>
          <div className={`arena-card backdrop-blur-sm bg-card/80 ${isMobile ? 'p-1 scale-75' : 'p-4'}`}>
            <div className={`flex items-center justify-between ${isMobile ? 'mb-1' : 'mb-2'}`}>
              <span className={`font-semibold text-epic ${isMobile ? 'text-xs' : 'text-sm'}`}>Progresso</span>
              
              {/* Timer Integrado */}
              <div className="flex items-center space-x-2">
                <div 
                  className={`${isMobile ? 'text-sm' : 'text-lg'}`}
                  style={{ 
                    filter: 'drop-shadow(0 0 6px rgba(255, 193, 7, 1))'
                  }}
                >⏳</div>
                <div 
                  className={`font-bold ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-yellow-400'} ${isMobile ? 'text-xs' : 'text-sm'}`}
                  style={{ 
                    filter: 'drop-shadow(0 0 4px rgba(255, 193, 7, 0.8))'
                  }}
                >
                  {timeLeft}s
                </div>
              </div>
              
              <span className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{Math.round(((currentQuestion) / questions.length) * 100)}%</span>
            </div>
            <div className="progress-epic">
              <div 
                className="progress-epic-fill" 
                style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Arena de Combate */}
        <div className={`relative ${isMobile ? 'mb-1' : 'mb-4'}`}>
          <div className={`relative w-full flex items-center justify-between ${isMobile ? 'h-20 mb-1' : 'h-40 mb-6'}`}>
            {/* Jogador - Posição Esquerda (origem do fogo) */}
            <div className="absolute left-2 text-center">
              <div className={`animate-bounce ${isMobile ? 'mb-0' : 'mb-0.5'} flex justify-center`}>
                <img 
                  src="/hero-mesopotamia.png" 
                  alt="Herói Mesopotâmia" 
                  className={`${isMobile ? 'w-8 h-8' : 'w-24 h-24'} object-contain`}
                  style={{ 
                    filter: hitEffect === 'player' 
                      ? 'drop-shadow(0 0 20px rgba(255, 0, 0, 1)) drop-shadow(0 0 30px rgba(255, 0, 0, 0.8))' 
                      : 'drop-shadow(0 0 12px rgba(6, 182, 212, 1))'
                  }}
                />
              </div>
              <div className={`arena-card backdrop-blur-sm bg-victory/20 ${isMobile ? 'p-0.5 min-w-12 scale-75' : 'p-3 min-w-32'}`}>
                <h3 className={`font-montserrat font-bold text-victory ${isMobile ? 'text-xs' : 'text-sm'}`}>{isMobile ? 'YOU' : 'VOCÊ'}</h3>
                <div className={`progress-epic ${isMobile ? 'mt-0' : 'mt-2'}`}>
                  <div 
                    className={`bg-victory rounded-full transition-all duration-1000 ${isMobile ? 'h-0.5' : 'h-2'}`} 
                    style={{ width: `${playerHp}%` }}
                  />
                </div>
                <p className={`font-semibold text-victory ${isMobile ? 'text-xs mt-0' : 'text-xs mt-1'}`}>{playerHp}</p>
              </div>
            </div>



            {/* Inimigo - Posição Direita (origem do fogo) */}
            <div className="absolute right-2 text-center">
              <div className={`animate-pulse ${isMobile ? 'mb-0' : 'mb-0.5'} flex justify-center`}>
                <img 
                  src="/enkidu-mesopotamia.png" 
                  alt="Enkidu Mesopotâmia" 
                  className={`${isMobile ? 'w-10 h-10' : 'w-28 h-28'} object-contain`}
                  style={{ 
                    filter: hitEffect === 'enemy' 
                      ? 'drop-shadow(0 0 20px rgba(255, 255, 0, 1)) drop-shadow(0 0 30px rgba(255, 255, 0, 0.8))' 
                      : 'drop-shadow(0 0 12px rgba(184, 134, 11, 1))'
                  }}
                />
              </div>
              <div className={`arena-card backdrop-blur-sm bg-destructive/20 ${isMobile ? 'p-0.5 min-w-12 scale-75' : 'p-3 min-w-32'}`}>
                <h3 className={`font-montserrat font-bold text-destructive ${isMobile ? 'text-xs' : 'text-sm'}`}>{isMobile ? 'ENKIDU' : 'ENKIDU SÁBIO'}</h3>
                <div className={`progress-epic ${isMobile ? 'mt-0' : 'mt-2'}`}>
                  <div 
                    className={`bg-destructive rounded-full transition-all duration-1000 ${isMobile ? 'h-0.5' : 'h-2'}`} 
                    style={{ width: `${enemyHp}%` }}
                  />
                </div>
                <p className={`font-semibold text-destructive ${isMobile ? 'text-xs mt-0' : 'text-xs mt-1'}`}>{enemyHp}</p>
              </div>
            </div>
          </div>

          {/* Lança Viajando - ACERTO: Herói → Enkidu */}
          {attackEffect === 'player-attack' && (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none z-[9999]">
              <div 
                className="text-2xl text-yellow-600"
                style={{
                  animation: 'spearFromPlayerToEnemy 3s ease-out forwards',
                  zIndex: 9999
                }}
              >
                🏹
              </div>
            </div>
          )}

          {/* Lança Viajando - ERRO: Enkidu → Herói */}
          {attackEffect === 'enemy-attack' && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none z-[9999]">
              <div 
                className="text-2xl text-amber-700"
                style={{
                  animation: 'spearFromEnemyToPlayer 3s ease-out forwards',
                  zIndex: 9999
                }}
              >
                🏹
              </div>
            </div>
          )}

          {/* CSS Keyframes para Lanças */}
          <style>{`
            @keyframes spearFromPlayerToEnemy {
              0% {
                transform: translateX(0px) rotate(0deg);
                opacity: 1;
                scale: 1;
              }
              25% {
                transform: translateX(195px) rotate(15deg);
                opacity: 0.9;
                scale: 1.1;
              }
              50% {
                transform: translateX(390px) rotate(30deg);
                opacity: 0.8;
                scale: 1.2;
              }
              75% {
                transform: translateX(585px) rotate(45deg);
                opacity: 0.7;
                scale: 1.1;
              }
              100% {
                transform: translateX(780px) rotate(60deg);
                opacity: 0;
                scale: 0.8;
              }
            }

            @keyframes spearFromEnemyToPlayer {
              0% {
                transform: translateX(0px) rotate(180deg);
                opacity: 1;
                scale: 1;
              }
              25% {
                transform: translateX(-195px) rotate(165deg);
                opacity: 0.9;
                scale: 1.1;
              }
              50% {
                transform: translateX(-390px) rotate(150deg);
                opacity: 0.8;
                scale: 1.2;
              }
              75% {
                transform: translateX(-585px) rotate(135deg);
                opacity: 0.7;
                scale: 1.1;
              }
              100% {
                transform: translateX(-780px) rotate(120deg);
                opacity: 0;
                scale: 0.8;
              }
            }
          `}</style>
        </div>

        {/* Pergunta - Responsiva como Medieval */}
        <div className={`arena-card-epic backdrop-blur-sm bg-amber-500/10 border border-amber-500 ${isMobile ? 'p-1 mb-1 mt-8 scale-26' : 'p-2 mb-2 mt-10 border-2 glow-epic scale-56'}`}>
          <div className={`flex items-center justify-center ${isMobile ? 'mb-1' : 'mb-6'}`}>
            <div className={`inline-block bg-amber-500/30 rounded-full backdrop-blur-sm border border-amber-500 ${isMobile ? 'px-1 py-0.5' : 'px-6 py-2'}`}>
              <span className={`text-amber-400 font-bold uppercase tracking-wide ${isMobile ? 'text-xs' : 'text-sm'}`}>
                📜 {question.category === 'history' ? 'História' : 
                 question.category === 'finance' ? 'Finanças' : 
                 question.category === 'technology' ? 'Tecnologia' : 'Futuro'}
              </span>
            </div>
          </div>

          <h2 className={`font-montserrat font-bold text-center text-foreground ${isMobile ? 'text-xs mb-1' : 'text-lg mb-4'}`}>
            {question.question}
          </h2>

          <div className={`grid grid-cols-1 md:grid-cols-2 ${isMobile ? 'gap-1' : 'gap-4'}`}>
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => gamePhase === 'question' ? handleAnswer(index) : null}
                disabled={gamePhase !== 'question'}
                className={`rounded border transition-all text-left backdrop-blur-sm ${isMobile ? 'p-1' : 'p-4 border-2 rounded-lg'} ${
                  gamePhase === 'question' 
                    ? 'border-border bg-card/80 hover:border-amber-500 hover:bg-amber-500/20 hover:scale-105' 
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
                      <CheckCircle className="w-6 h-6" /> : 
                      String.fromCharCode(65 + index)
                    }
                  </div>
                  <span className={`font-semibold ${isMobile ? 'text-xs' : 'text-lg'}`}>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-8 p-6 bg-background-soft/80 backdrop-blur-sm rounded-lg border border-card-border">
              <h4 className="font-semibold text-amber-400 mb-3 flex items-center">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs text-amber-900">!</span>
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
              {currentQuestion < questions.length - 1 ? '🔥 Próxima Pergunta' : '🏆 Ver Resultado Final'}
            </ActionButton>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Mesopotamia;