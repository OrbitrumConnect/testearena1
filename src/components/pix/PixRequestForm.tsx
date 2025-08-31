import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { DollarSign, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PixRequestFormProps {
  userId: string;
  displayName: string;
  onRequestSent: () => void;
}

export const PixRequestForm = ({ userId, displayName, onRequestSent }: PixRequestFormProps) => {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return formatted;
  };

  const validateCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.length === 11;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCPF(cpf)) {
      toast({
        title: "CPF Inválido",
        description: "Digite um CPF válido com 11 dígitos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Salvar solicitação PIX no localStorage (simular backend)
      const existingRequests = JSON.parse(localStorage.getItem('pix_requests') || '[]');
      
      // Verificar se já existe uma solicitação pendente
      const existingRequest = existingRequests.find((req: any) => 
        req.userId === userId && req.status === 'pending'
      );
      
      if (existingRequest) {
        toast({
          title: "Solicitação já existe",
          description: "Você já tem uma solicitação PIX pendente",
          variant: "destructive"
        });
        return;
      }

      const newRequest = {
        userId,
        displayName,
        cpf: cpf.replace(/\D/g, ''),
        amount: 20,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      existingRequests.push(newRequest);
      localStorage.setItem('pix_requests', JSON.stringify(existingRequests));

      // Salvar CPF no perfil do usuário
      const currentProfile = JSON.parse(localStorage.getItem('demo_profile') || '{}');
      currentProfile.cpf = cpf.replace(/\D/g, '');
      localStorage.setItem('demo_profile', JSON.stringify(currentProfile));

      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação PIX foi enviada para análise",
      });

      onRequestSent();
    } catch (error) {
      console.error('Erro ao enviar solicitação PIX:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar solicitação PIX",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-card/80">
      <div className="flex items-center space-x-2 mb-4">
        <DollarSign className="h-6 w-6 text-green-400" />
        <h3 className="text-xl font-bold text-white">Solicitar PIX</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cpf" className="text-white">CPF</Label>
          <Input
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(formatCPF(e.target.value))}
            maxLength={14}
            className="mt-1"
            required
          />
          <p className="text-sm text-gray-400 mt-1">
            Digite seu CPF para receber R$ 5,00 via PIX
          </p>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <h4 className="text-green-400 font-semibold mb-2">💰 Valor do PIX: R$ 5,00</h4>
          <p className="text-sm text-gray-300">
            Solicitação mensal disponível para usuários ativos. 
            Processamento em até 24 horas úteis.
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || !validateCPF(cpf)}
        >
          {loading ? (
            <>⏳ Enviando...</>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Solicitar R$ 5 via PIX
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};
