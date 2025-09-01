import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Clock, Target, ArrowLeft, Zap, Shield, Users, Search, Crown, Trophy } from 'lucide-react';
import { ActionButton } from '@/components/arena/ActionButton';
import { ParticleBackground } from '@/components/ui/particles';
import { useEraQuestions } from '@/hooks/useEraQuestions';
import { useBattleSave } from '@/hooks/useBattleSave';
import { useArena } from '@/hooks/useArena';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateHpDamage, getArenaRewards } from '@/utils/gameBalance';
import { handleNewBattleCredits, getUserPlan, getPvPValues } from '@/utils/creditsIntegration';
import { Player } from '@/types/arena';
import egyptArena from '@/assets/egypt-arena.png';
import mesopotamiaLanding from '@/assets/mesopotamia-landing-bg.jpg';
import medievalLanding from '@/assets/medieval-landing-bg.jpg';
import digitalLanding from '@/assets/digital-landing-bg.jpg';

interface Battle {
  player1: {
    name: string;
    hp: number;
    maxHp: number;
    avatar: string;
  };
  player2: {
    name: string;
    hp: number;
    maxHp: number;
    avatar: string;
  };
}

const Arena = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Obter valores do PvP baseados no plano do usuário
  const pvpValues = getPvPValues();
  const [battle, setBattle] = useState<Battle>({
    player1: { name: 'Você', hp: 100, maxHp: 100, avatar: '⚔️' },
    player2: { name: 'IA Esfinge', hp: 100, maxHp: 100, avatar: '🗿' }
  });
  const [gamePhase, setGamePhase] = useState<'waiting' | 'battle' | 'finished'>('waiting');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [battleStartTime, setBattleStartTime] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Usar o hook para buscar 5 perguntas aleatórias do Egito Antigo
  const { questions, loading } = useEraQuestions('egito-antigo', 5);
  
  // Hook para salvar dados da batalha
  const { saveBattleResult, saving } = useBattleSave();

  useEffect(() => {
    if (gamePhase === 'battle' && timeLeft > 0 && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'battle') {
      handleAnswer(null);
    }
  }, [timeLeft, gamePhase]);

  const startBattle = () => {
    setGamePhase('battle');
    setTimeLeft(30);
    setBattleStartTime(Date.now());
  };

  const handleAnswer = (answerIndex: number | null) => {
    setSelectedAnswer(answerIndex);
    
    const correct = answerIndex === questions[currentQuestion]?.correct;
    
    // Contar respostas corretas
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Calcular dano dinâmico baseado no número total de perguntas
    const damage = calculateHpDamage(questions.length);
    
    // Atualizar HP baseado na resposta
    if (correct) {
      // Jogador acerta, IA perde HP
      setBattle(prev => ({
        ...prev,
        player2: { ...prev.player2, hp: Math.max(0, prev.player2.hp - damage) }
      }));
    } else {
      // Jogador erra, perde HP
      setBattle(prev => ({
        ...prev,
        player1: { ...prev.player1, hp: Math.max(0, prev.player1.hp - damage) }
      }));
    }

    // Verificar fim do jogo
    setTimeout(async () => {
      let finalResult: 'victory' | 'defeat' | null = null;
      const minHp = calculateHpDamage(questions.length) - 1; // HP mínimo para continuar
      
      if (battle.player2.hp <= minHp) {
        finalResult = 'victory';
        setBattleResult('victory');
        setGamePhase('finished');
      } else if (battle.player1.hp <= minHp) {
        finalResult = 'defeat';
        setBattleResult('defeat');
        setGamePhase('finished');
      } else if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(30);
      } else {
        // Empate - quem tem mais HP ganha
        finalResult = battle.player1.hp > battle.player2.hp ? 'victory' : 'defeat';
        setBattleResult(finalResult);
        setGamePhase('finished');
      }
      
      // Salvar dados se o jogo terminou
      if (finalResult && battleStartTime) {
        const battleDurationSeconds = Math.round((Date.now() - battleStartTime) / 1000);
        const isVictory = finalResult === 'victory';
        
        // Usar sistema dinâmico de recompensas da Arena
        const rewards = getArenaRewards('egito-antigo', correctAnswers, questions.length, isVictory);
        
        await saveBattleResult({
          eraName: 'Arena - Egito Antigo',
          questionsTotal: questions.length,
          questionsCorrect: correctAnswers,
          xpEarned: rewards.xpEarned,
          moneyEarned: rewards.moneyEarned,
          battleDurationSeconds: battleDurationSeconds,
          battleType: 'pvp', // Novo: marcar como PvP para sistema de créditos
        });

        // Novo: Sistema de Percepção de Créditos para PvP
        const accuracyPercentage = Math.round((correctAnswers / questions.length) * 100);
        const userPlan = getUserPlan();
        const creditsResult = handleNewBattleCredits({
          battleType: 'pvp',
          questionsCorrect: correctAnswers,
          questionsTotal: questions.length,
          accuracyPercentage: accuracyPercentage,
          planType: userPlan
        });
        
        console.log(`⚔️ Arena PvP concluída! ${creditsResult.message} (${isVictory ? 'Vitória' : 'Derrota'})`);
      }
    }, 2000);
  };

  // Mostrar loading enquanto as perguntas carregam
  if (loading || questions.length === 0) {
    return (
      <div className={`${isMobile ? 'h-screen overflow-hidden' : 'h-screen overflow-hidden'} bg-background relative flex items-center justify-center`}>
        <div className={isMobile ? 'scale-[0.25] origin-top-left w-[400%] h-[400%]' : 'scale-[0.628] origin-top-left w-[159%] h-[159%]'}>
        <ParticleBackground />
        <div className="relative z-10 text-center">
          <div className="arena-card-epic p-8">
            <div className="text-4xl mb-4">🏺</div>
            <h2 className="text-2xl font-montserrat font-bold text-epic mb-4">
              Carregando Desafios...
            </h2>
            <p className="text-muted-foreground">
              Preparando perguntas exclusivas do Egito Antigo
            </p>
          </div>
        </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'waiting') {
    return (
      <div className={`${isMobile ? 'h-screen overflow-hidden' : 'h-screen overflow-hidden'} relative`}>
        {/* Epic Arena Background - Fusão Suave das 4 Eras */}
        <div className="absolute inset-0 z-0">
          {/* Layer 1: Egypt (Base) */}
          <div className="absolute inset-0 opacity-50">
            <img 
              src={egyptArena} 
              alt="Egypt Era" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/40 to-transparent" />
          </div>
          
          {/* Layer 2: Mesopotamia (Blend) */}
          <div className="absolute inset-0 opacity-40" style={{mixBlendMode: 'multiply'}}>
            <img 
              src={mesopotamiaLanding} 
              alt="Mesopotamia Era" 
              className="w-full h-full object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-bl from-amber-700/50 to-transparent" />
          </div>
          
          {/* Layer 3: Medieval (Overlay) */}
          <div className="absolute inset-0 opacity-35" style={{mixBlendMode: 'overlay'}}>
            <img 
              src={medievalLanding} 
              alt="Medieval Era" 
              className="w-full h-full object-cover scale-105 rotate-1"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-800/60 to-transparent" />
          </div>
          
          {/* Layer 4: Digital (Soft Light) */}
          <div className="absolute inset-0 opacity-30" style={{mixBlendMode: 'soft-light'}}>
            <img 
              src={digitalLanding} 
              alt="Digital Era" 
              className="w-full h-full object-cover scale-95 -rotate-1"
            />
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-800/50 to-transparent" />
          </div>
          
          {/* Central Epic Overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/20 to-background/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/80" />
          
          {/* Arena Center Glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-epic/15 rounded-full blur-3xl animate-pulse" />
          
          {/* Mystical Particles Effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-epic rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-victory rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-battle rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
        
        <ParticleBackground />
        
        <div className={`relative z-10 max-w-4xl mx-auto ${isMobile ? 'p-3 h-full overflow-y-auto' : 'p-6'}`}>
          <div className="text-center mb-8">
            <ActionButton 
              variant="battle" 
              icon={<ArrowLeft />}
              onClick={() => navigate('/app')}
              className="mb-6"
            >
              Voltar ao Menu
            </ActionButton>
          </div>

          <div className="arena-card-epic p-8 text-center">
            <h1 className="text-4xl font-montserrat font-bold text-epic mb-4">
              Arena do Conhecimento
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Prepare-se para a batalha no Egito Antigo!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="arena-card p-6">
                <div className="text-4xl mb-4">⚔️</div>
                <h3 className="font-montserrat font-bold text-xl mb-2">Você</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Shield className="w-5 h-5 text-victory" />
                  <span className="font-semibold">HP: 100/100</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Guerreiro do conhecimento, pronto para a batalha!
                </p>
              </div>

              <div className="arena-card p-6">
                <div className="text-4xl mb-4">🗿</div>
                <h3 className="font-montserrat font-bold text-xl mb-2">IA Esfinge</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Shield className="w-5 h-5 text-destructive" />
                  <span className="font-semibold">HP: 100/100</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Guardiã dos mistérios do Egito Antigo
                </p>
              </div>
            </div>

            <div className="arena-card p-6 mb-8">
              <h3 className="font-montserrat font-bold text-lg mb-4">Regras da Batalha</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <Zap className="w-6 h-6 text-epic mx-auto mb-2" />
                  <p><strong>30 segundos</strong> por pergunta</p>
                </div>
                <div>
                  <Target className="w-6 h-6 text-victory mx-auto mb-2" />
                  <p><strong>Acerto:</strong> -25 HP no oponente</p>
                </div>
                <div>
                  <Shield className="w-6 h-6 text-destructive mx-auto mb-2" />
                  <p><strong>Erro:</strong> -25 HP em você</p>
                </div>
              </div>
            </div>

            <div className="arena-card p-4 mb-8 bg-epic/10 border-epic">
              <p className="text-epic font-semibold">
                💰 Custo da Batalha: {pvpValues.betAmount} créditos
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Vitória: +{pvpValues.netWin} créditos | Derrota: {pvpValues.netLoss} créditos | Pool: {pvpValues.totalPool} créditos
              </p>
            </div>

            <ActionButton variant="epic" onClick={startBattle} className="text-xl px-8 py-4">
              <Sword className="w-6 h-6" />
              Iniciar Batalha!
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'finished') {
    return (
      <div className={`${isMobile ? 'h-screen overflow-hidden' : 'h-screen overflow-hidden'} relative`}>
        {/* Epic Arena Background - Fusão Suave das 4 Eras */}
        <div className="absolute inset-0 z-0">
          {/* Layer 1: Egypt (Base) */}
          <div className="absolute inset-0 opacity-50">
            <img 
              src={egyptArena} 
              alt="Egypt Era" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/40 to-transparent" />
          </div>
          
          {/* Layer 2: Mesopotamia (Blend) */}
          <div className="absolute inset-0 opacity-40" style={{mixBlendMode: 'multiply'}}>
            <img 
              src={mesopotamiaLanding} 
              alt="Mesopotamia Era" 
              className="w-full h-full object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-bl from-amber-700/50 to-transparent" />
          </div>
          
          {/* Layer 3: Medieval (Overlay) */}
          <div className="absolute inset-0 opacity-35" style={{mixBlendMode: 'overlay'}}>
            <img 
              src={medievalLanding} 
              alt="Medieval Era" 
              className="w-full h-full object-cover scale-105 rotate-1"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-800/60 to-transparent" />
          </div>
          
          {/* Layer 4: Digital (Soft Light) */}
          <div className="absolute inset-0 opacity-30" style={{mixBlendMode: 'soft-light'}}>
            <img 
              src={digitalLanding} 
              alt="Digital Era" 
              className="w-full h-full object-cover scale-95 -rotate-1"
            />
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-800/50 to-transparent" />
          </div>
          
          {/* Central Epic Overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/20 to-background/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/80" />
          
          {/* Arena Center Glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-epic/15 rounded-full blur-3xl animate-pulse" />
          
          {/* Mystical Particles Effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-epic rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-victory rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-battle rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
        
        <ParticleBackground />
        
        <div className={`relative z-10 max-w-4xl mx-auto ${isMobile ? 'p-3 h-full overflow-y-auto' : 'p-6'}`}>
          <div className="arena-card-epic p-8 text-center">
            <div className="text-6xl mb-6">
              {battleResult === 'victory' ? '🏆' : '💀'}
            </div>
            
            <h2 className={`text-3xl font-montserrat font-bold mb-4 ${
              battleResult === 'victory' ? 'text-victory' : 'text-destructive'
            }`}>
              {battleResult === 'victory' ? 'Vitória Épica!' : 'Derrota Heroica!'}
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8">
              {battleResult === 'victory' 
                ? 'Você dominou os mistérios do Egito!' 
                : 'A Esfinge foi mais sábia desta vez...'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="arena-card p-4">
                <h3 className="font-semibold mb-2">Recompensa</h3>
                <p className={`text-2xl font-bold ${battleResult === 'victory' ? 'text-victory' : 'text-epic'}`}>
                  {battleResult === 'victory' ? '+2 créditos' : '+0 créditos'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {battleResult === 'victory' ? 'Vitória PvP!' : 'Experiência de batalha'}
                </p>
                {saving && <p className="text-sm text-epic animate-pulse">Salvando...</p>}
                {!saving && <p className="text-sm text-victory">✅ Salvo!</p>}
              </div>
              
              <div className="arena-card p-4">
                <h3 className="font-semibold mb-2">XP Ganho</h3>
                <p className="text-2xl font-bold text-battle">
                  +{battleResult === 'victory' ? '200' : '75'}
                </p>
                {saving && <p className="text-sm text-epic animate-pulse">Salvando...</p>}
                {!saving && <p className="text-sm text-victory">✅ Salvo!</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActionButton variant="victory" onClick={() => window.location.reload()}>
                Nova Batalha
              </ActionButton>
              
              <ActionButton variant="epic" onClick={() => navigate('/app')}>
                Voltar ao Menu
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'h-screen overflow-hidden'} relative`}>
      {/* Epic Arena Background - Fusão Suave das 4 Eras */}
      <div className="absolute inset-0 z-0">
        {/* Layer 1: Egypt (Base) */}
        <div className="absolute inset-0 opacity-50">
          <img 
            src={egyptArena} 
            alt="Egypt Era" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/40 to-transparent" />
        </div>
        
        {/* Layer 2: Mesopotamia (Blend) */}
        <div className="absolute inset-0 opacity-40" style={{mixBlendMode: 'multiply'}}>
          <img 
            src={mesopotamiaLanding} 
            alt="Mesopotamia Era" 
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-amber-700/50 to-transparent" />
        </div>
        
        {/* Layer 3: Medieval (Overlay) */}
        <div className="absolute inset-0 opacity-35" style={{mixBlendMode: 'overlay'}}>
          <img 
            src={medievalLanding} 
            alt="Medieval Era" 
            className="w-full h-full object-cover scale-105 rotate-1"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-800/60 to-transparent" />
        </div>
        
        {/* Layer 4: Digital (Soft Light) */}
        <div className="absolute inset-0 opacity-30" style={{mixBlendMode: 'soft-light'}}>
          <img 
            src={digitalLanding} 
            alt="Digital Era" 
            className="w-full h-full object-cover scale-95 -rotate-1"
          />
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-800/50 to-transparent" />
        </div>
        
        {/* Central Epic Overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/20 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/80" />
        
        {/* Arena Center Glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-epic/15 rounded-full blur-3xl animate-pulse" />
        
        {/* Mystical Particles Effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-epic rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-victory rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-battle rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        </div>
      </div>
      
      <ParticleBackground />
      
      <div className={`relative z-10 max-w-6xl mx-auto ${isMobile ? 'p-3 h-full overflow-y-auto' : 'p-6'}`}>
        {/* Battle HUD */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Player 1 */}
          <div className="arena-card p-4 text-center">
            <div className="text-3xl mb-2">{battle.player1.avatar}</div>
            <h3 className="font-bold mb-2">{battle.player1.name}</h3>
            <div className="progress-epic mb-2">
              <div 
                className="h-3 bg-victory rounded-full transition-all duration-1000"
                style={{ width: `${(battle.player1.hp / battle.player1.maxHp) * 100}%` }}
              />
            </div>
            <p className="text-sm font-semibold">{battle.player1.hp}/{battle.player1.maxHp} HP</p>
          </div>

          {/* Timer */}
          <div className="arena-card-epic p-4 text-center">
            <div className="text-4xl mb-2">⚔️</div>
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-destructive' : 'text-epic'}`}>
              {timeLeft}s
            </div>
            <p className="text-sm">Pergunta {currentQuestion + 1}/{questions.length}</p>
          </div>

          {/* Player 2 */}
          <div className="arena-card p-4 text-center">
            <div className="text-3xl mb-2">{battle.player2.avatar}</div>
            <h3 className="font-bold mb-2">{battle.player2.name}</h3>
            <div className="progress-epic mb-2">
              <div 
                className="h-3 bg-destructive rounded-full transition-all duration-1000"
                style={{ width: `${(battle.player2.hp / battle.player2.maxHp) * 100}%` }}
              />
            </div>
            <p className="text-sm font-semibold">{battle.player2.hp}/{battle.player2.maxHp} HP</p>
          </div>
        </div>

        {/* Question */}
        <div className="arena-card-epic p-8">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-2 bg-epic/20 rounded-full mb-4">
              <span className="text-epic font-semibold">{question.category}</span>
            </div>
            <h2 className="text-2xl font-montserrat font-bold">{question.question}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className="p-6 rounded-lg border-2 border-border hover:border-epic hover:bg-epic/10 transition-all text-left disabled:opacity-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-semibold">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arena;