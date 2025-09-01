-- Sistema PvP Real-time: 4 minutos total, saída automática
-- 🎮 Matchmaking + Confirmação + Quiz + Resultado automático

-- Fila de matchmaking
CREATE TABLE public.pvp_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'standard', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Salas de batalha PvP
CREATE TABLE public.pvp_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_id UUID NOT NULL,
  player2_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'confirming', 'playing', 'finished')),
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_question INTEGER NOT NULL DEFAULT 0,
  player1_score INTEGER NOT NULL DEFAULT 0,
  player2_score INTEGER NOT NULL DEFAULT 0,
  winner_id UUID NULL, -- NULL = empate
  plan_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE NULL,
  finished_at TIMESTAMP WITH TIME ZONE NULL
);

-- Confirmações de batalha (30s para confirmar)
CREATE TABLE public.pvp_confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.pvp_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Movimentos/respostas em tempo real
CREATE TABLE public.pvp_moves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.pvp_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  question_number INTEGER NOT NULL,
  answer INTEGER NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Histórico de partidas PvP
CREATE TABLE public.pvp_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.pvp_rooms(id),
  player1_id UUID NOT NULL,
  player2_id UUID NOT NULL,
  winner_id UUID NULL,
  player1_score INTEGER NOT NULL,
  player2_score INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  credits_bet INTEGER NOT NULL,
  credits_won INTEGER NOT NULL,
  plan_type TEXT NOT NULL,
  finished_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.pvp_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pvp_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pvp_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pvp_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pvp_matches ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para pvp_queue
CREATE POLICY "Users can view their own queue entry" 
ON public.pvp_queue 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own queue entry" 
ON public.pvp_queue 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own queue entry" 
ON public.pvp_queue 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Políticas RLS para pvp_rooms
CREATE POLICY "Players can view their own rooms" 
ON public.pvp_rooms 
FOR SELECT 
USING (auth.uid()::text = player1_id::text OR auth.uid()::text = player2_id::text);

CREATE POLICY "Players can update their own rooms" 
ON public.pvp_rooms 
FOR UPDATE 
USING (auth.uid()::text = player1_id::text OR auth.uid()::text = player2_id::text);

-- Políticas RLS para pvp_confirmations
CREATE POLICY "Players can view confirmations for their rooms" 
ON public.pvp_confirmations 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.pvp_rooms 
  WHERE id = room_id 
  AND (auth.uid()::text = player1_id::text OR auth.uid()::text = player2_id::text)
));

CREATE POLICY "Players can insert their own confirmations" 
ON public.pvp_confirmations 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Políticas RLS para pvp_moves
CREATE POLICY "Players can view moves for their rooms" 
ON public.pvp_moves 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.pvp_rooms 
  WHERE id = room_id 
  AND (auth.uid()::text = player1_id::text OR auth.uid()::text = player2_id::text)
));

CREATE POLICY "Players can insert their own moves" 
ON public.pvp_moves 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Políticas RLS para pvp_matches
CREATE POLICY "Players can view their own matches" 
ON public.pvp_matches 
FOR SELECT 
USING (auth.uid()::text = player1_id::text OR auth.uid()::text = player2_id::text);

-- Índices para performance
CREATE INDEX idx_pvp_queue_plan_type ON public.pvp_queue(plan_type, created_at);
CREATE INDEX idx_pvp_rooms_status ON public.pvp_rooms(status);
CREATE INDEX idx_pvp_rooms_players ON public.pvp_rooms(player1_id, player2_id);
CREATE INDEX idx_pvp_moves_room_question ON public.pvp_moves(room_id, question_number);
CREATE INDEX idx_pvp_matches_players ON public.pvp_matches(player1_id, player2_id);

-- Trigger para atualizar finished_at automaticamente
CREATE OR REPLACE FUNCTION update_pvp_room_finished_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'finished' AND OLD.status != 'finished' THEN
    NEW.finished_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pvp_room_finished_at
  BEFORE UPDATE ON public.pvp_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_pvp_room_finished_at();

-- Trigger para limpar fila automaticamente após 5 minutos
CREATE OR REPLACE FUNCTION cleanup_old_queue_entries()
RETURNS void AS $$
BEGIN
  DELETE FROM public.pvp_queue 
  WHERE created_at < now() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE public.pvp_queue IS 'Fila de matchmaking para PvP - auto-cleanup após 5min';
COMMENT ON TABLE public.pvp_rooms IS 'Salas de batalha PvP - 4min total, saída automática';
COMMENT ON TABLE public.pvp_confirmations IS 'Confirmações de batalha - 30s timeout';
COMMENT ON TABLE public.pvp_moves IS 'Respostas em tempo real - 30s por pergunta';
COMMENT ON TABLE public.pvp_matches IS 'Histórico completo de partidas PvP';

COMMENT ON COLUMN public.pvp_rooms.winner_id IS 'ID do vencedor ou NULL para empate';
COMMENT ON COLUMN public.pvp_rooms.status IS 'waiting->confirming->playing->finished (auto)';
COMMENT ON COLUMN public.pvp_moves.answer IS 'Índice da resposta escolhida (0-3)';
