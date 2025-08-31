import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, TrendingUp, Clock, Star } from 'lucide-react';
import { ParticleBackground } from '@/components/ui/particles';
import { ActionButton } from '@/components/arena/ActionButton';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const WorldQuiz = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Verificar tipo de usuário - bloquear para FREE
  const userType = 'free'; // TODO: pegar do perfil do usuário real
  
  // Se for usuário FREE, redirecionar para home
  if (userType === 'free') {
    return (
      <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background relative flex items-center justify-center`}>
        <ParticleBackground />
        <div className="relative z-10 text-center arena-card-epic p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-montserrat font-bold text-epic mb-4">
            Acesso Restrito
          </h2>
          <p className="text-muted-foreground mb-6">
            O Quiz do Mundo Real é exclusivo para usuários pagos. Você ainda pode acessar as 4 eras históricas gratuitamente!
          </p>
          <div className="space-y-3">
            <ActionButton variant="epic" onClick={() => navigate('/payment')} className="w-full">
              💎 Upgrade para Pago
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => navigate('/app')} className="w-full">
              🏠 Voltar ao Menu
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  const currentEvents = [
    {
      id: 'ai-revolution',
      title: 'Revolução da IA: GPT-4 e Gemini',
      category: 'Tecnologia',
      questions: 12,
      difficulty: 'Médio',
      impact: 'Alto',
      trending: true
    },
    {
      id: 'climate-summit',
      title: 'COP28: Acordo sobre Combustíveis Fósseis',
      category: 'Meio Ambiente',
      questions: 8,
      difficulty: 'Fácil',
      impact: 'Crítico',
      trending: false
    },
    {
      id: 'quantum-computing',
      title: 'Computação Quântica: Marco de 1000 Qubits',
      category: 'Ciência',
      questions: 6,
      difficulty: 'Difícil',
      impact: 'Alto',
      trending: true
    },
    {
      id: 'space-mission',
      title: 'Artemis II: Retorno à Lua',
      category: 'Espaço',
      questions: 10,
      difficulty: 'Médio',
      impact: 'Médio',
      trending: false
    }
  ];

  return (
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background relative`}>
      <ParticleBackground />
      
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-card-border bg-background-soft/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <ActionButton variant="secondary" onClick={() => navigate('/app')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </ActionButton>
          
          <div className="text-center">
            <h1 className="text-2xl font-montserrat font-bold text-epic flex items-center">
              <Globe className="w-6 h-6 mr-2" />
              Quiz do Mundo Real
            </h1>
            <p className="text-sm text-muted-foreground">Eventos que moldam nossa sociedade</p>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            Atualizado hoje
          </div>
        </div>
      </header>

      <div className={`relative z-10 max-w-4xl mx-auto ${isMobile ? 'p-3 h-full overflow-y-auto' : 'p-6'}`}>
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="arena-card text-center p-4">
            <div className="text-2xl font-bold text-epic mb-1">36</div>
            <div className="text-sm text-muted-foreground">Perguntas Ativas</div>
          </div>
          <div className="arena-card text-center p-4">
            <div className="text-2xl font-bold text-victory mb-1">4</div>
            <div className="text-sm text-muted-foreground">Temas Atuais</div>
          </div>
          <div className="arena-card text-center p-4">
            <div className="text-2xl font-bold text-battle mb-1">2</div>
            <div className="text-sm text-muted-foreground">Em Alta</div>
          </div>
        </div>

        {/* Current Events Quiz */}
        <section className="mb-8">
          <h2 className="text-xl font-montserrat font-bold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-epic" />
            Eventos Atuais
          </h2>
          
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'}`}>
            {currentEvents.map((event) => (
              <Card 
                key={event.id}
                className="arena-card p-6 hover-scale cursor-pointer"
                onClick={() => {/* Start quiz */}}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        event.category === 'Tecnologia' ? 'bg-epic/20 text-epic' :
                        event.category === 'Meio Ambiente' ? 'bg-victory/20 text-victory' :
                        event.category === 'Ciência' ? 'bg-battle/20 text-battle' :
                        'bg-legendary/20 text-legendary'
                      }`}>
                        {event.category}
                      </span>
                      {event.trending && (
                        <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive font-medium">
                          <Star className="w-3 h-3 inline mr-1" />
                          Trending
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-3 leading-tight">{event.title}</h3>
                    
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-epic">{event.questions}</div>
                        <div className="text-xs text-muted-foreground">Perguntas</div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${
                          event.difficulty === 'Fácil' ? 'text-victory' :
                          event.difficulty === 'Médio' ? 'text-epic' : 'text-battle'
                        }`}>
                          {event.difficulty}
                        </div>
                        <div className="text-xs text-muted-foreground">Dificuldade</div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${
                          event.impact === 'Crítico' ? 'text-destructive' :
                          event.impact === 'Alto' ? 'text-battle' : 'text-epic'
                        }`}>
                          {event.impact}
                        </div>
                        <div className="text-xs text-muted-foreground">Impacto</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <ActionButton variant="epic" className="w-full">
                  Iniciar Quiz
                </ActionButton>
              </Card>
            ))}
          </div>
        </section>

        {/* Coming Soon */}
        <div className="arena-card-epic p-6 text-center">
          <Globe className="w-12 h-12 mx-auto text-epic mb-4" />
          <h3 className="text-xl font-montserrat font-bold text-epic mb-2">
            Mais Eventos em Breve
          </h3>
          <p className="text-muted-foreground mb-4">
            Novos temas baseados em eventos mundiais são adicionados semanalmente
          </p>
          <ActionButton variant="secondary" onClick={() => navigate('/app')}>
            Voltar ao Menu
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default WorldQuiz;
