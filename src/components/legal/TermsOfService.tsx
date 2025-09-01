import { Shield, Users, Coins, AlertTriangle, CheckCircle } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-montserrat font-bold mb-4">
          Termos de Uso - Arena of Wisdom Wars
        </h1>
        <p className="text-muted-foreground">
          Sistema de Créditos Internos e Competições de Conhecimento
        </p>
      </div>

      {/* Sistema de Créditos */}
      <section className="arena-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center text-epic">
          <Coins className="w-6 h-6 mr-2" />
          1. Sistema de Créditos Internos
        </h2>
        
        <div className="space-y-4 text-sm">
          <div className="bg-epic/10 p-4 rounded-lg border border-epic/20">
            <h3 className="font-semibold mb-2">🎯 Natureza dos Créditos</h3>
            <ul className="space-y-2">
              <li>• Os créditos são uma <strong>moeda virtual interna</strong> da plataforma</li>
              <li>• <strong>Não possuem valor monetário</strong> fora do aplicativo</li>
              <li>• Servem exclusivamente para <strong>uso interno</strong> na plataforma</li>
              <li>• Não podem ser transferidos entre usuários</li>
              <li>• Não constituem investimento ou promessa de retorno financeiro</li>
            </ul>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">💰 Entrada na Plataforma</h3>
            <ul className="space-y-2">
              <li>• Valor de entrada: <strong>R$ 5,00</strong></li>
              <li>• Taxa de plataforma: <strong>R$ 0,50</strong> (retida para manutenção)</li>
              <li>• Créditos recebidos: <strong>500 créditos</strong> para uso interno</li>
              <li>• O valor pago <strong>não constitui compra</strong> de créditos</li>
              <li>• É uma <strong>taxa de acesso</strong> aos serviços da plataforma</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Competições PvP */}
      <section className="arena-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center text-battle">
          <Users className="w-6 h-6 mr-2" />
          2. Competições Player vs Player (PvP)
        </h2>
        
        <div className="space-y-4 text-sm">
          <div className="bg-battle/10 p-4 rounded-lg border border-battle/20">
            <h3 className="font-semibold mb-2">⚔️ Natureza das Competições</h3>
            <ul className="space-y-2">
              <li>• Competições baseadas em <strong>habilidade e conhecimento</strong></li>
              <li>• <strong>Não constituem jogo de azar</strong> ou sorte</li>
              <li>• Resultado determinado pela <strong>capacidade do jogador</strong></li>
              <li>• Perguntas de conhecimento geral e histórico</li>
              <li>• Sistema de HP baseado em acertos e erros</li>
            </ul>
          </div>

          <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
            <h3 className="font-semibold mb-2">🎮 Mecânica das Batalhas</h3>
            <ul className="space-y-2">
              <li>• Aposta: <strong>varia por plano</strong> por participante</li>
              <li>• Pool total: <strong>varia por plano</strong></li>
              <li>• Vencedor recebe: <strong>baseado no plano</strong></li>
              <li>• Sistema de 3 planos: Basic, Standard, Premium</li>
              <li>• <strong>Consentimento explícito</strong> obrigatório antes de cada batalha</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bônus e Recompensas */}
      <section className="arena-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center text-victory">
          <CheckCircle className="w-6 h-6 mr-2" />
          3. Sistema de Recompensas
        </h2>
        
        <div className="space-y-4 text-sm">
          <div className="bg-victory/10 p-4 rounded-lg border border-victory/20">
            <h3 className="font-semibold mb-2">📚 Treinos e Atividades</h3>
            <ul className="space-y-2">
              <li>• Recompensas por <strong>atividade educacional</strong> na plataforma</li>
              <li>• Créditos baseados em <strong>precisão</strong> e <strong>participação</strong></li>
              <li>• Limite de <strong>3 treinos por era</strong> por dia</li>
              <li>• Bônus de 20% para <strong>90%+ de acerto</strong></li>
            </ul>
          </div>

          <div className="bg-epic/10 p-4 rounded-lg border border-epic/20">
            <h3 className="font-semibold mb-2">🎁 Bônus Misterioso Mensal</h3>
            <ul className="space-y-2">
              <li>• Bônus baseado em <strong>atividade mensal</strong> do usuário</li>
              <li>• Critérios: dias ativos, precisão, diversidade, tempo na plataforma</li>
              <li>• Máximo de <strong>2.500 créditos</strong> por mês</li>
              <li>• <strong>Não é garantido</strong> - baseado em mérito</li>
              <li>• Algoritmo interno da plataforma</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Saque e Devolução */}
      <section className="arena-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center text-warning">
          <AlertTriangle className="w-6 h-6 mr-2" />
          4. Política de Saque (Devolução)
        </h2>
        
        <div className="space-y-4 text-sm">
          <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
            <h3 className="font-semibold mb-2">💸 Condições de Saque</h3>
            <ul className="space-y-2">
              <li>• Saque disponível <strong>apenas do valor originalmente pago</strong></li>
              <li>• <strong>Créditos ganhos não são sacáveis</strong></li>
              <li>• Prazo mínimo: <strong>30 dias</strong> após entrada na plataforma</li>
              <li>• Taxa administrativa: <strong>5%</strong> sobre o valor sacado</li>
              <li>• Valor disponível: <strong>R$ 18,05</strong> (R$ 19,00 - 5%)</li>
            </ul>
          </div>

          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <h3 className="font-semibold mb-2">🚨 DISTINÇÃO CRÍTICA: Tipos de Créditos</h3>
            <div className="space-y-3">
              <div className="bg-background/50 p-3 rounded border-l-4 border-epic">
                <p className="font-semibold text-epic">💰 Créditos Sacáveis (Limitados)</p>
                <ul className="space-y-1 text-xs mt-1">
                  <li>• Apenas o valor originalmente pago (máximo R$ 20,00)</li>
                  <li>• Sujeito a prazo de 30 dias e taxa de 5%</li>
                </ul>
              </div>
              
              <div className="bg-background/50 p-3 rounded border-l-4 border-victory">
                <p className="font-semibold text-victory">🎮 Créditos Ganhos (Apenas Uso Interno)</p>
                <ul className="space-y-1 text-xs mt-1">
                  <li>• <strong>Obtidos em treinos, PvP e atividades</strong></li>
                  <li>• <strong>NÃO são sacáveis em hipótese alguma</strong></li>
                  <li>• Servem apenas para continuar jogando</li>
                  <li>• Limitação diária de partidas para controlar ganhos</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <h3 className="font-semibold mb-2">⚠️ Limitações Importantes</h3>
            <ul className="space-y-2">
              <li>• <strong>Créditos NÃO são conversíveis</strong> em dinheiro</li>
              <li>• Saque limitado ao <strong>valor de entrada menos taxas</strong></li>
              <li>• <strong>Não há promessa</strong> de lucro ou retorno</li>
              <li>• <strong>Não constitui investimento</strong> financeiro</li>
              <li>• <strong>Foco em entretenimento educacional</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Segurança e Privacidade */}
      <section className="arena-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center text-epic">
          <Shield className="w-6 h-6 mr-2" />
          5. Segurança e Conformidade
        </h2>
        
        <div className="space-y-4 text-sm">
          <div className="bg-muted/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🛡️ Proteção de Dados</h3>
            <ul className="space-y-2">
              <li>• Conformidade com <strong>LGPD</strong> (Lei Geral de Proteção de Dados)</li>
              <li>• <strong>Logs automáticos</strong> de todas as transações</li>
              <li>• <strong>Auditoria interna</strong> mensal</li>
              <li>• Dados criptografados e seguros</li>
            </ul>
          </div>

          <div className="bg-epic/10 p-4 rounded-lg border border-epic/20">
            <h3 className="font-semibold mb-2">📊 Transparência</h3>
            <ul className="space-y-2">
              <li>• <strong>Relatórios mensais</strong> de atividade</li>
              <li>• <strong>Histórico completo</strong> de transações</li>
              <li>• <strong>Suporte técnico</strong> disponível</li>
              <li>• <strong>Política de reembolso</strong> clara</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Consentimento */}
      <section className="arena-card p-6 bg-epic/5 border border-epic">
        <h2 className="text-xl font-bold mb-4 text-epic">
          ✅ Consentimento e Aceite
        </h2>
        
        <div className="space-y-4 text-sm">
          <p className="font-semibold">
            Ao utilizar a plataforma, você confirma que:
          </p>
          
          <ul className="space-y-2">
            <li>• <strong>Leu e compreendeu</strong> todos os termos acima</li>
            <li>• <strong>Concorda</strong> com o sistema de créditos internos</li>
            <li>• <strong>Entende</strong> que créditos não têm valor monetário externo</li>
            <li>• <strong>Aceita</strong> participar de competições baseadas em conhecimento</li>
            <li>• <strong>Está ciente</strong> das limitações de saque</li>
            <li>• É <strong>maior de 18 anos</strong> e capaz juridicamente</li>
          </ul>
          
          <div className="bg-epic/20 p-4 rounded-lg mt-6">
            <p className="font-bold text-epic text-center">
              Este é um sistema de entretenimento educacional baseado em conhecimento.
              <br />
              Não constitui jogo de azar, investimento ou promessa de retorno financeiro.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
