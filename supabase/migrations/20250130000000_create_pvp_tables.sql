-- Tabela para fila de matchmaking
CREATE TABLE IF NOT EXISTS matchmaking_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'matched')),
  bet_amount DECIMAL(10,2) NOT NULL DEFAULT 9.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para batalhas ativas em tempo real
CREATE TABLE IF NOT EXISTS active_battles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  player2_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
  bet_amount DECIMAL(10,2) NOT NULL DEFAULT 9.00,
  total_pool DECIMAL(10,2) NOT NULL DEFAULT 18.00,
  current_round INTEGER NOT NULL DEFAULT 1,
  max_rounds INTEGER NOT NULL DEFAULT 5,
  player1_hp INTEGER NOT NULL DEFAULT 100,
  player2_hp INTEGER NOT NULL DEFAULT 100,
  winner_id UUID REFERENCES profiles(user_id),
  questions_data JSONB, -- Armazenar perguntas da batalha
  battle_log JSONB DEFAULT '[]'::JSONB, -- Log de eventos da batalha
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Tabela para respostas em tempo real durante a batalha
CREATE TABLE IF NOT EXISTS battle_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  battle_id UUID NOT NULL REFERENCES active_battles(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time_ms INTEGER NOT NULL,
  damage_dealt INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_matchmaking_queue_status ON matchmaking_queue(status);
CREATE INDEX IF NOT EXISTS idx_matchmaking_queue_user_id ON matchmaking_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_active_battles_status ON active_battles(status);
CREATE INDEX IF NOT EXISTS idx_active_battles_players ON active_battles(player1_id, player2_id);
CREATE INDEX IF NOT EXISTS idx_battle_answers_battle_id ON battle_answers(battle_id);

-- RLS (Row Level Security) para segurança
ALTER TABLE matchmaking_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_answers ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para matchmaking_queue
CREATE POLICY "Users can view their own queue entries" ON matchmaking_queue
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own queue entries" ON matchmaking_queue
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own queue entries" ON matchmaking_queue
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own queue entries" ON matchmaking_queue
  FOR DELETE USING (user_id = auth.uid());

-- Políticas RLS para active_battles
CREATE POLICY "Players can view their own battles" ON active_battles
  FOR SELECT USING (player1_id = auth.uid() OR player2_id = auth.uid());

CREATE POLICY "System can insert battles" ON active_battles
  FOR INSERT WITH CHECK (true); -- Será controlado pela aplicação

CREATE POLICY "Players can update their battles" ON active_battles
  FOR UPDATE USING (player1_id = auth.uid() OR player2_id = auth.uid());

-- Políticas RLS para battle_answers
CREATE POLICY "Players can view battle answers" ON battle_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM active_battles 
      WHERE id = battle_id 
      AND (player1_id = auth.uid() OR player2_id = auth.uid())
    )
  );

CREATE POLICY "Players can insert their own answers" ON battle_answers
  FOR INSERT WITH CHECK (player_id = auth.uid());

-- Função para atualizar saldo da carteira
CREATE OR REPLACE FUNCTION update_wallet_balance(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE user_wallet 
  SET 
    balance = balance + amount,
    total_earned = CASE WHEN amount > 0 THEN total_earned + amount ELSE total_earned END,
    total_spent = CASE WHEN amount < 0 THEN total_spent + ABS(amount) ELSE total_spent END,
    updated_at = NOW()
  WHERE user_wallet.user_id = update_wallet_balance.user_id;
  
  -- Se não existe carteira, criar uma
  IF NOT FOUND THEN
    INSERT INTO user_wallet (user_id, balance, total_earned, total_spent)
    VALUES (
      update_wallet_balance.user_id, 
      GREATEST(amount, 0), 
      GREATEST(amount, 0), 
      CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar estatísticas de batalha
CREATE OR REPLACE FUNCTION update_battle_stats(user_id UUID, won BOOLEAN)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET 
    total_battles = total_battles + 1,
    battles_won = CASE WHEN won THEN battles_won + 1 ELSE battles_won END,
    updated_at = NOW()
  WHERE profiles.user_id = update_battle_stats.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para limpar fila antiga (remove entradas com mais de 1 hora)
CREATE OR REPLACE FUNCTION cleanup_old_queue_entries()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM matchmaking_queue 
  WHERE created_at < NOW() - INTERVAL '1 hour';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_cleanup_queue
  AFTER INSERT ON matchmaking_queue
  EXECUTE FUNCTION cleanup_old_queue_entries();

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_matchmaking_queue_updated_at
  BEFORE UPDATE ON matchmaking_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trigger_active_battles_updated_at
  BEFORE UPDATE ON active_battles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
