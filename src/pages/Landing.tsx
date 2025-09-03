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
  Crown,
  Brain,
  Database,
  GitBranch,
  Calendar
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
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Estudo e Treino",
      description: "Quizzes diários atualizados com notícias globais. Quanto mais você pratica, maior seu desempenho.",
      color: "primary",
      bgGradient: "from-primary/20 via-primary/10 to-transparent",
      borderColor: "border-primary/30"
    },
    {
      icon: <Sword className="w-8 h-8 text-battle" />,
      title: "PvP Meritocrático 1x1",
      description: "Duelos de conhecimento contra outros usuários. Custo 7 créditos por partida - vencedor recebe 9,5 créditos.", 
      color: "battle",
      bgGradient: "from-battle/20 via-battle/10 to-transparent",
      borderColor: "border-battle/30"
    },
    {
      icon: <Trophy className="w-8 h-8 text-epic" />,
      title: "Ganhe Créditos por Mérito",
                      description: "Sistema progressivo de 3 meses: Mês 1 → Mês 2 → Mês 3. Progressão baseada em engajamento.",
      color: "epic",
      bgGradient: "from-epic/20 via-epic/10 to-transparent",
      borderColor: "border-epic/30"
    },
    {
      icon: <Crown className="w-8 h-8 text-legendary" />,
      title: "Top 10% Elite + Bônus",
      description: "Apenas os melhores recebem bônus especiais. Sistema meritocrático com recompensas por performance.",
      color: "legendary",
      bgGradient: "from-legendary/20 via-legendary/10 to-transparent",
      borderColor: "border-legendary/30"
    },
    {
      icon: <Brain className="w-8 h-8 text-victory" />,
      title: "🤖 Mestre do Conhecimento",
      description: "IA educativa que sabe tudo sobre as eras históricas. Dicas de estudo, estratégias de PvP e curiosidades!",
      color: "victory",
      bgGradient: "from-victory/20 via-victory/10 to-transparent",
      borderColor: "border-victory/30"
    },
    {
      icon: <Database className="w-8 h-8 text-primary" />,
      title: "📚 Base de Conhecimento",
      description: "138 itens históricos verificados, paginados e organizados por eras. Aprenda sobre civilizações antigas!",
      color: "primary",
      bgGradient: "from-primary/20 via-primary/10 to-transparent",
      borderColor: "border-primary/30"
    },
    {
      icon: <GitBranch className="w-8 h-8 text-epic" />,
      title: "🌍 Conexões Históricas",
      description: "Descubra como o Egito, Mesopotâmia e Era Medieval influenciaram o mundo digital de hoje!",
      color: "epic",
      bgGradient: "from-epic/20 via-epic/10 to-transparent",
      borderColor: "border-epic/30"
    },
    {
      icon: <Calendar className="w-8 h-8 text-battle" />,
      title: "💰 Sistema PIX Inteligente",
      description: "Saques disponíveis dia 1° do mês, mínimo 200 créditos. Taxa administrativa de 15% transparente.",
      color: "battle",
      bgGradient: "from-battle/20 via-battle/10 to-transparent",
      borderColor: "border-battle/30"
    }
  ];

  const stats = [
    { value: "Sustentável", label: "Modelo Econômico", icon: <Shield className="w-6 h-6 text-epic" /> },
    { value: "Sistema 3 Meses", label: "Progressão Meritocrática", icon: <Trophy className="w-6 h-6 text-gray-400" /> },
    { value: "Top 10%", label: "Bônus Especiais", icon: <Crown className="w-6 h-6 text-gray-400" /> },
    { value: "100%", label: "Transparência", icon: <Target className="w-6 h-6 text-epic" /> }
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
      <div className={isMobile ? 'scale-[0.75] origin-top-left w-[133%] h-[133%]' : 'scale-[1.03] origin-top-left w-[97%]'}>
      {/* Dynamic Era Backgrounds */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full">
          {/* Egypt Section */}
          <div className="absolute inset-0 opacity-60">
            <img 
              src={egyptBg} 
              alt="Egypt Era" 
              className="w-full h-1/4 object-cover"
              style={{ objectPosition: '-15% -6%' }}
            />
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
          </div>
          
          {/* Mesopotamia Section */}
          <div className="absolute inset-0 opacity-60">
            <img 
              src={mesopotamiaBg} 
              alt="Mesopotamia Era" 
              className="w-full h-1/4 object-cover translate-y-full"
              style={{ objectPosition: '-15% -6%' }}
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
              style={{ objectPosition: '-15% -6%' }}
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
        <section className={`text-center ${isMobile ? 'py-4 px-2' : 'py-12 px-6'}`}>
          <div className="max-w-4xl mx-auto">
            <h1 className={`font-montserrat font-black ${isMobile ? 'text-xl mb-3' : 'text-xl md:text-2xl mb-4'}`}>
              <span className="text-gray-300">A Arena do</span><br />
              <span className="text-gray-200">Conhecimento</span>
            </h1>
            
            <p className={`text-gray-300 font-bold max-w-3xl mx-auto ${isMobile ? 'text-sm mb-2' : 'text-sm md:text-base mb-3'}`}>
              Aprenda, Compita e Acumule Créditos por Mérito!
            </p>
            
            <p className={`text-gray-400 max-w-3xl mx-auto ${isMobile ? 'text-xs mb-4' : 'text-xs md:text-sm mb-4'}`}>
              Transforme seu conhecimento em vitória e créditos acumulados. 
              Nosso app combina quiz educativo, PvP meritocrático e sistema progressivo de 3 meses. 
              <span className="text-gray-300 font-bold">Créditos proporcionais ao seu desempenho e dedicação.</span>
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
              <ActionButton 
                variant="epic" 
                onClick={() => setShowAuth(true)}
                className={`flex items-center gap-3 ${isMobile ? 'text-sm px-4 py-2' : 'text-sm px-5 py-2'}`}
                icon={<Play />}
              >
                Cadastrar Grátis
              </ActionButton>
              
              <ActionButton 
                variant="battle" 
                onClick={() => setShowAuth(true)}
                className={`flex items-center gap-3 ${isMobile ? 'text-sm px-4 py-2' : 'text-sm px-5 py-2'}`}
                icon={<Shield />}
              >
                Fazer Login
              </ActionButton>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="arena-card p-3 text-center bg-gradient-to-br from-background/50 to-background/20 backdrop-blur-sm border border-border/50 hover:border-epic/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="mb-3 flex justify-center">
                    <div className="p-2 rounded-full bg-background/30 backdrop-blur-sm">
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-2xl font-bold font-montserrat text-epic mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`${isMobile ? 'py-6 px-2' : 'py-8 px-6'}`}>
          <div className={`text-center ${isMobile ? 'mb-6' : 'mb-12'}`}>
            <h2 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-xl mb-2' : 'text-2xl mb-3'}`}>
              Por que Escolher a Arena?
            </h2>
            <p className={`text-muted-foreground max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
              Uma plataforma revolucionária que combina educação, competição e recompensas reais
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${isMobile ? 'gap-2' : 'gap-4'}`}>
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`
                  relative overflow-hidden text-center hover-scale transition-all duration-300
                  bg-gradient-to-br ${feature.bgGradient} 
                  border ${feature.borderColor}
                  hover:shadow-lg hover:scale-105
                  ${isMobile ? 'p-2' : 'p-3'}
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

        {/* Como Funciona Section */}
        <section className={`${isMobile ? 'py-6 px-2' : 'py-8 px-6'}`}>
          <div className={`text-center ${isMobile ? 'mb-6' : 'mb-10'}`}>
            <h2 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-xl mb-2' : 'text-2xl mb-3'}`}>
              🎯 Como Funciona o Sistema Meritocrático
            </h2>
            <p className={`text-muted-foreground max-w-4xl mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
              Um sistema justo onde o <span className="text-epic font-bold">conhecimento paga de verdade</span>
            </p>
          </div>

          <div className={`grid gap-3 max-w-6xl mx-auto ${isMobile ? 'grid-cols-2' : 'md:grid-cols-4'}`}>
            {/* Passo 1 */}
            <Card className={`arena-card text-center bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 ${isMobile ? 'p-2' : 'p-3'}`}>
              <div className={`${isMobile ? 'mb-2' : 'mb-4'}`}>
                <div className={`rounded-full bg-primary/20 mx-auto flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
                  <BookOpen className={`text-primary ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                </div>
              </div>
              <h3 className={`font-bold text-primary ${isMobile ? 'text-xs mb-1' : 'mb-2'}`}>1. Estude</h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                3 treinos grátis/dia + quizzes atualizados
              </p>
            </Card>

            {/* Passo 2 */}
            <Card className={`arena-card text-center bg-gradient-to-br from-battle/20 to-battle/5 border-battle/30 ${isMobile ? 'p-2' : 'p-3'}`}>
              <div className={`${isMobile ? 'mb-2' : 'mb-4'}`}>
                <div className={`rounded-full bg-battle/20 mx-auto flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
                  <Sword className={`text-battle ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                </div>
              </div>
              <h3 className={`font-bold text-battle ${isMobile ? 'text-xs mb-1' : 'mb-2'}`}>2. Compita</h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                PvP 1x1 onde habilidade decide
              </p>
            </Card>

            {/* Passo 3 */}
            <Card className={`arena-card text-center bg-gradient-to-br from-epic/20 to-epic/5 border-epic/30 ${isMobile ? 'p-2' : 'p-3'}`}>
              <div className={`${isMobile ? 'mb-2' : 'mb-4'}`}>
                <div className={`rounded-full bg-epic/20 mx-auto flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
                  <Trophy className={`text-epic ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                </div>
              </div>
              <h3 className={`font-bold text-epic ${isMobile ? 'text-xs mb-1' : 'mb-2'}`}>3. Ganhe</h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Top 5% recebem +20% bônus
              </p>
            </Card>

            {/* Passo 4 */}
            <Card className={`arena-card text-center bg-gradient-to-br from-legendary/20 to-legendary/5 border-legendary/30 ${isMobile ? 'p-2' : 'p-3'}`}>
              <div className={`${isMobile ? 'mb-2' : 'mb-4'}`}>
                <div className={`rounded-full bg-legendary/20 mx-auto flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
                  <Target className={`text-legendary ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                </div>
              </div>
              <h3 className={`font-bold text-legendary ${isMobile ? 'text-xs mb-1' : 'mb-2'}`}>4. Saque</h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Até 80% sacável via PIX
              </p>
            </Card>
          </div>

          {/* Exemplos de Créditos */}
          <div className={`text-center ${isMobile ? 'mt-4 px-1' : 'mt-8 px-6'}`}>
            <Card className={`arena-card-epic max-w-4xl mx-auto ${isMobile ? 'p-3' : 'p-6'}`}>
              <h3 className={`font-bold text-epic ${isMobile ? 'text-sm mb-3' : 'text-2xl mb-4'}`}>
                💰 Exemplos de Créditos Mensais
              </h3>
              <div className={`grid gap-2 ${isMobile ? 'grid-cols-2 text-xs' : 'md:grid-cols-4'}`}>
                <div className="text-center">
                  <div className={`font-bold text-gray-500 ${isMobile ? 'text-lg' : 'text-2xl'}`}>🥉</div>
                  <div className={`font-semibold ${isMobile ? 'text-xs' : 'text-lg'}`}>Iniciante</div>
                  <div className={`text-epic font-bold ${isMobile ? 'text-xs' : 'text-xl'}`}>48 créditos/mês</div>
                </div>
                <div className="text-center">
                  <div className={`font-bold text-gray-400 ${isMobile ? 'text-lg' : 'text-2xl'}`}>🥈</div>
                  <div className={`font-semibold ${isMobile ? 'text-xs' : 'text-lg'}`}>Ativo</div>
                  <div className={`text-epic font-bold ${isMobile ? 'text-xs' : 'text-xl'}`}>120 créditos/mês</div>
                </div>
                <div className="text-center">
                  <div className={`font-bold text-gray-300 ${isMobile ? 'text-lg' : 'text-2xl'}`}>🥇</div>
                  <div className={`font-semibold ${isMobile ? 'text-xs' : 'text-lg'}`}>Top 20%</div>
                  <div className={`text-epic font-bold ${isMobile ? 'text-xs' : 'text-xl'}`}>200 créditos/mês</div>
                </div>
                <div className="text-center">
                  <div className={`font-bold text-purple-500 ${isMobile ? 'text-lg' : 'text-2xl'}`}>👑</div>
                  <div className={`font-semibold ${isMobile ? 'text-xs' : 'text-lg'}`}>Elite 10%</div>
                  <div className={`text-legendary font-bold ${isMobile ? 'text-xs' : 'text-xl'}`}>200+ créditos/mês</div>
                </div>
              </div>
              <p className={`text-muted-foreground ${isMobile ? 'mt-2 text-xs' : 'mt-4 text-sm'}`}>
                <span className="text-epic font-bold">100% transparente:</span> Sistema matematicamente sustentável
              </p>
              <p className={`text-muted-foreground ${isMobile ? 'mt-1 text-xs' : 'mt-2 text-xs'}`}>
                <span className="text-gray-400 font-semibold">⚖️ Importante:</span> Créditos são para uso interno da plataforma. Não constitui investimento ou promessa de retorno financeiro. 
                Sistema meritocrático transparente - resultados individuais podem variar.
              </p>
            </Card>
          </div>
        </section>

        {/* Eras Section */}
        <section className={`${isMobile ? 'py-6 px-2' : 'py-12 px-6'}`}>
          <div className={`text-center ${isMobile ? 'mb-6' : 'mb-16'}`}>
            <h2 className={`font-montserrat font-bold text-epic ${isMobile ? 'text-xl mb-2' : 'text-3xl mb-4'}`}>
              Explore as Eras Históricas
            </h2>
            <p className={`text-muted-foreground max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-xl'}`}>
              Cada era oferece desafios únicos, perguntas dinâmicas e oportunidades de aprendizado
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 ${isMobile ? 'gap-2' : 'gap-4'}`}>
            {eras.map((era) => (
              <Card 
                key={era.id} 
                className={`
                  relative overflow-hidden cursor-pointer transition-all duration-300
                  bg-gradient-to-br ${era.bgGradient} 
                  border ${era.borderColor}
                  hover:shadow-xl hover:scale-[1.02] hover:border-${era.color}/50
                  ${isMobile ? 'p-2' : 'p-4'}
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
        <section className="py-12 px-6">
          <Card className="arena-card-epic p-8 text-center max-w-4xl mx-auto">
            <Zap className="w-16 h-16 text-epic mx-auto mb-6" />
            <h2 className="text-4xl font-montserrat font-bold text-epic mb-4">
              🏛️ Comece a Aprender e Competir Agora!
            </h2>
            <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
              Junte-se ao primeiro quiz que <span className="text-epic font-bold">realmente paga por conhecimento</span>. 
              Sistema meritocrático transparente onde cada vitória é sua conquista!
            </p>
            <div className="space-y-3 mb-8 max-w-2xl mx-auto">
              <p className="text-gray-400 text-sm">
                💡 <span className="font-semibold">Ganhos baseados em mérito:</span> Sem garantias fixas. 
                Valores dependem do seu desempenho e dedicação aos estudos.
              </p>
              <p className="text-green-400 text-sm font-semibold">
                🚫 <span className="font-bold">NÃO É APOSTA:</span> Todo ganho depende de conhecimento e esforço.
              </p>
              <p className="text-blue-400 text-sm">
                🎓 <span className="font-semibold">Menores de 18:</span> Modo FREE + Treinos (sem PvP) + Saque limitado 50%/mês.
              </p>
            </div>
            
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
              ✨ Grátis para começar • 🧠 Aprenda com diversão • �� Créditos por conhecimento
            </p>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-card-border bg-background-soft/80 backdrop-blur-sm p-4 mt-4">
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <button 
              onClick={() => setShowAuth(true)}
              className="text-epic hover:text-epic/80 transition-colors text-xs"
            >
              📝 Cadastro Grátis
            </button>
            <span className="text-muted-foreground">•</span>
            <button 
              onClick={() => setShowAuth(true)}
              className="text-muted-foreground hover:text-epic transition-colors text-xs"
            >
              📋 Políticas
            </button>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              💎 Plano Premium
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            🆓 <span className="text-epic text-xs">Free:</span> 6 partidas/dia • 
            <span className="text-muted-foreground">💎 Pago: Ilimitado + créditos salvos</span>
          </p>
          <p className="text-blue-400 text-xs">
            🎓 <span className="font-semibold">Seguro por idade:</span> Menores de 18 = FREE sem PvP + saque 50%/mês • Maiores de 18 = acesso completo
          </p>
          <p className="text-muted-foreground">
            © 2025 Arena do Conhecimento • Transformando educação em oportunidade
          </p>
        </div>
      </footer>
      </div>

      {/* Auth Modal - Fora do container scale */}
      {showAuth && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute -top-10 right-0 text-muted-foreground hover:text-epic transition-colors z-10"
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
    </div>
  );
};

export default Landing;