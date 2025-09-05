// 🧪 SCRIPT DE TESTE PARA CRIAR USUÁRIO SEM TRIGGER
// Execute este script para testar se o problema é o trigger ou não

import { createClient } from '@supabase/supabase-js';

// ⚠️ IMPORTANTE: Use sua Service Role Key (nunca exponha no frontend!)
const supabase = createClient(
  'https://jidwywpecgmcqduzmvcv.supabase.co',
  'SUA_SERVICE_ROLE_KEY_AQUI' // Substitua pela sua Service Role Key
);

async function criarUsuarioTeste() {
  try {
    console.log('🚀 Iniciando criação de usuário de teste...');

    // 1️⃣ Criar usuário no Auth
    const { data: userData, error: authError } = await supabase.auth.admin.createUser({
      email: 'teste@exemplo.com',
      password: 'SenhaTeste123!',
      email_confirm: true // Já confirma o email
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError);
      return;
    }

    console.log('✅ Usuário criado com sucesso:', userData.user.id);

    const userId = userData.user.id;

    // 2️⃣ Criar perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        display_name: 'Teste Usuario',
        avatar_url: null,
        account_type: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
    } else {
      console.log('✅ Perfil criado com sucesso');
    }

    // 3️⃣ Criar controle de créditos
    const { error: creditError } = await supabase
      .from('user_credit_control')
      .insert({
        user_id: userId,
        total_credits: 0,
        daily_limit: 22.5,
        monthly_limit: 400,
        user_type: 'free'
      });

    if (creditError) {
      console.error('❌ Erro ao criar controle de créditos:', creditError);
    } else {
      console.log('✅ Controle de créditos criado com sucesso');
    }

    // 4️⃣ Criar mérito
    const { error: meritError } = await supabase
      .from('user_merit')
      .insert({
        user_id: userId,
        merit_points: 0,
        level: 1,
        user_type: 'free',
        total_merit_earned: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (meritError) {
      console.error('❌ Erro ao criar mérito:', meritError);
    } else {
      console.log('✅ Mérito criado com sucesso');
    }

    // 5️⃣ Criar carteira
    const { error: walletError } = await supabase
      .from('user_wallet')
      .insert({
        user_id: userId,
        balance: 0,
        total_earned: 0,
        total_spent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (walletError) {
      console.error('❌ Erro ao criar carteira:', walletError);
    } else {
      console.log('✅ Carteira criada com sucesso');
    }

    // 6️⃣ Criar créditos
    const { error: creditsError } = await supabase
      .from('user_credits')
      .insert({
        user_id: userId,
        total_credits: 0,
        available_credits: 0,
        spent_credits: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (creditsError) {
      console.error('❌ Erro ao criar créditos:', creditsError);
    } else {
      console.log('✅ Créditos criados com sucesso');
    }

    // 7️⃣ Criar ranking free
    const { error: freeRankingError } = await supabase
      .from('free_rankings')
      .insert({
        user_id: userId,
        total_points: 0,
        arena_points: 0,
        training_points: 0,
        credits_points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (freeRankingError) {
      console.error('❌ Erro ao criar ranking free:', freeRankingError);
    } else {
      console.log('✅ Ranking free criado com sucesso');
    }

    // 8️⃣ Criar ranking premium
    const { error: premiumRankingError } = await supabase
      .from('premium_rankings')
      .insert({
        user_id: userId,
        total_points: 0,
        arena_points: 0,
        labirinto_points: 0,
        premium_bonus: 100,
        battles_won: 0,
        total_xp: 0,
        accuracy_average: 0,
        current_rank: 999999,
        last_updated: new Date().toISOString()
      });

    if (premiumRankingError) {
      console.error('❌ Erro ao criar ranking premium:', premiumRankingError);
    } else {
      console.log('✅ Ranking premium criado com sucesso');
    }

    // 9️⃣ Criar limites diários
    const { error: dailyLimitsError } = await supabase
      .from('daily_limits')
      .insert({
        user_id: userId,
        daily_credits_earned: 0,
        daily_questions_answered: 0,
        last_reset_date: new Date().toISOString().split('T')[0]
      });

    if (dailyLimitsError) {
      console.error('❌ Erro ao criar limites diários:', dailyLimitsError);
    } else {
      console.log('✅ Limites diários criados com sucesso');
    }

    console.log('🎉 USUÁRIO DE TESTE CRIADO COM SUCESSO!');
    console.log('📧 Email: teste@exemplo.com');
    console.log('🔑 Senha: SenhaTeste123!');
    console.log('🆔 User ID:', userId);

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o script
criarUsuarioTeste();
