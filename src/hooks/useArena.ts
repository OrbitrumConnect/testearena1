import { useState, useCallback, useEffect } from 'react';
import { Player, BattleRoom, BattleState, ArenaPhase } from '@/types/arena';

// Simulação de players online (em produção seria WebSocket/Socket.io)
const generateMockPlayers = (): Player[] => {
  const names = ['DragonSlayer', 'WisdomMaster', 'HistoryBuff', 'KnowledgeKing', 'ScholarWarrior', 'AncientWise'];
  const statuses: Player['status'][] = ['online', 'waiting', 'in_battle'];
  
  return names.map((name, index) => ({
    id: `player_${index + 1}`,
    name: `${name}${Math.floor(Math.random() * 100)}`,
    level: Math.floor(Math.random() * 50) + 1,
    xp: Math.floor(Math.random() * 10000),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    winRate: Math.floor(Math.random() * 100),
    totalBattles: Math.floor(Math.random() * 200),
    currentHp: 100,
    maxHp: 100
  }));
};

export const useArena = () => {
  const [currentPlayer] = useState<Player>({
    id: 'current_player',
    name: 'Guerreiro',
    level: 15,
    xp: 2500,
    status: 'online',
    winRate: 75,
    totalBattles: 20,
    currentHp: 100,
    maxHp: 100
  });

  const [phase, setPhase] = useState<ArenaPhase>('lobby');
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedOpponent, setSelectedOpponent] = useState<Player | null>(null);
  const [battleRoom, setBattleRoom] = useState<BattleRoom | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar players disponíveis
  const loadAvailablePlayers = useCallback(async () => {
    setLoading(true);
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const players = generateMockPlayers().filter(p => 
        p.status === 'online' || p.status === 'waiting'
      );
      
      setAvailablePlayers(players);
    } catch (err) {
      setError('Erro ao carregar players disponíveis');
    } finally {
      setLoading(false);
    }
  }, []);

  // Desafiar um player específico
  const challengePlayer = useCallback(async (opponent: Player) => {
    setLoading(true);
    setSelectedOpponent(opponent);
    setPhase('matchmaking');
    
    try {
      // Simular processo de matchmaking
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Criar sala de batalha
      const room: BattleRoom = {
        id: `battle_${Date.now()}`,
        player1: currentPlayer,
        player2: opponent,
        status: 'starting',
        betAmount: 9.00,
        totalPool: 18.00,
        currentRound: 0,
        maxRounds: 5,
        questions: [], // Será populado com perguntas
        turnMode: 'simultaneous',
        timeLeft: 30,
        createdAt: new Date()
      };
      
      setBattleRoom(room);
      setPhase('room_created');
      
      // Inicializar estado da batalha
      const initialBattleState: BattleState = {
        room,
        player1Answers: [],
        player2Answers: [],
        player1Hp: 100,
        player2Hp: 100,
        battleLog: [{
          id: `event_${Date.now()}`,
          type: 'round_start',
          data: { round: 1 },
          timestamp: new Date()
        }]
      };
      
      setBattleState(initialBattleState);
      
      // Auto-start após 3 segundos
      setTimeout(() => {
        setPhase('battle_starting');
        setTimeout(() => {
          setPhase('battle_active');
        }, 3000);
      }, 2000);
      
    } catch (err) {
      setError('Erro ao criar batalha');
      setPhase('lobby');
    } finally {
      setLoading(false);
    }
  }, [currentPlayer]);

  // Busca automática de adversário
  const findRandomOpponent = useCallback(async () => {
    const availableOpponents = availablePlayers.filter(p => p.status === 'waiting');
    if (availableOpponents.length > 0) {
      const randomOpponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
      await challengePlayer(randomOpponent);
    } else {
      setError('Nenhum adversário disponível no momento');
    }
  }, [availablePlayers, challengePlayer]);

  // Responder pergunta na batalha
  const answerQuestion = useCallback((questionId: string, selectedAnswer: number) => {
    if (!battleState || phase !== 'battle_active') return;
    
    // Simular resposta e dano
    const isCorrect = Math.random() > 0.3; // 70% chance de acerto para demo
    const damage = isCorrect ? 0 : 20; // Perde 20 HP se errar
    const opponentDamage = isCorrect ? 20 : 0; // Causa 20 HP se acertar
    
    setBattleState(prev => {
      if (!prev) return null;
      
      const newPlayer1Hp = Math.max(0, prev.player1Hp - damage);
      const newPlayer2Hp = Math.max(0, prev.player2Hp - opponentDamage);
      
      // Verificar se alguém morreu
      if (newPlayer1Hp <= 0 || newPlayer2Hp <= 0) {
        setPhase('battle_finished');
        return {
          ...prev,
          player1Hp: newPlayer1Hp,
          player2Hp: newPlayer2Hp,
          winner: newPlayer1Hp > 0 ? prev.room.player1 : prev.room.player2,
          loser: newPlayer1Hp <= 0 ? prev.room.player1 : prev.room.player2
        };
      }
      
      return {
        ...prev,
        player1Hp: newPlayer1Hp,
        player2Hp: newPlayer2Hp,
        battleLog: [...prev.battleLog, {
          id: `event_${Date.now()}`,
          type: 'answer',
          playerId: currentPlayer.id,
          data: { isCorrect, damage: opponentDamage },
          timestamp: new Date()
        }]
      };
    });
  }, [battleState, phase, currentPlayer]);

  // Voltar para lobby
  const returnToLobby = useCallback(() => {
    setPhase('lobby');
    setBattleRoom(null);
    setBattleState(null);
    setSelectedOpponent(null);
    setError(null);
    loadAvailablePlayers();
  }, [loadAvailablePlayers]);

  // Carregar players na inicialização
  useEffect(() => {
    if (phase === 'lobby') {
      loadAvailablePlayers();
    }
  }, [phase, loadAvailablePlayers]);

  // Simular atualizações em tempo real
  useEffect(() => {
    if (phase === 'lobby') {
      const interval = setInterval(() => {
        setAvailablePlayers(prev => 
          prev.map(player => ({
            ...player,
            status: Math.random() > 0.9 
              ? (player.status === 'online' ? 'waiting' : 'online')
              : player.status
          }))
        );
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [phase]);

  return {
    currentPlayer,
    phase,
    availablePlayers,
    selectedOpponent,
    battleRoom,
    battleState,
    loading,
    error,
    actions: {
      challengePlayer,
      findRandomOpponent,
      answerQuestion,
      returnToLobby,
      refreshPlayers: loadAvailablePlayers
    }
  };
};
