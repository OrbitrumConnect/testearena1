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
import { handleBattleCredits } from '@/utils/creditsIntegration';
import { calculateHpDamage, getTrainingRewards } from '@/utils/gameBalance';
import { getRewardDisplayValues } from '@/utils/rewardDisplay';

const Medieval = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gamePhase, setGamePhase] = useState<'start' | 'question' | 'result' | 'finished'>('start');
  const [showExplanation, setShowExplanation] = useState(false);
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [battleStartTime] = useState(Date.now());

  // Usar o hook para buscar 5 perguntas aleatórias da Era Medieval
  const { questions, loading, refetch } = useEraQuestions('medieval', 5);
  
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

  const handleAnswer = (answerIndex: number | null) => {
    setSelectedAnswer(answerIndex);
    setGamePhase('result');
    setShowExplanation(true);
    
    // Calcular dano dinâmico baseado no número total de perguntas
    const damage = calculateHpDamage(questions.length);
    
    if (answerIndex === questions[currentQuestion]?.correct) {
      setScore(score + 1);
      // Jogador acerta - Inimigo perde HP (5% a mais de dano)
      const enemyDamage = Math.round(damage * 1.05);
      setEnemyHp(prev => Math.max(0, prev - enemyDamage));
    } else {
      setPlayerHp(prev => Math.max(0, prev - damage));
    }
  };

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setGamePhase('question');
      setShowExplanation(false);
    } else {
      // Jogo terminou - salvar dados
      const battleDurationSeconds = Math.round((Date.now() - battleStartTime) / 1000);
      
      // Calcular recompensas usando novo sistema
      const rewards = getTrainingRewards('medieval', score, questions.length);
      
      await saveBattleResult({
        eraName: 'Era Medieval',
        questionsTotal: questions.length,
        questionsCorrect: score,
        xpEarned: rewards.xpEarned,
        moneyEarned: rewards.moneyEarned,
        battleDurationSeconds: battleDurationSeconds,
      });

      // Novo: Sistema de Percepção de Créditos
      const accuracyPercentage = Math.round((score / questions.length) * 100);
      const perceptionCredits = handleBattleCredits({
        battleType: 'training',
        questionsCorrect: score,
        questionsTotal: questions.length,
        accuracyPercentage: accuracyPercentage
      });
      
      console.log(`🎯 Treino Medieval concluído! +${perceptionCredits} créditos de percepção`);
      
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
    setTimeLeft(30);
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
    setTimeLeft(30);
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
            <div className="text-4xl mb-4">⚔️</div>
            <h2 className="text-2xl font-montserrat font-bold text-epic mb-4">
              Carregando Desafios...
            </h2>
            <p className="text-muted-foreground">
              Preparando perguntas exclusivas da Era Medieval
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
        
        <div className={`relative z-10 max-w-4xl mx-auto ${isMobile ? 'p-3 h-full overflow-y-auto' : 'p-6'}`}>
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
            <div className="text-6xl mb-6">⚔️</div>
            
            <h2 className="text-3xl font-montserrat font-bold text-epic mb-4">
              Treinamento: Era Medieval
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6">
              Teste seus conhecimentos sobre a época medieval!
            </p>

            {/* Informações do limite de treinamento */}
            <div className="arena-card p-4 mb-6">
              <h3 className="font-semibold mb-2">📊 Limite Diário de Treinamento</h3>
              <p className="text-sm text-muted-foreground">
                Treinamentos realizados hoje: <span className="font-bold text-epic">{trainingCount}/{maxTrainings}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Treinamentos restantes: <span className="font-bold text-victory">{remainingTrainings}</span>
              </p>
            </div>

            {/* Informações de recompensas */}
            <div className="arena-card p-4 mb-6">
              <h3 className="font-semibold mb-2">💰 Recompensas</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-epic font-bold">🏆 90%+</p>
                  <p className="text-muted-foreground">7 créditos</p>
                </div>
                <div className="text-center">
                  <p className="text-victory font-bold">✅ 70%+</p>
                  <p className="text-muted-foreground">6 créditos</p>
                </div>
                <div className="text-center">
                  <p className="text-warning font-bold">📚 Base</p>
                  <p className="text-muted-foreground">4 créditos</p>
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
                disabled={!canTrain}
                className="w-full"
              >
                {canTrain ? 'Iniciar Treinamento' : 'Limite Atingido'}
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
    );
  }

  if (gamePhase === 'finished') {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <ParticleBackground />
        
        <div className={`relative z-10 max-w-4xl mx-auto ${isMobile ? 'p-3 h-full overflow-y-auto' : 'p-6'}`}>
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
              {score >= questions.length * 0.7 ? '👑' : score >= questions.length * 0.5 ? '⚔️' : '🛡️'}
            </div>
            
            <h2 className="text-3xl font-montserrat font-bold text-epic mb-4">
              Era Medieval Dominada!
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
                <p className="text-2xl font-bold text-battle">+{getTrainingRewards('medieval', score, questions.length).xpEarned}</p>
                {saving && <p className="text-sm text-epic animate-pulse">Salvando...</p>}
                {!saving && <p className="text-sm text-victory">✅ Salvo!</p>}
              </div>

              <div className="arena-card p-4">
                <h3 className="font-semibold mb-2">Recompensa</h3>
                <p className="text-2xl font-bold text-victory">
                  +{Math.round((getTrainingRewards('medieval', score, questions.length).moneyEarned || 0) * 100)} créditos
                </p>
                {getTrainingRewards('medieval', score, questions.length).bonusApplied && (
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
                onClick={() => navigate('/digital')}
                className="bg-gradient-to-r from-epic to-victory"
              >
                🚀 Próximo Nível: Era Digital
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
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background relative`}>
      {/* Fundo Temático Medieval */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/medieval-background.png" 
          alt="Medieval Background" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-500/30 to-slate-700/50" />
      </div>
      
      <ParticleBackground />
      
      <div className={`relative z-10 max-w-4xl mx-auto ${isMobile ? 'p-3 h-full overflow-y-auto' : 'p-6'}`}>
        {/* Header de Batalha */}
        <div className={`${isMobile ? 'flex flex-col space-y-2 mb-4' : 'flex items-center justify-between mb-8'}`}>
          <ActionButton 
            variant="battle" 
            icon={<ArrowLeft />}
            onClick={() => navigate('/app')}
            className={`backdrop-blur-sm bg-battle-dark/80 ${isMobile ? 'self-start text-sm px-3 py-2' : ''}`}
          >
            Voltar
          </ActionButton>
          
          <div className={`text-center arena-card-epic backdrop-blur-sm bg-card/80 ${isMobile ? 'px-3 py-2 scale-50' : 'px-6 py-3'}`}>
            <h1 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-lg' : 'text-2xl'}`}>⚔️ BATALHA MEDIEVAL</h1>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>Era dos Cavaleiros - {currentQuestion + 1}/{questions.length}</p>
          </div>

          <div className={`text-right arena-card backdrop-blur-sm bg-card/80 ${isMobile ? 'px-2 py-2 scale-75 self-end' : 'px-4 py-3'}`}>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Pontuação</p>
            <p className={`font-bold text-victory ${isMobile ? 'text-lg' : 'text-xl'}`}>{score}/{currentQuestion + 1}</p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className={isMobile ? 'mb-2' : 'mb-8'}>
          <div className={`arena-card backdrop-blur-sm bg-card/80 ${isMobile ? 'p-1 scale-75' : 'p-4'}`}>
            <div className={`flex items-center justify-between ${isMobile ? 'mb-1' : 'mb-2'}`}>
              <span className={`font-semibold text-epic ${isMobile ? 'text-xs' : 'text-sm'}`}>Progresso</span>
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
          <div className={`flex items-center justify-between ${isMobile ? 'px-1 mb-1' : 'px-8 mb-6'}`}>
            {/* Jogador */}
            <div className="text-center">
              <div className={`animate-bounce ${isMobile ? 'text-base mb-0' : 'text-7xl mb-0.5'}`}>⚔️</div>
              <div className={`arena-card backdrop-blur-sm bg-victory/20 ${isMobile ? 'p-0.5 min-w-10 scale-75' : 'p-3 min-w-32'}`}>
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

            {/* Timer */}
            <div className={`arena-card-epic backdrop-blur-sm bg-purple-500/20 text-center border border-purple-500 ${isMobile ? 'p-0.5 mx-0.5 scale-75' : 'p-4 mx-4 border-2 glow-epic'}`}>
              <div className={`${isMobile ? 'text-xs' : 'text-3xl'}`}>⏰</div>
              <div className={`font-bold ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-purple-400'} ${isMobile ? 'text-xs' : 'text-2xl'}`}>
                {timeLeft}
              </div>
            </div>

            {/* Inimigo */}
            <div className="text-center">
              <div className={`animate-pulse ${isMobile ? 'text-base mb-0' : 'text-7xl mb-0.5'}`}>🐲</div>
              <div className={`arena-card backdrop-blur-sm bg-destructive/20 ${isMobile ? 'p-0.5 min-w-10 scale-75' : 'p-3 min-w-32'}`}>
                <h3 className={`font-montserrat font-bold text-destructive ${isMobile ? 'text-xs' : 'text-sm'}`}>{isMobile ? 'DRAG' : 'DRAGÃO SÁBIO'}</h3>
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

          {/* Efeitos de Batalha */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="text-4xl animate-ping opacity-50">⚡</div>
          </div>
        </div>

        {/* Pergunta */}
        <div className={`arena-card-epic backdrop-blur-sm bg-purple-500/10 border border-purple-500 ${isMobile ? 'p-1 mb-1' : 'p-8 mb-6 border-2 glow-epic'}`}>
          <div className={`flex items-center justify-center ${isMobile ? 'mb-1' : 'mb-6'}`}>
            <div className={`inline-block bg-purple-500/30 rounded-full backdrop-blur-sm border border-purple-500 ${isMobile ? 'px-1 py-0.5' : 'px-6 py-2'}`}>
              <span className={`text-purple-400 font-bold uppercase tracking-wide ${isMobile ? 'text-xs' : 'text-sm'}`}>
                ⚔️ {question.category === 'history' ? 'História Medieval' : 
                 question.category === 'finance' ? 'Economia' : 
                 question.category === 'technology' ? 'Tecnologia' : 'Futuro'}
              </span>
            </div>
          </div>

          <h2 className={`font-montserrat font-bold text-center text-foreground ${isMobile ? 'text-xs mb-1' : 'text-2xl mb-8'}`}>
            {question.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => gamePhase === 'question' ? handleAnswer(index) : null}
                disabled={gamePhase !== 'question'}
                className={`p-6 rounded-lg border-2 transition-all text-left backdrop-blur-sm ${
                  gamePhase === 'question' 
                    ? 'border-border bg-card/80 hover:border-purple-500 hover:bg-purple-500/20 hover:scale-105' 
                    : selectedAnswer === index
                      ? index === question.correct
                        ? 'border-victory bg-victory/30 text-victory scale-105'
                        : 'border-destructive bg-destructive/30 text-destructive'
                      : index === question.correct
                        ? 'border-victory bg-victory/30 text-victory scale-105'
                        : 'border-border bg-card/50 opacity-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
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
                  <span className="font-semibold text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-8 p-6 bg-background-soft/80 backdrop-blur-sm rounded-lg border border-card-border">
              <h4 className="font-semibold text-purple-400 mb-3 flex items-center">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs text-purple-900">!</span>
                </div>
                Explicação:
              </h4>
              <p className="text-muted-foreground">{question.explanation}</p>
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
              {currentQuestion < questions.length - 1 ? '⚔️ Próxima Pergunta' : '👑 Ver Resultado Final'}
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medieval;