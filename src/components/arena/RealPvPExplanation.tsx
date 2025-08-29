import { Users, Wallet, Shield, Zap, Trophy, Clock } from 'lucide-react';

export const RealPvPExplanation = () => {
  return (
    <div className="arena-card p-6 mb-6 bg-epic/5 border-epic">
      <h3 className="text-xl font-montserrat font-bold text-epic mb-4 flex items-center">
        <Shield className="w-6 h-6 mr-2" />
        Como Funcionará com Usuários Reais
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sistema Atual */}
        <div className="space-y-4">
          <h4 className="font-semibold text-warning">🔧 Sistema Atual (Localhost)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="text-red-500">❌</div>
              <p>Players simulados (fictícios)</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="text-red-500">❌</div>
              <p>Carteira não débita realmente</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="text-red-500">❌</div>
              <p>Batalhas apenas locais</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="text-green-500">✅</div>
              <p>Interface PvP completa</p>
            </div>
          </div>
        </div>

        {/* Sistema Real */}
        <div className="space-y-4">
          <h4 className="font-semibold text-victory">🚀 Sistema Real (Produção)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="text-green-500">✅</div>
              <p>Usuários reais autenticados</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="text-green-500">✅</div>
              <p>Carteira real com débitos/créditos</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="text-green-500">✅</div>
              <p>Batalhas em tempo real</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="text-green-500">✅</div>
              <p>Identificação por ID único</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fluxo Real */}
      <div className="mt-6 p-4 bg-background/50 rounded-lg">
        <h4 className="font-semibold mb-3 flex items-center">
          <Users className="w-5 h-5 mr-2 text-epic" />
          Fluxo com Usuários Reais:
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <div className="text-epic font-bold">1️⃣</div>
            <div>
              <p className="font-semibold">Autenticação</p>
              <p className="text-muted-foreground">Login via Supabase Auth</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <div className="text-epic font-bold">2️⃣</div>
            <div>
              <p className="font-semibold">Verificação</p>
              <p className="text-muted-foreground">Saldo 900 créditos mínimo</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <div className="text-epic font-bold">3️⃣</div>
            <div>
              <p className="font-semibold">Matchmaking</p>
              <p className="text-muted-foreground">Fila tempo real</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <div className="text-epic font-bold">4️⃣</div>
            <div>
              <p className="font-semibold">Batalha</p>
              <p className="text-muted-foreground">Sincronizada em tempo real</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tecnologias */}
      <div className="mt-6 p-4 bg-muted/20 rounded-lg">
        <h4 className="font-semibold mb-3 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-warning" />
          Tecnologias Implementadas:
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-1">🔐</div>
            <p className="font-semibold">Supabase Auth</p>
            <p className="text-muted-foreground">ID único por usuário</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-1">💾</div>
            <p className="font-semibold">PostgreSQL</p>
            <p className="text-muted-foreground">Dados em tempo real</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-1">⚡</div>
            <p className="font-semibold">Real-time</p>
            <p className="text-muted-foreground">WebSocket/Subscriptions</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-1">🛡️</div>
            <p className="font-semibold">RLS</p>
            <p className="text-muted-foreground">Segurança avançada</p>
          </div>
        </div>
      </div>

      {/* Próximos Passos */}
      <div className="mt-6 p-4 bg-epic/10 rounded-lg border border-epic/20">
        <h4 className="font-semibold mb-3 flex items-center text-epic">
          <Clock className="w-5 h-5 mr-2" />
          Para Ativar Sistema Real:
        </h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-epic rounded-full flex items-center justify-center text-white text-xs">1</div>
            <p>Executar migration do banco: <code className="bg-muted px-1 rounded">supabase db push</code></p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-epic rounded-full flex items-center justify-center text-white text-xs">2</div>
            <p>Ativar autenticação real (remover fallback demo)</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-epic rounded-full flex items-center justify-center text-white text-xs">3</div>
            <p>Deploy em produção com domínio real</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-epic rounded-full flex items-center justify-center text-white text-xs">4</div>
            <p>Usuários reais poderão se cadastrar e batalhar!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
