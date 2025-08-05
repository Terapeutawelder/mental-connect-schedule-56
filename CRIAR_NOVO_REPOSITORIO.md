# 🚀 CRIAR NOVO REPOSITÓRIO ATUALIZADO

## 1️⃣ CRIAR REPOSITÓRIO NO GITHUB

1. Acesse: https://github.com/new
2. Configure:
   - **Repository name:** `clinica-conexao-mental`
   - **Description:** "Plataforma de telemedicina para saúde mental com API v1 e integrações"
   - **Public** ou **Private** (sua escolha)
   - ✅ Add README
   - ❌ NÃO adicione .gitignore ou License (já temos)
3. Clique em **"Create repository"**

## 2️⃣ PREPARAR CÓDIGO LIMPO

Execute no Shell do Replit:

```bash
# Criar branch limpo
git checkout -b main-clean

# Adicionar apenas arquivos essenciais
git add server/ client/dist/ shared/ *.json *.ts *.js .gitignore README.md replit.md

# Commit inicial
git commit -m "feat: Clínica Conexão Mental - Plataforma completa

- Frontend React com TypeScript e Tailwind CSS
- Backend Express com API v1 autenticada
- Integração Mercado Pago para pagamentos
- Sistema de agendamento completo
- Dashboard administrativo
- API para integrações externas (N8N, Zapier)
- Webhooks configuráveis
- Multi-role: pacientes, profissionais e admin
- Domínio: clinicaconexaomental.online"
```

## 3️⃣ CONECTAR AO NOVO REPOSITÓRIO

```bash
# Remover repositório antigo
git remote remove origin

# Adicionar novo repositório (SUBSTITUA SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/clinica-conexao-mental.git

# Fazer push inicial
git push -u origin main-clean:main
```

## 4️⃣ AUTENTICAÇÃO

Quando pedir credenciais:
- **Username:** seu-usuario-github
- **Password:** seu-personal-access-token

Para criar token:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Marque: ✅ repo
4. Copie o token

## 5️⃣ ESTRUTURA DO NOVO REPOSITÓRIO

```
clinica-conexao-mental/
├── client/           # Frontend React
│   ├── dist/        # Build de produção
│   └── src/         # Código fonte
├── server/          # Backend Express
│   ├── api/         # API v1
│   └── routes.ts    # Rotas principais
├── shared/          # Schemas compartilhados
├── README.md        # Documentação
├── package.json     # Dependências
└── .gitignore      # Arquivos ignorados
```

## 6️⃣ ATUALIZAR README.MD

Crie um README profissional:

```markdown
# Clínica Conexão Mental 🧠

Plataforma completa de telemedicina para saúde mental desenvolvida com tecnologias modernas.

## 🚀 Tecnologias

- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend:** Node.js, Express, PostgreSQL
- **Pagamentos:** Mercado Pago (PIX e Cartão)
- **Autenticação:** Session-based com roles
- **API:** REST v1 com Bearer Token
- **Integrações:** Webhooks, N8N, Zapier

## 📦 Instalação

\`\`\`bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar em desenvolvimento
npm run dev
\`\`\`

## 🌐 Deploy

Domínio: https://clinicaconexaomental.online

## 📝 Licença

Proprietário
```

## 7️⃣ COMANDOS FINAIS

Após criar o repositório, execute:

```bash
# Verificar status
git status

# Ver repositório configurado
git remote -v

# Adicionar arquivos faltantes (se houver)
git add .
git commit -m "docs: adicionar documentação"
git push origin main
```

## ✅ PRONTO!

Seu novo repositório estará em:
`https://github.com/SEU-USUARIO/clinica-conexao-mental`

Com código limpo, organizado e pronto para deploy!