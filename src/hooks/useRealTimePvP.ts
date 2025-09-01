import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getPvPValues, updateNewSubscriptionCredits } from '@/utils/creditsIntegration';

export interface PvPRoom {
  id: string;
  player1_id: string;
  player2_id: string;
  status: 'waiting' | 'confirming' | 'playing' | 'finished';
  questions: any[];
  current_question: number;
  player1_score: number;
  player2_score: number;
  winner_id?: string;
  created_at: string;
  started_at?: string;
  plan_type: string;
}

export interface PvPMove {
  id: string;
  room_id: string;
  user_id: string;
  question_number: number;
  answer: number;
  answered_at: string;
}

const PVP_CONFIG = {
  TOTAL_TIME: 240,        // 4 minutos total
  QUESTIONS: 8,           // 8 perguntas
  TIME_PER_QUESTION: 30,  // 30 segundos cada
  CONFIRMATION_TIME: 30,  // 30s para confirmar
  AUTO_EXIT_DELAY: 10     // 10s para sair automaticamente
};

export const useRealTimePvP = (roomId?: string) => {
  const navigate = useNavigate();
  const [room, setRoom] = useState<PvPRoom | null>(null);
  const [timeLeft, setTimeLeft] = useState(PVP_CONFIG.TIME_PER_QUESTION);
  const [totalTimeLeft, setTotalTimeLeft] = useState(PVP_CONFIG.TOTAL_TIME);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [myAnswers, setMyAnswers] = useState<number[]>([]);
  const [opponentAnswers, setOpponentAnswers] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'confirming' | 'playing' | 'finished'>('waiting');
  const [loading, setLoading] = useState(true);
  const [confirmationTimeLeft, setConfirmationTimeLeft] = useState(PVP_CONFIG.CONFIRMATION_TIME);

  // 🎮 Buscar oponente e criar sala
  const findMatch = useCallback(async (userId: string, planType: string) => {
    try {
      // 1. Verificar se já existe oponente na fila
      const { data: waitingPlayer } = await supabase
        .from('pvp_queue')
        .select('*')
        .eq('plan_type', planType)
        .neq('user_id', userId)
        .order('created_at')
        .limit(1)
        .maybeSingle();

      if (waitingPlayer) {
        // 2. Encontrou oponente - criar sala
        const questions = await generatePvPQuestions();
        
        const { data: newRoom } = await supabase
          .from('pvp_rooms')
          .insert({
            player1_id: userId,
            player2_id: waitingPlayer.user_id,
            status: 'confirming',
            questions: questions,
            current_question: 0,
            player1_score: 0,
            player2_score: 0,
            plan_type: planType
          })
          .select()
          .single();

        // 3. Remover ambos da fila
        await supabase
          .from('pvp_queue')
          .delete()
          .in('user_id', [userId, waitingPlayer.user_id]);

        return newRoom;
      } else {
        // 4. Não encontrou - entrar na fila
        await supabase
          .from('pvp_queue')
          .insert({
            user_id: userId,
            plan_type: planType
          });

        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar partida:', error);
      return null;
    }
  }, []);

  // 📝 Gerar perguntas mistas
  const generatePvPQuestions = async () => {
    try {
      // Buscar perguntas de diferentes eras
      const { data: allQuestions } = await supabase
        .from('knowledge_items')
        .select('*')
        .eq('item_type', 'qa')
        .eq('is_verified', true)
        .limit(50);

      if (!allQuestions) return [];

      // Misturar e pegar 8 aleatórias
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, PVP_CONFIG.QUESTIONS);
    } catch (error) {
      console.error('Erro ao gerar perguntas:', error);
      return [];
    }
  };

  // ✅ Confirmar participação
  const confirmBattle = useCallback(async (userId: string) => {
    if (!room) return;

    try {
      await supabase
        .from('pvp_confirmations')
        .insert({
          room_id: room.id,
          user_id: userId,
          confirmed: true
        });

      // Verificar se ambos confirmaram
      const { data: confirmations } = await supabase
        .from('pvp_confirmations')
        .select('*')
        .eq('room_id', room.id);

      if (confirmations && confirmations.length === 2) {
        // Iniciar jogo
        await supabase
          .from('pvp_rooms')
          .update({ 
            status: 'playing',
            started_at: new Date().toISOString()
          })
          .eq('id', room.id);
      }
    } catch (error) {
      console.error('Erro ao confirmar batalha:', error);
    }
  }, [room]);

  // 🎯 Responder pergunta
  const answerQuestion = useCallback(async (userId: string, answer: number) => {
    if (!room) return;

    try {
      await supabase
        .from('pvp_moves')
        .insert({
          room_id: room.id,
          user_id: userId,
          question_number: currentQuestion,
          answer: answer
        });

      // Atualizar respostas locais
      setMyAnswers(prev => [...prev, answer]);
    } catch (error) {
      console.error('Erro ao responder:', error);
    }
  }, [room, currentQuestion]);

  // ⏱️ Timer principal do jogo (4 minutos total)
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const interval = setInterval(() => {
      setTotalTimeLeft(prev => {
        if (prev <= 1) {
          // 🚨 TEMPO ESGOTADO - FINALIZAR AUTOMATICAMENTE
          finishGameByTimeout();
          return 0;
        }
        return prev - 1;
      });

      setTimeLeft(prev => {
        if (prev <= 1) {
          // ⏭️ Próxima pergunta automaticamente
          if (currentQuestion < PVP_CONFIG.QUESTIONS - 1) {
            setCurrentQuestion(curr => curr + 1);
            return PVP_CONFIG.TIME_PER_QUESTION;
          } else {
            // 🏁 Última pergunta - finalizar
            finishGameByTimeout();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gamePhase, currentQuestion]);

  // ⏰ Timer de confirmação
  useEffect(() => {
    if (gamePhase !== 'confirming') return;

    const interval = setInterval(() => {
      setConfirmationTimeLeft(prev => {
        if (prev <= 1) {
          // 🚫 Tempo de confirmação esgotado - cancelar
          cancelGameByTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gamePhase]);

  // 🚨 Finalizar por timeout
  const finishGameByTimeout = useCallback(async () => {
    if (!room) return;

    try {
      // Calcular vencedor baseado nas respostas
      const player1Score = calculateScore(myAnswers, room.questions);
      const player2Score = calculateScore(opponentAnswers, room.questions);
      
      let winnerId = null;
      if (player1Score > player2Score) {
        winnerId = room.player1_id;
      } else if (player2Score > player1Score) {
        winnerId = room.player2_id;
      }
      // Empate = winnerId fica null

      // Atualizar sala
      await supabase
        .from('pvp_rooms')
        .update({
          status: 'finished',
          player1_score: player1Score,
          player2_score: player2Score,
          winner_id: winnerId
        })
        .eq('id', room.id);

      // 💰 Processar créditos
      await processPvPCredits(room, winnerId);

      setGamePhase('finished');

      // 🚪 Sair automaticamente após 10 segundos
      setTimeout(() => {
        navigate('/');
      }, PVP_CONFIG.AUTO_EXIT_DELAY * 1000);

    } catch (error) {
      console.error('Erro ao finalizar jogo:', error);
    }
  }, [room, myAnswers, opponentAnswers, navigate]);

  // 🚫 Cancelar por timeout na confirmação
  const cancelGameByTimeout = useCallback(async () => {
    if (!room) return;

    await supabase
      .from('pvp_rooms')
      .delete()
      .eq('id', room.id);

    navigate('/arena-new');
  }, [room, navigate]);

  // 🧮 Calcular pontuação
  const calculateScore = (answers: number[], questions: any[]) => {
    return answers.reduce((score, answer, index) => {
      const question = questions[index];
      if (question && answer === question.correct_answer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  // 💰 Processar créditos do PvP
  const processPvPCredits = async (room: PvPRoom, winnerId: string | null) => {
    const pvpValues = getPvPValues(room.plan_type as any);

    if (winnerId) {
      // 🏆 Vencedor ganha, perdedor perde
      const loserId = winnerId === room.player1_id ? room.player2_id : room.player1_id;
      
      // Simular para demo (localStorage)
      if (winnerId === 'current-user-id') { // TODO: pegar ID real
        updateNewSubscriptionCredits(
          pvpValues.winnerReceives - pvpValues.betAmount,
          `Vitória PvP (${room.plan_type})`
        );
      } else {
        updateNewSubscriptionCredits(
          -pvpValues.betAmount,
          `Derrota PvP (${room.plan_type})`
        );
      }
    } else {
      // ⚖️ Empate - ambos perdem aposta (plataforma fica com tudo)
      updateNewSubscriptionCredits(
        -pvpValues.betAmount,
        `Empate PvP (${room.plan_type})`
      );
    }
  };

  // 🎧 Escutar mudanças em tempo real
  useEffect(() => {
    if (!roomId) return;

    const roomChannel = supabase
      .channel(`pvp-room-${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pvp_rooms',
        filter: `id=eq.${roomId}`
      }, (payload) => {
        setRoom(payload.new as PvPRoom);
        setGamePhase(payload.new.status);
      })
      .subscribe();

    const movesChannel = supabase
      .channel(`pvp-moves-${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'pvp_moves',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        const move = payload.new as PvPMove;
        // Atualizar resposta do oponente
        setOpponentAnswers(prev => {
          const newAnswers = [...prev];
          newAnswers[move.question_number] = move.answer;
          return newAnswers;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(movesChannel);
    };
  }, [roomId]);

  return {
    // Estado
    room,
    timeLeft,
    totalTimeLeft,
    currentQuestion,
    gamePhase,
    confirmationTimeLeft,
    loading,
    myAnswers,
    opponentAnswers,

    // Ações
    findMatch,
    confirmBattle,
    answerQuestion,

    // Utilitários
    PVP_CONFIG
  };
};
