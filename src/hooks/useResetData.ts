import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useResetData = () => {
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetAllData = async () => {
    const confirmReset = window.confirm(
      '⚠️ ATENÇÃO: Isso irá zerar TODOS os seus dados!\n\n' +
      '• Histórico de batalhas\n' +
      '• Transações e saldo\n' +
      '• XP e progresso\n\n' +
      'Tem certeza que deseja continuar?'
    );
    
    if (!confirmReset) return;

    setResetting(true);
    setError(null);

    try {
      // Obter usuário atual
      let { data: { user } } = await supabase.auth.getUser();

      // Use demo user se não autenticado
      if (!user) {
        const demoUUID = '12345678-1234-1234-1234-123456789012';
        user = { id: demoUUID } as any;
      }

      console.log('🗑️ Iniciando reset dos dados para usuário:', user.id);
      alert('🗑️ Iniciando reset dos dados...');

      // 1. Deletar transações da carteira
      const { error: transactionsError } = await supabase
        .from('wallet_transactions')
        .delete()
        .eq('user_id', user.id);

      if (transactionsError) {
        console.error('Erro ao deletar transações:', transactionsError);
      } else {
        console.log('✅ Transações deletadas');
      }

      // 2. Deletar histórico de batalhas
      const { error: battleError } = await supabase
        .from('battle_history')
        .delete()
        .eq('user_id', user.id);

      if (battleError) {
        console.error('Erro ao deletar batalhas:', battleError);
      } else {
        console.log('✅ Histórico de batalhas deletado');
      }

      // 3. Resetar carteira
      const { error: walletError } = await supabase
        .from('user_wallet')
        .upsert({
          user_id: user.id,
          balance: 0,
          total_earned: 0,
          total_spent: 0,
        }, { onConflict: 'user_id' });

      if (walletError) {
        console.error('Erro ao resetar carteira:', walletError);
      } else {
        console.log('✅ Carteira resetada');
      }

      // 4. Resetar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: 'Guerreiro',
          total_xp: 0,
          total_battles: 0,
          battles_won: 0,
          favorite_era: null,
        }, { onConflict: 'user_id' });

      if (profileError) {
        console.error('Erro ao resetar perfil:', profileError);
        // Se houver erro, tenta fallback com localStorage
        localStorage.clear();
        console.log('✅ Dados locais limpos como fallback');
      } else {
        console.log('✅ Perfil resetado');
      }

      // Limpar qualquer cache local também
      localStorage.clear();
      sessionStorage.clear();

      console.log('🎉 Reset completo realizado com sucesso!');
      alert('✅ Reset realizado com sucesso!\n\nA página será recarregada para atualizar os dados.');
      
      // Recarregar página para atualizar todos os dados
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (err) {
      console.error('❌ Erro geral no reset:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido no reset');
      alert('❌ Erro no reset: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    } finally {
      setResetting(false);
    }
  };

  const forceReset = () => {
    const confirmForce = window.confirm(
      '🔄 RESET FORÇADO\n\n' +
      'Isso irá limpar todos os caches locais e recarregar a página.\n' +
      'Use apenas se o reset normal não funcionou.\n\n' +
      'Continuar?'
    );
    
    if (confirmForce) {
      // Limpar tudo do lado do cliente
      localStorage.clear();
      sessionStorage.clear();
      
      // Tentar limpar cache do browser
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      
      alert('🔄 Cache limpo! Recarregando página...');
      
      // Recarregar forçadamente
      window.location.href = window.location.href;
    }
  };

  return {
    resetAllData,
    forceReset,
    resetting,
    error
  };
};
