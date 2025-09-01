import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Clock, Target, ArrowLeft, Zap, Shield, Users, Search, Crown, Trophy, Play } from 'lucide-react';
import { ActionButton } from '@/components/arena/ActionButton';
import { ParticleBackground } from '@/components/ui/particles';
import { Progress } from '@/components/ui/progress';
import { useArena } from '@/hooks/useArena';
import { usePvPLimit } from '@/hooks/usePvPLimit';
import { useBattleSave } from '@/hooks/useBattleSave';
import { useIsMobile } from '@/hooks/use-mobile';
import { Player } from '@/types/arena';
import { RealPvPExplanation } from '@/components/arena/RealPvPExplanation';
import { handleNewBattleCredits, getUserPlan, getPvPValues } from '@/utils/creditsIntegration';
import { useRealTimePvP } from '@/hooks/useRealTimePvP';

const ArenaNew = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const pvpLimit = usePvPLimit();
  const { saveBattleResult } = useBattleSave();
  
  // Obter valores do PvP baseados no plano do usuário
  const pvpValues = getPvPValues();
  
  // 🎮 NOVO: Controle de modo PvP (Real-time vs Simulado)
  const [pvpMode, setPvpMode] = useState<'realtime' | 'simulated'>('realtime');
  const userPlan = getUserPlan();
  
  // 🔥 SISTEMA SIMULADO (useArena - existente)
  const { 
    currentPlayer, 
    phase, 
    availablePlayers, 
    selectedOpponent,
    battleRoom,
    battleState,
    loading,
    error,
    actions 
  } = useArena();
  
  // ⚡ SISTEMA REAL-TIME (useRealTimePvP - novo)
  const realTimePvP = useRealTimePvP();
  
  // 🎯 Decidir qual sistema usar baseado no modo
  const isRealTime = pvpMode === 'realtime';
  const currentSystem = isRealTime ? realTimePvP : {
    room: battleRoom,
    timeLeft: 30,
    totalTimeLeft: 240,
    currentQuestion: 0,
    gamePhase: phase,
    confirmationTimeLeft: 30,
    loading,
    myAnswers: [],
    opponentAnswers: [],
    findMatch: () => actions.findRandomOpponent(),
    confirmBattle: () => {},
    answerQuestion: () => {},
    PVP_CONFIG: { TOTAL_TIME: 240, QUESTIONS: 8, TIME_PER_QUESTION: 30 }
  };

  // Salvar dados quando a batalha termina
  useEffect(() => {
    if (phase === 'finished' && battleState?.winner) {
      const handleBattleFinished = async () => {
        const isVictory = battleState.winner.id === currentPlayer.id;
        const questionsCorrect = battleState.score || 3; // Simulado
        const questionsTotal = 5; // Simulado
        const accuracyPercentage = Math.round((questionsCorrect / questionsTotal) * 100);
        
        // Salvar dados da batalha
        await saveBattleResult({
          eraName: 'Arena PvP - Multi-Eras',
          questionsTotal: questionsTotal,
          questionsCorrect: questionsCorrect,
          xpEarned: isVictory ? 200 : 75,
          moneyEarned: isVictory ? 500 : 0, // créditos de plataforma
          battleDurationSeconds: 180, // Simulado ~3min
          battleType: 'pvp',
        });

        // Novo Sistema de Créditos para PvP
        const userPlan = getUserPlan();
        const creditsResult = handleNewBattleCredits({
          battleType: 'pvp',
          questionsCorrect: questionsCorrect,
          questionsTotal: questionsTotal,
          accuracyPercentage: accuracyPercentage,
          planType: userPlan
        });
        
        console.log(`⚔️ PvP Real concluído! ${creditsResult.message} (${isVictory ? 'Vitória' : 'Derrota'})`);
      };
      
      handleBattleFinished();
    }
  }, [phase, battleState?.winner, currentPlayer.id, saveBattleResult]);

  // Renderizar lista de players (Lobby)
  const renderLobby = () => (
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background relative`}>
      <ParticleBackground />
      
      <div className={`relative z-10 max-w-6xl mx-auto ${isMobile ? 'p-3 h-full overflow-y-auto' : 'p-6'}`}>
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

        {/* Mini Card de Créditos na Arena */}
        <div className="bg-epic/5 border border-epic/20 rounded-lg p-3 mb-4 max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Créditos Disponíveis</span>
            <span className="text-epic font-bold">500</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-muted-foreground">Taxa PvP</span>
            <span className="text-warning font-semibold">{pvpValues.betAmount} créditos</span>
          </div>
        </div>

        <div className="arena-card-epic p-6 text-center mb-6">
          <div className="text-4xl mb-4">⚔️</div>
          <h2 className="text-2xl font-montserrat font-bold text-epic mb-3">
            Arena PvP - Player vs Player
          </h2>
          <p className="text-base text-muted-foreground mb-3">
            Desafie outros guerreiros em batalhas épicas de conhecimento!
          </p>
          
          {/* Aviso sobre Limite PvP */}
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-4 mx-auto max-w-sm">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm font-semibold text-warning">
                Limite Diário: {pvpLimit.getBattlesRemaining()}/{pvpLimit.getPvPLimitInfo().dailyLimit} partidas restantes
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              ⚠️ Créditos ganhos em PvP são apenas para uso interno
            </p>
          </div>

          {/* Seleção de Modo PvP */}
          <div className="arena-card p-3 mb-4 bg-warning/10 border-warning">
            <h3 className="text-sm font-semibold mb-2">🎮 Modo de Jogo</h3>
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                variant={pvpMode === 'realtime' ? 'epic' : 'battle'}
                onClick={() => setPvpMode('realtime')}
                className="text-xs py-2"
              >
                ⚡ Real-time
              </ActionButton>
              <ActionButton
                variant={pvpMode === 'simulated' ? 'epic' : 'battle'}
                onClick={() => setPvpMode('simulated')}
                className="text-xs py-2"
              >
                🤖 Simulado
              </ActionButton>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {pvpMode === 'realtime' ? '⏱️ 4min total • Saída automática' : '🎯 Sistema tradicional'}
            </p>
          </div>

          {/* Informações do sistema PvP */}
          <div className="arena-card p-3 mb-4 bg-epic/10 border-epic">
            <p className="text-epic font-semibold">
              💰 Custo da Batalha: {pvpValues.betAmount} créditos
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Vitória: +{pvpValues.netWin} créditos | Derrota: {pvpValues.netLoss} créditos | Pool: {pvpValues.totalPool} créditos
            </p>
            {isRealTime && (
              <div className="mt-2 pt-2 border-t border-epic/30">
                <p className="text-xs text-epic">
                  ⚡ Modo Real-time: {currentSystem.PVP_CONFIG.QUESTIONS} perguntas • {currentSystem.PVP_CONFIG.TIME_PER_QUESTION}s cada
                </p>
              </div>
            )}
          </div>

          {/* Busca automática */}
          <div className="mb-6">
            <ActionButton 
              variant="epic" 
              icon={<Search />}
              onClick={() => {
                if (isRealTime) {
                  currentSystem.findMatch('current-user-id', userPlan);
                } else {
                  actions.findRandomOpponent();
                }
              }}
              disabled={currentSystem.loading}
              className="w-full mb-4"
            >
              {currentSystem.loading ? 'Procurando...' : 
                isRealTime ? 'Buscar Partida Real-time' : 'Buscar Adversário Automático'}
            </ActionButton>
            
            {isRealTime && currentSystem.gamePhase === 'confirming' && (
              <div className="arena-card p-4 bg-warning/10 border-warning text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Oponente Encontrado!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  ⏱️ {currentSystem.confirmationTimeLeft}s para confirmar
                </p>
                <div className="flex gap-2 justify-center">
                  <ActionButton
                    variant="victory"
                    onClick={() => currentSystem.confirmBattle('current-user-id')}
                    className="text-sm"
                  >
                    ✅ Aceitar
                  </ActionButton>
                  <ActionButton
                    variant="battle"
                    onClick={() => navigate('/')}
                    className="text-sm"
                  >
                    ❌ Recusar
                  </ActionButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Explicação do Sistema Real */}
        <RealPvPExplanation />

        {/* Lista de Players Online */}
        <div className="arena-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-montserrat font-bold">
              <Users className="w-6 h-6 inline mr-2 text-epic" />
              Guerreiros Online ({availablePlayers.length})
            </h3>
            <ActionButton 
              variant="battle" 
              onClick={actions.refreshPlayers}
              disabled={loading}
              className="text-sm"
            >
              Atualizar
            </ActionButton>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-epic border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando guerreiros...</p>
            </div>
          ) : availablePlayers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum guerreiro disponível no momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePlayers.map((player) => (
                <PlayerCard 
                  key={player.id} 
                  player={player} 
                  onChallenge={() => actions.challengePlayer(player)}
                  disabled={loading}
                />
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="arena-card p-4 mt-6 bg-destructive/10 border-destructive">
            <p className="text-destructive font-semibold">⚠️ {error}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar processo de matchmaking
  const renderMatchmaking = () => (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />
      
      <div className="relative z-10 text-center">
        <div className="arena-card-epic p-8">
          <div className="animate-pulse text-6xl mb-6">⚔️</div>
          <h2 className="text-2xl font-montserrat font-bold text-epic mb-4">
            Criando Batalha...
          </h2>
          <p className="text-muted-foreground mb-6">
            Preparando sala de combate contra {selectedOpponent?.name}
          </p>
          <div className="animate-spin w-8 h-8 border-4 border-epic border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );

  // 🎮 NOVO: Renderizar jogo real-time (4 minutos + saída automática)
  const renderRealTimeGame = () => {
    if (!currentSystem.room || !currentSystem.room.questions) return null;
    
    const question = currentSystem.room.questions[currentSystem.currentQuestion];
    const isGameActive = currentSystem.gamePhase === 'playing';
    const isFinished = currentSystem.gamePhase === 'finished';
    
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <ParticleBackground />
        
        <div className="relative z-10 p-4">
          {/* Header com timers */}
          <div className="arena-card p-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Pergunta</p>
                <p className="text-lg font-bold">{currentSystem.currentQuestion + 1}/8</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Tempo Pergunta</p>
                <p className="text-xl font-bold text-warning">{currentSystem.timeLeft}s</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Tempo Total</p>
                <p className="text-lg font-bold text-epic">
                  {Math.floor(currentSystem.totalTimeLeft / 60)}:{(currentSystem.totalTimeLeft % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
            
            <div className="mt-3">
              <Progress 
                value={(currentSystem.totalTimeLeft / currentSystem.PVP_CONFIG.TOTAL_TIME) * 100} 
                className="h-2"
              />
            </div>
          </div>

          {/* Pergunta */}
          {isGameActive && question && (
            <div className="arena-card p-6 mb-4">
              <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
              
              <div className="grid gap-3">
                {[question.correct_answer, ...question.wrong_options].map((option, index) => (
                  <ActionButton
                    key={index}
                    variant="battle"
                    onClick={() => currentSystem.answerQuestion('current-user-id', index)}
                    className="text-left justify-start p-4"
                    disabled={currentSystem.myAnswers[currentSystem.currentQuestion] !== undefined}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </ActionButton>
                ))}
              </div>
              
              {currentSystem.myAnswers[currentSystem.currentQuestion] !== undefined && (
                <div className="mt-4 text-center">
                  <p className="text-victory">✅ Resposta enviada! Aguardando oponente...</p>
                </div>
              )}
            </div>
          )}

          {/* Resultado Final */}
          {isFinished && (
            <div className="arena-card-epic p-8 text-center">
              <div className="text-6xl mb-4">
                {currentSystem.room.winner_id === 'current-user-id' ? '🏆' : '😔'}
              </div>
              <h2 className="text-2xl font-bold mb-4">
                {currentSystem.room.winner_id === 'current-user-id' ? 'Vitória!' : 
                 currentSystem.room.winner_id ? 'Derrota!' : 'Empate!'}
              </h2>
              
              <div className="arena-card p-4 bg-epic/10 border-epic mb-6">
                <p className="text-epic font-semibold">💰 Pool Total: {pvpValues.totalPool} créditos</p>
                <p className="text-sm text-muted-foreground">
                  Vencedor leva {pvpValues.winnerReceives} créditos | Plataforma: {pvpValues.totalPool - pvpValues.winnerReceives} créditos
                </p>
              </div>

              <p className="text-muted-foreground mb-4">
                🚪 Saindo automaticamente em {currentSystem.PVP_CONFIG.AUTO_EXIT_DELAY} segundos...
              </p>
              
              <ActionButton
                variant="epic"
                onClick={() => navigate('/')}
                className="mt-4"
              >
                Voltar ao Dashboard
              </ActionButton>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar sala de batalha criada
  const renderRoomCreated = () => (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="arena-card-epic p-8 text-center w-full">
          <div className="text-6xl mb-6">⚔️</div>
          <h2 className="text-3xl font-montserrat font-bold text-epic mb-4">
            Sala de Batalha Criada!
          </h2>
          
          {battleRoom && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Player 1 */}
              <div className="arena-card p-4">
                <div className="text-3xl mb-2">⚔️</div>
                <h3 className="font-bold text-epic">{battleRoom.player1.name}</h3>
                <p className="text-sm text-muted-foreground">Nível {battleRoom.player1.level}</p>
                <p className="text-xs text-victory">{battleRoom.player1.winRate}% vitórias</p>
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <div className="text-4xl font-bold text-epic animate-pulse">VS</div>
              </div>

              {/* Player 2 */}
              <div className="arena-card p-4">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-bold text-battle">{battleRoom.player2.name}</h3>
                <p className="text-sm text-muted-foreground">Nível {battleRoom.player2.level}</p>
                <p className="text-xs text-victory">{battleRoom.player2.winRate}% vitórias</p>
              </div>
            </div>
          )}

          <div className="arena-card p-4 bg-epic/10 border-epic mb-6">
            <p className="text-epic font-semibold">💰 Pool Total: {pvpValues.totalPool} créditos</p>
            <p className="text-sm text-muted-foreground">Vencedor leva {pvpValues.winnerReceives} créditos | Plataforma: {pvpValues.totalPool - pvpValues.winnerReceives} créditos</p>
          </div>

          <p className="text-muted-foreground">
            ⏳ Batalha iniciará automaticamente em instantes...
          </p>
        </div>
      </div>
    </div>
  );

  // Renderizar countdown de início
  const renderBattleStarting = () => {
    const [countdown, setCountdown] = useState(3);
    
    useEffect(() => {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        
        <div className="relative z-10 text-center">
          <div className="arena-card-epic p-8">
            <div className="text-8xl mb-6 animate-pulse">{countdown || '⚔️'}</div>
            <h2 className="text-3xl font-montserrat font-bold text-epic mb-4">
              {countdown > 0 ? `Batalha em ${countdown}...` : 'LUTE!'}
            </h2>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar batalha ativa (placeholder)
  const renderBattleActive = () => (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Barras de HP */}
        {battleState && (
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Player 1 HP */}
            <div className="arena-card p-4">
              <h3 className="font-bold mb-2">{battleState.room.player1.name}</h3>
              <Progress value={battleState.player1Hp} className="mb-2" />
              <p className="text-sm text-muted-foreground">{battleState.player1Hp}/100 HP</p>
            </div>

            {/* Player 2 HP */}
            <div className="arena-card p-4">
              <h3 className="font-bold mb-2">{battleState.room.player2.name}</h3>
              <Progress value={battleState.player2Hp} className="mb-2" />
              <p className="text-sm text-muted-foreground">{battleState.player2Hp}/100 HP</p>
            </div>
          </div>
        )}

        {/* Simulação de pergunta */}
        <div className="arena-card-epic p-8 text-center">
          <h2 className="text-xl font-bold mb-6">
            Qual foi a principal contribuição dos egípcios para a matemática?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {['Sistema decimal', 'Geometria avançada', 'Álgebra', 'Trigonometria'].map((option, index) => (
              <ActionButton
                key={index}
                variant="battle"
                onClick={() => actions.answerQuestion('demo', index)}
                className="w-full"
              >
                {option}
              </ActionButton>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            ⏱️ Responda rapidamente! Cada acerto causa dano no adversário.
          </p>
        </div>
      </div>
    </div>
  );

  // Renderizar resultado da batalha
  const renderBattleFinished = () => (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />
      
      <div className="relative z-10 text-center">
        <div className="arena-card-epic p-8">
          {battleState?.winner ? (
            <>
              <div className="text-6xl mb-6">
                {battleState.winner.id === currentPlayer.id ? '🏆' : '💀'}
              </div>
              <h2 className="text-3xl font-montserrat font-bold mb-4">
                {battleState.winner.id === currentPlayer.id ? (
                  <span className="text-victory">Vitória!</span>
                ) : (
                  <span className="text-destructive">Derrota!</span>
                )}
              </h2>
              <div className="mb-6">
                <p className="text-xl mb-2">
                  {battleState.winner.id === currentPlayer.id 
                    ? `Você ganhou +${pvpValues.netWin} créditos!`
                    : `Você perdeu ${Math.abs(pvpValues.netLoss)} créditos`}
                </p>
                <p className="text-sm text-epic">
                  +15 créditos de percepção
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6">⚔️</div>
              <h2 className="text-3xl font-montserrat font-bold mb-4">Batalha Finalizada!</h2>
            </>
          )}

          <div className="flex gap-4 justify-center">
            <ActionButton variant="victory" onClick={actions.returnToLobby}>
              Nova Batalha
            </ActionButton>
            <ActionButton variant="battle" onClick={() => navigate('/app')}>
              Voltar ao Menu
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar baseado na fase atual (Sistema Híbrido)
  const renderCurrentPhase = () => {
    // 🎮 MODO REAL-TIME: Usar novo sistema
    if (isRealTime) {
      const gamePhase = currentSystem.gamePhase;
      
      if (gamePhase === 'playing' || gamePhase === 'finished') {
        return renderRealTimeGame();
      }
      
      // Fases de lobby/confirmação ainda usam o sistema base
      return renderLobby();
    }
    
    // 🤖 MODO SIMULADO: Usar sistema existente
    switch (phase) {
      case 'lobby':
        return renderLobby();
      case 'matchmaking':
        return renderMatchmaking();
      case 'room_created':
        return renderRoomCreated();
      case 'battle_starting':
        return renderBattleStarting();
      case 'battle_active':
        return renderBattleActive();
      case 'battle_finished':
        return renderBattleFinished();
      default:
        return renderLobby();
    }
  };

  return renderCurrentPhase();
};

// Componente para card de player
const PlayerCard = ({ player, onChallenge, disabled }: {
  player: Player;
  onChallenge: () => void;
  disabled: boolean;
}) => {
  const getStatusColor = (status: Player['status']) => {
    switch (status) {
      case 'online': return 'text-victory';
      case 'waiting': return 'text-epic';
      case 'in_battle': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: Player['status']) => {
    switch (status) {
      case 'online': return '🟢 Online';
      case 'waiting': return '⏳ Aguardando';
      case 'in_battle': return '⚔️ Em Batalha';
      default: return '⚫ Offline';
    }
  };

  const canChallenge = player.status === 'online' || player.status === 'waiting';

  return (
    <div className="arena-card p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">{player.level > 25 ? '👑' : '⚔️'}</div>
          <div>
            <h4 className="font-bold truncate">{player.name}</h4>
            <p className="text-xs text-muted-foreground">Nível {player.level}</p>
          </div>
        </div>
        <div className={`text-xs ${getStatusColor(player.status)}`}>
          {getStatusText(player.status)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <p className="text-muted-foreground">XP</p>
          <p className="font-semibold">{player.xp.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Vitórias</p>
          <p className="font-semibold text-victory">{player.winRate}%</p>
        </div>
      </div>

      <ActionButton
        variant={canChallenge ? "epic" : "battle"}
        onClick={onChallenge}
        disabled={disabled || !canChallenge}
        className="w-full text-sm"
      >
        {canChallenge ? (
          <><Sword className="w-4 h-4 mr-1" /> Desafiar</>
        ) : (
          'Indisponível'
        )}
      </ActionButton>
    </div>
  );
};

export default ArenaNew;
