import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  LogOut,
  UserX,
  Crown,
  Ban,
  Settings,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminData } from '@/hooks/useAdminData';
import { useIsMobile } from '@/hooks/use-mobile';

export const AdminDashboard = () => {
  const { adminUser, logoutAdmin } = useAdminAuth();
  const { users, stats, loading, updateUserType, banUser, makeUserVIP } = useAdminData();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'free': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'paid': return 'bg-epic/20 text-epic border-epic/30';
      case 'vip': return 'bg-victory/20 text-victory border-victory/30';
      case 'banned': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const handleUserAction = async (userId: string, action: 'ban' | 'vip' | 'free' | 'paid') => {
    if (action === 'ban') {
      await banUser(userId);
    } else if (action === 'vip') {
      await makeUserVIP(userId);
    } else {
      await updateUserType(userId, action);
    }
  };

  if (loading) {
    return (
      <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-epic mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados administrativos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background relative`}>
      {/* Header Admin */}
      <header className="border-b border-card-border bg-background/80 backdrop-blur-sm">
        <div className={`max-w-7xl mx-auto ${isMobile ? 'p-3' : 'p-6'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-epic/20 rounded-full">
                <Shield className="w-6 h-6 text-epic" />
              </div>
              <div>
                <h1 className="text-xl font-montserrat font-bold text-epic">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Arena do Conhecimento</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">{adminUser?.email}</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logoutAdmin}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                {!isMobile && <span className="ml-2">Sair</span>}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto ${isMobile ? 'p-3 h-full overflow-y-auto' : 'p-6'}`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`${isMobile ? 'grid grid-cols-4 w-full' : 'inline-flex'}`}>
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              {!isMobile && <span>Overview</span>}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              {!isMobile && <span>Usuários</span>}
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              {!isMobile && <span>Financeiro</span>}
            </TabsTrigger>
            <TabsTrigger value="evo" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              {!isMobile && <span>EVO</span>}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="arena-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-epic" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Usuários</p>
                      <p className="text-2xl font-bold text-epic">{stats?.totalUsers || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="arena-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-victory" />
                    <div>
                      <p className="text-sm text-muted-foreground">Receita Total</p>
                      <p className="text-2xl font-bold text-victory">
                        {formatCurrency(stats?.totalRevenue || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="arena-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-battle" />
                    <div>
                      <p className="text-sm text-muted-foreground">Batalhas</p>
                      <p className="text-2xl font-bold text-battle">{stats?.totalBattles || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="arena-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-legendary" />
                    <div>
                      <p className="text-sm text-muted-foreground">VIP Users</p>
                      <p className="text-2xl font-bold text-legendary">{stats?.vipUsers || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Distribuição de Usuários */}
            <Card className="arena-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Distribuição de Usuários</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-gray-700">{stats?.freeUsers || 0}</p>
                    <p className="text-sm text-muted-foreground">Free</p>
                  </div>
                  <div className="text-center p-4 bg-epic/10 rounded-lg">
                    <p className="text-2xl font-bold text-epic">{stats?.paidUsers || 0}</p>
                    <p className="text-sm text-muted-foreground">Pagos</p>
                  </div>
                  <div className="text-center p-4 bg-victory/10 rounded-lg">
                    <p className="text-2xl font-bold text-victory">{stats?.vipUsers || 0}</p>
                    <p className="text-sm text-muted-foreground">VIP</p>
                  </div>
                  <div className="text-center p-4 bg-destructive/10 rounded-lg">
                    <p className="text-2xl font-bold text-destructive">{stats?.bannedUsers || 0}</p>
                    <p className="text-sm text-muted-foreground">Banidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="arena-card">
              <CardHeader>
                <CardTitle>Gerenciar Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-card-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium">{user.display_name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getUserTypeColor(user.user_type)}>
                              {user.user_type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {user.total_battles} batalhas • {formatCurrency(user.wallet_balance)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {user.user_type !== 'vip' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'vip')}
                            className="text-victory hover:text-victory"
                          >
                            <Crown className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {user.user_type !== 'banned' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'ban')}
                            className="text-destructive hover:text-destructive"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {user.user_type === 'banned' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'free')}
                            className="text-epic hover:text-epic"
                          >
                            Desbanir
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financeiro Tab */}
          <TabsContent value="financeiro" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="arena-card">
                <CardHeader>
                  <CardTitle>Receita Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-victory mb-2">
                    {formatCurrency(stats?.monthlyRevenue || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    +12% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="arena-card">
                <CardHeader>
                  <CardTitle>Tempo Médio de Sessão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-epic mb-2">
                    {stats?.avgSessionTime || 0} min
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Por usuário ativo
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* EVO Tab */}
          <TabsContent value="evo" className="space-y-6">
            <Card className="arena-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Área EVO - Evolução da Plataforma</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-epic/5 rounded-lg border border-epic/20">
                  <h3 className="font-semibold text-epic mb-2">📰 Notícias para Quiz</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Últimas notícias globais que podem se tornar questões:
                  </p>
                  <div className="space-y-2">
                    <div className="p-2 bg-background rounded border">
                      <p className="text-sm font-medium">IA Generativa revoluciona mercado</p>
                      <p className="text-xs text-muted-foreground">Impacto: Alto • Relevância: 95%</p>
                    </div>
                    <div className="p-2 bg-background rounded border">
                      <p className="text-sm font-medium">Mudanças climáticas aceleram</p>
                      <p className="text-xs text-muted-foreground">Impacto: Crítico • Relevância: 89%</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-victory/5 rounded-lg border border-victory/20">
                  <h3 className="font-semibold text-victory mb-2">🚀 Melhorias da Arena</h3>
                  <div className="space-y-2 text-sm">
                    <p>• Sistema PvP real implementado</p>
                    <p>• Dashboard administrativo ativo</p>
                    <p>• Sistema de créditos funcional</p>
                    <p>• Responsividade mobile otimizada</p>
                  </div>
                </div>

                <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <h3 className="font-semibold text-warning mb-2">⚡ Próximas Features</h3>
                  <div className="space-y-2 text-sm">
                    <p>• Sistema de torneios (10/mês)</p>
                    <p>• Modo free com 3 treinos/dia</p>
                    <p>• Analytics avançados</p>
                    <p>• Ranking global dinâmico</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
