# 🚀 COMANDOS PARA ATUALIZAR REPOSITÓRIO - TERAPEUTAWELDER

## ⚠️ REPOSITÓRIO JÁ CRIADO

Seu repositório está em: **https://github.com/Terapeutawelder/-clinica-conexao-mental.git**

## 2️⃣ EXECUTAR NO SHELL DO REPLIT

Copie e cole estes comandos:

```bash
# Remover repositório antigo
git remote remove origin

# Adicionar novo repositório (com hífen antes do nome)
git remote add origin https://github.com/Terapeutawelder/-clinica-conexao-mental.git

# Criar branch limpo
git checkout -b main-novo

# Adicionar arquivos essenciais
git add server/ dist/ shared/ *.json *.ts .gitignore README.md replit.md

# Criar commit
git commit -m "feat: Clínica Conexão Mental - Plataforma completa v1.0.0

- Frontend React com TypeScript e Tailwind CSS
- Backend Express com API v1 autenticada
- Integração Mercado Pago (PIX e Cartão)
- Sistema de agendamento completo
- Dashboard administrativo
- API REST com autenticação Bearer
- Webhooks configuráveis
- Integrações N8N e Zapier
- Multi-role: pacientes, profissionais e admin
- Domínio: clinicaconexaomental.online"

# Fazer push
git push -u origin main-novo:main --force
```

## 3️⃣ AUTENTICAÇÃO

Quando pedir:
- **Username:** Terapeutawelder
- **Password:** [Cole seu Personal Access Token]

## 4️⃣ CRIAR TOKEN (se ainda não tem)

1. Acesse: https://github.com/settings/tokens
2. Click em "Generate new token (classic)"
3. Nome: "Replit Deploy"
4. Marque: ✅ repo (todas as opções de repo)
5. Click "Generate token"
6. COPIE O TOKEN IMEDIATAMENTE

## 5️⃣ APÓS O PUSH

Seu repositório estará atualizado em:
**https://github.com/Terapeutawelder/-clinica-conexao-mental**

## 📦 ARQUIVO PARA DOWNLOAD

Se preferir baixar o projeto completo:
- **Arquivo:** `clinica-conexao-mental-completo.tar.gz`
- Contém todo o projeto pronto para deploy

## ✅ VERIFICAR SUCESSO

Após o push, você verá:
```
To https://github.com/Terapeutawelder/clinica-conexao-mental.git
 * [new branch]      main-novo -> main
```

Execute os comandos agora no Shell!