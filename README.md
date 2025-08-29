# 🏛️ Arena do Conhecimento

## 📝 Descrição
Plataforma educativa gamificada onde usuários batalham com conhecimento histórico e ganham créditos através de treinos e PvP em diferentes eras da humanidade.

## ⚔️ Eras Disponíveis
- 🏛️ **Egito Antigo** (3000-2900 a.C.)
- 📜 **Mesopotâmia** (2900-2800 a.C.) 
- ⚔️ **Era Medieval** (1000-1100 d.C.)
- 💻 **Era Digital** (2000-2100 d.C.)
- 🌍 **Mundo Real** (2024 - Atual)

## 🎮 Funcionalidades

### 👥 Sistema de Usuários
- **FREE**: 3 treinos/dia (sem ganhos)
- **PAID**: Acesso completo com recompensas
- **VIP**: Acesso gratuito especial
- **BANNED**: Bloqueado pelo admin

### 🎯 Modos de Jogo
- **Treinos**: 9 por dia, ganho de XP e créditos
- **PvP**: 3 batalhas/dia contra outros jogadores
- **Arena**: Batalhas temáticas por era
- **Torneios**: Competições especiais (em desenvolvimento)

### 💰 Sistema Financeiro
- **Créditos Internos**: Moeda da plataforma
- **Sistema de Percepção**: R$ 0,05 por crédito ganho
- **Limite de Saque**: R$ 20 (Sistema de 3)
- **Decay Mensal**: 27,05% ao dia útil

### 🛡️ Admin Dashboard
- **Acesso**: Restrito a phpg69@gmail.com
- **Gestão**: Usuários, finanças, analytics
- **Controles**: Ban, VIP, estatísticas
- **EVO**: Área para evolução da plataforma

## 🛠️ Tecnologias

### Frontend
- **React** + **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Shadcn/UI** (Components)
- **React Router** (Navigation)

### Backend
- **Supabase** (Database + Auth)
- **PostgreSQL** (Database)
- **Row Level Security** (RLS)
- **Real-time Subscriptions**

### Deploy
- **Vercel** (Frontend Hosting)
- **Supabase** (Backend as a Service)

## 🚀 Como Executar

### Desenvolvimento Local
```bash
# Clone o repositório
git clone https://github.com/phpg69/arena-do-conhecimento.git

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute o projeto
npm run dev
```

### Variáveis de Ambiente
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Responsividade
- ✅ **Mobile First**: Otimizado para dispositivos móveis
- ✅ **Desktop**: Interface completa para telas grandes
- ✅ **Tablet**: Adaptação automática
- ✅ **PWA Ready**: Funciona como app nativo

## 🎨 Design System
- **Tema**: Arena/Medieval inspirado
- **Cores**: Epic, Battle, Victory, Legendary
- **Tipografia**: Montserrat + Inter
- **Animações**: Smooth transitions

## 🔐 Segurança
- **Autenticação**: Supabase Auth
- **Autorização**: RLS Policies
- **Admin**: Acesso restrito por email
- **Dados**: Criptografia em trânsito

## 📊 Analytics
- **Usuários**: Tracking completo
- **Financeiro**: Receitas e gastos
- **Engajamento**: Tempo de sessão
- **Performance**: Métricas de jogo

## 🎯 Roadmap
- [ ] Sistema de Torneios (10/mês)
- [ ] Ranking Global Dinâmico
- [ ] Notificações Push
- [ ] Chat em Tempo Real
- [ ] Mobile App (React Native)
- [ ] IA para Questões Dinâmicas

## 📄 Licença
MIT License - Livre para uso educacional

## 👨‍💻 Desenvolvedor
**Pedro Henrique** (phpg69@gmail.com)
- Admin da plataforma
- Desenvolvedor Full Stack
- Game Designer

---

🏛️ **Arena do Conhecimento** - Transformando educação em aventura épica! ⚔️