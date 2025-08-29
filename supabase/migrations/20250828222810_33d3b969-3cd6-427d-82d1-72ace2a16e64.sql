-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER NOT NULL DEFAULT 0,
  total_battles INTEGER NOT NULL DEFAULT 0,
  battles_won INTEGER NOT NULL DEFAULT 0,
  favorite_era TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Criar tabela de carteira do usuário
CREATE TABLE public.user_wallet (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_earned DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_wallet ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para wallet
CREATE POLICY "Users can view their own wallet" 
ON public.user_wallet 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own wallet" 
ON public.user_wallet 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own wallet" 
ON public.user_wallet 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Criar tabela de histórico de batalhas
CREATE TABLE public.battle_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  era_name TEXT NOT NULL,
  questions_total INTEGER NOT NULL,
  questions_correct INTEGER NOT NULL,
  accuracy_percentage INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  money_earned DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  battle_duration_seconds INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.battle_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para battle_history
CREATE POLICY "Users can view their own battle history" 
ON public.battle_history 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own battle history" 
ON public.battle_history 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Criar tabela de transações da carteira
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'bonus')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  battle_id UUID REFERENCES public.battle_history(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para transactions
CREATE POLICY "Users can view their own transactions" 
ON public.wallet_transactions 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own transactions" 
ON public.wallet_transactions 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_wallet_updated_at
BEFORE UPDATE ON public.user_wallet
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();