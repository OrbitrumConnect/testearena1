import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, User, Mail, Calendar, Trophy, DollarSign, Send } from 'lucide-react';
import { ActionButton } from '@/components/arena/ActionButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ParticleBackground } from '@/components/ui/particles';
import { useAdminAuth } from '@/utils/adminAuth';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  total_battles: number;
  battles_won: number;
  favorite_era: string | null;
  created_at: string;
  updated_at: string;
  user_type: 'free' | 'paid' | 'vip' | 'banned';
  cpf?: string;
}

interface UserAuth {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
}

interface PixRequest {
  userId: string;
  displayName: string;
  cpf: string;
  amount: number;
  status: 'pending' | 'sent' | 'rejected';
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [users, setUsers] = useState<(UserProfile & { email?: string })[]>([]);
  const [pixRequests, setPixRequests] = useState<PixRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Buscar perfis dos usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar dados de autenticação (apenas admins podem fazer isso)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      // Combinar dados de perfil com email
      const usersWithEmail = (profiles || []).map(profile => {
        const authUser = authUsers?.users?.find(u => u.id === profile.user_id);
        return {
          ...profile,
          email: authUser?.email || 'N/A'
        };
      });

      setUsers(usersWithEmail);

      // Buscar solicitações PIX (simular com localStorage por enquanto)
      const savedRequests = localStorage.getItem('pix_requests');
      if (savedRequests) {
        setPixRequests(JSON.parse(savedRequests));
      }

    } catch (error) {
      console.error('Erro ao buscar dados admin:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados administrativos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserType = async (userId: string, newType: 'free' | 'paid' | 'vip' | 'banned') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: newType })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.user_id === userId ? { ...user, user_type: newType } : user
      ));

      toast({
        title: "Usuário atualizado",
        description: `Tipo alterado para ${newType}`,
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário",
        variant: "destructive"
      });
    }
  };

  const sendPixPayment = async (requestId: string, userId: string, cpf: string, amount: number) => {
    try {
      // Simular envio PIX (integrar com API real depois)
      console.log(`💸 Enviando PIX de R$ ${amount} para CPF: ${cpf}`);
      
      // Atualizar status da solicitação
      const updatedRequests = pixRequests.map(req => 
        req.userId === userId ? { ...req, status: 'sent' as const } : req
      );
      setPixRequests(updatedRequests);
      localStorage.setItem('pix_requests', JSON.stringify(updatedRequests));

      toast({
        title: "PIX Enviado",
        description: `R$ ${amount} enviado para CPF ${cpf}`,
      });
    } catch (error) {
      console.error('Erro ao enviar PIX:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar PIX",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'free': return 'bg-gray-500';
      case 'paid': return 'bg-blue-500';
      case 'vip': return 'bg-purple-500';
      case 'banned': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Verificar autenticação admin
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Verificando permissões...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold text-white mb-4">Acesso Negado</h1>
          <p className="text-gray-300 mb-6">Apenas administradores podem acessar esta área</p>
          <ActionButton 
            variant="battle" 
            icon={<ArrowLeft />}
            onClick={() => navigate('/app')}
          >
            Voltar ao App
          </ActionButton>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando painel administrativo...</div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'h-screen overflow-hidden'} relative overflow-hidden`}>
      <div className={isMobile ? 'scale-[0.25] origin-top-left w-[400%] h-[400%]' : 'scale-[0.628] origin-top-left w-[159%] h-[159%]'}>
      {/* Background Temático Admin - Digital */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/digital-background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-black/70" />
      
      <ParticleBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto p-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <ActionButton 
            variant="battle" 
            icon={<ArrowLeft />}
            onClick={() => navigate('/app')}
            className="backdrop-blur-sm bg-battle-dark/80"
          >
            Voltar
          </ActionButton>
          
          <h1 className="text-3xl font-montserrat font-bold text-white">
            🛠️ Dashboard Administrativo
          </h1>
          
          <div className="text-right text-white">
            <p className="text-sm opacity-80">Total de Usuários</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </div>

        {/* Estatísticas Administrativas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-4 backdrop-blur-sm bg-card/80 text-center">
            <User className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{users.length}</p>
            <p className="text-sm text-gray-400">Usuários Totais</p>
          </Card>

          <Card className="p-4 backdrop-blur-sm bg-card/80 text-center">
            <Trophy className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {users.filter(u => (u.user_type === 'paid' || u.user_type === 'vip')).length}
            </p>
            <p className="text-sm text-gray-400">Usuários Pagos</p>
          </Card>

          <Card className="p-4 backdrop-blur-sm bg-card/80 text-center">
            <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {pixRequests.filter(req => req.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-400">PIX Pendentes</p>
          </Card>

          <Card className="p-4 backdrop-blur-sm bg-card/80 text-center">
            <Calendar className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {users.filter(u => {
                const today = new Date();
                const userDate = new Date(u.created_at);
                return today.toDateString() === userDate.toDateString();
              }).length}
            </p>
            <p className="text-sm text-gray-400">Novos Hoje</p>
          </Card>
        </div>

        {/* Busca */}
        <Card className="mb-6 p-4 backdrop-blur-sm bg-card/80">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={fetchAdminData}>
              Atualizar
            </Button>
          </div>
        </Card>

        {/* Grid de Usuários */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-4 backdrop-blur-sm bg-card/80 hover:bg-card/90 transition-all">
              <div className="space-y-3">
                {/* Cabeçalho do Usuário */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-white">
                      {user.display_name || 'Usuário Anônimo'}
                    </h3>
                  </div>
                  <Badge className={`${getUserTypeColor(user.user_type || 'free')} text-white`}>
                    {user.user_type || 'free'}
                  </Badge>
                </div>

                {/* Informações do Usuário */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(user.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-300">
                    <Trophy className="h-4 w-4" />
                    <span>{user.total_battles} batalhas ({user.battles_won} vitórias)</span>
                  </div>

                  <div className="text-gray-300">
                    <strong>{user.total_xp}</strong> XP total
                  </div>
                </div>

                {/* Ações Administrativas */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-600">
                  <Button
                    size="sm"
                    variant={user.user_type === 'paid' ? 'default' : 'outline'}
                    onClick={() => updateUserType(user.user_id, 'paid')}
                  >
                    Pago
                  </Button>
                  <Button
                    size="sm"
                    variant={user.user_type === 'vip' ? 'default' : 'outline'}
                    onClick={() => updateUserType(user.user_id, 'vip')}
                  >
                    VIP
                  </Button>
                  <Button
                    size="sm"
                    variant={user.user_type === 'free' ? 'default' : 'outline'}
                    onClick={() => updateUserType(user.user_id, 'free')}
                  >
                    Free
                  </Button>
                  <Button
                    size="sm"
                    variant={user.user_type === 'banned' ? 'destructive' : 'outline'}
                    onClick={() => updateUserType(user.user_id, 'banned')}
                  >
                    Banir
                  </Button>
                </div>

                {/* Botão PIX (se usuário tem CPF) */}
                {user.cpf && (
                  <Button
                    className="w-full mt-2"
                    onClick={() => sendPixPayment(`req-${user.id}`, user.user_id, user.cpf, 5)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar R$ 5 via PIX
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Solicitações PIX */}
        {pixRequests.length > 0 && (
          <Card className="mt-8 p-6 backdrop-blur-sm bg-card/80">
            <h2 className="text-xl font-bold text-white mb-4">
              <DollarSign className="inline h-6 w-6 mr-2" />
              Solicitações PIX Pendentes
            </h2>
            <div className="space-y-3">
              {pixRequests.filter(req => req.status === 'pending').map((request) => (
                <div key={request.userId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{request.displayName}</p>
                    <p className="text-gray-400 text-sm">CPF: {request.cpf}</p>
                    <p className="text-gray-400 text-sm">R$ {request.amount}</p>
                  </div>
                  <Button
                    onClick={() => sendPixPayment(`req-${request.userId}`, request.userId, request.cpf, request.amount)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar PIX
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Ações Rápidas do Admin */}
        <Card className="mt-8 p-6 backdrop-blur-sm bg-card/80">
          <h2 className="text-xl font-bold text-white mb-4">
            ⚡ Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                users.forEach(user => {
                  if (user.user_type === 'free') {
                    updateUserType(user.user_id, 'paid');
                  }
                });
                toast({
                  title: "Ação Executada",
                  description: "Todos usuários free foram promovidos para paid",
                });
              }}
              className="w-full"
            >
              🔄 Promover Todos Free → Paid
            </Button>

            <Button
              onClick={() => {
                const today = new Date().toDateString();
                const newUsers = users.filter(u => {
                  const userDate = new Date(u.created_at);
                  return today === userDate.toDateString();
                });
                console.log('Novos usuários hoje:', newUsers);
                toast({
                  title: "Relatório Gerado",
                  description: `${newUsers.length} usuários se registraram hoje`,
                });
              }}
              variant="outline"
              className="w-full"
            >
              📊 Relatório de Novos Usuários
            </Button>

            <Button
              onClick={() => {
                const totalPixValue = pixRequests
                  .filter(req => req.status === 'pending')
                  .reduce((sum, req) => sum + req.amount, 0);
                toast({
                  title: "Total PIX Pendente",
                  description: `R$ ${totalPixValue.toFixed(2)} em solicitações pendentes`,
                });
              }}
              variant="outline"
              className="w-full"
            >
              💰 Calcular Total PIX
            </Button>
          </div>
        </Card>

        {/* Log de Atividades Admin */}
        <Card className="mt-8 p-6 backdrop-blur-sm bg-card/80">
          <h2 className="text-xl font-bold text-white mb-4">
            📋 Log de Atividades
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[
              { time: '14:32', action: 'PIX enviado para CPF ***.***.***-12', type: 'pix' },
              { time: '14:28', action: 'Usuário João promovido para VIP', type: 'promotion' },
              { time: '14:15', action: 'Nova solicitação PIX recebida', type: 'request' },
              { time: '13:45', action: 'Usuário Maria banida por violação', type: 'ban' },
              { time: '13:22', action: '3 novos usuários registrados', type: 'registration' },
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded text-sm">
                <span className="text-gray-400">{log.time}</span>
                <span className="text-white flex-1 ml-4">{log.action}</span>
                <Badge 
                  variant="secondary" 
                  className={
                    log.type === 'pix' ? 'bg-green-500' :
                    log.type === 'promotion' ? 'bg-blue-500' :
                    log.type === 'ban' ? 'bg-red-500' : 'bg-gray-500'
                  }
                >
                  {log.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
