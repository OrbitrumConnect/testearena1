-- 🏆 EXPANSÃO FINAL: ECONOMIA E SOBREVIVÊNCIA - Arena of Wisdom Wars
-- 🎯 Adicionando 40 perguntas finais com foco em ECONOMIA/SOBREVIVÊNCIA (4 alternativas cada)
-- 📊 Resultado final: 170 perguntas totais (50 + 40 + 40 + 40)

-- ⚔️ ERA MEDIEVAL - 10 Perguntas (Economia e Sobrevivência)

INSERT INTO public.knowledge_items (era_id, category, item_type, title, content, question, correct_answer, wrong_options, tags, is_verified) VALUES

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Sobrevivência Camponesa', 'Os camponeses medievais garantiam sobrevivência cultivando alimentos básicos e vendendo o excedente nos mercados locais para obter outros bens necessários.', 'Como os camponeses medievais garantiam sua sobrevivência?', 'Cultivando alimentos e vendendo excedente', '["Lutando em torneios", "Trabalhando apenas nos castelos", "Produzindo moedas"]', ARRAY['camponeses', 'sobrevivência', 'agricultura'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Renda Senhorial', 'A principal fonte de renda dos senhores feudais eram os impostos e tributos cobrados dos camponeses que trabalhavam em suas terras.', 'Qual era a principal fonte de renda dos senhores feudais?', 'Impostos e tributos dos camponeses', '["Comércio marítimo", "Produção de armas", "Educação de filhos nobres"]', ARRAY['senhores-feudais', 'impostos', 'tributos'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Lucro dos Ferreiros', 'Os ferreiros medievais ganhavam dinheiro produzindo ferramentas essenciais para agricultura, armas para soldados e ferraduras para cavalos.', 'Como os ferreiros ganhavam dinheiro?', 'Produzindo ferramentas, armas e ferraduras', '["Consertando castelos", "Cultivando trigo", "Fazendo vinho"]', ARRAY['ferreiros', 'ferramentas', 'metalurgia'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Economia Monástica', 'Os mosteiros lucravam economicamente produzindo cerveja, vinho e manuscritos iluminados que eram vendidos para sustentar a comunidade religiosa.', 'Como os mosteiros lucravam economicamente?', 'Produzindo cerveja, vinho e manuscritos para venda', '["Lutando por terras", "Apenas rezando", "Vendendo armas"]', ARRAY['mosteiros', 'produção', 'manuscritos'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Lucro em Feiras', 'Os comerciantes medievais lucravam nas feiras vendendo produtos importados de regiões distantes e artesanato local com margens de lucro significativas.', 'Como os comerciantes medievais lucravam nas feiras?', 'Vendendo produtos importados e artesanato local', '["Lutando em torneios", "Produzindo moedas", "Cultivando campos"]', ARRAY['comerciantes', 'feiras', 'produtos-importados'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Pesca Medieval', 'Os pescadores medievais geravam lucro vendendo peixe fresco nos mercados locais, fornecendo proteína essencial para as comunidades.', 'O que gerava lucro para os pescadores medievais?', 'Vender peixe nos mercados locais', '["Lutando em guerras", "Produzindo tecidos", "Fazendo vinho"]', ARRAY['pescadores', 'peixe', 'mercados'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Alfaiates Medievais', 'Os alfaiates obtinham renda produzindo roupas sob medida para nobres e comerciantes ricos, usando tecidos finos e técnicas especializadas.', 'Como os alfaiates obtinham renda?', 'Produzindo roupas sob medida para nobres e comerciantes', '["Cultivando trigo", "Recolhendo impostos", "Lutando em torneios"]', ARRAY['alfaiates', 'roupas', 'nobres'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Sistema de Pedágios', 'Os pedágios medievais eram taxas cobradas pelos senhores locais sobre o uso de pontes ou estradas, controlando rotas comerciais lucrativas.', 'O que eram pedágios medievais?', 'Taxas sobre pontes ou estradas cobradas pelos senhores', '["Impostos sobre livros", "Tarifas de barcos de guerra", "Tributos religiosos"]', ARRAY['pedágios', 'estradas', 'controle-comercial'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Açougue Medieval', 'Os açougueiros obtinham lucro comprando animais vivos de criadores rurais e vendendo carne processada nas cidades e vilas.', 'Como os açougueiros obtinham lucro?', 'Comprando animais e vendendo carne', '["Lutando em torneios", "Cultivando trigo", "Fazendo tecidos"]', ARRAY['açougueiros', 'carne', 'processamento'], true),

((SELECT id FROM public.eras WHERE slug = 'idade-media'), 'finance', 'qa', 'Comércio de Especiarias', 'As especiarias como pimenta, canela e cravo geravam enormes lucros para comerciantes internacionais devido à alta demanda e dificuldade de obtenção.', 'Qual produto gerava grande lucro para comerciantes internacionais?', 'Especiarias como pimenta, canela e cravo', '["Sal comum", "Ferraduras", "Madeira"]', ARRAY['especiarias', 'comércio-internacional', 'alta-demanda'], true),

-- 📜 MESOPOTÂMIA - 10 Perguntas (Economia e Sobrevivência)

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'finance', 'qa', 'Agricultura Mesopotâmica', 'Os agricultores mesopotâmicos ganhavam dinheiro vendendo trigo, cevada e tâmaras nos mercados urbanos, aproveitando a fertilidade dos rios.', 'Como os agricultores mesopotâmicos ganhavam dinheiro?', 'Vendendo trigo, cevada e tâmaras', '["Produzindo papiro", "Construindo templos", "Lutando"]', ARRAY['agricultura', 'cereais', 'tâmaras'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'finance', 'qa', 'Riqueza Real', 'A principal fonte de riqueza dos reis e sacerdotes mesopotâmicos eram os tributos pagos por agricultores e comerciantes das cidades-estado.', 'Qual era a principal fonte de riqueza dos reis e sacerdotes?', 'Tributos pagos por agricultores e comerciantes', '["Mineração de ouro", "Produção de vinho", "Comércio marítimo"]', ARRAY['reis', 'sacerdotes', 'tributos'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'finance', 'qa', 'Comércio Regional', 'Os comerciantes mesopotâmicos lucravam vendendo tecidos, cerâmica e objetos de metal para outras cidades-estado e regiões vizinhas.', 'Como os comerciantes mesopotâmicos lucravam?', 'Vendendo tecidos, cerâmica e metais a outras cidades', '["Lutando nas muralhas", "Produzindo armas", "Construindo templos"]', ARRAY['comércio', 'tecidos', 'cerâmica'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'finance', 'qa', 'Sistema de Troca', 'O sistema de barganha mesopotâmico funcionava através da troca direta de produtos, permitindo lucro pela diferença de valor entre mercadorias.', 'O que era o sistema de barganha na Mesopotâmia?', 'Troca direta de produtos para lucro', '["Imposto sobre escravos", "Fabricação de moedas", "Produção de joias"]', ARRAY['barganha', 'troca-direta', 'sistema-econômico'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'finance', 'qa', 'Artesanato Lucrativo', 'Os artesãos mesopotâmicos obtinham renda produzindo joias elaboradas, ferramentas especializadas e cerâmica decorativa para venda.', 'Como os artesãos obtinham renda?', 'Produzindo joias, ferramentas e cerâmica', '["Fazendo esculturas religiosas sem vender", "Lutando nas guerras", "Cultivando trigo"]', ARRAY['artesãos', 'joias', 'cerâmica-decorativa'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'finance', 'qa', 'Propriedade Rural', 'Os proprietários de terra geravam renda cobrando uma porcentagem da colheita dos camponeses que trabalhavam em suas propriedades agrícolas.', 'O que gerava renda para proprietários de terra?', 'Cobrar parte da colheita dos camponeses', '["Escrever livros", "Participar de expedições militares", "Produzir tecidos"]', ARRAY['proprietários', 'colheita', 'porcentagem'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'finance', 'qa', 'Pesca Fluvial', 'Os pescadores dos rios Tigre e Eufrates lucravam vendendo peixe fresco para as crescentes populações urbanas das cidades mesopotâmicas.', 'Como os pescadores do Tigre e Eufrates lucravam?', 'Vendendo peixe fresco', '["Transportando pedras", "Produzindo vinho", "Lutando"]', ARRAY['pesca', 'rios', 'populações-urbanas'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'finance', 'qa', 'Indústria Têxtil', 'A tecelagem de lã e linho gerava lucros significativos na Mesopotâmia, com produtos vendidos localmente e exportados para regiões distantes.', 'Qual atividade gerava lucro com produtos têxteis?', 'Tecelagem de lã e linho', '["Escultura em bronze", "Pesca", "Produção de vinho"]', ARRAY['tecelagem', 'lã', 'exportação'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'finance', 'qa', 'Mercado de Grãos', 'O comércio de grãos funcionava através do armazenamento estratégico em celeiros e venda conforme a demanda sazonal e regional.', 'Como funcionava o comércio de grãos?', 'Armazenamento nos celeiros e venda conforme demanda', '["Coleta apenas para uso próprio", "Queima dos excedentes", "Comércio internacional"]', ARRAY['grãos', 'celeiros', 'demanda-sazonal'], true),

((SELECT id FROM public.eras WHERE slug = 'mesopotamia'), 'finance', 'qa', 'Cálculo Comercial', 'Os mercadores mesopotâmicos calculavam lucro comparando cuidadosamente o custo de produção com o preço de venda nos diversos mercados.', 'Como os mercadores calculavam lucro?', 'Comparando custo de produção e preço de venda', '["Apenas confiando na sorte", "Usando astrologia", "Produzindo artesanato"]', ARRAY['mercadores', 'cálculo', 'comparação-custos'], true),

-- 🏺 EGITO ANTIGO - 10 Perguntas (Economia e Sobrevivência)

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'finance', 'qa', 'Sobrevivência Agrícola', 'Os agricultores egípcios sobreviviam economicamente vendendo o excedente de trigo e cevada após entregar a parte devida ao Estado.', 'Como os agricultores egípcios sobreviviam economicamente?', 'Vendendo excedente de trigo e cevada', '["Lutando em guerras", "Construindo pirâmides", "Produzindo vinho"]', ARRAY['agricultores', 'sobrevivência', 'excedente'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'finance', 'qa', 'Renda Faraônica', 'A principal fonte de renda dos faraós eram os tributos de agricultores, comerciantes e impostos sobre todas as atividades econômicas do reino.', 'Qual era a principal fonte de renda dos faraós?', 'Tributos de agricultores, comerciantes e impostos', '["Produção artesanal", "Pesca", "Escultura"]', ARRAY['faraós', 'tributos', 'impostos-gerais'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'finance', 'qa', 'Comércio Exterior Egípcio', 'Os comerciantes egípcios lucravam no comércio exterior vendendo papiro exclusivo, ouro de alta qualidade e tecidos de linho fino.', 'Como os comerciantes egípcios lucravam no exterior?', 'Vendendo papiro, ouro e tecidos', '["Lutando com mercenários", "Produzindo vinho apenas para templos", "Construindo pirâmides"]', ARRAY['comércio-exterior', 'papiro', 'ouro'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'finance', 'qa', 'Artesanato Egípcio', 'Os artesãos egípcios ganhavam dinheiro produzindo joias elaboradas, móveis finos e estátuas decorativas para venda à elite e templos.', 'Como os artesãos egípcios ganhavam dinheiro?', 'Produzindo joias, móveis e estátuas para venda', '["Trabalhando em túmulos sem pagamento", "Lutando em batalhas", "Cultivando trigo"]', ARRAY['artesãos', 'joias', 'móveis-finos'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'finance', 'qa', 'Profissão de Escriba', 'Os escribas obtinham renda registrando impostos, contratos comerciais e documentos oficiais, sendo pagos pelo Estado e particulares.', 'Como os escribas obtinham renda?', 'Registrando impostos e documentos oficiais', '["Vendendo papiro", "Produzindo vinho", "Lutando"]', ARRAY['escribas', 'documentos', 'registros'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'finance', 'qa', 'Pesca no Nilo', 'Os pescadores do Nilo lucravam vendendo peixe fresco nos mercados locais, aproveitando a abundante vida aquática do rio sagrado.', 'Como os pescadores do Nilo lucravam?', 'Vendendo peixe fresco', '["Guardando templos", "Construindo embarcações militares", "Produzindo vinho"]', ARRAY['pescadores', 'nilo', 'peixe-fresco'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'finance', 'qa', 'Produtos Premium', 'O papiro, ouro e linho eram altamente lucrativos para o comércio egípcio devido à sua qualidade excepcional e demanda internacional.', 'Qual produto era altamente lucrativo para o comércio egípcio?', 'Papiro, ouro e linho', '["Sal comum", "Trigo apenas", "Madeira"]', ARRAY['produtos-premium', 'papiro', 'linho'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'finance', 'qa', 'Transporte Nilótico', 'Os comerciantes egípcios transportavam mercadorias principalmente em barcos pelo rio Nilo, aproveitando a corrente natural para reduzir custos.', 'Como os comerciantes transportavam mercadorias?', 'Em barcos pelo Nilo', '["Apenas por estradas de areia", "Transportando a pé grandes pedras", "Somente em caravanas de camelos"]', ARRAY['transporte', 'nilo', 'barcos'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'finance', 'qa', 'Mineração Organizada', 'Os trabalhadores em mineração de ouro ganhavam dinheiro recebendo pagamento regular do Estado egípcio ou dos templos que controlavam as minas.', 'Como os trabalhadores em mineração de ouro ganhavam dinheiro?', 'Recebendo pagamento do Estado ou templos', '["Apenas comida", "Não recebiam nada", "Vendendo joias"]', ARRAY['mineração', 'ouro', 'pagamento-regular'], true),

((SELECT id FROM public.eras WHERE slug = 'egito-antigo'), 'finance', 'qa', 'Arte Religiosa', 'Os artesãos especializados lucravam em templos produzindo estátuas de deuses e ornamentos religiosos elaborados encomendados pelos sacerdotes.', 'Como artesãos lucravam em templos?', 'Produzindo estátuas e ornamentos religiosos', '["Lutando em guerras", "Plantando trigo", "Guardando papiros"]', ARRAY['arte-religiosa', 'estátuas', 'ornamentos'], true),

-- 💻 ERA DIGITAL - 10 Perguntas (Economia e Sobrevivência)

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Economia de Influência', 'Os influenciadores digitais ganham dinheiro através de parcerias com marcas, marketing de afiliados e vendas de produtos próprios para suas audiências engajadas.', 'Como influenciadores digitais ganham dinheiro?', 'Patrocínios, marketing e vendas de produtos', '["Somente com vídeos virais", "Fazendo transmissões públicas", "Produzindo aplicativos"]', ARRAY['influenciadores', 'patrocínios', 'marketing-afiliados'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Economia NFT', 'O lucro em NFTs é gerado através da venda e revenda de tokens digitais exclusivos, criando mercados de arte e colecionáveis digitais.', 'O que gera lucro em NFTs?', 'Venda e revenda de tokens digitais exclusivos', '["Apenas criar a arte", "Guardar os tokens sem vender", "Produzir vídeos"]', ARRAY['nfts', 'tokens-exclusivos', 'arte-digital'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Modelo Delivery', 'Aplicativos de delivery obtêm lucro cobrando taxas sobre cada pedido realizado e comissões dos restaurantes parceiros por vendas intermediadas.', 'Como aplicativos de delivery obtêm lucro?', 'Taxas sobre pedidos e comissão de restaurantes', '["Apenas anunciando apps", "Distribuindo comida gratuitamente", "Produzindo software"]', ARRAY['delivery', 'taxas-pedidos', 'comissões'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Monetização Streaming', 'Criadores de conteúdo em streaming monetizam através de assinaturas de seguidores, receita publicitária e doações diretas da comunidade.', 'Como criadores de conteúdo em streaming ganham dinheiro?', 'Assinaturas, publicidade e doações', '["Vendendo só produtos físicos", "Apenas com redes sociais", "Produzindo hardware"]', ARRAY['streaming', 'assinaturas', 'monetização'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Modelo E-commerce', 'Empresas de e-commerce lucram através das vendas diretas de produtos, taxas de serviço e cobrança de frete dos consumidores finais.', 'Como empresas de e-commerce lucram?', 'Vendas de produtos, taxas de serviço e frete', '["Produzindo aplicativos", "Vendendo publicidade apenas", "Fazendo eventos"]', ARRAY['e-commerce', 'vendas-diretas', 'taxas-serviço'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Mineração Crypto', 'Mineradores de criptomoedas lucram validando transações na blockchain e recebendo moedas como recompensa pelo processamento computacional.', 'Como mineradores de criptomoedas lucram?', 'Validando transações e recebendo moedas', '["Investindo em ações", "Fazendo marketing digital", "Produzindo hardware"]', ARRAY['mineração-crypto', 'blockchain', 'validação'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Modelo Crowdfunding', 'Plataformas de crowdfunding geram lucro cobrando taxas percentuais sobre doações bem-sucedidas ou financiamentos coletivos realizados.', 'O que gera lucro em crowdfunding?', 'Taxas sobre doações ou financiamento', '["Apenas criando campanhas", "Vendendo produtos físicos", "Produzindo software"]', ARRAY['crowdfunding', 'taxas-percentuais', 'financiamento-coletivo'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Capital Startup', 'Startups digitais obtêm capital através de rodadas de investimento de venture capital e campanhas de crowdfunding para financiar crescimento.', 'Como startups digitais obtêm capital?', 'Investimentos de venture capital e crowdfunding', '["Vendendo produtos físicos", "Trabalhando sem receita", "Produzindo aplicativos offline"]', ARRAY['startups', 'venture-capital', 'rodadas-investimento'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Publicidade Programática', 'Empresas de publicidade online lucram cobrando por clique (CPC), impressões (CPM) e campanhas segmentadas baseadas em dados de usuários.', 'Como empresas de publicidade online lucram?', 'Cobrança por clique, impressões e campanhas segmentadas', '["Vendendo software", "Produzindo equipamentos", "Somente mídia social"]', ARRAY['publicidade-online', 'cpc', 'segmentação'], true),

((SELECT id FROM public.eras WHERE slug = 'era-digital'), 'finance', 'qa', 'Economia Compartilhada', 'Aplicativos de mobilidade urbana como Uber geram lucro cobrando taxas sobre corridas e oferecendo serviços adicionais como entrega.', 'Como apps de mobilidade urbana geram lucro?', 'Taxas sobre corridas e serviços adicionais', '["Apenas marketing", "Produzindo carros", "Vendendo mapas"]', ARRAY['mobilidade-urbana', 'economia-compartilhada', 'taxas-corridas'], true);

-- 📊 VERIFICAÇÃO FINAL COMPLETA - Total após todas as expansões
SELECT 
  e.name as era_nome,
  e.slug as era_slug,
  COUNT(ki.*) as total_perguntas,
  COUNT(CASE WHEN ki.category = 'finance' THEN 1 END) as perguntas_economia,
  COUNT(CASE WHEN ki.category = 'history' THEN 1 END) as perguntas_historia,
  COUNT(CASE WHEN ki.category = 'technology' THEN 1 END) as perguntas_tecnologia
FROM public.eras e
LEFT JOIN public.knowledge_items ki ON e.id = ki.era_id AND ki.item_type = 'qa'
GROUP BY e.name, e.slug, e.id
ORDER BY e.id;

-- 🎯 RESULTADO FINAL ESPERADO:
-- 🏺 Egito Antigo: 43 perguntas (13 + 10 + 10 + 10)
-- 📜 Mesopotâmia: 42 perguntas (12 + 10 + 10 + 10) 
-- ⚔️ Era Medieval: 43 perguntas (13 + 10 + 10 + 10)
-- 💻 Era Digital: 42 perguntas (12 + 10 + 10 + 10)
-- 🏆 TOTAL FINAL: 170 PERGUNTAS (120 novas adicionadas!)
