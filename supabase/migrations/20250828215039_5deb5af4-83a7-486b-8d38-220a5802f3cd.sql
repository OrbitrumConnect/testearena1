-- Add sample knowledge items for each era

-- Get era IDs
WITH era_data AS (
  SELECT id AS egito_id FROM public.eras WHERE slug = 'egito-antigo'
  UNION ALL
  SELECT id AS mesopotamia_id FROM public.eras WHERE slug = 'mesopotamia'
  UNION ALL
  SELECT id AS medieval_id FROM public.eras WHERE slug = 'idade-media'
  UNION ALL
  SELECT id AS digital_id FROM public.eras WHERE slug = 'era-digital'
),
eras AS (
  SELECT 
    (SELECT id FROM public.eras WHERE slug = 'egito-antigo') AS egito_id,
    (SELECT id FROM public.eras WHERE slug = 'mesopotamia') AS mesopotamia_id,
    (SELECT id FROM public.eras WHERE slug = 'idade-media') AS medieval_id,
    (SELECT id FROM public.eras WHERE slug = 'era-digital') AS digital_id
)

-- Insert sample knowledge items
INSERT INTO public.knowledge_items (era_id, category, item_type, title, content, question, correct_answer, wrong_options, year_start, year_end, tags) 

-- Egito Antigo samples
SELECT 
  eras.egito_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Unificação do Egito',
  'Narmer (também conhecido como Menés) foi o primeiro faraó a unificar o Alto e o Baixo Egito em cerca de 3100 a.C., criando o primeiro estado centralizado da história.',
  'Quem unificou o Egito em 3100 a.C.?',
  'Narmer',
  '["Akhenaton", "Tutancâmon", "Ramsés II"]'::jsonb,
  -3100,
  -3100,
  ARRAY['unificação', 'faraó', 'estado']
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Pirâmides de Giza',
  'As pirâmides de Giza (2630 a.C.) representam avanços extraordinários em engenharia e matemática, servindo como túmulos monumentais dos faraós.',
  'Em que ano foram construídas as pirâmides de Giza?',
  '2630 a.C.',
  '["3100 a.C.", "2000 a.C.", "1500 a.C."]'::jsonb,
  -2630,
  -2630,
  ARRAY['pirâmides', 'engenharia', 'faraó']
FROM eras

UNION ALL

-- Mesopotâmia samples
SELECT 
  eras.mesopotamia_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Código de Hamurabi',
  'O Código de Hamurabi (1750 a.C.) foi uma das primeiras leis escritas da história, criado pelo rei babilônico Hamurabi.',
  'Quem criou o primeiro código de leis escrito?',
  'Hamurabi',
  '["Nabucodonosor", "Sargão", "Gilgamesh"]'::jsonb,
  -1750,
  -1750,
  ARRAY['leis', 'babilônia', 'código']
FROM eras

UNION ALL

SELECT 
  eras.mesopotamia_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Escrita Cuneiforme',
  'A escrita cuneiforme (3000 a.C.) foi desenvolvida pelos sumérios, marcando o fim da Pré-História e o início dos registros históricos.',
  'Qual civilização criou a escrita cuneiforme?',
  'Sumérios',
  '["Babilônios", "Assírios", "Persas"]'::jsonb,
  -3000,
  -3000,
  ARRAY['escrita', 'sumérios', 'história']
FROM eras

UNION ALL

-- Idade Média samples
SELECT 
  eras.medieval_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Magna Carta',
  'A Magna Carta (1215) foi um documento que limitou o poder do rei João da Inglaterra, estabelecendo direitos dos nobres.',
  'Que documento limitou o poder do rei na Inglaterra em 1215?',
  'Magna Carta',
  '["Carta de Direitos", "Declaração de Independência", "Código Civil"]'::jsonb,
  1215,
  1215,
  ARRAY['direitos', 'inglaterra', 'nobreza']
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'finance'::knowledge_category,
  'qa'::knowledge_item_type,
  'Ordem dos Templários',
  'Os Templários (1119) criaram o primeiro sistema bancário medieval, usando letras de câmbio para transferências seguras.',
  'Qual ordem militar criou o primeiro sistema bancário medieval?',
  'Templários',
  '["Hospitalários", "Teutônicos", "Santiago"]'::jsonb,
  1119,
  1300,
  ARRAY['bancos', 'templários', 'finanças']
FROM eras

UNION ALL

-- Era Digital samples
SELECT 
  eras.digital_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'ENIAC',
  'O ENIAC (1946) foi um dos primeiros computadores eletrônicos, pesando 27 toneladas e ocupando uma sala inteira.',
  'Qual foi um dos primeiros computadores eletrônicos?',
  'ENIAC',
  '["IBM PC", "Apple II", "Commodore 64"]'::jsonb,
  1946,
  1946,
  ARRAY['computador', 'eletrônico', 'tecnologia']
FROM eras

UNION ALL

SELECT 
  eras.digital_id,
  'future'::knowledge_category,
  'qa'::knowledge_item_type,
  'Bitcoin',
  'Bitcoin (2009) foi a primeira criptomoeda descentralizada, criada por Satoshi Nakamoto, revolucionando as finanças digitais.',
  'Qual foi a primeira criptomoeda descentralizada?',
  'Bitcoin',
  '["Ethereum", "Litecoin", "Dogecoin"]'::jsonb,
  2009,
  2009,
  ARRAY['criptomoeda', 'blockchain', 'finanças']
FROM eras;