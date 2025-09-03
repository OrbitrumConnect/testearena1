-- 💰 EXPANSÃO: PERGUNTAS DE ECONOMIA - Arena of Wisdom Wars
-- 🎯 Adicionando 40 perguntas focadas em ECONOMIA/LUCRO por era
-- 📊 Cada era ganha 10 perguntas específicas sobre sistemas econômicos

-- ⚔️ ERA MEDIEVAL - 10 Perguntas sobre Economia

INSERT INTO public.knowledge_items (era_id, category, item_type, title, content, question, correct_answer, wrong_options, tags, is_verified) VALUES

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'economics', 'qa', 'Renda dos Camponeses', 'Os camponeses medievais ganhavam dinheiro trabalhando nas terras dos senhores feudais e vendendo o excedente de sua produção.', 'Como os camponeses ganhavam dinheiro na Idade Média?', 'Trabalhando nas terras dos senhores e vendendo excedente', '["Construindo castelos para nobres", "Lutando em torneios sem receber", "Apenas com trocas de favores"]', ARRAY['camponeses', 'agricultura', 'economia-feudal'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'economics', 'qa', 'Renda dos Senhores Feudais', 'Os senhores feudais obtinham renda principalmente através de impostos sobre camponeses e percentual da produção agrícola de suas terras.', 'Qual era a principal fonte de renda dos senhores feudais?', 'Impostos sobre camponeses e produção agrícola', '["Comércio marítimo internacional", "Trabalho como escribas", "Mineração de metais preciosos"]', ARRAY['senhores-feudais', 'impostos', 'feudalismo'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'economics', 'qa', 'Lucro dos Comerciantes', 'Os comerciantes medievais lucravam nas feiras vendendo produtos importados de outras regiões e artesanato local com margens de lucro.', 'Como os comerciantes medievais lucravam nas feiras?', 'Vendendo produtos importados e artesanato local', '["Lutando em justas", "Produzindo moedas de ouro", "Organizando torneios"]', ARRAY['comerciantes', 'feiras', 'lucro'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'economics', 'qa', 'Atividade do Ferreiro', 'Os ferreiros medievais ganhavam dinheiro fabricando ferramentas, armas e ferraduras sob encomenda para camponeses, soldados e cavaleiros.', 'Qual era a atividade lucrativa de um ferreiro medieval?', 'Fabricar ferramentas, armas e ferraduras para venda', '["Cultivar trigo", "Ensinar crianças nobres", "Participar de batalhas"]', ARRAY['ferreiro', 'artesanato', 'metalurgia'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'economics', 'qa', 'Renda dos Mosteiros', 'Os monges geravam renda para os mosteiros produzindo cerveja, vinho e manuscritos iluminados que eram vendidos para financiar a comunidade.', 'Como um monge podia gerar renda em mosteiros?', 'Produzindo cerveja, vinho e manuscritos para venda', '["Lutando em batalhas", "Organizando torneios", "Cobrando dízimos"]', ARRAY['monges', 'mosteiros', 'produção'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'economics', 'qa', 'Lucro do Alfaiate', 'Os alfaiates medievais lucravam fazendo roupas sob medida para nobres e comerciantes ricos, usando tecidos finos e bordados elaborados.', 'O que um alfaiate vendia para lucrar na Idade Média?', 'Roupas feitas sob medida para nobres e comerciantes', '["Comida para os camponeses", "Terras do feudo", "Armas para soldados"]', ARRAY['alfaiate', 'roupas', 'artesanato'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'economics', 'qa', 'Renda dos Pescadores', 'Os pescadores medievais ganhavam dinheiro vendendo peixe fresco nos mercados locais, sendo uma fonte importante de proteína.', 'Como os pescadores medievais ganhavam dinheiro?', 'Vendendo peixe nos mercados locais', '["Participando de guerras", "Produzindo tecidos", "Construindo embarcações militares"]', ARRAY['pescadores', 'mercados', 'alimentação'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'economics', 'qa', 'Sistema de Pedágios', 'Os pedágios medievais eram taxas cobradas por senhores locais sobre o uso de pontes ou estradas, gerando renda através do controle de rotas comerciais.', 'O que eram pedágios medievais e quem lucrava com eles?', 'Taxas sobre pontes ou estradas, arrecadadas por senhores locais', '["Impostos sobre livros", "Tarifas de barcos de guerra", "Tributos sobre torneios"]', ARRAY['pedágios', 'estradas', 'taxas'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'economics', 'qa', 'Lucro dos Açougueiros', 'Os açougueiros medievais obtinham lucro comprando animais vivos de criadores e vendendo carne processada aos moradores das cidades.', 'Como os açougueiros obtinham lucro?', 'Comprando animais e vendendo carne aos moradores', '["Lutando em torneios", "Cultivando trigo", "Produzindo vinho"]', ARRAY['açougueiros', 'carne', 'processamento'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'economics', 'qa', 'Comércio de Especiarias', 'As especiarias como pimenta, canela e cravo geravam grandes lucros para comerciantes medievais devido à alta demanda e dificuldade de obtenção.', 'Qual produto gerava grande lucro para comerciantes medievais internacionais?', 'Especiarias como pimenta, canela e cravo', '["Sal comum", "Ferraduras", "Trigo local"]', ARRAY['especiarias', 'comércio-internacional', 'lucro'], true),

-- 📜 MESOPOTÂMIA - 10 Perguntas sobre Economia

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'economics', 'qa', 'Renda dos Agricultores', 'Os agricultores mesopotâmicos ganhavam dinheiro vendendo trigo, cevada e tâmaras nos mercados das cidades-estado, aproveitando a fertilidade dos rios.', 'Como os agricultores mesopotâmicos ganhavam dinheiro?', 'Vendendo trigo, cevada e tâmaras nos mercados', '["Produzindo papiro", "Construindo templos", "Minerando metais"]', ARRAY['agricultura', 'mercados', 'cereais'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'economics', 'qa', 'Riqueza dos Reis', 'Os reis e sacerdotes mesopotâmicos obtinham riqueza principalmente através de tributos pagos por agricultores e comerciantes de suas cidades-estado.', 'Qual era a principal fonte de riqueza dos reis e sacerdotes?', 'Tributos pagos por agricultores e comerciantes', '["Mineração de ouro", "Produção de vinho", "Comércio marítimo"]', ARRAY['reis', 'tributos', 'governo'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'economics', 'qa', 'Comércio Exterior', 'Os comerciantes mesopotâmicos lucravam vendendo tecidos, cerâmica e objetos de metal para outras cidades-estado e regiões distantes.', 'Como os comerciantes mesopotâmicos lucravam no comércio exterior?', 'Vendendo tecidos, cerâmica e metais a outras cidades-estado', '["Lutando nas muralhas", "Produzindo armas", "Construindo zigurates"]', ARRAY['comércio-exterior', 'tecidos', 'cerâmica'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'economics', 'qa', 'Sistema de Barganha', 'O sistema de barganha mesopotâmico era baseado na troca direta de produtos, permitindo lucro através da diferença de valor entre mercadorias.', 'O que era o sistema de barganha na Mesopotâmia?', 'Troca direta de produtos para lucro', '["Imposto sobre escravos", "Fabricação de moedas", "Sistema de empréstimos"]', ARRAY['barganha', 'troca', 'comércio'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'economics', 'qa', 'Lucro dos Artesãos', 'Os artesãos mesopotâmicos obtinham lucro produzindo joias, ferramentas e cerâmica decorativa para venda nos mercados urbanos.', 'Como os artesãos mesopotâmicos obtinham lucro?', 'Produzindo joias, ferramentas e cerâmica para venda', '["Fazendo esculturas religiosas sem vender", "Lutando nas guerras", "Apenas trabalhando para templos"]', ARRAY['artesãos', 'joias', 'cerâmica'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'economics', 'qa', 'Renda dos Proprietários', 'Os proprietários de terra mesopotâmicos geravam renda cobrando uma parte da colheita dos camponeses que trabalhavam em suas propriedades.', 'O que gerava renda para os proprietários de terra?', 'Cobrar parte da colheita dos camponeses', '["Escrever livros", "Participar de expedições militares", "Produzir armas"]', ARRAY['proprietários', 'colheita', 'renda'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'economics', 'qa', 'Lucro da Pesca', 'Os pescadores dos rios Tigre e Eufrates lucravam vendendo peixe fresco para as populações urbanas das cidades mesopotâmicas.', 'Como os pescadores do Tigre e Eufrates lucravam?', 'Vendendo peixe fresco para cidades', '["Transportando pedras", "Produzindo vinho", "Construindo barcos militares"]', ARRAY['pesca', 'rios', 'alimentação'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'economics', 'qa', 'Produtos Têxteis', 'A tecelagem de lã e linho gerava lucro significativo na Mesopotâmia, com produtos vendidos tanto localmente quanto exportados.', 'Qual atividade gerava lucro com produtos têxteis?', 'Tecelagem de lã e linho e venda em mercados', '["Escultura em bronze", "Pesca de rios", "Mineração de sal"]', ARRAY['tecelagem', 'lã', 'têxteis'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'economics', 'qa', 'Comércio de Grãos', 'O comércio de grãos funcionava através do armazenamento em celeiros e venda conforme a demanda, permitindo controle de preços e lucros.', 'Como funcionava o comércio de grãos?', 'Armazenamento nos celeiros e venda conforme demanda', '["Coleta apenas para uso próprio", "Queima dos excedentes", "Doação aos templos"]', ARRAY['grãos', 'armazenamento', 'demanda'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'economics', 'qa', 'Cálculo de Lucro', 'Os mercadores mesopotâmicos calculavam lucro comparando o custo de produção com o preço de venda nos mercados urbanos e regionais.', 'Como os mercadores mesopotâmicos calculavam lucro?', 'Comparando custo de produção e preço de venda nos mercados', '["Apenas confiando na sorte", "Usando astrologia", "Seguindo ordens dos deuses"]', ARRAY['lucro', 'cálculo', 'mercadores'], true),

-- 🏺 EGITO ANTIGO - 10 Perguntas sobre Economia

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'economics', 'qa', 'Renda dos Agricultores', 'Os agricultores egípcios ganhavam dinheiro vendendo o excedente de trigo e cevada após entregar a parte devida ao faraó e aos templos.', 'Como os agricultores egípcios ganhavam dinheiro?', 'Vendendo excedente de trigo e cevada', '["Construindo pirâmides", "Lutando nas guerras", "Minerando ouro"]', ARRAY['agricultura', 'trigo', 'excedente'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'economics', 'qa', 'Renda dos Faraós', 'Os faraós obtinham renda através de tributos de agricultores, comerciantes e impostos sobre todos os produtos e atividades econômicas do reino.', 'Qual era a fonte de renda dos faraós?', 'Tributos de agricultores, comerciantes e impostos sobre produtos', '["Produção artesanal", "Pesca", "Apenas mineração"]', ARRAY['faraós', 'tributos', 'impostos'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'economics', 'qa', 'Comércio Internacional', 'Os comerciantes egípcios lucravam com o comércio internacional vendendo papiro, ouro e tecidos de linho para povos do Mediterrâneo e África.', 'Como os comerciantes do Egito lucravam com o comércio internacional?', 'Vendendo papiro, ouro e tecidos para outros povos', '["Lutando com mercenários", "Produzindo vinho apenas para templos", "Construindo navios militares"]', ARRAY['comércio-internacional', 'papiro', 'ouro'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'economics', 'qa', 'Renda dos Artesãos', 'Os artesãos egípcios obtinham renda produzindo joias, móveis elaborados e estátuas decorativas para venda à nobreza e templos.', 'Como os artesãos egípcios obtinham renda?', 'Produzindo joias, móveis e estátuas para venda', '["Trabalhando em túmulos sem pagamento", "Lutando em batalhas", "Apenas doando trabalho"]', ARRAY['artesãos', 'joias', 'móveis'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'economics', 'qa', 'Renda dos Escribas', 'Os escribas ganhavam dinheiro registrando impostos, contratos e documentos oficiais, recebendo pagamento do Estado e de particulares.', 'Como os escribas ganhavam dinheiro?', 'Registrando impostos e documentos e recebendo pagamento', '["Vendendo papiro", "Produzindo vinho", "Construindo templos"]', ARRAY['escribas', 'documentos', 'pagamento'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'economics', 'qa', 'Lucro dos Pescadores', 'Os pescadores do Nilo lucravam vendendo peixe fresco nos mercados locais, aproveitando a abundância de peixes do rio sagrado.', 'Como os pescadores do Nilo lucravam?', 'Vendendo peixe fresco nos mercados locais', '["Guardando templos", "Construindo embarcações militares", "Produzindo papiro"]', ARRAY['pescadores', 'nilo', 'mercados'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'economics', 'qa', 'Produtos Lucrativos', 'O papiro, ouro e linho eram os produtos mais lucrativos do comércio egípcio devido à sua qualidade única e demanda internacional.', 'Qual produto era muito lucrativo para o comércio egípcio?', 'Papiro, ouro e linho', '["Sal comum", "Trigo apenas", "Pedras comuns"]', ARRAY['papiro', 'linho', 'produtos-lucrativos'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'economics', 'qa', 'Transporte de Mercadorias', 'Os comerciantes egípcios transportavam mercadorias principalmente em barcos pelo rio Nilo, aproveitando a corrente natural para lucrar com fretes.', 'Como os comerciantes transportavam mercadorias para lucro?', 'Em barcos pelo Nilo', '["Somente por estradas de areia", "Transportando a pé grandes pedras", "Apenas por terra"]', ARRAY['transporte', 'nilo', 'barcos'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'economics', 'qa', 'Mineração de Ouro', 'Os trabalhadores em mineração de ouro ganhavam dinheiro recebendo pagamento do Estado egípcio ou dos templos que controlavam as minas.', 'Como os trabalhadores em mineração de ouro ganhavam dinheiro?', 'Recebendo pagamento do Estado ou do templo', '["Apenas comida", "Não recebiam nada", "Somente proteção"]', ARRAY['mineração', 'ouro', 'pagamento'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'economics', 'qa', 'Artesãos de Templos', 'Os artesãos especializados lucravam em templos produzindo estátuas de deuses e ornamentos religiosos elaborados encomendados pelos sacerdotes.', 'Como os artesãos lucravam em templos?', 'Produzindo estátuas e ornamentos religiosos', '["Lutando em guerras", "Plantando trigo", "Guardando tesouros"]', ARRAY['templos', 'estátuas', 'ornamentos'], true),

-- 💻 ERA DIGITAL - 10 Perguntas sobre Economia/Lucro

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'economics', 'qa', 'Renda de Influenciadores', 'Os influenciadores digitais ganham dinheiro através de patrocínios de marcas, marketing de afiliados e vendas de produtos próprios para suas audiências.', 'Como os influenciadores digitais ganham dinheiro?', 'Patrocínios, marketing e vendas de produtos', '["Somente com vídeos virais", "Fazendo transmissões públicas", "Apenas com curtidas"]', ARRAY['influenciadores', 'patrocínios', 'marketing'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Lucro com NFTs', 'O lucro em NFTs vem da venda e revenda de tokens digitais exclusivos, aproveitando a escassez digital e demanda de colecionadores.', 'O que gera lucro em NFTs?', 'Venda e revenda de tokens digitais exclusivos', '["Apenas criar a arte", "Guardar os tokens sem vender", "Somente exibir online"]', ARRAY['nfts', 'tokens', 'revenda'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'economics', 'qa', 'Lucro do Delivery', 'Aplicativos de delivery obtêm lucro cobrando taxas sobre cada pedido e comissões dos restaurantes parceiros por cada venda realizada.', 'Como aplicativos de delivery obtêm lucro?', 'Taxas sobre pedidos e comissão de restaurantes', '["Apenas anunciando apps", "Distribuindo comida gratuitamente", "Somente com publicidade"]', ARRAY['delivery', 'taxas', 'comissões'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'economics', 'qa', 'Renda de Streaming', 'Criadores de conteúdo em streaming ganham através de assinaturas de seguidores, receita publicitária e doações diretas da audiência.', 'Como os criadores de conteúdo em streaming ganham dinheiro?', 'Assinaturas, publicidade e doações', '["Vendendo só produtos físicos", "Apenas com redes sociais", "Somente com merchandising"]', ARRAY['streaming', 'assinaturas', 'doações'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'economics', 'qa', 'Lucro E-commerce', 'Empresas de e-commerce lucram através das vendas de produtos, taxas de serviço e cobrança de frete dos consumidores finais.', 'Como empresas de e-commerce lucram?', 'Vendas de produtos, taxas de serviço e frete', '["Produzindo aplicativos", "Vendendo espaço publicitário", "Apenas com marketing"]', ARRAY['e-commerce', 'vendas', 'frete'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Lucro da Mineração', 'Mineradores de criptomoedas lucram validando transações na blockchain e recebendo moedas como recompensa pelo processamento computacional.', 'Como um minerador de criptomoedas lucra?', 'Validando transações e recebendo moedas', '["Investindo em ações", "Apenas com marketing digital", "Vendendo equipamentos"]', ARRAY['mineração', 'blockchain', 'validação'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Lucro Crowdfunding', 'Plataformas de crowdfunding geram lucro cobrando taxas percentuais sobre as doações ou financiamentos bem-sucedidos dos projetos.', 'O que gera lucro em plataformas de crowdfunding?', 'Taxas sobre doações ou financiamento', '["Apenas criando campanhas", "Vendendo produtos físicos", "Somente com publicidade"]', ARRAY['crowdfunding', 'taxas', 'financiamento'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'economics', 'qa', 'Capital para Startups', 'Startups digitais obtêm capital através de investimentos de venture capital e campanhas de crowdfunding para financiar crescimento e desenvolvimento.', 'Como startups digitais obtêm capital?', 'Investimentos de venture capital e crowdfunding', '["Apenas vendendo produtos físicos", "Trabalhando sem receita", "Somente com empréstimos bancários"]', ARRAY['startups', 'venture-capital', 'investimento'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'economics', 'qa', 'Lucro Publicidade Online', 'Empresas de publicidade online lucram cobrando por clique (CPC), impressões (CPM) e campanhas segmentadas baseadas em dados de usuários.', 'Como empresas de publicidade online lucram?', 'Cobrança por clique, impressões e campanhas segmentadas', '["Apenas com vendas de softwares", "Vendendo equipamentos", "Somente com assinaturas"]', ARRAY['publicidade', 'cpc', 'segmentação'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'economics', 'qa', 'Lucro Mobilidade Urbana', 'Aplicativos de mobilidade urbana como Uber geram lucro cobrando taxas sobre corridas e oferecendo serviços adicionais como entrega e fretes.', 'Como aplicativos de mobilidade urbana (ex.: Uber) geram lucro?', 'Taxas sobre corridas e serviços adicionais', '["Apenas marketing", "Produzindo carros", "Somente com publicidade"]', ARRAY['mobilidade', 'uber', 'taxas'], true);

-- 📊 VERIFICAÇÃO FINAL - Contar total de perguntas por era após economia
SELECT 
  e.name as era_nome,
  e.slug as era_slug,
  COUNT(ki.*) as total_perguntas,
  COUNT(CASE WHEN ki.category = 'economics' THEN 1 END) as perguntas_economia
FROM public.eras e
LEFT JOIN public.knowledge_items ki ON e.id = ki.era_id AND ki.item_type = 'qa'
GROUP BY e.name, e.slug, e.id
ORDER BY e.id;

-- 🎯 RESULTADO ESPERADO APÓS ECONOMIA:
-- Egito Antigo: 33 perguntas (13 + 10 novas + 10 economia)
-- Mesopotâmia: 32 perguntas (12 + 10 novas + 10 economia) 
-- Era Medieval: 33 perguntas (13 + 10 novas + 10 economia)
-- Era Digital: 32 perguntas (12 + 10 novas + 10 economia)
-- TOTAL: 130 perguntas (50 originais + 40 variadas + 40 economia)
