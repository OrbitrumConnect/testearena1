// Tipos para o sistema PvP Arena

export interface Player {
  id: string;
  name: string;
  level: number;
  xp: number;
  status: 'online' | 'waiting' | 'in_battle' | 'offline';
  avatar?: string;
  winRate: number;
  totalBattles: number;
  currentHp?: number;
  maxHp?: number;
}

export interface BattleRoom {
  id: string;
  player1: Player;
  player2: Player;
  status: 'waiting' | 'starting' | 'active' | 'finished';
  betAmount: number;
  totalPool: number;
  currentRound: number;
  maxRounds: number;
  questions: Question[];
  currentQuestion?: Question;
  turnMode: 'simultaneous' | 'turns';
  currentTurn?: 'player1' | 'player2';
  timeLeft: number;
  createdAt: Date;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  era: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BattleAnswer {
  playerId: string;
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  responseTime: number;
  timestamp: Date;
}

export interface BattleState {
  room: BattleRoom;
  player1Answers: BattleAnswer[];
  player2Answers: BattleAnswer[];
  player1Hp: number;
  player2Hp: number;
  winner?: Player;
  loser?: Player;
  battleLog: BattleEvent[];
}

export interface BattleEvent {
  id: string;
  type: 'answer' | 'damage' | 'heal' | 'round_start' | 'round_end' | 'battle_end';
  playerId?: string;
  data: any;
  timestamp: Date;
}

export type ArenaPhase = 
  | 'lobby'           // Lista de players, procurar adversário
  | 'matchmaking'     // Procurando/aguardando match
  | 'room_created'    // Sala criada, aguardando players
  | 'battle_starting' // Countdown para iniciar
  | 'battle_active'   // Batalha em andamento
  | 'battle_finished' // Resultado da batalha
  | 'leaving';        // Saindo da arena
