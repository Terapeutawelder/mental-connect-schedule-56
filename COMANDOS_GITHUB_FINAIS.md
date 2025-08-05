# 🚀 COMANDOS FINAIS PARA ATUALIZAR GITHUB

Execute estes comandos no servidor:

```bash
# 1. IR PARA O DIRETÓRIO DO PROJETO
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 2. ADICIONAR TODOS OS ARQUIVOS
git add -A

# 3. CRIAR COMMIT
git commit -m "feat: API externa completa com webhooks e integrações

- API REST v1 com autenticação Bearer
- Sistema de webhooks configurável
- Integração N8N/Zapier pronta
- Dashboard admin melhorado
- Correções servidor e domínio"

# 4. ENVIAR PARA GITHUB
git push origin main
```

## SE DER ERRO DE AUTENTICAÇÃO:

```bash
# Configure suas credenciais
git config --global user.name "Terapeutawelder"
git config --global user.email "seu-email@gmail.com"

# Tente novamente
git push origin main
```

Quando pedir senha, use um Personal Access Token do GitHub em vez da senha normal.