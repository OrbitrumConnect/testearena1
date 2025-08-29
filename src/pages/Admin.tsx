import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ParticleBackground } from '@/components/ui/particles';

const Admin = () => {
  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-epic mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isAdmin ? <AdminLogin /> : <AdminDashboard />}
    </>
  );
};

export default Admin;
