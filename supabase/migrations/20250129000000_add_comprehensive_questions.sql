-- Add comprehensive question bank for all eras
-- This migration adds 50 questions total: 13 Egypt, 12 Mesopotamia, 13 Medieval, 12 Digital

-- First, clear existing sample data to avoid duplicates
DELETE FROM public.knowledge_items WHERE title IN (
  'Unificação do Egito', 'Pirâmides de Giza', 'Código de Hamurabi', 
  'Escrita Cuneiforme', 'Magna Carta', 'Ordem dos Templários'
);

-- Get era IDs for reference
WITH eras AS (
  SELECT 
    (SELECT id FROM public.eras WHERE slug = 'egito-antigo') AS egito_id,
    (SELECT id FROM public.eras WHERE slug = 'mesopotamia') AS mesopotamia_id,
    (SELECT id FROM public.eras WHERE slug = 'idade-media') AS medieval_id,
    (SELECT id FROM public.eras WHERE slug = 'era-digital') AS digital_id
)

-- Insert Egypt questions (13 questions)
INSERT INTO public.knowledge_items (era_id, category, item_type, title, content, question, correct_answer, wrong_options, tags, is_verified) 
SELECT 
  eras.egito_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Deus Rá - Sol e Criação',
  'Rá era o principal deus egípcio associado ao sol e à criação, sendo considerado o rei dos deuses no panteão egípcio.',
  'Qual deus egípcio era associado ao sol e à criação?',
  'Rá',
  '["Anúbis", "Osíris", "Thoth"]'::jsonb,
  ARRAY['deuses', 'mitologia', 'sol'],
  true
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Rainha Hatshepsut',
  'Hatshepsut foi uma das rainhas mais poderosas do Egito, assumindo o título de faraó e construindo templos grandiosos.',
  'Qual rainha egípcia assumiu o título de faraó e construiu templos grandiosos?',
  'Hatshepsut',
  '["Nefertiti", "Cleópatra", "Tiy"]'::jsonb,
  ARRAY['rainhas', 'faraós', 'templos'],
  true
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Rio Nilo - Fertilização',
  'O Rio Nilo inundava anualmente, depositando sedimentos férteis que tornavam possível a agricultura no Egito.',
  'Qual rio inundava anualmente, fertilizando as terras egípcias?',
  'Nilo',
  '["Tigre", "Eufrates", "Jordão"]'::jsonb,
  ARRAY['geografia', 'agricultura', 'rio'],
  true
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Gatos Sagrados',
  'Os gatos eram considerados animais sagrados no Egito, sendo mumificados e associados à deusa Bastet.',
  'Qual animal era mumificado e considerado sagrado pelos egípcios?',
  'Gato',
  '["Cão", "Cavalo", "Leão"]'::jsonb,
  ARRAY['animais', 'religião', 'mumificação'],
  true
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Obeliscos Astronômicos',
  'Os obeliscos egípcios eram usados como instrumentos para observar as estrelas e medir o tempo.',
  'Qual estrutura egípcia era usada para observar as estrelas?',
  'Obelisco',
  '["Pirâmide", "Templo", "Esfinge"]'::jsonb,
  ARRAY['astronomia', 'arquitetura', 'ciência'],
  true
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Ramsés II - Expansão',
  'Ramsés II foi um dos faraós mais poderosos, expandindo o império egípcio para o sul e construindo monumentos grandiosos.',
  'Qual faraó egípcio expandiu o império para o sul?',
  'Ramsés II',
  '["Tutancâmon", "Amenhotep III", "Akhenaton"]'::jsonb,
  ARRAY['faraós', 'expansão', 'império'],
  true
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Papiro - Material de Escrita',
  'O papiro era feito da planta papirus e revolucionou a escrita e documentação no Egito Antigo.',
  'Qual planta era usada para fazer papiro no Egito?',
  'Papirus',
  '["Junco", "Cevada", "Linho"]'::jsonb,
  ARRAY['escrita', 'plantas', 'tecnologia'],
  true
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Deusa Taweret',
  'Taweret era a deusa hipopótamo que protegia as mulheres durante o parto, sendo muito venerada no Egito.',
  'Qual deusa egípcia era protetora do parto?',
  'Taweret',
  '["Ísis", "Bastet", "Nut"]'::jsonb,
  ARRAY['deusas', 'parto', 'proteção'],
  true
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Novo Império - Akhenaton',
  'O Novo Império foi marcado pela revolução religiosa de Akhenaton e seu culto monoteísta a Aton.',
  'Qual período egípcio foi marcado por Akhenaton e o culto a Aton?',
  'Novo Império',
  '["Antigo Império", "Médio Império", "Período Tardio"]'::jsonb,
  ARRAY['períodos', 'religião', 'monoteísmo'],
  true
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Pirâmides - Túmulos',
  'As pirâmides eram construções monumentais que serviam como túmulos para guardar as múmias dos faraós.',
  'Qual construção egípcia guardava a múmia do faraó?',
  'Pirâmide',
  '["Templo", "Palácio", "Obelisco"]'::jsonb,
  ARRAY['arquitetura', 'túmulos', 'faraós'],
  true
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Akhenaton e Nefertiti',
  'Akhenaton foi o faraó revolucionário que se casou com a bela rainha Nefertiti e mudou a religião egípcia.',
  'Qual faraó egípcio casou com Nefertiti?',
  'Akhenaton',
  '["Tutancâmon", "Ramsés II", "Seti I"]'::jsonb,
  ARRAY['faraós', 'rainhas', 'casamentos'],
  true
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Nilômetro - Medição',
  'O nilômetro era um instrumento engenhoso usado pelos egípcios para medir o nível das águas do Nilo.',
  'Qual instrumento era usado para medir o Nilo?',
  'Nilômetro',
  '["Clepsidra", "Astrolábio", "Compasso"]'::jsonb,
  ARRAY['instrumentos', 'medição', 'engenharia'],
  true
FROM eras

UNION ALL

SELECT 
  eras.egito_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Anúbis - Deus Chacal',
  'Anúbis era o deus egípcio dos mortos, representado com corpo de homem e cabeça de chacal.',
  'Qual deus egípcio tinha corpo de homem e cabeça de chacal?',
  'Anúbis',
  '["Hórus", "Sobek", "Ptah"]'::jsonb,
  ARRAY['deuses', 'morte', 'mumificação'],
  true
FROM eras

UNION ALL

-- Mesopotamia questions (12 questions)
SELECT 
  eras.mesopotamia_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Escrita Cuneiforme Suméria',
  'Os sumérios inventaram a escrita cuneiforme, um dos primeiros sistemas de escrita da humanidade.',
  'Qual civilização mesopotâmica inventou a escrita cuneiforme?',
  'Sumérios',
  '["Assírios", "Babilônios", "Hititas"]'::jsonb,
  ARRAY['escrita', 'sumérios', 'invenção'],
  true
FROM eras

UNION ALL

SELECT 
  eras.mesopotamia_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Jardins Suspensos de Babilônia',
  'Nabucodonosor II construiu os famosos Jardins Suspensos de Babilônia, uma das maravilhas do mundo antigo.',
  'Qual rei mesopotâmico construiu os Jardins Suspensos?',
  'Nabucodonosor II',
  '["Sargão", "Assurbanipal", "Hamurabi"]'::jsonb,
  ARRAY['arquitetura', 'jardins', 'maravilhas'],
  true
FROM eras

UNION ALL

SELECT 
  eras.mesopotamia_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Rio Eufrates',
  'O Rio Eufrates era fundamental para a agricultura mesopotâmica, fornecendo água para irrigação.',
  'Qual rio era essencial para a agricultura mesopotâmica?',
  'Eufrates',
  '["Nilo", "Indo", "Jordão"]'::jsonb,
  ARRAY['geografia', 'agricultura', 'rios'],
  true
FROM eras

UNION ALL

SELECT 
  eras.mesopotamia_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Biblioteca de Nínive',
  'Nínive era famosa por sua biblioteca real, que continha milhares de tábuas cuneiformes.',
  'Qual cidade mesopotâmica era conhecida por sua biblioteca real?',
  'Nínive',
  '["Ur", "Babilônia", "Uruk"]'::jsonb,
  ARRAY['bibliotecas', 'conhecimento', 'assírios'],
  true
FROM eras

UNION ALL

SELECT 
  eras.mesopotamia_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Zigurates Mesopotâmicos',
  'Os zigurates eram torres escalonadas características da arquitetura mesopotâmica, servindo como templos.',
  'Qual estrutura mesopotâmica era uma torre escalonada?',
  'Zigurates',
  '["Pirâmides", "Templo", "Obelisco"]'::jsonb,
  ARRAY['arquitetura', 'templos', 'religião'],
  true
FROM eras

UNION ALL

SELECT 
  eras.mesopotamia_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Sargão da Acádia',
  'Sargão da Acádia criou o primeiro império conhecido da história, unificando as cidades-estado mesopotâmicas.',
  'Qual rei mesopotâmico criou o primeiro império conhecido?',
  'Sargão da Acádia',
  '["Hamurabi", "Nabucodonosor", "Assurbanipal"]'::jsonb,
  ARRAY['império', 'unificação', 'acádios'],
  true
FROM eras

UNION ALL

SELECT 
  eras.mesopotamia_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Tábuas de Argila',
  'A argila era o material principal para escrita na Mesopotâmia, moldada em tábuas e cozida para preservação.',
  'Qual material era usado para escrever na Mesopotâmia?',
  'Argila',
  '["Papiro", "Pergaminho", "Madeira"]'::jsonb,
  ARRAY['escrita', 'materiais', 'tábuas'],
  true
FROM eras

UNION ALL

SELECT 
  eras.mesopotamia_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Marduk - Rei dos Deuses',
  'Marduk era considerado o rei dos deuses na mitologia babilônica, especialmente durante o império de Nabucodonosor.',
  'Qual deus mesopotâmico era o rei dos deuses?',
  'Marduk',
  '["Enki", "Shamash", "Ishtar"]'::jsonb,
  ARRAY['deuses', 'mitologia', 'babilônia'],
  true
FROM eras

UNION ALL

SELECT 
  eras.mesopotamia_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Império Assírio',
  'O Império Assírio foi conhecido por sua grande biblioteca em Nínive e pelo conhecimento acumulado.',
  'Qual império mesopotâmico foi conhecido por sua biblioteca?',
  'Assírio',
  '["Sumério", "Acádio", "Caldeu"]'::jsonb,
  ARRAY['impérios', 'bibliotecas', 'assírios'],
  true
FROM eras

UNION ALL

SELECT 
  eras.mesopotamia_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Conquista de Jerusalém',
  'Nabucodonosor II conquistou Jerusalém e levou os judeus para o exílio babilônico.',
  'Qual rei mesopotâmico conquistou Jerusalém?',
  'Nabucodonosor II',
  '["Hamurabi", "Sargão", "Tiglate-Pileser"]'::jsonb,
  ARRAY['conquistas', 'jerusalém', 'exílio'],
  true
FROM eras

UNION ALL

SELECT 
  eras.mesopotamia_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Canais de Irrigação',
  'Os canais de irrigação foram uma invenção mesopotâmica fundamental para a agricultura nas regiões áridas.',
  'Qual invenção mesopotâmica foi usada para irrigação?',
  'Canais',
  '["Aquedutos", "Moinhos", "Pontes"]'::jsonb,
  ARRAY['irrigação', 'agricultura', 'engenharia'],
  true
FROM eras

UNION ALL

SELECT 
  eras.mesopotamia_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Politeísmo Mesopotâmico',
  'O politeísmo era a religião principal na Mesopotâmia, com adoração a múltiplos deuses.',
  'Qual era a religião principal na Mesopotâmia?',
  'Politeísmo',
  '["Monoteísmo", "Animismo", "Ateísmo"]'::jsonb,
  ARRAY['religião', 'deuses', 'politeísmo'],
  true
FROM eras

UNION ALL

-- Medieval questions (13 questions)
SELECT 
  eras.medieval_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Queda do Império Romano',
  'A queda de Roma em 476 d.C. marcou o início da Idade Média no Ocidente.',
  'Qual evento marcou o início da Idade Média no Ocidente?',
  'Queda de Roma',
  '["Descoberta da América", "Revolução Francesa", "Renascimento"]'::jsonb,
  ARRAY['início', 'roma', 'transição'],
  true
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Sistema Feudal',
  'O feudalismo foi o sistema social dominante na Europa medieval, baseado em relações de vassalagem.',
  'Qual sistema social dominou a Europa medieval?',
  'Feudalismo',
  '["Capitalismo", "Socialismo", "Mercantilismo"]'::jsonb,
  ARRAY['feudalismo', 'sociedade', 'vassalagem'],
  true
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'finance'::knowledge_category,
  'qa'::knowledge_item_type,
  'Ordem dos Templários',
  'Os Templários eram uma ordem militar que protegia peregrinos nas Cruzadas e desenvolveram o sistema bancário.',
  'Qual ordem militar protegia peregrinos nas Cruzadas?',
  'Templários',
  '["Jesuítas", "Franciscanos", "Dominicanos"]'::jsonb,
  ARRAY['cruzadas', 'peregrinos', 'bancos'],
  true
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Peste Negra',
  'A Peste Negra devastou a Europa em 1347, matando cerca de um terço da população.',
  'Qual praga matou milhões na Europa em 1347?',
  'Peste Negra',
  '["Cólera", "Malária", "Tifo"]'::jsonb,
  ARRAY['epidemias', 'morte', 'europa'],
  true
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Magna Carta Inglesa',
  'A Magna Carta de 1215 limitou o poder do rei João da Inglaterra, estabelecendo direitos dos nobres.',
  'Qual documento limitou o poder do rei João na Inglaterra?',
  'Magna Carta',
  '["Declaração de Direitos", "Código de Hamurabi", "Lei das Doze Tábuas"]'::jsonb,
  ARRAY['direitos', 'limitação', 'nobreza'],
  true
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Arquitetura Gótica',
  'O estilo gótico caracterizava-se por arcos ogivais, grandes janelas e verticalidade nas catedrais.',
  'Qual estilo arquitetônico medieval tinha arcos ogivais?',
  'Gótico',
  '["Românico", "Bizantino", "Barroco"]'::jsonb,
  ARRAY['arquitetura', 'catedrais', 'arcos'],
  true
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Hugo Capeto',
  'Hugo Capeto foi coroado rei da França em 987, iniciando a dinastia capetíngia.',
  'Qual rei francês foi coroado em 987?',
  'Hugo Capeto',
  '["Luís XIV", "Carlos Magno", "Filipe Augusto"]'::jsonb,
  ARRAY['frança', 'dinastia', 'coroação'],
  true
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'finance'::knowledge_category,
  'qa'::knowledge_item_type,
  'Comércio Veneziano',
  'Veneza tornou-se rica através do comércio de especiarias entre Europa e Oriente.',
  'Qual cidade italiana lucrou com o comércio de especiarias?',
  'Veneza',
  '["Roma", "Florença", "Milão"]'::jsonb,
  ARRAY['comércio', 'especiarias', 'riqueza'],
  true
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Moinhos de Vento',
  'Os moinhos de vento revolucionaram a agricultura medieval, facilitando a moagem de grãos.',
  'Qual invenção medieval melhorou a agricultura?',
  'Moinhos de vento',
  '["Telescópio", "Imprensa", "Compasso"]'::jsonb,
  ARRAY['agricultura', 'moinhos', 'tecnologia'],
  true
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Grande Cisma do Oriente',
  'O Cisma do Oriente de 1054 dividiu definitivamente a cristandade entre Igreja Católica e Ortodoxa.',
  'Qual cisma dividiu a Igreja em 1054?',
  'Cisma do Oriente',
  '["Grande Cisma do Ocidente", "Reforma Protestante", "Cisma de Avinhão"]'::jsonb,
  ARRAY['religião', 'cisma', 'igrejas'],
  true
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Guerra dos Cem Anos',
  'A Guerra dos Cem Anos (1337-1453) foi um conflito prolongado entre França e Inglaterra.',
  'Qual guerra medieval durou mais de 100 anos?',
  'Guerra dos Cem Anos',
  '["Guerra das Rosas", "Guerra dos Trinta Anos", "Reconquista"]'::jsonb,
  ARRAY['guerra', 'frança', 'inglaterra'],
  true
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'finance'::knowledge_category,
  'qa'::knowledge_item_type,
  'Bancos Templários',
  'A Ordem dos Templários criou o primeiro sistema bancário medieval, com letras de câmbio.',
  'Qual ordem medieval criou os primeiros bancos?',
  'Templários',
  '["Jesuítas", "Cistercienses", "Teutônicos"]'::jsonb,
  ARRAY['bancos', 'finanças', 'inovação'],
  true
FROM eras

UNION ALL

SELECT 
  eras.medieval_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Dieta de Worms',
  'A Dieta de Worms em 1521 marcou um momento crucial da Reforma Protestante com Martinho Lutero.',
  'Qual evento medieval marcou a Reforma?',
  'Dieta de Worms',
  '["Concílio de Trento", "Paz de Westfália", "Queda de Constantinopla"]'::jsonb,
  ARRAY['reforma', 'protestantismo', 'lutero'],
  true
FROM eras

UNION ALL

-- Digital Era questions (12 questions)
SELECT 
  eras.digital_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Fundação da Microsoft',
  'Bill Gates fundou a Microsoft em 1975, revolucionando a computação pessoal com o Windows.',
  'Quem fundou a Microsoft?',
  'Bill Gates',
  '["Steve Jobs", "Jeff Bezos", "Mark Zuckerberg"]'::jsonb,
  ARRAY['microsoft', 'fundadores', 'computação'],
  true
FROM eras

UNION ALL

SELECT 
  eras.digital_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Revolução do iPhone',
  'O iPhone, lançado em 2007, foi o primeiro smartphone moderno e revolucionou a comunicação móvel.',
  'Qual foi o primeiro smartphone lançado?',
  'iPhone',
  '["Blackberry", "Android", "Nokia"]'::jsonb,
  ARRAY['smartphones', 'apple', 'revolução'],
  true
FROM eras

UNION ALL

SELECT 
  eras.digital_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Nascimento do Facebook',
  'O Facebook foi criado por Mark Zuckerberg em 2004, transformando as redes sociais globalmente.',
  'Qual rede social foi criada em 2004?',
  'Facebook',
  '["Twitter", "Instagram", "TikTok"]'::jsonb,
  ARRAY['redes-sociais', 'facebook', 'conexão'],
  true
FROM eras

UNION ALL

SELECT 
  eras.digital_id,
  'finance'::knowledge_category,
  'qa'::knowledge_item_type,
  'Tecnologia Blockchain',
  'A blockchain permite transações financeiras descentralizadas, eliminando a necessidade de bancos tradicionais.',
  'Qual tecnologia permite transações sem bancos?',
  'Blockchain',
  '["Cloud Computing", "IA", "VR"]'::jsonb,
  ARRAY['blockchain', 'criptomoedas', 'descentralização'],
  true
FROM eras

UNION ALL

SELECT 
  eras.digital_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Fundadores do Google',
  'Larry Page e Sergey Brin fundaram o Google em 1998, revolucionando a busca na internet.',
  'Quem é o fundador do Google?',
  'Larry Page e Sergey Brin',
  '["Elon Musk", "Tim Cook", "Jack Dorsey"]'::jsonb,
  ARRAY['google', 'busca', 'internet'],
  true
FROM eras

UNION ALL

SELECT 
  eras.digital_id,
  'history'::knowledge_category,
  'qa'::knowledge_item_type,
  'Pandemia e Digitalização',
  'A pandemia de COVID-19 em 2020 acelerou drasticamente a digitalização mundial em todos os setores.',
  'Qual pandemia acelerou a digitalização em 2020?',
  'COVID-19',
  '["Ébola", "Zika", "SARS"]'::jsonb,
  ARRAY['pandemia', 'digitalização', 'transformação'],
  true
FROM eras

UNION ALL

SELECT 
  eras.digital_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Revolução Tesla',
  'A Tesla, liderada por Elon Musk, revolucionou o mercado automobilístico com carros elétricos inovadores.',
  'Qual empresa revolucionou os carros elétricos?',
  'Tesla',
  '["Toyota", "Ford", "Volkswagen"]'::jsonb,
  ARRAY['carros-elétricos', 'tesla', 'sustentabilidade'],
  true
FROM eras

UNION ALL

SELECT 
  eras.digital_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Inteligência Artificial - ChatGPT',
  'O ChatGPT é uma ferramenta de inteligência artificial avançada capaz de gerar textos humanizados.',
  'Qual ferramenta de IA é usada para gerar textos?',
  'ChatGPT',
  '["Photoshop", "Excel", "AutoCAD"]'::jsonb,
  ARRAY['inteligência-artificial', 'chatgpt', 'texto'],
  true
FROM eras

UNION ALL

SELECT 
  eras.digital_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Era do TikTok',
  'O TikTok transformou o consumo de conteúdo com vídeos curtos e algoritmos de recomendação avançados.',
  'Qual rede é conhecida por vídeos curtos?',
  'TikTok',
  '["YouTube", "LinkedIn", "Pinterest"]'::jsonb,
  ARRAY['vídeos-curtos', 'algoritmos', 'entretenimento'],
  true
FROM eras

UNION ALL

SELECT 
  eras.digital_id,
  'technology'::knowledge_category,
  'qa'::knowledge_item_type,
  'Realidade Virtual',
  'A tecnologia VR (Virtual Reality) permite experiências imersivas em ambientes digitais tridimensionais.',
  'Qual tecnologia permite realidade virtual?',
  'VR',
  '["AR", "Blockchain", "Cloud"]'::jsonb,
  ARRAY['realidade-virtual', 'imersão', 'experiência'],
  true
FROM eras

UNION ALL

SELECT 
  eras.digital_id,
  'finance'::knowledge_category,
  'qa'::knowledge_item_type,
  'Jeff Bezos e Amazon',
  'Jeff Bezos fundou a Amazon em 1994, transformando o comércio eletrônico e a computação em nuvem.',
  'Quem fundou a Amazon?',
  'Jeff Bezos',
  '["Bill Gates", "Elon Musk", "Mark Zuckerberg"]'::jsonb,
  ARRAY['amazon', 'e-commerce', 'nuvem'],
  true
FROM eras

UNION ALL

SELECT 
  eras.digital_id,
  'finance'::knowledge_category,
  'qa'::knowledge_item_type,
  'Bitcoin - Primeira Criptomoeda',
  'O Bitcoin foi a primeira e mais importante criptomoeda, criando um novo paradigma financeiro descentralizado.',
  'Qual é a principal moeda digital?',
  'Bitcoin',
  '["Ethereum", "Ripple", "Litecoin"]'::jsonb,
  ARRAY['bitcoin', 'criptomoeda', 'digital'],
  true
FROM eras;

-- Create indexes to improve question query performance
CREATE INDEX IF NOT EXISTS idx_knowledge_items_era_category ON public.knowledge_items(era_id, category);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_era_type ON public.knowledge_items(era_id, item_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_verified ON public.knowledge_items(is_verified);

-- Update statistics
ANALYZE public.knowledge_items;
