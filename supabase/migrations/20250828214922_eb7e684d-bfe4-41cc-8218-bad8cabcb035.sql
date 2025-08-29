-- Create enums for categories and item types
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'knowledge_category') THEN
    CREATE TYPE public.knowledge_category AS ENUM ('history','finance','technology','future');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'knowledge_item_type') THEN
    CREATE TYPE public.knowledge_item_type AS ENUM ('fact','qa');
  END IF;
END $$;

-- Common updated_at trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eras table
CREATE TABLE IF NOT EXISTS public.eras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Knowledge items table
CREATE TABLE IF NOT EXISTS public.knowledge_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  era_id UUID NOT NULL REFERENCES public.eras(id) ON DELETE CASCADE,
  category public.knowledge_category NOT NULL DEFAULT 'history',
  item_type public.knowledge_item_type NOT NULL DEFAULT 'fact',
  title TEXT,
  content TEXT,
  question TEXT,
  correct_answer TEXT,
  wrong_options JSONB NOT NULL DEFAULT '[]'::jsonb,
  source TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  year_start INT,
  year_end INT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT question_answer_presence CHECK (
    (item_type = 'fact' AND content IS NOT NULL) OR
    (item_type = 'qa' AND question IS NOT NULL AND correct_answer IS NOT NULL)
  )
);

-- Triggers for updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_eras_updated_at'
  ) THEN
    CREATE TRIGGER trg_eras_updated_at
    BEFORE UPDATE ON public.eras
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_knowledge_items_updated_at'
  ) THEN
    CREATE TRIGGER trg_knowledge_items_updated_at
    BEFORE UPDATE ON public.knowledge_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_items_era ON public.knowledge_items(era_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_type ON public.knowledge_items(item_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_category ON public.knowledge_items(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_year_start ON public.knowledge_items(year_start);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_tags ON public.knowledge_items USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_wrong_options ON public.knowledge_items USING GIN (wrong_options);

-- RLS
ALTER TABLE public.eras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_items ENABLE ROW LEVEL SECURITY;

-- Public read policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Eras are readable by everyone'
  ) THEN
    CREATE POLICY "Eras are readable by everyone"
    ON public.eras FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Knowledge items are readable by everyone'
  ) THEN
    CREATE POLICY "Knowledge items are readable by everyone"
    ON public.knowledge_items FOR SELECT USING (true);
  END IF;
END $$;

-- Optional: allow inserts/updates for authenticated users later (kept disabled now)
-- No write policies created; writes are denied by default for safety.

-- Seed eras
INSERT INTO public.eras (slug, name, description) VALUES
  ('egito-antigo', 'Egito Antigo', 'Civilização do Nilo, faraós e pirâmides.'),
  ('mesopotamia', 'Mesopotâmia', 'Entre Tigre e Eufrates, berço da escrita.'),
  ('idade-media', 'Idade Média', 'Feudos, cruzadas e universidades.'),
  ('era-digital', 'Era Digital', 'Computação, internet e IA.')