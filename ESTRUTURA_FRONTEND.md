# 📁 ESTRUTURA DO FRONTEND - CONEXÃO MENTAL

## 🎯 ARQUIVOS INCLUÍDOS NO PACOTE:

### 📄 **PÁGINAS PRINCIPAIS** (`src/pages/`)
- `HomePage.tsx` - Página inicial com hero e apresentação
- `LoginPage.tsx` - Login de usuários e profissionais  
- `RegisterPage.tsx` - Cadastro de novos usuários
- `DashboardPage.tsx` - Dashboard principal pós-login
- `ProfessionalDashboard.tsx` - Dashboard específico para terapeutas
- `AdminDashboard.tsx` - Painel administrativo completo
- `AppointmentPage.tsx` - Agendamento de consultas
- `VideoCallPage.tsx` - Interface de videochamada
- `ProfilePage.tsx` - Perfil do usuário/profissional
- `PlansPage.tsx` - Planos e assinaturas

### 🧩 **COMPONENTES VISUAIS** (`src/components/`)

#### **Formulários e Cadastros:**
- `ProfessionalForm/` - Formulário completo de cadastro profissional
  - `PersonalDataForm.tsx` - Dados pessoais
  - `ProfessionalDataForm.tsx` - Dados profissionais  
  - `AddressForm.tsx` - Endereço
  - `ScheduleForm.tsx` - Horários de atendimento
  - `TermsAcceptance.tsx` - Aceite de termos

#### **Sistema de Videochamada:**
- `VideoCall/` - Interface completa de videochamada
  - `VideoCallInterface.tsx` - Interface principal
  - `VideoCallHeader.tsx` - Cabeçalho com controles
  - `VideoCallControls.tsx` - Controles de áudio/vídeo
  - `VideoCallStream.tsx` - Stream de vídeo
  - `VideoCallChat.tsx` - Chat da sessão
  - `VideoCallSettings.tsx` - Configurações

#### **Dashboard e Gestão:**
- `AgendaSummary.tsx` - Resumo da agenda
- `AppointmentsSection.tsx` - Seção de agendamentos
- `AppointmentCard.tsx` - Card individual de consulta
- `ReferralSection.tsx` - Sistema de indicações

#### **Painel Administrativo:**
- `admin/AdminRecordings.tsx` - Gestão de gravações
- `admin/AdminReports.tsx` - Relatórios do sistema
- `admin/AdminIntegrations.tsx` - Integrações externas
- `admin/AdminWebhooks.tsx` - Gestão de webhooks

### 🎨 **ESTILOS E ASSETS**
- `src/index.css` - Estilos globais com tema purple
- `src/App.css` - Estilos específicos da aplicação
- `src/assets/` - Imagens e recursos visuais
- `public/` - Arquivos públicos (favicon, manifest)
- `index.html` - Template HTML principal

### 🔧 **CONFIGURAÇÕES**
- `src/App.tsx` - Componente raiz e roteamento
- `src/main.tsx` - Ponto de entrada da aplicação

## 🎯 **CARACTERÍSTICAS DO DESIGN:**

### **Paleta de Cores:**
- **Primária:** Purple gradient (#020817, purple-600/700)
- **Secundária:** White/black para light/dark mode
- **Accent:** Blue e green para status

### **Estilo Visual:**
- **Glass morphism** com backdrop blur
- **Gradientes purple** em botões e elementos
- **Cards com sombra** e bordas arredondadas
- **Layout responsivo** para mobile e desktop
- **Dark mode completo** implementado

### **Componentes UI:**
- **shadcn/ui** - Sistema de componentes base
- **Tailwind CSS** - Framework de estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones modernos

## 📦 **COMO USAR:**

1. **Extrair o arquivo:**
   ```bash
   tar -xzf frontend-layouts.tar.gz
   ```

2. **Estrutura após extração:**
   ```
   client/
   ├── src/
   │   ├── components/
   │   ├── pages/
   │   ├── assets/
   │   └── ...
   ├── public/
   └── index.html
   ```

3. **Tecnologias necessárias:**
   - React 18+ com TypeScript
   - Tailwind CSS
   - shadcn/ui components
   - Vite para build

## 🎨 **DESTAQUES VISUAIS:**

- **Homepage:** Design moderno com hero section e cards de apresentação
- **Login:** Layout lado a lado com background immersivo  
- **Dashboards:** Cards estatísticos e seções funcionais organizadas
- **Videochamada:** Interface completa com controles profissionais
- **Admin:** Painel robusto com todas as funcionalidades de gestão
- **Formulários:** Multi-step com validação visual e feedback

Todos os componentes seguem o design system estabelecido com cores purple, glass morphism e responsividade total.