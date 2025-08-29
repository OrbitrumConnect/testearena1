import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionButton } from '@/components/arena/ActionButton';
import { User, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  onAuthSuccess: () => void;
  redirectToApp?: boolean;
}

export const AuthForm = ({ onAuthSuccess, redirectToApp = false }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta, guerreiro!",
        });
        
        if (redirectToApp) {
          window.location.href = '/app';
          return;
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName,
            },
          },
        });
        if (error) throw error;
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo à Arena do Conhecimento!",
        });
        
        if (redirectToApp) {
          window.location.href = '/app';
          return;
        }
      }
      onAuthSuccess();
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Erro na autenticação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // Criar usuário demo temporário
      const demoEmail = `demo_${Date.now()}@example.com`;
      const demoPassword = 'demo123456';
      
      const { error } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            full_name: 'Guerreiro Demo',
          },
        },
      });

      if (error) throw error;

      // Fazer login automaticamente
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (loginError) throw loginError;

      toast({
        title: "Conta demo criada!",
        description: "Explore o dashboard com dados de exemplo.",
      });
      onAuthSuccess();
    } catch (error) {
      console.error('Demo auth error:', error);
      toast({
        title: "Erro ao criar conta demo",
        description: "Tente novamente em alguns segundos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="arena-card-epic p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <User className="w-16 h-16 text-epic mx-auto mb-4" />
        <h2 className="text-2xl font-montserrat font-bold text-epic">
          {isLogin ? 'Entrar na Arena' : 'Criar Conta'}
        </h2>
        <p className="text-muted-foreground mt-2">
          {isLogin ? 'Acesse seu dashboard pessoal' : 'Junte-se à batalha do conhecimento'}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        {!isLogin && (
          <div>
            <Label htmlFor="displayName" className="text-sm font-semibold">Nome de Guerreiro</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="displayName"
                type="text"
                placeholder="Seu nome de batalha"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="pl-10"
                required={!isLogin}
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-semibold">Senha</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Sua senha secreta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-epic/20 border-2 border-epic rounded-lg text-epic font-bold hover:bg-epic/30 transition-all disabled:opacity-50"
        >
          {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-epic hover:underline"
          >
            {isLogin ? 'Não tem conta? Criar uma nova' : 'Já tem conta? Fazer login'}
          </button>
        </div>

        <div className="text-center">
          <ActionButton
            variant="battle"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full"
          >
            🚀 Entrar como Demo
          </ActionButton>
          <p className="text-xs text-muted-foreground mt-2">
            Explore o dashboard sem criar conta
          </p>
        </div>
      </div>
    </Card>
  );
};