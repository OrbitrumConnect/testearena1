# 🚀 Deploy - Arena do Conhecimento

## 📋 Checklist Pré-Deploy

### ✅ Funcionalidades Implementadas

- **🎮 Sistema de Treinamento**
  - 4 Eras completas (Egito, Mesopotâmia, Medieval, Digital)
  - 9 partidas gratuitas por dia (aumento implementado)
  - Animações sincronizadas e responsivas
  - Timer corrigido (não reseta entre perguntas)

- **👥 Sistema de Usuários**
  - Cadastro com email habilitado no Supabase
  - Dashboard administrativo completo
  - Tipos de usuário: free, paid, vip, banned
  - Perfis e estatísticas detalhadas

- **💰 Sistema PIX**
  - Solicitação de R$ 20 por usuário/mês
  - Dashboard admin para envio por CPF
  - Interface para coleta de CPF dos usuários
  - Sistema de rastreamento de solicitações

## 🔧 Configuração para Deploy

### 1. Supabase
```sql
-- Verificar tabelas existentes:
-- ✅ profiles
-- ✅ user_wallet  
-- ✅ battle_history
-- ✅ wallet_transactions

-- Adicionar campos necessários:
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cpf TEXT;
```

### 2. Variáveis de Ambiente (Vercel)
```
VITE_SUPABASE_URL=https://jidwywpecgmcqduzmvcv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Configurações Supabase Dashboard
- **Authentication > Settings**
  - ✅ Enable email confirmations: OFF (desenvolvimento)
  - ✅ Enable email auth: ON
  - ✅ Auto confirm users: ON (desenvolvimento)
  
- **API > Settings**
  - ✅ Enable Row Level Security (RLS) nas tabelas sensíveis

## 🎯 Funcionalidades Principais

### Para Usuários
1. **Cadastro/Login** com email
2. **9 treinos gratuitos** por dia
3. **Dashboard pessoal** com estatísticas
4. **Solicitação PIX** de R$ 20/mês
5. **4 eras diferentes** com armas únicas

### Para Administradores
1. **Dashboard Admin** (`/admin-dashboard`)
2. **Visualizar todos usuários** e emails
3. **Alterar tipos** de usuário (free/paid/vip/banned)
4. **Enviar PIX** via CPF com um clique
5. **Monitorar solicitações** PIX pendentes

## 🚀 Deploy Steps

### GitHub
```bash
git add .
git commit -m "feat: Sistema completo com PIX e admin dashboard"
git push origin main
```

### Vercel
1. Conectar repositório GitHub
2. Adicionar variáveis de ambiente
3. Deploy automático

## 🔐 Acesso Admin
- Acesse: `/admin-dashboard`
- Botão 🛠️ no dashboard principal
- Visualize usuários, emails, estatísticas
- Gerencie tipos de usuário
- Processe PIX com CPF

## 💡 Melhorias Futuras
- ✅ API PIX real (Mercado Pago/PagBank)
- ✅ Notificações push
- ✅ Sistema de referência
- ✅ Marketplace de itens
- ✅ Torneios semanais

## 📱 URLs Importantes
- **App Principal**: `/app`
- **Dashboard Usuário**: `/dashboard`  
- **Dashboard Admin**: `/admin-dashboard`
- **Treinamentos**: `/training`, `/mesopotamia`, `/medieval`, `/digital`

## 🎮 Características Técnicas
- **React + TypeScript**
- **Supabase (Auth + Database)**
- **Tailwind CSS**
- **Vite Build**
- **Vercel Deploy**
- **Sistema PIX Simulado**
