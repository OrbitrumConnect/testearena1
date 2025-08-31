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

const Digital = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);
  const [gamePhase, setGamePhase] = useState<'start' | 'question' | 'result' | 'finished'>('start');
  const [showExplanation, setShowExplanation] = useState(false);
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [battleStartTime] = useState(Date.now());
  const [attackEffect, setAttackEffect] = useState<'player' | 'enemy' | null>(null);
  const [laserShots, setLaserShots] = useState<Array<{id: number, type: 'player' | 'enemy'}>>([]);
  const [hitEffect, setHitEffect] = useState<'player' | 'enemy' | null>(null);

  // Usar o hook para buscar 25 perguntas aleatórias da Era Digital
  const { questions, loading, refetch } = useEraQuestions('digital', 25);
  
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
      
      // Calcular recompensas usando novo sistema
      const rewards = getTrainingRewards('digital', score, questions.length);
      
      await saveBattleResult({
        eraName: 'Era Digital',
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
      
      console.log(`🎯 Treino Digital concluído! +${perceptionCredits} créditos de percepção`);
      
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
    setTimeLeft(50);
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
    setTimeLeft(50);
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

          <div className={`arena-card-epic text-center ${isMobile ? 'p-3' : 'p-8'}`}>
            <div className={`${isMobile ? 'text-3xl mb-2' : 'text-6xl mb-6'}`}>💻</div>
            
            <h2 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-lg mb-2' : 'text-3xl mb-4'}`}>
              Treinamento: Era Digital
            </h2>
            
            <p className={`text-muted-foreground ${isMobile ? 'text-sm mb-3' : 'text-lg mb-6'}`}>
              Domine os conhecimentos da era digital e tecnológica!
            </p>

            {/* Informações do limite de treinamento */}
            <div className={`arena-card ${isMobile ? 'p-2 mb-3' : 'p-4 mb-6'}`}>
              <h3 className={`font-semibold ${isMobile ? 'text-sm mb-1' : 'mb-2'}`}>📊 Limite Diário</h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Hoje: <span className="font-bold text-epic">{trainingCount}/{maxTrainings}</span>
              </p>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Restantes: <span className="font-bold text-victory">{remainingTrainings}</span>
              </p>
            </div>

            {/* Informações de recompensas */}
            <div className={`arena-card ${isMobile ? 'p-2 mb-3' : 'p-4 mb-6'}`}>
              <h3 className={`font-semibold ${isMobile ? 'text-sm mb-1' : 'mb-2'}`}>💰 Recompensas</h3>
              <div className={`grid grid-cols-3 gap-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                <div className="text-center">
                  <p className={`text-epic font-bold ${isMobile ? 'text-xs' : ''}`}>🏆 90%+</p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>8 créditos</p>
                </div>
                <div className="text-center">
                  <p className={`text-victory font-bold ${isMobile ? 'text-xs' : ''}`}>✅ 70%+</p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>7 créditos</p>
                </div>
                <div className="text-center">
                  <p className={`text-warning font-bold ${isMobile ? 'text-xs' : ''}`}>📚 Base</p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>5 créditos</p>
                </div>
              </div>
            </div>

            {/* Alerta de limite atingido */}
            {!canTrain && (
              <Alert className={isMobile ? 'mb-3 p-2' : 'mb-6'}>
                <AlertTriangle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                <AlertDescription className={isMobile ? 'text-xs' : ''}>
                  ⚠️ Você atingiu o limite diário de {maxTrainings} treinamentos. 
                  Volte amanhã para continuar treinando!
                </AlertDescription>
              </Alert>
            )}

            <div className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-4'}`}>
              <ActionButton 
                variant="victory" 
                icon={<Play />}
                onClick={startTraining}
                disabled={!canTrain}
                className={`w-full ${isMobile ? 'text-sm py-2' : ''}`}
              >
                {canTrain ? 'Iniciar Treinamento' : 'Limite Atingido'}
              </ActionButton>

              {trainingCount > 0 && (
                <ActionButton 
                  variant="battle" 
                  icon={<Target />}
                  onClick={resetTrainingCount}
                  className={`w-full ${isMobile ? 'text-xs py-1' : ''}`}
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
                <p className="text-2xl font-bold text-battle">+{getTrainingRewards('digital', score, questions.length).xpEarned}</p>
                {saving && <p className="text-sm text-epic animate-pulse">Salvando...</p>}
                {!saving && <p className="text-sm text-victory">✅ Salvo!</p>}
              </div>

              <div className="arena-card p-4">
                <h3 className="font-semibold mb-2">Recompensa</h3>
                <p className="text-2xl font-bold text-victory">
                  +{Math.round((getTrainingRewards('digital', score, questions.length).moneyEarned || 0) * 100)} créditos
                </p>
                {getTrainingRewards('digital', score, questions.length).bonusApplied && (
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
                onClick={() => navigate('/arena')}
                className="bg-gradient-to-r from-epic to-victory"
              >
                🏆 Desafio Arena
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
      {/* Fundo Temático Digital */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/digital-background.png" 
          alt="Digital Background" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-300/30 to-blue-600/50" />
      </div>
      
      <ParticleBackground />
      
      <div className={`relative z-10 max-w-4xl mx-auto ${isMobile ? 'p-1 h-full flex flex-col' : 'p-6'}`}>
        {/* Botão Voltar */}
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
            <h1 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-lg' : 'text-2xl'}`}>💻 BATALHA EM CURSO</h1>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>Era Digital - {currentQuestion + 1}/{questions.length}</p>
          </div>

          <div className={`text-right arena-card backdrop-blur-sm bg-card/80 ${isMobile ? 'px-1 py-1 scale-50 self-end' : 'px-4 py-3'}`}>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Pontos</p>
            <p className={`font-bold text-victory ${isMobile ? 'text-sm' : 'text-xl'}`}>{score}/{currentQuestion + 1}</p>
          </div>
        </div>
        
        {/* Barra de Progresso Épica - Padrão Egito */}
        <div className={isMobile ? 'mb-2' : 'mb-8'}>
          <div className={`arena-card backdrop-blur-sm bg-card/80 ${isMobile ? 'p-1 scale-75' : 'p-4'}`}>
            <div className={`flex items-center justify-between ${isMobile ? 'mb-1' : 'mb-2'}`}>
              <span className={`font-semibold text-epic ${isMobile ? 'text-xs' : 'text-sm'}`}>Progresso</span>
              
              {/* Timer Integrado */}
              <div className="flex items-center space-x-2">
                <div 
                  className={`${isMobile ? 'text-sm' : 'text-lg'}`}
                  style={{ 
                    filter: 'drop-shadow(0 0 6px rgba(0, 255, 255, 1))'
                  }}
                >⏱️</div>
                <div 
                  className={`font-bold ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-cyan-400'} ${isMobile ? 'text-xs' : 'text-sm'}`}
                  style={{ 
                    filter: 'drop-shadow(0 0 4px rgba(0, 255, 255, 0.8))'
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
        <div className={`relative w-full flex items-center justify-between ${isMobile ? 'h-20 mb-3' : 'h-40 mb-8'}`}>
          {/* Jogador - Posição Esquerda (origem do ataque) */}
          <div className="absolute left-6 top-3 text-center">
            <div className={`animate-pulse ${isMobile ? 'mb-0' : 'mb-0.5'} flex justify-center`}>
              <img 
                src="/guerreirodigital.png" 
                alt="Guerreiro Digital" 
                className={`${isMobile ? 'w-8 h-8' : 'w-24 h-24'} object-contain`}
                style={{ 
                  filter: hitEffect === 'player' 
                    ? 'drop-shadow(0 0 20px rgba(255, 0, 0, 1)) drop-shadow(0 0 30px rgba(255, 0, 0, 0.8))' 
                    : 'drop-shadow(0 0 12px rgba(14, 165, 233, 1))'
                }}
              />
            </div>
            <div className={`arena-card backdrop-blur-sm bg-victory/20 ${isMobile ? 'p-0.5 min-w-10 scale-65' : 'p-2 min-w-28'}`}>
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

          {/* Inimigo - Posição Direita (alvo do ataque) */}
          <div className="absolute right-6 top-3 text-center">
            <div className={`${isMobile ? 'mb-0' : 'mb-0.5'} flex justify-center`}>
              <img 
                src="/bossdigital.png" 
                alt="Boss Digital" 
                className={`${isMobile ? 'w-10 h-10' : 'w-28 h-28'} object-contain`}
                style={{ 
                  filter: hitEffect === 'enemy' 
                    ? 'drop-shadow(0 0 20px rgba(255, 255, 0, 1)) drop-shadow(0 0 30px rgba(255, 255, 0, 0.8))' 
                    : 'drop-shadow(0 0 12px rgba(239, 68, 68, 1))'
                }}
              />
            </div>
            <div className={`arena-card backdrop-blur-sm bg-destructive/20 ${isMobile ? 'p-0.5 min-w-10 scale-65' : 'p-2 min-w-28'}`}>
              <h3 className={`font-montserrat font-bold text-destructive ${isMobile ? 'text-xs' : 'text-sm'}`}>{isMobile ? 'IA' : 'IA SUPREMA'}</h3>
              <div className={`progress-epic ${isMobile ? 'mt-0' : 'mt-2'}`}>
                <div 
                  className={`bg-destructive rounded-full transition-all duration-1000 ${isMobile ? 'h-0.5' : 'h-2'}`}
                  style={{ width: `${enemyHp}%` }}
                />
              </div>
              <p className={`font-semibold text-destructive ${isMobile ? 'text-xs mt-0' : 'text-xs mt-1'}`}>{enemyHp}</p>
            </div>
          </div>

          {/* Efeito de 3 Tiros de Laser Neon Laranja */}
          {laserShots.map((shot, index) => {
            // Tamanhos diferentes para cada laser (30% menores)
            const laserSizes = ['━━━', '━━', '━━━━'];
            const laserSize = laserSizes[index % 3];
            
            // Posições verticais diferentes com mais espaçamento
            const verticalPositions = [40, 50, 60]; // Posições em %
            const verticalPos = verticalPositions[index % 3];
            
            return (
              <div 
                key={shot.id}
                className={`absolute pointer-events-none ${isMobile ? 'text-xs' : 'text-lg'}`}
                style={{
                  left: shot.type === 'player' ? '16%' : 'auto',
                  right: shot.type === 'enemy' ? '16%' : 'auto',
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
        <div className={`arena-card-epic backdrop-blur-sm bg-cyan-500/10 border-2 border-cyan-500 glow-epic ${isMobile ? 'p-0.5 mb-0.5 scale-18 mt-4' : 'p-2 mb-2 scale-56 mt-16'}`}>
          <div className="flex items-center justify-center mb-6">
            <div className="inline-block px-6 py-2 bg-cyan-500/30 rounded-full backdrop-blur-sm border border-cyan-500">
              <span className="text-cyan-400 font-bold text-sm uppercase tracking-wide">
                🤖 {question.category === 'history' ? 'História Digital' : 
                 question.category === 'finance' ? 'Fintech' : 
                 question.category === 'technology' ? 'Tecnologia' : 'Futuro'}
              </span>
            </div>
          </div>

          <h2 className={`${isMobile ? 'text-lg mb-4' : 'text-2xl mb-8'} font-montserrat font-bold text-center text-foreground`}>
            {question.question}
          </h2>

          <div className={`grid grid-cols-1 md:grid-cols-2 ${isMobile ? 'gap-2' : 'gap-4'}`}>
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => gamePhase === 'question' ? handleAnswer(index) : null}
                disabled={gamePhase !== 'question'}
                className={`${isMobile ? 'p-1 text-xs' : 'p-4'} rounded-lg border-2 transition-all text-left backdrop-blur-sm ${
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
              <h4 className="font-semibold text-cyan-400 mb-3 flex items-center">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs text-cyan-900">!</span>
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
              {currentQuestion < questions.length - 1 ? '⚡ Próxima Pergunta' : '🚀 Ver Resultado Final'}
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Digital;