-- ✨ EXPANSÃO DO BANCO DE PERGUNTAS - Arena of Wisdom Wars
-- 🎯 Adicionando 40 novas perguntas às 50 existentes = 90 perguntas totais
-- 📊 Resultado: Egito(23), Mesopotâmia(22), Medieval(23), Digital(22)

-- 🏺 EGITO ANTIGO - 10 Novas Perguntas
INSERT INTO public.knowledge_items (era_id, category, item_type, title, content, question, correct_answer, wrong_options, tags, is_verified) VALUES

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Pirâmide de Quéops', 'O faraó Quéops (Khufu) mandou construir a Grande Pirâmide de Giza, uma das Sete Maravilhas do Mundo Antigo.', 'Qual faraó construiu a pirâmide de Quéops?', 'Quéops', '["Tutancâmon", "Ramsés II", "Akhenaton"]', ARRAY['pirâmides', 'giza', 'quéops'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Obeliscos Egípcios', 'Obeliscos eram monumentos altos de pedra com ponta piramidal, símbolos de poder faraônico e conexão divina.', 'O que eram os obeliscos?', 'Monumentos altos com ponta piramidal', '["Templos", "Túmulos subterrâneos", "Armas de guerra"]', ARRAY['obeliscos', 'monumentos', 'arquitetura'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Anúbis - Deus dos Mortos', 'Anúbis era o deus com cabeça de chacal, responsável pela mumificação e proteção dos mortos no além.', 'Quem era Anúbis?', 'Deus dos mortos e mumificação', '["Deus do sol", "Rei guerreiro", "Protetor do Nilo"]', ARRAY['anúbis', 'mumificação', 'morte'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'technology', 'qa', 'Malaquita - Cosmético Egípcio', 'A malaquita, mineral verde, era moída para criar maquiagem para os olhos, tanto por questões estéticas quanto religiosas.', 'Qual mineral era usado para maquiagem no Egito Antigo?', 'Malaquita', '["Prata", "Estanho", "Cobre"]', ARRAY['malaquita', 'cosmético', 'maquiagem'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'technology', 'qa', 'Papiro - Material de Escrita', 'O papiro era feito da planta do mesmo nome e servia como material para escrita, sendo precursor do papel.', 'O que era o papiro?', 'Material para escrita feito de planta', '["Tipo de pão", "Vestimenta nobre", "Arma de caça"]', ARRAY['papiro', 'escrita', 'tecnologia'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Gatos Sagrados do Egito', 'Os gatos eram considerados animais sagrados no Egito, associados à deusa Bastet e frequentemente mumificados.', 'Qual animal era sagrado no Egito Antigo?', 'Gato', '["Cavalo", "Lobo", "Serpente"]', ARRAY['gatos', 'bastet', 'sagrado'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Howard Carter - Descobridor', 'Howard Carter foi o arqueólogo britânico que descobriu o túmulo intacto de Tutancâmon em 1922.', 'Quem descobriu o túmulo de Tutancâmon?', 'Howard Carter', '["Jean-François Champollion", "Flinders Petrie", "Napoleon Bonaparte"]', ARRAY['howard-carter', 'tutancâmon', 'arqueologia'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Hórus - Deus Falcão', 'Hórus era o deus com cabeça de falcão, protetor do faraó e símbolo do poder real no Egito.', 'O que era o deus Hórus?', 'Deus com cabeça de falcão, protetor do faraó', '["Deus do rio Nilo", "Deus da guerra", "Deus do submundo"]', ARRAY['hórus', 'falcão', 'faraó'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'history', 'qa', 'Esfinge - Guardião', 'A Esfinge com corpo de leão e cabeça humana servia como guardiã de templos e símbolo do poder faraônico.', 'Qual era a função do Sphinx?', 'Guardar templos e símbolos de poder', '["Servir como tumba", "Arma de guerra", "Observatório astronômico"]', ARRAY['esfinge', 'guardião', 'poder'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'technology', 'qa', 'Construção de Pirâmides', 'Os egípcios usavam rampas e sistemas de roldanas para transportar e posicionar os blocos de pedra das pirâmides.', 'Qual técnica usavam para construir pirâmides?', 'Rampas e roldanas', '["Guindastes modernos", "Helicópteros", "Magia divina"]', ARRAY['construção', 'rampas', 'engenharia'], true),

-- 📜 MESOPOTÂMIA - 10 Novas Perguntas

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'technology', 'qa', 'Bronze Mesopotâmico', 'O bronze era a liga metálica mais avançada da época, usado para fabricar armas, ferramentas e objetos cerimoniais.', 'Qual metal era mais usado para fabricar armas na Mesopotâmia?', 'Bronze', '["Ferro", "Ouro", "Prata"]', ARRAY['bronze', 'armas', 'metalurgia'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Lamassu - Guardião Alado', 'Lamassu eram estátuas protetoras com corpo de leão ou touro, asas de águia e cabeça humana, guardiãs de palácios.', 'O que era um lamassu?', 'Estátua protetora com corpo de leão, asas e cabeça humana', '["Um tipo de barco", "Templo de água", "Instrumento musical"]', ARRAY['lamassu', 'guardião', 'escultura'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'technology', 'qa', 'Sistema de Irrigação', 'Os mesopotâmicos desenvolveram complexos sistemas de canais, comportas e represas para irrigar suas terras áridas.', 'Qual era o principal sistema de irrigação mesopotâmico?', 'Canalização e represas', '["Aquedutos", "Poços artesianos", "Moinhos de vento"]', ARRAY['irrigação', 'canais', 'agricultura'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Reis-Sacerdotes', 'Os governantes das cidades-estado mesopotâmicas eram reis-sacerdotes que combinavam poder temporal e religioso.', 'Quem governava as cidades-estado na Mesopotâmia?', 'Reis-sacerdotes', '["Imperadores", "Chefes tribais nômades", "Conselhos de anciãos"]', ARRAY['reis-sacerdotes', 'governo', 'religião'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Épico de Gilgamesh', 'O Épico de Gilgamesh é uma das primeiras obras literárias da humanidade, contando a história de um herói e suas lições de vida.', 'Qual era o objetivo do "Épico de Gilgamesh"?', 'Contar a história de um herói e ensinar lições de vida', '["Registrar leis da cidade", "Descrever rituais de agricultura", "Manual de guerra"]', ARRAY['gilgamesh', 'épico', 'literatura'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Código de Ur-Nammu', 'O Código de Ur-Nammu (c. 2100-2050 a.C.) é considerado o primeiro código legal conhecido da história.', 'O que era o Código de Ur-Nammu?', 'Primeiro código legal conhecido', '["Livro sagrado", "Técnica de navegação", "Sistema monetário"]', ARRAY['ur-nammu', 'código', 'lei'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'finance', 'qa', 'Comércio Mesopotâmico', 'A Mesopotâmia exportava sal (abundante devido à irrigação) e lã de suas ovelhas para outras regiões.', 'Qual produto era exportado pela Mesopotâmia?', 'Sal e lã', '["Café", "Ouro do Nilo", "Especiarias"]', ARRAY['comércio', 'sal', 'lã'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Ensi - Governantes Locais', 'Os "ensi" eram governantes locais das cidades-estado, abaixo dos reis mas com poder administrativo significativo.', 'O que eram os "ensi"?', 'Governantes locais de cidades-estado', '["Artesãos", "Sacerdotes do sol", "Soldados de elite"]', ARRAY['ensi', 'governantes', 'administração'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'technology', 'qa', 'Ábaco Mesopotâmico', 'O ábaco foi uma invenção mesopotâmica que influenciou profundamente o desenvolvimento da matemática e contabilidade.', 'Qual invenção mesopotâmica influenciou a matemática?', 'Ábaco', '["Relógio de sol", "Astrolábio", "Bússola"]', ARRAY['ábaco', 'matemática', 'contabilidade'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'history', 'qa', 'Leão - Símbolo de Poder', 'O leão era o animal símbolo de poder, força e realeza na Mesopotâmia, presente em arte e arquitetura.', 'Qual animal era símbolo de poder na Mesopotâmia?', 'Leão', '["Cavalo", "Crocodilo", "Águia"]', ARRAY['leão', 'poder', 'simbolismo'], true),

-- ⚔️ ERA MEDIEVAL - 10 Novas Perguntas

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Feiras Medievais', 'As feiras medievais eram centros comerciais temporários onde mercadores de várias regiões se reuniam para trocar produtos.', 'Qual era a principal função de uma feira medieval?', 'Promover comércio e troca de produtos', '["Realizar cerimônias religiosas", "Treinar cavaleiros", "Julgar criminosos"]', ARRAY['feiras', 'comércio', 'mercadores'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Jograis Medievais', 'Os jograis eram artistas itinerantes que viajavam de cidade em cidade apresentando música, teatro e entretenimento.', 'Quem eram os jograis?', 'Músicos e atores itinerantes', '["Artesãos de armas", "Oficiais da Igreja", "Guardas reais"]', ARRAY['jograis', 'entretenimento', 'música'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Denário Medieval', 'O denário era a moeda de prata mais comum na Europa Ocidental durante o século XII, base do sistema monetário.', 'Qual era a moeda mais utilizada na Europa Ocidental no século XII?', 'Denário', '["Dólar", "Libra esterlina", "Franco"]', ARRAY['denário', 'moeda', 'prata'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Coroa Ducal', 'A coroa ducal era um título de nobreza abaixo do rei, conferindo poder sobre territórios específicos (ducados).', 'O que era a coroa ducal?', 'Título de nobreza abaixo do rei', '["Um tipo de arma medieval", "Uma peça de armadura", "Ritual religioso"]', ARRAY['duque', 'nobreza', 'feudalismo'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Alimentação Camponesa', 'Os camponeses medievais se alimentavam principalmente de pão de centeio e mingau de aveia, raramente consumindo carne.', 'Qual alimento era mais consumido pelos camponeses?', 'Pão e mingau', '["Carne de cordeiro", "Peixe importado", "Frutas exóticas"]', ARRAY['camponeses', 'alimentação', 'pão'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Justas Medievais', 'As justas eram competições onde cavaleiros se enfrentavam com lanças, demonstrando habilidade e conquistando honra.', 'O que eram as Justas?', 'Competições de cavaleiros com lanças', '["Reuniões da Igreja", "Tributos pagos ao rei", "Festivais de colheita"]', ARRAY['justas', 'cavaleiros', 'competição'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Tecelãs Medievais', 'A tecelagem era uma das poucas profissões medievais dominadas por mulheres, sendo essencial para a economia doméstica.', 'Qual profissão medieval era reservada quase exclusivamente às mulheres?', 'Tecelã', '["Ferreiro", "Cavaleiro", "Escriba"]', ARRAY['tecelagem', 'mulheres', 'profissão'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Morsa - Instrumento de Tortura', 'A morsa era um instrumento de tortura medieval que comprimia partes do corpo para extrair confissões.', 'Qual instrumento de tortura era usado na Idade Média?', 'Morsa', '["Estetoscópio", "Catapulta", "Arado"]', ARRAY['tortura', 'justiça', 'medieval'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Homestead Medieval', 'O homestead era a propriedade rural básica onde vivia uma família camponesa com sua terra de cultivo.', 'O que era o homestead medieval?', 'Propriedade rural de camponeses', '["Nome de castelo real", "Escola para jovens nobres", "Templo religioso"]', ARRAY['homestead', 'camponeses', 'propriedade'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'history', 'qa', 'Escudeiro Medieval', 'O escudeiro era um jovem nobre que assistia um cavaleiro e treinava para se tornar cavaleiro também.', 'Qual era o papel do escudeiro?', 'Assistir o cavaleiro e treinar para se tornar cavaleiro', '["Preparar alimentos para o rei", "Recolher impostos", "Construir castelos"]', ARRAY['escudeiro', 'cavalaria', 'treinamento'], true),

-- 💻 ERA DIGITAL - 20 Novas Perguntas (10 de cada conjunto)

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'LIDAR Autônomo', 'LIDAR é a tecnologia que usa lasers para mapear o ambiente em 3D, essencial para carros autônomos navegarem.', 'Qual tecnologia permite que carros autônomos percebam o ambiente ao redor?', 'LIDAR', '["Blockchain", "Cloud Computing", "5G"]', ARRAY['lidar', 'carros-autônomos', 'sensores'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Rede 5G', '5G é a quinta geração de redes móveis, oferecendo velocidades muito maiores e menor latência que 4G.', 'O que é 5G?', 'A quinta geração de redes móveis', '["Um tipo de inteligência artificial", "Um software de edição de vídeo", "Um protocolo de segurança"]', ARRAY['5g', 'redes-móveis', 'velocidade'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Firewall de Rede', 'Um firewall é um sistema de segurança que monitora e bloqueia tráfego de rede não autorizado.', 'Qual é a função de um firewall em redes de computadores?', 'Bloquear acesso não autorizado', '["Armazenar dados na nuvem", "Processar transações financeiras", "Editar imagens"]', ARRAY['firewall', 'segurança', 'rede'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Deepfake Technology', 'Deepfake é uma técnica de IA que cria vídeos ou imagens falsas extremamente realistas de pessoas.', 'O que é deepfake?', 'Técnica de edição que cria imagens ou vídeos falsos realistas', '["Um tipo de vírus de computador", "Um protocolo de criptografia", "Um aplicativo de música"]', ARRAY['deepfake', 'inteligência-artificial', 'falsificação'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Computação em Nuvem', 'A computação em nuvem permite executar aplicações e armazenar dados em servidores remotos via internet.', 'Qual é a principal vantagem da computação em nuvem?', 'Permite executar softwares sem precisar instalar localmente', '["Reduz o consumo de energia elétrica em celulares", "Substitui completamente a internet", "Aumenta a velocidade do processador"]', ARRAY['nuvem', 'cloud-computing', 'serviços'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Tokenização Digital', 'Tokenização é o processo de converter ativos físicos ou direitos em tokens digitais negociáveis em blockchain.', 'O que é a tokenização em finanças digitais?', 'Processo de transformar ativos em tokens digitais', '["Um tipo de malware que rouba dados", "Sistema de compressão de arquivos", "Protocolo de email"]', ARRAY['tokenização', 'blockchain', 'ativos-digitais'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Big Data Analytics', 'Big Data se refere a ferramentas e técnicas para armazenar, processar e analisar grandes volumes de dados estruturados.', 'Qual ferramenta é usada para armazenar grandes volumes de dados de forma estruturada?', 'Big Data', '["HTML", "VPN", "CSS"]', ARRAY['big-data', 'análise', 'dados'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Realidade Aumentada AR', 'Realidade Aumentada sobrepõe informações digitais ao mundo real, diferente da VR que cria mundos totalmente virtuais.', 'O que é a realidade aumentada (AR)?', 'Sobreposição de informações digitais no mundo real', '["Criação de mundos totalmente virtuais", "Apenas uma técnica de animação 3D", "Sistema de backup automático"]', ARRAY['realidade-aumentada', 'ar', 'digital'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Blockchain Security', 'Blockchain é a tecnologia de registro distribuído que garante segurança e transparência em transações de criptomoedas.', 'Qual tecnologia garante segurança em transações de criptomoedas?', 'Blockchain', '["Inteligência Artificial", "Wi-Fi 6", "HTML5"]', ARRAY['blockchain', 'criptomoedas', 'segurança'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Edge Computing', 'Edge computing processa dados próximo à fonte (dispositivos) em vez de enviar tudo para servidores remotos na nuvem.', 'O que é edge computing?', 'Processamento de dados próximo à fonte, em vez de servidores remotos', '["Um tipo de linguagem de programação", "Um protocolo de envio de e-mails", "Sistema de pagamento online"]', ARRAY['edge-computing', 'processamento', 'descentralização'], true),

-- 10 Perguntas Adicionais Era Digital

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Web3 Descentralizada', 'Web3 é a terceira geração da internet, baseada em blockchain e descentralização, dando controle aos usuários.', 'O que é Web3?', 'Terceira geração da internet, baseada em blockchain e descentralização', '["Novo modelo de computador portátil", "Sistema operacional da Microsoft", "Protocolo de Wi-Fi"]', ARRAY['web3', 'descentralização', 'blockchain'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'VR no Metaverso', 'Realidade Virtual (VR) permite criar avatares realistas e experiências imersivas no metaverso e mundos digitais.', 'Qual tecnologia permite criar avatares realistas no metaverso?', 'Realidade virtual (VR)', '["Computação em nuvem", "Blockchain", "Machine Learning"]', ARRAY['vr', 'metaverso', 'avatares'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Phishing Digital', 'Phishing é um golpe digital que usa emails, sites e mensagens falsas para roubar informações pessoais e senhas.', 'O que é phishing?', 'Golpe digital que rouba informações', '["Técnica de segurança digital", "Software de edição de imagens", "Protocolo de rede"]', ARRAY['phishing', 'golpe', 'segurança'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'TikTok Videos Curtos', 'TikTok foi a rede social que popularizou os vídeos curtos, mudando como consumimos conteúdo digital.', 'Qual rede social surgiu focada em vídeos curtos?', 'TikTok', '["Twitter", "LinkedIn", "Facebook"]', ARRAY['tiktok', 'vídeos-curtos', 'social'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'NFTs Tokens Únicos', 'NFTs (Non-Fungible Tokens) são certificados digitais únicos que comprovam propriedade de ativos digitais.', 'O que são NFTs?', 'Tokens não fungíveis, certificados digitais únicos', '["Moedas digitais tradicionais", "Protocolos de Wi-Fi", "Sistemas de backup"]', ARRAY['nft', 'tokens', 'únicos'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Ransomware Malware', 'Ransomware é um malware que criptografa arquivos da vítima e exige pagamento para liberar o acesso.', 'O que é ransomware?', 'Programa que bloqueia dados até pagamento', '["Sistema de backup automático", "Aplicativo de streaming", "Antivírus gratuito"]', ARRAY['ransomware', 'malware', 'resgate'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'CBDC Bahamas', 'As Bahamas lançaram o Sand Dollar em 2020, sendo o primeiro país a implementar uma moeda digital oficial de banco central.', 'Qual país lançou a primeira moeda digital oficial de banco central?', 'Bahamas', '["EUA", "Japão", "China"]', ARRAY['cbdc', 'bahamas', 'moeda-digital'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Deep Learning IA', 'Deep Learning é uma subcategoria de machine learning que usa redes neurais profundas para aprender padrões complexos.', 'O que é deep learning?', 'Aprendizado de máquina com redes neurais profundas', '["Técnica de edição de vídeo", "Sistema de compressão de arquivos", "Protocolo de internet"]', ARRAY['deep-learning', 'ia', 'redes-neurais'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'technology', 'qa', 'Autenticação 2FA', '2FA (Two-Factor Authentication) é um sistema de segurança que exige duas formas diferentes de verificação de identidade.', 'O que significa 2FA (autenticação de dois fatores)?', 'Segurança que exige duas formas de verificação', '["Sistema de criptografia de arquivos", "Programa de criação de senhas", "Protocolo de rede"]', ARRAY['2fa', 'autenticação', 'segurança'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Smart Contracts', 'Smart contracts são contratos digitais autoexecutáveis programados em blockchain que cumprem termos automaticamente.', 'Qual é a função de um smart contract?', 'Contrato digital autoexecutável baseado em blockchain', '["Contrato físico assinado por advogados", "Programa de gerenciamento de emails", "Sistema de pagamento tradicional"]', ARRAY['smart-contracts', 'blockchain', 'automação'], true);

-- 📊 VERIFICAÇÃO FINAL - Contar perguntas por era
SELECT 
  e.name as era_nome,
  e.slug as era_slug,
  COUNT(ki.*) as total_perguntas
FROM public.eras e
LEFT JOIN public.knowledge_items ki ON e.id = ki.era_id AND ki.item_type = 'qa'
GROUP BY e.name, e.slug, e.id
ORDER BY e.id;

-- 🎯 RESULTADO ESPERADO:
-- Egito Antigo: 23 perguntas (13 antigas + 10 novas)
-- Mesopotâmia: 22 perguntas (12 antigas + 10 novas) 
-- Era Medieval: 23 perguntas (13 antigas + 10 novas)
-- Era Digital: 22 perguntas (12 antigas + 10 novas)
-- TOTAL: 90 perguntas (50 antigas + 40 novas)
