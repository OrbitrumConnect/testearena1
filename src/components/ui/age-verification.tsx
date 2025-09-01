import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, UserCheck } from 'lucide-react';

interface AgeVerificationProps {
  onVerificationComplete: (isAdult: boolean) => void;
}

export const AgeVerification = ({ onVerificationComplete }: AgeVerificationProps) => {
  const [step, setStep] = useState<'initial' | 'document' | 'verification' | 'complete'>('initial');
  const [birthDate, setBirthDate] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

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

  const handleInitialVerification = () => {
    if (!birthDate) {
      setError('Por favor, informe sua data de nascimento');
      return;
    }

    const age = calculateAge(birthDate);
    
    if (age >= 18) {
      setStep('document');
      setError('');
    } else {
      // Menor de 18 - modo restrito
      setIsVerified(true);
      setStep('complete');
      onVerificationComplete(false);
    }
  };

  const handleDocumentVerification = () => {
    if (!documentNumber || documentNumber.length < 11) {
      setError('Por favor, informe um CPF válido');
      return;
    }

    // Simular verificação de documento
    setStep('verification');
    setTimeout(() => {
      setIsVerified(true);
      setStep('complete');
      onVerificationComplete(true);
    }, 2000);
  };

  const getAgeRestrictions = () => (
    <div className="space-y-4">
      <Alert className="border-yellow-500/20 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-600">
          <strong>Modo Restrito para Menores de 18 anos:</strong>
        </AlertDescription>
      </Alert>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="font-semibold text-green-600">✅ Modo FREE Ativo</p>
            <p className="text-sm text-green-500">Acesso completo aos treinos gratuitos</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <CheckCircle className="h-5 w-5 text-blue-500" />
          <div>
            <p className="font-semibold text-blue-600">✅ Treinos Ilimitados</p>
            <p className="text-sm text-blue-500">Quiz de todas as eras disponíveis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <div>
            <p className="font-semibold text-orange-600">⚠️ PvP Desabilitado</p>
            <p className="text-sm text-orange-500">Apenas para maiores de 18 anos</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <Shield className="h-5 w-5 text-purple-500" />
          <div>
            <p className="font-semibold text-purple-600">🛡️ Saque Limitado</p>
            <p className="text-sm text-purple-500">Máximo 50% dos créditos/mês</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (step === 'complete' && !isVerified) {
    return (
      <Card className="arena-card-epic max-w-md mx-auto">
        <CardHeader className="text-center">
          <UserCheck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <CardTitle className="text-xl text-blue-600">Modo Restrito Ativo</CardTitle>
        </CardHeader>
        <CardContent>
          {getAgeRestrictions()}
          <Button 
            onClick={() => onVerificationComplete(false)}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
          >
            Continuar para Treinos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="arena-card-epic max-w-md mx-auto">
      <CardHeader className="text-center">
        <Shield className="w-12 h-12 text-epic mx-auto mb-4" />
        <CardTitle className="text-xl">Verificação Responsável</CardTitle>
        <p className="text-sm text-muted-foreground">
          {step === 'initial' && 'Informe sua data de nascimento'}
          {step === 'document' && 'Verificação de documento para maiores de 18 anos'}
          {step === 'verification' && 'Verificando documento...'}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        )}

        {step === 'initial' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="birthDate" className="text-sm font-medium">
                Data de Nascimento
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-1"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <Button 
              onClick={handleInitialVerification}
              className="w-full bg-epic hover:bg-epic/90"
            >
              Verificar Idade
            </Button>
          </div>
        )}

        {step === 'document' && (
          <div className="space-y-4">
            <Alert className="border-blue-500/20 bg-blue-500/10">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-600">
                <strong>Maior de 18 anos detectado!</strong> Verificação adicional necessária.
              </AlertDescription>
            </Alert>
            
            <div>
              <Label htmlFor="document" className="text-sm font-medium">
                CPF (apenas números)
              </Label>
              <Input
                id="document"
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value.replace(/\D/g, ''))}
                className="mt-1"
                placeholder="00000000000"
                maxLength={11}
              />
            </div>
            
            <Button 
              onClick={handleDocumentVerification}
              className="w-full bg-epic hover:bg-epic/90"
            >
              Verificar Documento
            </Button>
          </div>
        )}

        {step === 'verification' && (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-epic mx-auto"></div>
            <p className="text-sm text-muted-foreground">
              Verificando documento... Isso pode levar alguns segundos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
