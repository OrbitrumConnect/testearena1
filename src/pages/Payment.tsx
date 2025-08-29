import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Shield, 
  Lock, 
  ArrowLeft, 
  Check, 
  AlertTriangle,
  Percent,
  Calendar,
  Trophy,
  Zap
} from 'lucide-react';
import { ParticleBackground } from '@/components/ui/particles';
import { ActionButton } from '@/components/arena/ActionButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import egyptArena from '@/assets/egypt-arena.png';

const Payment = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState<'payment' | 'confirmation'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'boleto'>('card');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Data de início da promoção (29/08/2024)
  const promoStartDate = new Date('2024-08-29');
  const promoEndDate = new Date(promoStartDate.getTime() + (6 * 30 * 24 * 60 * 60 * 1000)); // 6 meses
  const today = new Date();
  const isPromoActive = today <= promoEndDate;
  
  // Cálculo dos valores
  const regularPrice = 20.00;
  const discountPercent = isPromoActive ? 50 : 0;
  const currentPrice = isPromoActive ? regularPrice * 0.5 : regularPrice;
  const maxWithdrawal = isPromoActive ? currentPrice * 0.95 : regularPrice * 0.95; // 95% após taxas

  const handlePayment = async () => {
    if (!acceptTerms) {
      alert('Você deve aceitar os termos e condições para continuar.');
      return;
    }

    setProcessing(true);
    
    // Simular processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setProcessing(false);
    setCurrentStep('confirmation');
  };

  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background temático do guerreiro */}
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${egyptArena})` }}
        />
        <ParticleBackground />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center arena-card-epic">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-2xl font-montserrat font-bold text-epic mb-4">
              Pagamento Realizado com Sucesso!
            </h1>
            <p className="text-muted-foreground mb-6">
              Você pode começar a jogar imediatamente e explorar todas as eras históricas!
            </p>
            
            <div className="bg-epic/10 border border-epic/30 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-epic mb-2">🎮 Acesso Liberado</h3>
              <ul className="text-sm space-y-1 text-left">
                <li>✅ Todas as 4 eras históricas</li>
                <li>✅ Arena PvP completa</li>
                <li>✅ Sistema de créditos ativo</li>
                <li>✅ Ranking global</li>
              </ul>
            </div>

            <ActionButton 
              variant="epic" 
              onClick={() => navigate('/app')}
              className="w-full mb-4"
              icon={<Trophy />}
            >
              Ir para Arena
            </ActionButton>

            <ActionButton 
              variant="secondary" 
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              Ver Dashboard
            </ActionButton>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background temático do guerreiro */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${egyptArena})` }}
      />
      <ParticleBackground />
      
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-card-border bg-background-soft/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <ActionButton variant="secondary" onClick={() => navigate('/app')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </ActionButton>
          
          <div className="text-center">
            <h1 className="text-2xl font-montserrat font-bold text-epic">Arena do Conhecimento</h1>
            <p className="text-sm text-muted-foreground">Pagamento Seguro</p>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="w-4 h-4 mr-1" />
            SSL Seguro
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'lg:grid-cols-3 gap-8'}`}>
          
          {/* Coluna da Esquerda - Resumo da Oferta */}
          <div className={isMobile ? 'order-2' : 'lg:col-span-1'}>
            <Card className="arena-card-epic p-6 sticky top-6">
              <h2 className="text-xl font-montserrat font-bold text-epic mb-4">
                💎 Arena Premium
              </h2>
              
              {/* Promoção Ativa */}
              {isPromoActive && (
                <div className="bg-gradient-to-r from-epic/20 to-victory/20 border border-epic/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Percent className="w-5 h-5 text-epic" />
                    <span className="font-bold text-epic">OFERTA ESPECIAL!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    50% de desconto nos primeiros 6 meses
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                    <Calendar className="w-4 h-4" />
                    <span>Válido até {promoEndDate.toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              )}

              {/* Preços */}
              <div className="space-y-3 mb-6">
                {isPromoActive && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground line-through">Preço normal</span>
                    <span className="text-muted-foreground line-through">R$ {regularPrice.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Valor a pagar</span>
                  <span className="text-2xl font-bold text-epic">
                    R$ {currentPrice.toFixed(2)}
                  </span>
                </div>

                {isPromoActive && (
                  <div className="text-center">
                    <span className="bg-epic text-white px-3 py-1 rounded-full text-sm font-bold">
                      Economia: R$ {(regularPrice - currentPrice).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Sistema de 3 */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-epic" />
                  Sistema de 3 Meses
                </h3>
                
                <div className="bg-muted/20 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Limite de saque deste mês:</span>
                    <span className="font-bold text-epic">R$ {maxWithdrawal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valor disponível para devolução após taxas administrativas (5%)
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>🏛️ Mês 1 (Atual)</span>
                    <span className="font-semibold">R$ {currentPrice.toFixed(2)}</span>
                  </div>
                  {!isPromoActive && (
                    <>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>📜 Mês 2</span>
                        <span>R$ 16,00</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>⚔️ Mês 3</span>
                        <span>R$ 12,00</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Aviso Legal - Compacto */}
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <div className="text-xs">
                    <span className="font-semibold text-warning">⚖️ Legal:</span>
                    <span className="text-muted-foreground ml-1">
                      Saque limitado • Créditos internos • CVM/LGPD OK
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Coluna da Direita - Formulário de Pagamento */}
          <div className={isMobile ? 'order-1' : 'lg:col-span-2'}>
            <Card className="arena-card p-6">
              <h2 className="text-xl font-montserrat font-bold mb-6">
                💳 Dados do Pagamento
              </h2>

              {/* Métodos de Pagamento */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">Método de Pagamento</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border rounded-lg text-center transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-epic bg-epic/10 text-epic' 
                        : 'border-muted hover:border-epic/50'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Cartão</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 border rounded-lg text-center transition-all ${
                      paymentMethod === 'pix' 
                        ? 'border-epic bg-epic/10 text-epic' 
                        : 'border-muted hover:border-epic/50'
                    }`}
                  >
                    <div className="w-6 h-6 mx-auto mb-2 text-lg">🏦</div>
                    <span className="text-sm font-medium">PIX</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('boleto')}
                    className={`p-4 border rounded-lg text-center transition-all ${
                      paymentMethod === 'boleto' 
                        ? 'border-epic bg-epic/10 text-epic' 
                        : 'border-muted hover:border-epic/50'
                    }`}
                  >
                    <div className="w-6 h-6 mx-auto mb-2 text-lg">🧾</div>
                    <span className="text-sm font-medium">Boleto</span>
                  </button>
                </div>
              </div>

              {/* Dados Pessoais */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold">📋 Dados Pessoais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      placeholder="Seu nome completo"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Dados do Cartão (se selecionado) */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Dados do Cartão
                  </h3>
                  
                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="validity">Validade</Label>
                      <Input 
                        id="validity" 
                        placeholder="MM/AA"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PIX */}
              {paymentMethod === 'pix' && (
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold">🏦 PIX Instantâneo</h3>
                  <div className="bg-epic/10 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">
                      QR Code gerado após confirmação • Pagamento instantâneo
                    </p>
                  </div>
                </div>
              )}

              {/* Boleto */}
              {paymentMethod === 'boleto' && (
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold">🧾 Boleto Bancário</h3>
                  <div className="bg-epic/10 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">
                      Enviado por e-mail • Vencimento: 3 dias úteis
                    </p>
                  </div>
                </div>
              )}

              {/* Termos e Condições - Ultra Compacto */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-xs">
                    Aceito{' '}
                    <button className="text-epic hover:underline font-medium">
                      T&C
                    </button>
                    {' '}e{' '}
                    <button className="text-epic hover:underline font-medium">
                      PP
                    </button>
                    . Créditos internos.
                  </Label>
                </div>
              </div>

              {/* Segurança - Compacto */}
              <div className="bg-epic/10 border border-epic/30 rounded-lg p-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-epic" />
                  <span className="text-sm font-semibold text-epic">SSL 256-bit • Dados Protegidos</span>
                </div>
              </div>

              {/* Botão de Pagamento */}
              <ActionButton
                variant="epic"
                onClick={handlePayment}
                disabled={!acceptTerms || processing}
                className="w-full text-lg py-4"
                icon={processing ? undefined : <Check />}
              >
                {processing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processando...</span>
                  </div>
                ) : (
                  `Pagar R$ ${currentPrice.toFixed(2)} - ${paymentMethod.toUpperCase()}`
                )}
              </ActionButton>

              {isPromoActive && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  ⚡ Oferta especial aplicada automaticamente!
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
