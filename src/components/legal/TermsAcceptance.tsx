import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  BookOpen, 
  Trophy, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Scale,
  Users
} from 'lucide-react';

interface TermsAcceptanceProps {
  onAccept: () => void;
  userName?: string;
}

export const TermsAcceptance: React.FC<TermsAcceptanceProps> = ({ 
  onAccept, 
  userName = "Guerreiro" 
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const canProceed = termsAccepted && privacyAccepted && rulesAccepted;

  const handleAcceptAll = () => {
    if (canProceed) {
      // Salvar aceite no localStorage/banco
      localStorage.setItem('terms_accepted', new Date().toISOString());
      localStorage.setItem('terms_version', '1.0');
      onAccept();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-soft to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-black/80 backdrop-blur border-epic/30">
        <CardHeader className="text-center border-b border-epic/20">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-epic/20">
              <Scale className="w-8 h-8 text-epic" />
            </div>
          </div>
          <CardTitle className="text-2xl text-epic">
            🏛️ Bem-vindo à Arena do Conhecimento, {userName}!
          </CardTitle>
          <p className="text-muted-foreground">
            Antes de começar sua jornada, precisamos do seu aceite aos nossos termos e políticas
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Resumo do Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-primary">100% Educacional</h3>
                  <p className="text-xs text-muted-foreground">Quiz baseado em conhecimento histórico</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-epic/10 to-epic/5 border-epic/30">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-epic" />
                <div>
                  <h3 className="font-semibold text-epic">Sistema Meritocrático</h3>
                  <p className="text-xs text-muted-foreground">Ganhos baseados em habilidade real</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-victory/10 to-victory/5 border-victory/30">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-victory" />
                <div>
                  <h3 className="font-semibold text-victory">100% Legal</h3>
                  <p className="text-xs text-muted-foreground">Conforme leis brasileiras</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Aceites Obrigatórios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Aceites Obrigatórios
            </h3>

            {/* Termos de Uso */}
            <Card className="p-4 border-border/50">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="terms" className="font-medium text-white cursor-pointer">
                    Aceito os Termos de Uso
                  </label>
                  <div className="mt-2 text-sm text-muted-foreground space-y-1">
                    <p>• Plataforma educacional com recompensas por mérito</p>
                    <p>• Sistema baseado 100% em habilidade, sem elementos de sorte</p>
                    <p>• Competições justas e transparentes</p>
                    <p>• Responsabilidade sobre uso adequado da plataforma</p>
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Versão 1.0 - Dezembro 2024
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Política de Privacidade */}
            <Card className="p-4 border-border/50">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="privacy" className="font-medium text-white cursor-pointer">
                    Aceito a Política de Privacidade (LGPD)
                  </label>
                  <div className="mt-2 text-sm text-muted-foreground space-y-1">
                    <p>• Coleta apenas dados necessários para funcionamento</p>
                    <p>• Proteção total conforme Lei 13.709/2018 (LGPD)</p>
                    <p>• Direito a exclusão, portabilidade e correção de dados</p>
                    <p>• Não compartilhamento com terceiros sem consentimento</p>
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Conforme LGPD
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Regulamento de Competições */}
            <Card className="p-4 border-border/50">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="rules"
                  checked={rulesAccepted}
                  onCheckedChange={(checked) => setRulesAccepted(checked === true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="rules" className="font-medium text-white cursor-pointer">
                    Aceito o Regulamento de Competições
                  </label>
                  <div className="mt-2 text-sm text-muted-foreground space-y-1">
                    <p>• Sistema de ranking transparente baseado em mérito</p>
                    <p>• Top 5% recebem bônus de +20% nos ganhos</p>
                    <p>• Saques limitados a 80% dos créditos + bônus mérito</p>
                    <p>• Proibido uso de ferramentas externas ou trapaças</p>
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Sistema Meritocrático
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Informações Importantes */}
          <Card className="p-4 border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-500 mb-2">Informações Importantes</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• <strong>Idade mínima:</strong> 18 anos ou autorização dos responsáveis</p>
                  <p>• <strong>Tributação:</strong> Ganhos acima de R$ 1.903,98/mês devem ser declarados</p>
                  <p>• <strong>Responsabilidade:</strong> Uso consciente e educativo da plataforma</p>
                  <p>• <strong>Suporte:</strong> Disponível para dúvidas sobre termos e funcionamento</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Botão de Aceite */}
          <div className="flex flex-col items-center gap-4 pt-4 border-t border-epic/20">
            <Button
              onClick={handleAcceptAll}
              disabled={!canProceed}
              className={`w-full max-w-md text-lg py-3 ${
                canProceed 
                  ? 'bg-epic hover:bg-epic/90 text-white' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {canProceed ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Aceitar e Entrar na Arena
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Marque todos os aceites para continuar
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Ao aceitar, você confirma ter lido e concordado com todos os termos. 
              Você pode revogar seu consentimento a qualquer momento nas configurações.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
