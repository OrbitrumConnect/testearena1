-- Criar tabela de assinaturas/planos dos usuários
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('premium', 'standard', 'basic')),
  plan_value DECIMAL(4,2) NOT NULL,
  credits_balance INTEGER NOT NULL DEFAULT 0,
  credits_initial INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para subscriptions
CREATE POLICY "Users can view their own subscription" 
ON public.user_subscriptions 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own subscription" 
ON public.user_subscriptions 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own subscription" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_plan_type ON public.user_subscriptions(plan_type);

-- Comentários para documentação
COMMENT ON TABLE public.user_subscriptions IS 'Tabela de assinaturas/planos dos usuários com sistema de 3 planos';
COMMENT ON COLUMN public.user_subscriptions.plan_type IS 'Tipo do plano: premium (R$ 5,00), standard (R$ 3,50), basic (R$ 2,00)';
COMMENT ON COLUMN public.user_subscriptions.plan_value IS 'Valor pago pelo plano em reais';
COMMENT ON COLUMN public.user_subscriptions.credits_balance IS 'Saldo atual de créditos do usuário';
COMMENT ON COLUMN public.user_subscriptions.credits_initial IS 'Créditos iniciais recebidos no plano';
