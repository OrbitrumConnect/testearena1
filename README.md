# 🏛️ Arena do Conhecimento

**Plataforma educacional gamificada com sistema de créditos internos e competições de conhecimento histórico.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/OrbitrumConnect/arenadoconhecimento.git)

## 🎯 **Visão Geral**

Arena do Conhecimento é uma plataforma inovadora que combina educação e gamificação, permitindo que usuários:

- 🎓 **Aprendam História** através de quizzes interativos
- ⚔️ **Compitam em PvP** baseado em habilidade e conhecimento
- 💎 **Ganhem Créditos** por desempenho e participação
- 🏆 **Progridam** através de diferentes eras históricas
- 📈 **Acompanhem** estatísticas e ranking global

## ✨ **Características Principais**

### 🎮 **Sistema de Jogo**
- **4 Eras Históricas**: Egito Antigo, Mesopotâmia, Medieval, Digital
- **Modo Treinamento**: Aprendizado gratuito com recompensas
- **Arena PvP**: Competições 1v1 baseadas em conhecimento
- **Sistema de HP**: Mecânica dinâmica baseada em acertos/erros

### 💰 **Sistema de Créditos Internos**
- **Créditos Sacáveis**: Limitados ao valor depositado
- **Créditos Ganhos**: Apenas para uso interno na plataforma
- **Sistema de 3**: Entrada escalonada (R$20 → R$16 → R$12)
- **Limitação Diária**: Controle de partidas PvP (10/dia)

### 🛡️ **Compliance Legal**
- **CVM Compliant**: Sem promessas de retorno financeiro
- **Skill-Based**: Resultados baseados em habilidade, não sorte
- **Entretenimento Educacional**: Foco em aprendizado
- **Termos Claros**: Distinção entre créditos sacáveis e internos

### 🎵 **Experiência Imersiva**
- **Música Ambiente**: 3 trilhas que se alternam automaticamente
- **Controles de Áudio**: Volume, mute, navegação de faixas
- **Efeitos Visuais**: Partículas e animações temáticas
- **Responsivo**: Otimizado para web e mobile

## 🚀 **Tecnologias Utilizadas**

### **Frontend**
- **React 18** + **TypeScript**
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **React Router** para navegação

### **Backend & Database**
- **Supabase** para backend-as-a-service
- **PostgreSQL** para banco de dados
- **Row Level Security (RLS)** para segurança
- **Real-time subscriptions** para PvP

### **Estado & Hooks**
- **Custom Hooks** para lógica de negócio
- **Local Storage** para persistência offline
- **Context API** para estado global

## 🏗️ **Arquitetura do Sistema**

```
📁 src/
├── 🎮 components/arena/     # Componentes de jogo
├── 🎯 hooks/               # Lógica de negócio
├── 📄 pages/               # Páginas da aplicação
├── 🛠️ utils/               # Utilitários e configurações
├── 🎨 assets/              # Imagens e recursos
└── 🔗 integrations/        # Supabase e APIs
```

### **Principais Módulos**

#### **🎯 Hooks Principais**
- `useDashboard`: Gerencia dados do usuário
- `useEraQuestions`: Sistema de perguntas por era
- `useBattleSave`: Salva resultados e progressão
- `usePvPLimit`: Controla limite diário de partidas
- `useCredits`: Gerencia sistema de créditos

#### **⚖️ Sistema Financeiro**
- `creditsSystem.ts`: Conversão e cálculos de créditos
- `subscriptionSystem.ts`: Sistema de 3 meses
- `gameBalance.ts`: Balanceamento de recompensas

## 📋 **Instalação e Desenvolvimento**

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Conta Supabase (para backend)

### **1️⃣ Clone o Repositório**
```bash
git clone https://github.com/OrbitrumConnect/arenadoconhecimento.git
cd arenadoconhecimento
```

### **2️⃣ Instale Dependências**
```bash
npm install
```

### **3️⃣ Configure Variáveis de Ambiente**
Crie `.env.local` com suas credenciais Supabase:
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### **4️⃣ Execute em Desenvolvimento**
```bash
npm run dev
```

### **5️⃣ Build para Produção**
```bash
npm run build
```

## 🗄️ **Configuração do Banco de Dados**

### **Tabelas Principais**
- `profiles`: Dados dos usuários
- `user_wallet`: Sistema financeiro
- `battle_history`: Histórico de batalhas
- `knowledge_items`: Base de conhecimento
- `user_subscriptions`: Sistema de assinaturas

### **Aplicar Migrações**
```bash
# No diretório supabase/
supabase db reset
```

## 🎮 **Como Jogar**

### **1️⃣ Cadastro**
- Entre na plataforma
- Sistema demo disponível para testes

### **2️⃣ Treinamento**
- Comece pelo Egito Antigo
- Complete quizzes para ganhar XP e créditos
- Desbloqueie novas eras com 30% de progresso

### **3️⃣ Arena PvP**
- Desafie outros jogadores
- Aposte 900 créditos por batalha
- Vencedor leva 1400 créditos, perdedor perde 900

### **4️⃣ Progressão**
- Acompanhe estatísticas no dashboard
- Veja ranking global
- Explore base de conhecimento

## 🔒 **Segurança e Compliance**

### **Proteções Implementadas**
- ✅ Limite diário de partidas PvP
- ✅ Separação clara entre créditos sacáveis/internos
- ✅ Termos de uso específicos sobre natureza dos créditos
- ✅ Sem promessas de retorno financeiro
- ✅ Sistema baseado em habilidade, não sorte

### **Conformidade CVM**
- 🛡️ Créditos internos não conversíveis
- 🛡️ Saque limitado ao valor depositado
- 🛡️ Foco em entretenimento educacional
- 🛡️ Termos legais claros e específicos

## 📱 **Responsividade**

A plataforma é totalmente responsiva e otimizada para:
- 💻 **Desktop**: Layout completo com todas as funcionalidades
- 📱 **Mobile**: Interface compacta sem scroll vertical
- 🎯 **Funcionalidade Idêntica**: Mesmas features em ambas as plataformas

## 🎵 **Sistema de Áudio**

### **Recursos de Áudio**
- 🎼 **3 Trilhas Musicais** em rotação automática
- 🔊 **Controles Completos**: Play/pause, volume, mute
- 🔄 **Navegação de Faixas**: Anterior/próxima
- 🎯 **Persistência**: Música continua entre páginas
- 📱 **Mobile Friendly**: Controles adaptados para touch

## 🚀 **Deploy**

### **Vercel (Recomendado)**
```bash
# Conecte seu repositório GitHub ao Vercel
# Configure as variáveis de ambiente
# Deploy automático a cada push
```

### **Outras Plataformas**
- Netlify
- Railway
- Heroku

## 📊 **Métricas e Analytics**

O sistema inclui tracking abrangente de:
- 📈 **Engajamento**: Tempo na plataforma, páginas visitadas
- 🎯 **Performance**: Taxa de acerto, progressão por era
- 💰 **Financeiro**: Créditos ganhos/gastos, padrões de uso
- 🏆 **Competitivo**: Ranking, vitórias/derrotas PvP

## 🤝 **Contribuição**

### **Como Contribuir**
1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

### **Áreas de Contribuição**
- 📚 **Conteúdo**: Novas perguntas e eras históricas
- 🎮 **Features**: Novos modos de jogo
- 🎨 **UI/UX**: Melhorias visuais
- 🔧 **Performance**: Otimizações técnicas

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 **Suporte**

- 📧 **Email**: suporte@arenadoconhecimento.com
- 💬 **Discord**: [Arena do Conhecimento](discord.gg/arena)
- 📱 **WhatsApp**: +55 (21) 9xxxx-xxxx

---

## 🎯 **Roadmap**

### **Próximas Features**
- 🌍 **Novas Eras**: Renascimento, Revolução Industrial
- 🏆 **Torneios**: Competições sazonais
- 🎓 **Certificados**: Validação de conhecimento
- 🤝 **Guilds**: Sistema de clãs e cooperação
- 📱 **App Mobile**: Versão nativa iOS/Android

### **Melhorias Planejadas**
- 🔊 **Efeitos Sonoros**: Feedback auditivo para ações
- 🎨 **Temas Visuais**: Personalização da interface
- 📊 **Analytics Avançado**: Dashboard detalhado
- 🌐 **Multiplayer**: Batalhas em grupo
- 🎪 **Eventos**: Conteúdo sazonal

---

**🏛️ Arena do Conhecimento - Onde a História se torna Épica! ⚔️**