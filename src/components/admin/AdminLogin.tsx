import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export const AdminLogin = () => {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState('phpg69@gmail.com');
  const [password, setPassword] = useState('p6p7p8P9!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginAsAdmin } = useAdminAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await loginAsAdmin(email, password);
    
    if (!result.success) {
      setError(result.error || 'Erro ao fazer login');
    }
    
    setIsLoading(false);
  };

  return (
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background relative flex items-center justify-center`}>
      {/* Background administrativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-battle/20 via-epic/10 to-background"></div>
      
      <Card className="w-full max-w-md mx-4 arena-card-epic">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-epic/20 rounded-full">
              <Shield className="w-8 h-8 text-epic" />
            </div>
          </div>
          <CardTitle className="text-2xl font-montserrat font-bold text-epic">
            Admin Dashboard
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Acesso restrito para administradores
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@arena.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="arena-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="arena-input pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full btn-epic"
              disabled={isLoading}
            >
              {isLoading ? 'Autenticando...' : 'Entrar no Admin'}
            </Button>
          </form>
          
          <div className="mt-6 p-3 bg-epic/5 rounded-lg border border-epic/20">
            <p className="text-xs text-muted-foreground text-center">
              🛡️ Área restrita • Acesso apenas para phpg69@gmail.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
