import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sword, 
  Trophy, 
  BookOpen, 
  Users, 
  Target,
  Star,
  ChevronRight,
  Play,
  Zap,
  Shield,
  Crown
} from 'lucide-react';
import { ParticleBackground } from '@/components/ui/particles';
import { ActionButton } from '@/components/arena/ActionButton';
import { AuthForm } from '@/components/auth/AuthForm';
import { useIsMobile } from '@/hooks/use-mobile';

import arenaLogo from '@/assets/arena-logo.png';
import egyptBg from '@/assets/egypt-landing-bg.jpg';
import mesopotamiaBg from '@/assets/mesopotamia-landing-bg.jpg';
import medievalBg from '@/assets/medieval-landing-bg.jpg';
import digitalBg from '@/assets/digital-landing-bg.jpg';
import { Card } from '@/components/ui/card';

const Landing = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showAuth, setShowAuth] = useState(false);

  const features = [
    {
      icon: <Sword className="w-8 h-8 text-battle" />,
      title: "Batalhas Épicas",
      description: "Enfrente desafios históricos únicos e ganhe créditos por suas habilidades",
      color: "battle",
      bgGradient: "from-battle/20 via-battle/10 to-transparent",
      borderColor: "border-battle/30"
    },
    {
      icon: <Trophy className="w-8 h-8 text-epic" />,
      title: "Ganhe por Conhecimento",
      description: "Transforme seu aprendizado em créditos através de competições educativas",
      color: "epic",
      bgGradient: "from-epic/20 via-epic/10 to-transparent",
      borderColor: "border-epic/30"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-epic" />,
      title: "Eras Históricas",
      description: "Explore desde o Egito Antigo até a Era Digital com conteúdo dinâmico",
      color: "epic",
      bgGradient: "from-epic/20 via-epic/10 to-transparent",
      borderColor: "border-epic/30"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Comunidade Global",
      description: "Compete com guerreiros do conhecimento de todo o mundo",
      color: "primary",
      bgGradient: "from-primary/20 via-primary/10 to-transparent",
      borderColor: "border-primary/30"
    }
  ];

  const stats = [
    { value: "10K+", label: "Guerreiros Ativos", icon: <Users className="w-6 h-6 text-epic" /> },
    { value: "50M+", label: "Créditos Distribuídos", icon: <Trophy className="w-6 h-6 text-epic" /> },
    { value: "4", label: "Eras Disponíveis", icon: <Crown className="w-6 h-6 text-battle" /> },
    { value: "95%", label: "Satisfação", icon: <Star className="w-6 h-6 text-primary" /> }
  ];

  const eras = [
    {
      id: 'egypt',
      title: 'Egito Antigo',
      period: '3000-2900 a.C.',
      emoji: '🏺',
      description: 'Domine os mistérios do Nilo e a economia dos faraós',
      color: 'epic',
      bgGradient: 'from-epic/20 via-epic/10 to-transparent',
      borderColor: 'border-epic/40'
    },
    {
      id: 'mesopotamia',
      title: 'Mesopotâmia',
      period: '2900-2800 a.C.',
      emoji: '📜',
      description: 'Explore o berço da civilização e seus códigos',
      color: 'epic',
      bgGradient: 'from-epic/20 via-epic/10 to-transparent',
      borderColor: 'border-epic/40'
    },
    {
      id: 'medieval',
      title: 'Era Medieval',
      period: '1000-1100 d.C.',
      emoji: '⚔️',
      description: 'Navegue pela política e economia feudal',
      color: 'battle',
      bgGradient: 'from-battle/20 via-battle/10 to-transparent',
      borderColor: 'border-battle/40'
    },
    {
      id: 'digital',
      title: 'Era Digital',
      period: '2000-2100 d.C.',
      emoji: '💻',
      description: 'Domine tecnologia e inovação moderna',
      color: 'primary',
      bgGradient: 'from-primary/20 via-primary/10 to-transparent',
      borderColor: 'border-primary/40'
    }
  ];

  return (
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background relative`}>
      {/* Dynamic Era Backgrounds */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full">
          {/* Egypt Section */}
          <div className="absolute inset-0 opacity-60">
            <img 
              src={egyptBg} 
              alt="Egypt Era" 
              className="w-full h-1/4 object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
          </div>
          
          {/* Mesopotamia Section */}
          <div className="absolute inset-0 opacity-60">
            <img 
              src={mesopotamiaBg} 
              alt="Mesopotamia Era" 
              className="w-full h-1/4 object-cover translate-y-full"
            />
            <div className="absolute top-1/4 left-0 w-full h-1/4 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
          </div>
          
          {/* Medieval Section */}
          <div className="absolute inset-0 opacity-60">
            <img 
              src={medievalBg} 
              alt="Medieval Era" 
              className="w-full h-1/4 object-cover translate-y-[200%]"
            />
            <div className="absolute top-2/4 left-0 w-full h-1/4 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
          </div>
          
          {/* Digital Section */}
          <div className="absolute inset-0 opacity-60">
            <img 
              src={digitalBg} 
              alt="Digital Era" 
              className="w-full h-1/4 object-cover translate-y-[300%]"
            />
            <div className="absolute top-3/4 left-0 w-full h-1/4 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
          </div>
          
          {/* Main overlay */}
          <div className="absolute inset-0 bg-background/30" />
        </div>
      </div>
      
      <ParticleBackground />
      

      
      {/* Header */}
      <header className={`relative z-10 border-b border-card-border bg-background-soft/80 backdrop-blur-sm ${isMobile ? 'p-3' : 'p-6'}`}>
        <div className={`max-w-6xl mx-auto ${isMobile ? 'flex flex-col space-y-2' : 'flex items-center justify-between'}`}>
          <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
            <img src={arenaLogo} alt="Arena do Conhecimento" className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`} />
            <div>
              <h1 className={`text-epic ${isMobile ? 'text-lg' : 'text-2xl'}`}>Arena do Conhecimento</h1>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Batalhas Educativas</p>
            </div>
          </div>
          
          <div className={`flex items-center ${isMobile ? 'space-x-2 self-center' : 'space-x-4'}`}>
            <ActionButton 
              variant="epic" 
              onClick={() => setShowAuth(true)}
              className={`${isMobile ? 'text-xs px-3 py-1' : 'text-sm px-4 py-2'}`}
            >
              📊 Login
            </ActionButton>
            <ActionButton 
              variant="battle" 
              onClick={() => setShowAuth(true)}
              className={`${isMobile ? 'text-xs px-3 py-1' : 'text-sm px-4 py-2'}`}
            >
              🚀 Cadastrar
            </ActionButton>
          </div>
        </div>
      </header>

      <div className={`relative z-10 max-w-6xl mx-auto ${isMobile ? 'h-full overflow-y-auto' : ''}`}>
        {/* Hero Section */}
        <section className={`text-center ${isMobile ? 'py-4 px-2' : 'py-20 px-6'}`}>
          <div className="max-w-4xl mx-auto">
            <h1 className={`font-montserrat font-black ${isMobile ? 'text-2xl mb-3' : 'text-6xl md:text-8xl mb-6'}`}>
              <span className="text-epic">Arena do</span><br />
              <span className="text-epic">Conhecimento</span>
            </h1>
            
            <p className={`text-muted-foreground max-w-2xl mx-auto ${isMobile ? 'text-xs mb-4' : 'text-xl md:text-2xl mb-8'}`}>
              Transforme seu conhecimento histórico em <span className="text-epic font-bold">créditos valiosos</span>. 
              Batalhe, aprenda e ganhe créditos dominando as eras da humanidade.
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isMobile ? 'mb-6' : 'mb-12'}`}>
              <ActionButton 
                variant="epic" 
                onClick={() => setShowAuth(true)}
                className={`flex items-center gap-3 ${isMobile ? 'text-sm px-4 py-2' : 'text-xl px-8 py-4'}`}
                icon={<Play />}
              >
                Cadastrar Grátis
              </ActionButton>
              
              <ActionButton 
                variant="battle" 
                onClick={() => setShowAuth(true)}
                className={`flex items-center gap-3 ${isMobile ? 'text-sm px-4 py-2' : 'text-xl px-8 py-4'}`}
                icon={<Shield />}
              >
                Fazer Login
              </ActionButton>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="arena-card p-6 text-center bg-gradient-to-br from-background/50 to-background/20 backdrop-blur-sm border border-border/50 hover:border-epic/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="mb-3 flex justify-center">
                    <div className="p-2 rounded-full bg-background/30 backdrop-blur-sm">
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-3xl font-bold font-montserrat text-epic mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`${isMobile ? 'py-6 px-2' : 'py-20 px-6'}`}>
          <div className={`text-center ${isMobile ? 'mb-6' : 'mb-16'}`}>
            <h2 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-xl mb-2' : 'text-4xl mb-4'}`}>
              Por que Escolher a Arena?
            </h2>
            <p className={`text-muted-foreground max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-xl'}`}>
              Uma plataforma revolucionária que combina educação, competição e recompensas reais
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${isMobile ? 'gap-3' : 'gap-6'}`}>
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`
                  relative overflow-hidden text-center hover-scale transition-all duration-300
                  bg-gradient-to-br ${feature.bgGradient} 
                  border ${feature.borderColor}
                  hover:shadow-lg hover:scale-105
                  ${isMobile ? 'p-3' : 'p-6'}
                `}
              >
                <div className="relative z-10">
                  <div className={`flex justify-center ${isMobile ? 'mb-2' : 'mb-4'}`}>
                    <div className={`rounded-full bg-background/20 backdrop-blur-sm ${isMobile ? 'p-2' : 'p-3'}`}>
                      <div className={`${isMobile ? 'w-5 h-5' : 'w-8 h-8'}`}>
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className={`font-montserrat font-bold text-${feature.color} ${isMobile ? 'text-sm mb-2' : 'text-xl mb-3'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-muted-foreground leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {feature.description}
                  </p>
                </div>
                {/* Subtle glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300`} />
              </Card>
            ))}
          </div>
        </section>

        {/* Eras Section */}
        <section className={`${isMobile ? 'py-6 px-2' : 'py-20 px-6'}`}>
          <div className={`text-center ${isMobile ? 'mb-6' : 'mb-16'}`}>
            <h2 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-xl mb-2' : 'text-4xl mb-4'}`}>
              Explore as Eras Históricas
            </h2>
            <p className={`text-muted-foreground max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-xl'}`}>
              Cada era oferece desafios únicos, perguntas dinâmicas e oportunidades de aprendizado
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 ${isMobile ? 'gap-3' : 'gap-6'}`}>
            {eras.map((era) => (
              <Card 
                key={era.id} 
                className={`
                  relative overflow-hidden cursor-pointer transition-all duration-300
                  bg-gradient-to-br ${era.bgGradient} 
                  border ${era.borderColor}
                  hover:shadow-xl hover:scale-[1.02] hover:border-${era.color}/50
                  ${isMobile ? 'p-3' : 'p-6'}
                `}
              >
                <div className="relative z-10">
                  <div className={`flex items-center mb-4 ${isMobile ? 'gap-2' : 'gap-4'}`}>
                    <div className={`rounded-full bg-${era.color}/10 border border-${era.color}/20 ${isMobile ? 'text-2xl p-1' : 'text-4xl p-2'}`}>
                      {era.emoji}
                    </div>
                    <div>
                      <h3 className={`font-montserrat font-bold text-${era.color} ${isMobile ? 'text-sm' : 'text-xl'}`}>
                        {era.title}
                      </h3>
                      <p className={`text-muted-foreground font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{era.period}</p>
                    </div>
                  </div>
                  <p className={`text-muted-foreground leading-relaxed ${isMobile ? 'text-xs mb-3' : 'mb-6'}`}>{era.description}</p>
                                    <div className="space-y-2">
                    <ActionButton
                      variant={era.color as any}
                      className="w-full"
                      onClick={() => navigate('/app')}
                      icon={<ChevronRight />}
                    >
                      Explorar Era
                    </ActionButton>
                    <ActionButton
                      variant="epic"
                      className="w-full text-sm"
                      onClick={() => navigate('/payment')}
                    >
                      💳 Assinar Premium
                    </ActionButton>
                  </div>
                </div>
                {/* Subtle animated background */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${era.color}/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500`} />
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <Card className="arena-card-epic p-12 text-center max-w-4xl mx-auto">
            <Zap className="w-16 h-16 text-epic mx-auto mb-6" />
            <h2 className="text-4xl font-montserrat font-bold text-epic mb-4">
              Pronto para a Batalha?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de guerreiros do conhecimento e comece a conquistar créditos 
              com suas habilidades históricas hoje mesmo!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ActionButton 
                variant="epic" 
                onClick={() => navigate('/app')}
                className="text-xl px-8 py-4"
                icon={<Target />}
              >
                Entrar na Arena Agora
              </ActionButton>
              
              <ActionButton 
                variant="victory" 
                onClick={() => setShowAuth(true)}
                className="text-xl px-8 py-4"
                icon={<Users />}
              >
                Criar Conta
              </ActionButton>
            </div>
            
            <p className="text-sm text-muted-foreground mt-6">
              ✨ Grátis para começar • 🧠 Aprenda com diversão • 🏆 Créditos por conhecimento
            </p>
          </Card>
        </section>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute -top-12 right-0 text-muted-foreground hover:text-epic transition-colors"
            >
              ✕ Fechar
            </button>
            <AuthForm onAuthSuccess={() => {
              setShowAuth(false);
              navigate('/app');
            }} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-card-border bg-background-soft/80 backdrop-blur-sm p-6 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Arena do Conhecimento • Transformando educação em oportunidade
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;