import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Clock, Target, ArrowLeft, Zap, Shield, Users, Search, Crown, Trophy, Play } from 'lucide-react';
import { ActionButton } from '@/components/arena/ActionButton';
import { ParticleBackground } from '@/components/ui/particles';
import { Progress } from '@/components/ui/progress';
import { useArena } from '@/hooks/useArena';
import { usePvPLimit } from '@/hooks/usePvPLimit';
import { Player } from '@/types/arena';
import { RealPvPExplanation } from '@/components/arena/RealPvPExplanation';

const ArenaNew = () => {
  const navigate = useNavigate();
  const pvpLimit = usePvPLimit();
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

  // Renderizar lista de players (Lobby)
  const renderLobby = () => (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto p-6">
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

        <div className="arena-card-epic p-8 text-center mb-8">
          <div className="text-6xl mb-6">⚔️</div>
          <h2 className="text-3xl font-montserrat font-bold text-epic mb-4">
            Arena PvP - Player vs Player
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Desafie outros guerreiros em batalhas épicas de conhecimento!
          </p>
          
          {/* Aviso sobre Limite PvP */}
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6 mx-auto max-w-md">
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

          {/* Informações do sistema PvP */}
          <div className="arena-card p-4 mb-6 bg-epic/10 border-epic">
            <p className="text-epic font-semibold">
              💰 Custo da Batalha: 900 créditos
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Vitória: +500 créditos | Derrota: -900 créditos | Pool: 1.800 créditos
            </p>
          </div>

          {/* Busca automática */}
          <div className="mb-6">
            <ActionButton 
              variant="epic" 
              icon={<Search />}
              onClick={actions.findRandomOpponent}
              disabled={loading}
              className="w-full mb-4"
            >
              {loading ? 'Procurando...' : 'Buscar Adversário Automático'}
            </ActionButton>
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
            <p className="text-epic font-semibold">💰 Pool Total: 1.800 créditos</p>
            <p className="text-sm text-muted-foreground">Vencedor leva 1.400 créditos | Plataforma: 400 créditos</p>
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
              <p className="text-xl mb-6">
                {battleState.winner.id === currentPlayer.id 
                  ? 'Você ganhou +500 créditos!' 
                  : 'Você perdeu 900 créditos'}
              </p>
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

  // Renderizar baseado na fase atual
  const renderCurrentPhase = () => {
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
