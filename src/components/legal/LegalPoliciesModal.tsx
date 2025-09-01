import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  Scale,
  Shield,
  FileText,
  Users,
  Trophy,
  DollarSign,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Target
} from 'lucide-react';

interface LegalPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalPoliciesModal: React.FC<LegalPoliciesModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'rules' | 'legal'>('terms');

  if (!isOpen) return null;

  const tabs = [
    { id: 'terms', label: 'Termos de Uso', icon: FileText },
    { id: 'privacy', label: 'Privacidade', icon: Shield },
    { id: 'rules', label: 'Regulamento', icon: Trophy },
    { id: 'legal', label: 'Legalidade', icon: Scale }
  ];

  const renderTermsContent = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">Termos de Uso</h3>
        <Badge variant="outline">v1.0</Badge>
      </div>
      
      <div className="space-y-3 text-sm text-muted-foreground">
        <div>
          <h4 className="font-medium text-white mb-2">🎯 Natureza do Serviço</h4>
          <p>A Arena do Conhecimento é uma plataforma educacional que oferece:</p>
          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
            <li>Quizzes educativos sobre história mundial</li>
            <li>Competições baseadas em habilidade intelectual</li>
            <li>Sistema de recompensas por mérito e desempenho</li>
            <li>Ranking transparente e justo</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-2">⚖️ Responsabilidades do Usuário</h4>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Fornecer informações verdadeiras no cadastro</li>
            <li>Usar a plataforma de forma educativa e ética</li>
            <li>Não utilizar ferramentas externas ou trapaças</li>
            <li>Respeitar outros usuários e as regras da comunidade</li>
            <li>Ser responsável por declaração tributária quando aplicável</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-2">🚫 Proibições</h4>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Uso de bots, scripts ou automação</li>
            <li>Compartilhamento de conta com terceiros</li>
            <li>Tentativas de manipular o sistema de ranking</li>
            <li>Comportamento abusivo ou discriminatório</li>
            <li>Uso comercial não autorizado da plataforma</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderPrivacyContent = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-victory" />
        <h3 className="text-lg font-semibold text-victory">Política de Privacidade</h3>
        <Badge variant="outline">LGPD</Badge>
      </div>
      
      <div className="space-y-3 text-sm text-muted-foreground">
        <div>
          <h4 className="font-medium text-white mb-2">📊 Dados Coletados</h4>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Cadastro:</strong> Nome, email, data de nascimento</li>
            <li><strong>Performance:</strong> Pontuações, ranking, histórico de jogos</li>
            <li><strong>Financeiro:</strong> PIX, histórico de saques (criptografado)</li>
            <li><strong>Técnicos:</strong> IP, device, logs de segurança</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-2">🎯 Finalidade dos Dados</h4>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Funcionamento da plataforma educacional</li>
            <li>Cálculo de ranking e distribuição de prêmios</li>
            <li>Processamento de pagamentos via PIX</li>
            <li>Prevenção de fraudes e segurança</li>
            <li>Melhoria da experiência educativa</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-2">🔒 Seus Direitos (LGPD)</h4>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Acesso:</strong> Consultar dados pessoais armazenados</li>
            <li><strong>Correção:</strong> Atualizar informações incorretas</li>
            <li><strong>Exclusão:</strong> Solicitar remoção de dados</li>
            <li><strong>Portabilidade:</strong> Exportar dados em formato padrão</li>
            <li><strong>Revogação:</strong> Cancelar consentimentos a qualquer momento</li>
          </ul>
        </div>

        <Card className="p-3 border-victory/30 bg-victory/5">
          <p className="text-xs text-victory">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            <strong>Garantia:</strong> Seus dados são protegidos com criptografia de ponta e nunca são vendidos para terceiros.
          </p>
        </Card>
      </div>
    </div>
  );

  const renderRulesContent = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-epic" />
        <h3 className="text-lg font-semibold text-epic">Regulamento de Competições</h3>
        <Badge variant="outline">Meritocrático</Badge>
      </div>
      
      <div className="space-y-3 text-sm text-muted-foreground">
        <div>
          <h4 className="font-medium text-white mb-2">🏆 Sistema de Ranking</h4>
          <p className="mb-2">O mérito é calculado com base em:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Taxa de vitória (30%):</strong> Percentual de PvPs ganhos</li>
            <li><strong>Precisão média (25%):</strong> Acertos nas respostas</li>
            <li><strong>Atividade (20%):</strong> Dias ativos no mês</li>
            <li><strong>Sequência (15%):</strong> Vitórias consecutivas</li>
            <li><strong>Volume (10%):</strong> Quantidade de jogos</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-2">💰 Sistema Financeiro</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="p-3 border-primary/30 bg-primary/5">
              <h5 className="font-medium text-primary mb-1">PvP (Competição)</h5>
              <ul className="text-xs space-y-1">
                <li>• Entrada: varia por plano (1-3 créditos)</li>
                <li>• Prêmio vencedor: 2,0 créditos</li>
                <li>• Retenção app: 0,5 créditos</li>
              </ul>
            </Card>
            
            <Card className="p-3 border-epic/30 bg-epic/5">
              <h5 className="font-medium text-epic mb-1">Sistema de Saques</h5>
              <ul className="text-xs space-y-1">
                <li>• Sacável: 80% dos créditos</li>
                <li>• Top 5%: +20% bônus</li>
                <li>• Taxa saque: 10%</li>
                <li>• Mínimo: R$ 2,00</li>
              </ul>
            </Card>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-white mb-2">🎯 Critérios de Elegibilidade</h4>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Idade mínima: 18 anos (ou autorização responsável)</li>
            <li>Mínimo 10 PvPs para entrar no ranking</li>
            <li>Conta verificada com dados reais</li>
            <li>Não ter violações de conduta</li>
          </ul>
        </div>

        <Card className="p-3 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
            <div>
              <h5 className="font-medium text-yellow-500">Anti-Fraude</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Uso de ferramentas externas, bots ou qualquer forma de trapaça resulta em banimento permanente e perda de créditos.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderLegalContent = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Scale className="w-5 h-5 text-legendary" />
        <h3 className="text-lg font-semibold text-legendary">Conformidade Legal</h3>
        <Badge variant="outline">100% Legal</Badge>
      </div>
      
      <div className="space-y-3 text-sm text-muted-foreground">
        <div>
          <h4 className="font-medium text-white mb-2">⚖️ Base Legal</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="p-3 border-victory/30 bg-victory/5">
              <h5 className="font-medium text-victory mb-1">✅ O que SOMOS</h5>
              <ul className="text-xs space-y-1">
                <li>• Plataforma educacional</li>
                <li>• Competição de habilidade</li>
                <li>• Sistema meritocrático</li>
                <li>• Quiz de conhecimento</li>
              </ul>
            </Card>
            
            <Card className="p-3 border-destructive/30 bg-destructive/5">
              <h5 className="font-medium text-destructive mb-1">❌ O que NÃO somos</h5>
              <ul className="text-xs space-y-1">
                <li>• Jogo de azar</li>
                <li>• Casa de apostas</li>
                <li>• Loteria ou sorteio</li>
                <li>• Esquema piramidal</li>
              </ul>
            </Card>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-white mb-2">📋 Conformidade Regulatória</h4>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Lei 13.756/2018:</strong> Competições de habilidade são permitidas</li>
            <li><strong>Lei 14.790/2023:</strong> Não se aplica (não somos casa de apostas)</li>
            <li><strong>Lei 13.709/2018:</strong> Totalmente conforme LGPD</li>
            <li><strong>Marco Civil:</strong> Transparência e neutralidade garantidas</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-2">💼 Aspectos Tributários</h4>
          <Card className="p-3 border-yellow-500/30 bg-yellow-500/5">
            <div className="space-y-2 text-xs">
              <p><strong>Para Usuários:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Ganhos até R$ 1.903,98/mês: ISENTO de IR</li>
                <li>Ganhos acima: Declarar como "Outros Rendimentos"</li>
                <li>Responsabilidade individual do usuário</li>
              </ul>
              <p className="mt-2"><strong>Para a Empresa:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>CNPJ educacional/tecnologia</li>
                <li>Simples Nacional ou Lucro Real</li>
                <li>ISS sobre serviços prestados</li>
              </ul>
            </div>
          </Card>
        </div>

        <div>
          <h4 className="font-medium text-white mb-2">🛡️ Sustentabilidade do Modelo</h4>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="p-2 rounded border border-epic/30 bg-epic/5">
              <div className="font-bold text-epic">88%</div>
              <div>Margem Operacional</div>
            </div>
            <div className="p-2 rounded border border-victory/30 bg-victory/5">
              <div className="font-bold text-victory">5%</div>
              <div>Usuários Elite</div>
            </div>
            <div className="p-2 rounded border border-legendary/30 bg-legendary/5">
              <div className="font-bold text-legendary">80%</div>
              <div>Valor Sacável</div>
            </div>
          </div>
          <p className="text-xs mt-2 text-center text-muted-foreground">
            Sistema matematicamente sustentável que garante pagamento de todos os top performers.
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'terms': return renderTermsContent();
      case 'privacy': return renderPrivacyContent();
      case 'rules': return renderRulesContent();
      case 'legal': return renderLegalContent();
      default: return renderTermsContent();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-black/90 backdrop-blur border-epic/30 overflow-hidden">
        <CardHeader className="border-b border-epic/20 flex flex-row items-center justify-between p-4">
          <CardTitle className="text-xl text-epic flex items-center gap-2">
            <Scale className="w-6 h-6" />
            Termos & Políticas
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <div className="flex flex-col md:flex-row max-h-[70vh]">
          {/* Tabs Sidebar */}
          <div className="w-full md:w-64 border-r border-epic/20 p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-epic/20 text-epic border border-epic/30'
                        : 'text-muted-foreground hover:text-white hover:bg-muted/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </div>

        <div className="border-t border-epic/20 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Última atualização: Dezembro 2024 • Versão 1.0 • 
            <span className="text-epic"> Dúvidas? Entre em contato conosco</span>
          </p>
        </div>
      </Card>
    </div>
  );
};
