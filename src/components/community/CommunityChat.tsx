import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Send, AlertTriangle, Shield, Users, Clock } from 'lucide-react';

interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  timestamp: string;
  is_moderated: boolean;
  warning_count: number;
}

interface UserWarning {
  id: string;
  user_id: string;
  reason: string;
  timestamp: string;
  expires_at: string;
}

export const CommunityChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userWarnings, setUserWarnings] = useState<UserWarning[]>([]);
  const [canChat, setCanChat] = useState(true);
  const [chatTimeout, setChatTimeout] = useState<Date | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // REGRAS DO CHAT
  const chatRules = [
    "🚫 Sem spam ou mensagens repetitivas",
    "🚫 Sem conteúdo ofensivo ou inadequado",
    "🚫 Sem divulgação de informações pessoais",
    "✅ Mantenha o foco no conhecimento e aprendizado",
    "✅ Respeite outros usuários",
    "✅ Use linguagem apropriada"
  ];

  // SISTEMA DE ADVERTÊNCIAS
  const warningSystem = {
    1: "⚠️ Primeira advertência - 15 minutos de timeout",
    2: "🚨 Segunda advertência - 1 hora de timeout", 
    3: "🔒 Terceira advertência - 24 horas de timeout"
  };

  useEffect(() => {
    loadCurrentUser();
    loadMessages();
    loadUserWarnings();
    
    // Real-time subscription para mensagens
    const messagesSubscription = supabase
      .channel('chat_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, []);

  const loadCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('is_moderated', false)
        .order('timestamp', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserWarnings = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('user_warnings')
        .select('*')
        .eq('user_id', currentUser.id)
        .gte('expires_at', new Date().toISOString());

      if (error) throw error;
      setUserWarnings(data || []);
      
      // Verificar se usuário está em timeout
      const activeWarning = data?.find(w => new Date(w.expires_at) > new Date());
      if (activeWarning) {
        setCanChat(false);
        setChatTimeout(new Date(activeWarning.expires_at));
      }
    } catch (error) {
      console.error('Erro ao carregar advertências:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !canChat) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: currentUser.id,
          username: currentUser.email?.split('@')[0] || 'Usuário',
          message: newMessage.trim(),
          timestamp: new Date().toISOString(),
          is_moderated: false,
          warning_count: 0
        });

      if (error) throw error;
      
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getWarningLevel = () => {
    if (userWarnings.length === 0) return 0;
    return Math.min(userWarnings.length, 3);
  };

  const getTimeoutMessage = () => {
    if (!chatTimeout) return '';
    
    const now = new Date();
    const timeLeft = chatTimeout.getTime() - now.getTime();
    
    if (timeLeft <= 0) {
      setCanChat(true);
      setChatTimeout(null);
      return '';
    }
    
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    return `⏰ Chat bloqueado por ${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="w-5 h-5" />
          Chat da Comunidade
          <Badge variant="secondary" className="ml-auto">
            <Users className="w-3 h-3 mr-1" />
            {messages.length > 0 ? messages.length : '0'} usuários
          </Badge>
        </CardTitle>
        
        {/* REGRAS DO CHAT */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="font-semibold text-foreground">📋 Regras do Chat:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {chatRules.map((rule, index) => (
              <div key={index} className="flex items-center gap-1">
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* SISTEMA DE ADVERTÊNCIAS */}
        {getWarningLevel() > 0 && (
          <Alert className={`border-${getWarningLevel() === 3 ? 'destructive' : 'warning'}`}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold">
                {warningSystem[getWarningLevel() as keyof typeof warningSystem]}
              </div>
              <div className="text-xs mt-1">
                Advertências ativas: {userWarnings.length}/3
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* TIMEOUT MESSAGE */}
        {!canChat && (
          <Alert className="border-destructive">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              {getTimeoutMessage()}
            </AlertDescription>
          </Alert>
        )}

        {/* MENSAGENS */}
        <div className="h-64 overflow-y-auto border rounded-lg p-3 space-y-2 bg-muted/20">
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando mensagens...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Seja o primeiro a enviar uma mensagem! 🚀
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">
                    {msg.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{msg.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    {msg.warning_count > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        ⚠️ {msg.warning_count}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm break-words">{msg.message}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT DE MENSAGEM */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={canChat ? "Digite sua mensagem..." : "Chat bloqueado temporariamente"}
            disabled={!canChat || loading}
            maxLength={500}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !canChat || loading}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* CONTADOR DE CARACTERES */}
        <div className="text-xs text-muted-foreground text-right">
          {newMessage.length}/500 caracteres
        </div>

        {/* INFO DO SISTEMA */}
        <div className="text-xs text-muted-foreground text-center border-t pt-2">
          <Shield className="w-3 h-3 inline mr-1" />
          Chat moderado automaticamente • Mensagens são revisadas
        </div>
      </CardContent>
    </Card>
  );
};
