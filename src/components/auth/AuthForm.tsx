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
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState<'email' | 'phone' | 'cpf' | 'random'>('email');
  const [isStudying, setIsStudying] = useState(false);
  const [institution, setInstitution] = useState('');
  const [parentalConsent, setParentalConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

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
        // Validação completa no cadastro
        if (!birthDate) {
          throw new Error('Data de nascimento é obrigatória');
        }
        if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
          throw new Error('CPF válido é obrigatório');
        }
        if (!phone || phone.replace(/\D/g, '').length < 10) {
          throw new Error('Telefone válido é obrigatório');
        }
        if (isStudying && !institution.trim()) {
          throw new Error('Instituição de ensino é obrigatória quando está estudando');
        }
        
        const age = calculateAge(birthDate);
        const isMinor = age < 18;
        
        if (isMinor && !parentalConsent) {
          throw new Error('Para menores de 18 anos é necessário consentimento dos responsáveis');
        }

        const accountType = isMinor ? 'minor_free' : 'adult_free'; // Tipos de conta específicos

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
        
        // Salvar dados extras em tabela separada
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('profiles').insert({
              user_id: user.id,
              birth_date: birthDate,
              cpf: cpf.replace(/\D/g, ''),
              phone: phone.replace(/\D/g, ''),
              is_studying: isStudying,
              institution: institution.trim(),
              is_minor: isMinor,
              parental_consent: parentalConsent,
              age: age,
              account_type: accountType,
              can_pvp: !isMinor,
              withdrawal_limit: isMinor ? 0.5 : 0.8,
            });
          }
        } catch (profileError) {
          console.log('Perfil criado, mas dados extras não puderam ser salvos:', profileError);
          // Não falha o cadastro por causa dos dados extras
        }

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
    <Card className="arena-card-epic p-6 max-w-md mx-auto">
      <div className="text-center mb-4">
        <User className="w-12 h-12 text-epic mx-auto mb-3" />
        <h2 className="text-xl font-montserrat font-bold text-epic">
          {isLogin ? 'Entrar na Arena' : 'Criar Conta'}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {isLogin ? 'Acesse seu dashboard pessoal' : 'Junte-se à batalha do conhecimento'}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-3">
        {!isLogin && (
          <>
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
            
            <div>
              <Label htmlFor="birthDate" className="text-sm font-semibold">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full mt-1"
                required={!isLogin}
              />
            </div>
            
            <div>
              <Label htmlFor="cpf" className="text-sm font-semibold">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                className="w-full mt-1"
                maxLength={14}
                required={!isLogin}
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-semibold">Telefone</Label>
              <Input
                id="phone"
                type="text"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="w-full mt-1"
                maxLength={15}
                required={!isLogin}
              />
            </div>
            
            <div>
              <Label htmlFor="pixKeyType" className="text-sm font-semibold">Tipo de Chave PIX</Label>
              <select
                id="pixKeyType"
                value={pixKeyType}
                onChange={(e) => setPixKeyType(e.target.value as any)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-900"
                required={!isLogin}
              >
                <option value="email">📧 E-mail</option>
                <option value="phone">📱 Telefone</option>
                <option value="cpf">🆔 CPF</option>
                <option value="random">🔑 Chave Aleatória</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="pixKey" className="text-sm font-semibold">Chave PIX</Label>
              <Input
                id="pixKey"
                type="text"
                placeholder={pixKeyType === 'email' ? 'seu@email.com' : 
                           pixKeyType === 'phone' ? '(11) 99999-9999' :
                           pixKeyType === 'cpf' ? '000.000.000-00' :
                           'Chave aleatória (será gerada)'}
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="w-full mt-1"
                required={!isLogin && pixKeyType !== 'random'}
                disabled={pixKeyType === 'random'}
              />
              {pixKeyType === 'random' && (
                <p className="text-xs text-muted-foreground mt-1">
                  🔑 Uma chave aleatória será gerada automaticamente para você
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="isStudying"
                type="checkbox"
                checked={isStudying}
                onChange={(e) => setIsStudying(e.target.checked)}
              />
              <Label htmlFor="isStudying" className="text-sm font-semibold">
                📚 Atualmente estudando (escola/faculdade)
              </Label>
            </div>
            
            {isStudying && (
              <div>
                <Label htmlFor="institution" className="text-sm font-semibold">Instituição de Ensino</Label>
                <Input
                  id="institution"
                  type="text"
                  placeholder="Ex: Escola Municipal João Silva, UFRJ, etc."
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full mt-1"
                  required={isStudying}
                />
              </div>
            )}
            
            {birthDate && calculateAge(birthDate) < 18 && (
              <div className="space-y-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <div className="flex items-start space-x-2">
                  <input
                    id="parentalConsent"
                    type="checkbox"
                    checked={parentalConsent}
                    onChange={(e) => setParentalConsent(e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <Label htmlFor="parentalConsent" className="text-xs text-blue-800 leading-tight">
                    <span className="font-semibold">🎓 Conta Educativa:</span> Autorização dos responsáveis • Modo FREE sem PvP • Saque 50%/mês • Foco educação
                  </Label>
                </div>
              </div>
            )}
          </>
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
          className="w-full p-2 bg-epic/20 border-2 border-epic rounded-lg text-epic font-bold hover:bg-epic/30 transition-all disabled:opacity-50 text-sm"
        >
          {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
        </button>
      </form>

      <div className="mt-4 space-y-3">
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
            className="w-full text-sm py-2"
          >
            🚀 Entrar como Demo
          </ActionButton>
          <p className="text-xs text-muted-foreground mt-1">
            Explore o dashboard sem criar conta
          </p>
        </div>
      </div>
    </Card>
  );
};