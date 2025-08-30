import { KnowledgeViewer } from '@/components/knowledge/KnowledgeViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Knowledge = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-gradient-subtle`}>
      {/* Header */}
      <div className={`container mx-auto ${isMobile ? 'px-0 py-4 h-full overflow-y-auto' : 'px-4 py-6'}`}>
        <div className={`flex items-center ${isMobile ? 'justify-between px-4 mb-4' : 'justify-between mb-6'}`}>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/app')}
            className={`gap-2 ${isMobile ? 'text-sm px-2' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          
          <div className={`flex items-center gap-2 text-epic ${isMobile ? 'text-sm' : ''}`}>
            <Database className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            <span className="font-bold">{isMobile ? 'Conhecimento' : 'Arena do Conhecimento'}</span>
          </div>
        </div>
        
        <KnowledgeViewer />
      </div>
    </div>
  );
};

export default Knowledge;