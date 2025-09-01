import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useNewSubscription } from '@/hooks/useNewSubscription';
import { NewWallet } from '@/components/wallet/NewWallet';
import { LivesManager } from '@/components/lives/LivesManager';
import { NewSubscriptionCard } from '@/components/subscription/NewSubscriptionCard';
import { MeritRankingCard } from '@/components/merit/MeritRankingCard';
import { SmartWithdrawal } from '@/components/withdrawal/SmartWithdrawal';
import { ActionButton } from '@/components/ui/action-button';
import { ArrowLeft, RotateCcw, LogOut, Trash2 } from 'lucide-react';

const NewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { userSubscription, computed } = useNewSubscription();

  const handleLogout = () => {
    // Implementar logout
    localStorage.clear();
    navigate('/');
  };

  const handleReset = () => {
    // Implementar reset de dados
    localStorage.removeItem('demo_new_subscription');
    window.location.reload();
  };

  if (!userSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medieval-900 via-medieval-800 to-medieval-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-epic mx-auto mb-4"></div>
          <p>Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  const systemReport = computed.systemReport;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/medieval-castle.jpg')"
      }}
    >
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
        <div className={`container mx-auto ${isMobile ? 'p-1' : 'p-6'}`}>
          {/* Header */}
          <div className={`${isMobile ? 'p-2 mb-2' : 'p-4 mb-6'} bg-black/60 backdrop-blur rounded-lg border border-epic/20`}>
            <div className={`flex items-center ${isMobile ? 'justify-between' : 'justify-between'}`}>
              <div className="flex items-center gap-2">
                <ActionButton
                  icon={ArrowLeft}
                  label="Voltar"
                  onClick={() => navigate('/app')}
                  className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}
                />
                <h1 className={`${isMobile ? 'text-base' : 'text-2xl'} font-bold text-white`}>
                  Dashboard do Guerreiro
                </h1>
              </div>
              
              <div className="flex items-center gap-1">
                <ActionButton
                  icon={RotateCcw}
                  label="Reset"
                  onClick={handleReset}
                  className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}
                />
                <ActionButton
                  icon={Trash2}
                  label="Limpar"
                  onClick={handleReset}
                  className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}
                />
                <ActionButton
                  icon={LogOut}
                  label="Sair"
                  onClick={handleLogout}
                  className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-1 lg:grid-cols-3 gap-6'}`}>
            {/* Left Column - Subscription & Lives */}
            <div className={`${isMobile ? 'space-y-2' : 'space-y-6'}`}>
              <NewSubscriptionCard 
                className="bg-black/80 backdrop-blur border-epic/30" 
              />
              <LivesManager 
                className="bg-black/80 backdrop-blur border-epic/30" 
              />
            </div>

            {/* Middle Column - Wallet & Smart Withdrawal */}
            <div className={`${isMobile ? 'space-y-2' : 'space-y-6'}`}>
              <SmartWithdrawal 
                className="bg-black/80 backdrop-blur border-epic/30" 
              />
              
              {/* Quick Stats */}
              {systemReport && (
                <div className="bg-black/80 backdrop-blur border border-epic/30 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4">📊 Resumo Rápido</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Plano Atual:</span>
                      <span className="text-epic font-medium">
                        Mês {systemReport.subscription.currentMonth}/3
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Valor Mensal:</span>
                      <span className="text-victory font-medium">
                        R$ {systemReport.subscription.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Saldo em Reais:</span>
                      <span className="text-victory font-medium">
                        R$ {systemReport.credits.balanceInReais.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Pode Sacar:</span>
                      <span className={`font-medium ${systemReport.credits.canWithdraw ? 'text-victory' : 'text-destructive'}`}>
                        {systemReport.credits.canWithdraw ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Vidas Disponíveis:</span>
                      <span className="text-red-400 font-medium">
                        {systemReport.lives.livesAvailable}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Merit Ranking & Info */}
            <div className={`${isMobile ? 'space-y-2' : 'space-y-6'}`}>
              {/* Merit Ranking */}
              <MeritRankingCard 
                className="bg-black/80 backdrop-blur border-epic/30"
                showFullRanking={!isMobile}
              />
              
              {/* System Comparison */}
              {systemReport && (
                <div className="bg-black/80 backdrop-blur border border-epic/30 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4">📈 Comparação de Sistemas</h3>
                  <div className="space-y-4">
                    <div className="text-center p-3 rounded bg-destructive/20 border border-destructive/50">
                      <div className="text-xs text-gray-300">Sistema Antigo</div>
                      <div className="text-lg font-bold text-destructive">
                        R$ {systemReport.comparison.oldSystemPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">por mês</div>
                    </div>
                    
                    <div className="text-center text-victory">
                      <div className="text-2xl">⬇️</div>
                      <div className="text-sm font-medium">
                        -{systemReport.comparison.savingsPercentage}% de economia!
                      </div>
                    </div>
                    
                    <div className="text-center p-3 rounded bg-victory/20 border border-victory/50">
                      <div className="text-xs text-gray-300">Sistema Novo</div>
                      <div className="text-lg font-bold text-victory">
                        R$ {systemReport.comparison.newSystemPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">este mês</div>
                    </div>
                  </div>
                </div>
              )}

              {/* How It Works */}
              <div className="bg-black/80 backdrop-blur border border-epic/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4">🎯 Como Funciona</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-epic">1.</span>
                    <div>
                      <div className="text-white font-medium">Pague mensalmente</div>
                      <div className="text-gray-400">R$ 5,00 → R$ 3,50 → R$ 2,00</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-epic">2.</span>
                    <div>
                      <div className="text-white font-medium">Receba créditos</div>
                      <div className="text-gray-400">80% do valor em créditos sacáveis</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-epic">3.</span>
                    <div>
                      <div className="text-white font-medium">Use as vidas grátis</div>
                      <div className="text-gray-400">10 vidas por dia, reset à meia-noite</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-epic">4.</span>
                    <div>
                      <div className="text-white font-medium">Jogue PvP ou saque</div>
                      <div className="text-gray-400">Ganhe mais créditos ou retire dinheiro</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDashboard;
