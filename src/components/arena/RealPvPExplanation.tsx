import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export const RealPvPExplanation = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-epic/5 border border-epic/20 rounded-lg mb-4 overflow-hidden">
      {/* Header Compacto - Sempre Visível */}
      <div 
        className="p-3 cursor-pointer hover:bg-epic/10 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-epic" />
            <span className="text-sm font-medium text-epic">Sistema PvP Real</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">🔧 Localhost • 🚀 Produção</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-epic" />
            ) : (
              <ChevronDown className="w-4 h-4 text-epic" />
            )}
          </div>
        </div>
      </div>

      {/* Detalhes Expansíveis */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-epic/10">
          <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
            {/* Sistema Atual */}
            <div className="bg-warning/5 border border-warning/20 rounded p-2">
              <p className="font-semibold text-warning mb-2">🔧 Localhost</p>
              <div className="space-y-1">
                <p className="text-muted-foreground">❌ Players simulados</p>
                <p className="text-victory">✅ Interface completa</p>
              </div>
            </div>

            {/* Sistema Real */}
            <div className="bg-victory/5 border border-victory/20 rounded p-2">
              <p className="font-semibold text-victory mb-2">🚀 Produção</p>
              <div className="space-y-1">
                <p className="text-muted-foreground">✅ Usuários reais</p>
                <p className="text-muted-foreground">✅ Carteira real</p>
              </div>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-background/50 rounded text-xs">
            <p className="font-semibold mb-1">🔄 Ativação:</p>
            <p className="text-muted-foreground">Deploy → Auth → Matchmaking → Battles</p>
          </div>
        </div>
      )}
    </div>
  );
};
