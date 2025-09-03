-- Sistema Colaborativo - Arena do Conhecimento
-- Tabelas para contribuições, votação, chat e provas

-- 1. Tabela de contribuições (resumos, questões, curiosidades)
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  era_slug TEXT NOT NULL CHECK (era_slug IN ('digital', 'medieval', 'egito-antigo', 'mesopotamia')),
  category TEXT NOT NULL CHECK (category IN ('resumo', 'questao', 'curiosidade', 'anotacao')),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  votes_positive INTEGER DEFAULT 0,
  votes_negative INTEGER DEFAULT 0,
  is_validated BOOLEAN DEFAULT FALSE,
  validated_at TIMESTAMP,
  daily_count INTEGER DEFAULT 0, -- Contador diário de contribuições validadas
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tabela de votos nas contribuições
CREATE TABLE contribution_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID REFERENCES contributions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  vote_type TEXT NOT NULL CHECK (vote_type IN ('positive', 'negative')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(contribution_id, user_id)
);

-- 3. Tabela de chat da comunidade
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  era_slug TEXT CHECK (era_slug IN ('geral', 'digital', 'medieval', 'egito-antigo', 'mesopotamia')),
  message TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Tabela de moderação (advertencias e bans)
CREATE TABLE user_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  warning_type TEXT NOT NULL CHECK (warning_type IN ('warning', 'ban_15min', 'ban_1day', 'permanent')),
  reason TEXT NOT NULL,
  moderator_id UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP, -- para bans temporários
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Tabela de provas automáticas
CREATE TABLE auto_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  era_slug TEXT NOT NULL,
  questions JSONB NOT NULL, -- Array de questões personalizadas
  answers JSONB NOT NULL, -- Respostas do usuário
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- 6. Tabela de análise de desempenho
CREATE TABLE user_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  era_slug TEXT NOT NULL,
  strength_areas JSONB, -- Áreas de força identificadas
  weakness_areas JSONB, -- Áreas de fraqueza identificadas
  study_recommendations JSONB, -- Recomendações de estudo
  last_analyzed TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_contributions_user_id ON contributions(user_id);
CREATE INDEX idx_contributions_era_slug ON contributions(era_slug);
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_contributions_daily_count ON contributions(daily_count);
CREATE INDEX idx_contribution_votes_contribution_id ON contribution_votes(contribution_id);
CREATE INDEX idx_chat_messages_era_slug ON chat_messages(era_slug);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_user_warnings_user_id ON user_warnings(user_id);
CREATE INDEX idx_user_warnings_is_active ON user_warnings(is_active);

-- Função para resetar contador diário de contribuições
CREATE OR REPLACE FUNCTION reset_daily_contribution_count()
RETURNS void AS $$
BEGIN
  UPDATE contributions 
  SET daily_count = 0 
  WHERE DATE(created_at) < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Trigger para resetar contador diário
CREATE OR REPLACE FUNCTION trigger_reset_daily_count()
RETURNS trigger AS $$
BEGIN
  PERFORM reset_daily_contribution_count();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Agendar reset diário (executar manualmente no Supabase)
-- SELECT cron.schedule('reset-daily-contributions', '0 0 * * *', 'SELECT reset_daily_contribution_count();');
