-- Script para inserir 50 perguntas variadas no Arena of Wisdom Wars
-- Execute este script diretamente no SQL Editor do Supabase

-- Primeiro, limpar perguntas antigas de exemplo
DELETE FROM public.knowledge_items WHERE title IN (
  'Unificação do Egito', 'Pirâmides de Giza', 'Código de Hamurabi', 
  'Escrita Cuneiforme', 'Magna Carta', 'Ordem dos Templários'
);

-- Inserir perguntas do Egito Antigo (13 perguntas)
INSERT INTO public.knowledge_items (era_id, category, item_type, title, content, question, correct_answer, wrong_options, tags, is_verified) VALUES
((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Deus Rá - Sol e Criação', 'Rá era o principal deus egípcio associado ao sol e à criação, sendo considerado o rei dos deuses no panteão egípcio.', 'Qual deus egípcio era associado ao sol e à criação?', 'Rá', '["Anúbis", "Osíris", "Thoth"]', ARRAY['deuses', 'mitologia', 'sol'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Rainha Hatshepsut', 'Hatshepsut foi uma das rainhas mais poderosas do Egito, assumindo o título de faraó e construindo templos grandiosos.', 'Qual rainha egípcia assumiu o título de faraó e construiu templos grandiosos?', 'Hatshepsut', '["Nefertiti", "Cleópatra", "Tiy"]', ARRAY['rainhas', 'faraós', 'templos'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Rio Nilo - Fertilização', 'O Rio Nilo inundava anualmente, depositando sedimentos férteis que tornavam possível a agricultura no Egito.', 'Qual rio inundava anualmente, fertilizando as terras egípcias?', 'Nilo', '["Tigre", "Eufrates", "Jordão"]', ARRAY['geografia', 'agricultura', 'rio'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Gatos Sagrados', 'Os gatos eram considerados animais sagrados no Egito, sendo mumificados e associados à deusa Bastet.', 'Qual animal era mumificado e considerado sagrado pelos egípcios?', 'Gato', '["Cão", "Cavalo", "Leão"]', ARRAY['animais', 'religião', 'mumificação'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'technology', 'qa', 'Obeliscos Astronômicos', 'Os obeliscos egípcios eram usados como instrumentos para observar as estrelas e medir o tempo.', 'Qual estrutura egípcia era usada para observar as estrelas?', 'Obelisco', '["Pirâmide", "Templo", "Esfinge"]', ARRAY['astronomia', 'arquitetura', 'ciência'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Ramsés II - Expansão', 'Ramsés II foi um dos faraós mais poderosos, expandindo o império egípcio para o sul e construindo monumentos grandiosos.', 'Qual faraó egípcio expandiu o império para o sul?', 'Ramsés II', '["Tutancâmon", "Amenhotep III", "Akhenaton"]', ARRAY['faraós', 'expansão', 'império'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'technology', 'qa', 'Papiro - Material de Escrita', 'O papiro era feito da planta papirus e revolucionou a escrita e documentação no Egito Antigo.', 'Qual planta era usada para fazer papiro no Egito?', 'Papirus', '["Junco", "Cevada", "Linho"]', ARRAY['escrita', 'plantas', 'tecnologia'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Deusa Taweret', 'Taweret era a deusa hipopótamo que protegia as mulheres durante o parto, sendo muito venerada no Egito.', 'Qual deusa egípcia era protetora do parto?', 'Taweret', '["Ísis", "Bastet", "Nut"]', ARRAY['deusas', 'parto', 'proteção'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Novo Império - Akhenaton', 'O Novo Império foi marcado pela revolução religiosa de Akhenaton e seu culto monoteísta a Aton.', 'Qual período egípcio foi marcado por Akhenaton e o culto a Aton?', 'Novo Império', '["Antigo Império", "Médio Império", "Período Tardio"]', ARRAY['períodos', 'religião', 'monoteísmo'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'technology', 'qa', 'Pirâmides - Túmulos', 'As pirâmides eram construções monumentais que serviam como túmulos para guardar as múmias dos faraós.', 'Qual construção egípcia guardava a múmia do faraó?', 'Pirâmide', '["Templo", "Palácio", "Obelisco"]', ARRAY['arquitetura', 'túmulos', 'faraós'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Akhenaton e Nefertiti', 'Akhenaton foi o faraó revolucionário que se casou com a bela rainha Nefertiti e mudou a religião egípcia.', 'Qual faraó egípcio casou com Nefertiti?', 'Akhenaton', '["Tutancâmon", "Ramsés II", "Seti I"]', ARRAY['faraós', 'rainhas', 'casamentos'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'technology', 'qa', 'Nilômetro - Medição', 'O nilômetro era um instrumento engenhoso usado pelos egípcios para medir o nível das águas do Nilo.', 'Qual instrumento era usado para medir o Nilo?', 'Nilômetro', '["Clepsidra", "Astrolábio", "Compasso"]', ARRAY['instrumentos', 'medição', 'engenharia'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Anúbis - Deus Chacal', 'Anúbis era o deus egípcio dos mortos, representado com corpo de homem e cabeça de chacal.', 'Qual deus egípcio tinha corpo de homem e cabeça de chacal?', 'Anúbis', '["Hórus", "Sobek", "Ptah"]', ARRAY['deuses', 'morte', 'mumificação'], true);

-- Inserir perguntas da Mesopotâmia (12 perguntas)
INSERT INTO public.knowledge_items (era_id, category, item_type, title, content, question, correct_answer, wrong_options, tags, is_verified) VALUES
((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'technology', 'qa', 'Escrita Cuneiforme Suméria', 'Os sumérios inventaram a escrita cuneiforme, um dos primeiros sistemas de escrita da humanidade.', 'Qual civilização mesopotâmica inventou a escrita cuneiforme?', 'Sumérios', '["Assírios", "Babilônios", "Hititas"]', ARRAY['escrita', 'sumérios', 'invenção'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Jardins Suspensos de Babilônia', 'Nabucodonosor II construiu os famosos Jardins Suspensos de Babilônia, uma das maravilhas do mundo antigo.', 'Qual rei mesopotâmico construiu os Jardins Suspensos?', 'Nabucodonosor II', '["Sargão", "Assurbanipal", "Hamurabi"]', ARRAY['arquitetura', 'jardins', 'maravilhas'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Rio Eufrates', 'O Rio Eufrates era fundamental para a agricultura mesopotâmica, fornecendo água para irrigação.', 'Qual rio era essencial para a agricultura mesopotâmica?', 'Eufrates', '["Nilo", "Indo", "Jordão"]', ARRAY['geografia', 'agricultura', 'rios'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Biblioteca de Nínive', 'Nínive era famosa por sua biblioteca real, que continha milhares de tábuas cuneiformes.', 'Qual cidade mesopotâmica era conhecida por sua biblioteca real?', 'Nínive', '["Ur", "Babilônia", "Uruk"]', ARRAY['bibliotecas', 'conhecimento', 'assírios'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'technology', 'qa', 'Zigurates Mesopotâmicos', 'Os zigurates eram torres escalonadas características da arquitetura mesopotâmica, servindo como templos.', 'Qual estrutura mesopotâmica era uma torre escalonada?', 'Zigurates', '["Pirâmides", "Templo", "Obelisco"]', ARRAY['arquitetura', 'templos', 'religião'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Sargão da Acádia', 'Sargão da Acádia criou o primeiro império conhecido da história, unificando as cidades-estado mesopotâmicas.', 'Qual rei mesopotâmico criou o primeiro império conhecido?', 'Sargão da Acádia', '["Hamurabi", "Nabucodonosor", "Assurbanipal"]', ARRAY['império', 'unificação', 'acádios'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'technology', 'qa', 'Tábuas de Argila', 'A argila era o material principal para escrita na Mesopotâmia, moldada em tábuas e cozida para preservação.', 'Qual material era usado para escrever na Mesopotâmia?', 'Argila', '["Papiro", "Pergaminho", "Madeira"]', ARRAY['escrita', 'materiais', 'tábuas'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Marduk - Rei dos Deuses', 'Marduk era considerado o rei dos deuses na mitologia babilônica, especialmente durante o império de Nabucodonosor.', 'Qual deus mesopotâmico era o rei dos deuses?', 'Marduk', '["Enki", "Shamash", "Ishtar"]', ARRAY['deuses', 'mitologia', 'babilônia'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Império Assírio', 'O Império Assírio foi conhecido por sua grande biblioteca em Nínive e pelo conhecimento acumulado.', 'Qual império mesopotâmico foi conhecido por sua biblioteca?', 'Assírio', '["Sumério", "Acádio", "Caldeu"]', ARRAY['impérios', 'bibliotecas', 'assírios'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Conquista de Jerusalém', 'Nabucodonosor II conquistou Jerusalém e levou os judeus para o exílio babilônico.', 'Qual rei mesopotâmico conquistou Jerusalém?', 'Nabucodonosor II', '["Hamurabi", "Sargão", "Tiglate-Pileser"]', ARRAY['conquistas', 'jerusalém', 'exílio'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'technology', 'qa', 'Canais de Irrigação', 'Os canais de irrigação foram uma invenção mesopotâmica fundamental para a agricultura nas regiões áridas.', 'Qual invenção mesopotâmica foi usada para irrigação?', 'Canais', '["Aquedutos", "Moinhos", "Pontes"]', ARRAY['irrigação', 'agricultura', 'engenharia'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Politeísmo Mesopotâmico', 'O politeísmo era a religião principal na Mesopotâmia, com adoração a múltiplos deuses.', 'Qual era a religião principal na Mesopotâmia?', 'Politeísmo', '["Monoteísmo", "Animismo", "Ateísmo"]', ARRAY['religião', 'deuses', 'politeísmo'], true);

-- Inserir perguntas da Idade Média (13 perguntas)
INSERT INTO public.knowledge_items (era_id, category, item_type, title, content, question, correct_answer, wrong_options, tags, is_verified) VALUES
((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Queda do Império Romano', 'A queda de Roma em 476 d.C. marcou o início da Idade Média no Ocidente.', 'Qual evento marcou o início da Idade Média no Ocidente?', 'Queda de Roma', '["Descoberta da América", "Revolução Francesa", "Renascimento"]', ARRAY['início', 'roma', 'transição'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Sistema Feudal', 'O feudalismo foi o sistema social dominante na Europa medieval, baseado em relações de vassalagem.', 'Qual sistema social dominou a Europa medieval?', 'Feudalismo', '["Capitalismo", "Socialismo", "Mercantilismo"]', ARRAY['feudalismo', 'sociedade', 'vassalagem'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Ordem dos Templários', 'Os Templários eram uma ordem militar que protegia peregrinos nas Cruzadas e desenvolveram o sistema bancário.', 'Qual ordem militar protegia peregrinos nas Cruzadas?', 'Templários', '["Jesuítas", "Franciscanos", "Dominicanos"]', ARRAY['cruzadas', 'peregrinos', 'bancos'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Peste Negra', 'A Peste Negra devastou a Europa em 1347, matando cerca de um terço da população.', 'Qual praga matou milhões na Europa em 1347?', 'Peste Negra', '["Cólera", "Malária", "Tifo"]', ARRAY['epidemias', 'morte', 'europa'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Magna Carta Inglesa', 'A Magna Carta de 1215 limitou o poder do rei João da Inglaterra, estabelecendo direitos dos nobres.', 'Qual documento limitou o poder do rei João na Inglaterra?', 'Magna Carta', '["Declaração de Direitos", "Código de Hamurabi", "Lei das Doze Tábuas"]', ARRAY['direitos', 'limitação', 'nobreza'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'technology', 'qa', 'Arquitetura Gótica', 'O estilo gótico caracterizava-se por arcos ogivais, grandes janelas e verticalidade nas catedrais.', 'Qual estilo arquitetônico medieval tinha arcos ogivais?', 'Gótico', '["Românico", "Bizantino", "Barroco"]', ARRAY['arquitetura', 'catedrais', 'arcos'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Hugo Capeto', 'Hugo Capeto foi coroado rei da França em 987, iniciando a dinastia capetíngia.', 'Qual rei francês foi coroado em 987?', 'Hugo Capeto', '["Luís XIV", "Carlos Magno", "Filipe Augusto"]', ARRAY['frança', 'dinastia', 'coroação'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Comércio Veneziano', 'Veneza tornou-se rica através do comércio de especiarias entre Europa e Oriente.', 'Qual cidade italiana lucrou com o comércio de especiarias?', 'Veneza', '["Roma", "Florença", "Milão"]', ARRAY['comércio', 'especiarias', 'riqueza'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'technology', 'qa', 'Moinhos de Vento', 'Os moinhos de vento revolucionaram a agricultura medieval, facilitando a moagem de grãos.', 'Qual invenção medieval melhorou a agricultura?', 'Moinhos de vento', '["Telescópio", "Imprensa", "Compasso"]', ARRAY['agricultura', 'moinhos', 'tecnologia'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Grande Cisma do Oriente', 'O Cisma do Oriente de 1054 dividiu definitivamente a cristandade entre Igreja Católica e Ortodoxa.', 'Qual cisma dividiu a Igreja em 1054?', 'Cisma do Oriente', '["Grande Cisma do Ocidente", "Reforma Protestante", "Cisma de Avinhão"]', ARRAY['religião', 'cisma', 'igrejas'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Guerra dos Cem Anos', 'A Guerra dos Cem Anos (1337-1453) foi um conflito prolongado entre França e Inglaterra.', 'Qual guerra medieval durou mais de 100 anos?', 'Guerra dos Cem Anos', '["Guerra das Rosas", "Guerra dos Trinta Anos", "Reconquista"]', ARRAY['guerra', 'frança', 'inglaterra'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Bancos Templários', 'A Ordem dos Templários criou o primeiro sistema bancário medieval, com letras de câmbio.', 'Qual ordem medieval criou os primeiros bancos?', 'Templários', '["Jesuítas", "Cistercienses", "Teutônicos"]', ARRAY['bancos', 'finanças', 'inovação'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Dieta de Worms', 'A Dieta de Worms em 1521 marcou um momento crucial da Reforma Protestante com Martinho Lutero.', 'Qual evento medieval marcou a Reforma?', 'Dieta de Worms', '["Concílio de Trento", "Paz de Westfália", "Queda de Constantinopla"]', ARRAY['reforma', 'protestantismo', 'lutero'], true);

-- Inserir perguntas da Era Digital (12 perguntas)
INSERT INTO public.knowledge_items (era_id, category, item_type, title, content, question, correct_answer, wrong_options, tags, is_verified) VALUES
((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Fundação da Microsoft', 'Bill Gates fundou a Microsoft em 1975, revolucionando a computação pessoal com o Windows.', 'Quem fundou a Microsoft?', 'Bill Gates', '["Steve Jobs", "Jeff Bezos", "Mark Zuckerberg"]', ARRAY['microsoft', 'fundadores', 'computação'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Revolução do iPhone', 'O iPhone, lançado em 2007, foi o primeiro smartphone moderno e revolucionou a comunicação móvel.', 'Qual foi o primeiro smartphone lançado?', 'iPhone', '["Blackberry", "Android", "Nokia"]', ARRAY['smartphones', 'apple', 'revolução'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Nascimento do Facebook', 'O Facebook foi criado por Mark Zuckerberg em 2004, transformando as redes sociais globalmente.', 'Qual rede social foi criada em 2004?', 'Facebook', '["Twitter", "Instagram", "TikTok"]', ARRAY['redes-sociais', 'facebook', 'conexão'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Tecnologia Blockchain', 'A blockchain permite transações financeiras descentralizadas, eliminando a necessidade de bancos tradicionais.', 'Qual tecnologia permite transações sem bancos?', 'Blockchain', '["Cloud Computing", "IA", "VR"]', ARRAY['blockchain', 'criptomoedas', 'descentralização'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Fundadores do Google', 'Larry Page e Sergey Brin fundaram o Google em 1998, revolucionando a busca na internet.', 'Quem é o fundador do Google?', 'Larry Page e Sergey Brin', '["Elon Musk", "Tim Cook", "Jack Dorsey"]', ARRAY['google', 'busca', 'internet'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'history', 'qa', 'Pandemia e Digitalização', 'A pandemia de COVID-19 em 2020 acelerou drasticamente a digitalização mundial em todos os setores.', 'Qual pandemia acelerou a digitalização em 2020?', 'COVID-19', '["Ébola", "Zika", "SARS"]', ARRAY['pandemia', 'digitalização', 'transformação'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Revolução Tesla', 'A Tesla, liderada por Elon Musk, revolucionou o mercado automobilístico com carros elétricos inovadores.', 'Qual empresa revolucionou os carros elétricos?', 'Tesla', '["Toyota", "Ford", "Volkswagen"]', ARRAY['carros-elétricos', 'tesla', 'sustentabilidade'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Inteligência Artificial - ChatGPT', 'O ChatGPT é uma ferramenta de inteligência artificial avançada capaz de gerar textos humanizados.', 'Qual ferramenta de IA é usada para gerar textos?', 'ChatGPT', '["Photoshop", "Excel", "AutoCAD"]', ARRAY['inteligência-artificial', 'chatgpt', 'texto'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Era do TikTok', 'O TikTok transformou o consumo de conteúdo com vídeos curtos e algoritmos de recomendação avançados.', 'Qual rede é conhecida por vídeos curtos?', 'TikTok', '["YouTube", "LinkedIn", "Pinterest"]', ARRAY['vídeos-curtos', 'algoritmos', 'entretenimento'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Realidade Virtual', 'A tecnologia VR (Virtual Reality) permite experiências imersivas em ambientes digitais tridimensionais.', 'Qual tecnologia permite realidade virtual?', 'VR', '["AR", "Blockchain", "Cloud"]', ARRAY['realidade-virtual', 'imersão', 'experiência'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Jeff Bezos e Amazon', 'Jeff Bezos fundou a Amazon em 1994, transformando o comércio eletrônico e a computação em nuvem.', 'Quem fundou a Amazon?', 'Jeff Bezos', '["Bill Gates", "Elon Musk", "Mark Zuckerberg"]', ARRAY['amazon', 'e-commerce', 'nuvem'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Bitcoin - Primeira Criptomoeda', 'O Bitcoin foi a primeira e mais importante criptomoeda, criando um novo paradigma financeiro descentralizado.', 'Qual é a principal moeda digital?', 'Bitcoin', '["Ethereum", "Ripple", "Litecoin"]', ARRAY['bitcoin', 'criptomoeda', 'digital'], true);

-- Mensagem de confirmação
SELECT 
  e.name as era,
  COUNT(ki.*) as total_perguntas
FROM public.eras e
LEFT JOIN public.knowledge_items ki ON e.id = ki.era_id AND ki.item_type = 'qa'
GROUP BY e.name, e.slug
ORDER BY e.slug;
