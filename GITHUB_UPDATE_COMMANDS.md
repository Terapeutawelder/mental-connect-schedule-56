# 🚀 COMANDOS PARA ATUALIZAR O GITHUB

Como não posso executar comandos git diretamente, execute você mesmo:

## 📋 OPÇÃO 1 - USAR O SCRIPT:
```bash
./update_github.sh
```

## 📋 OPÇÃO 2 - COMANDOS MANUAIS:

```bash
# 1. Adicionar todos os arquivos
git add -A

# 2. Criar commit detalhado
git commit -m "feat: API externa completa com webhooks e integrações

- Implementada API REST completa em /api/v1 com autenticação Bearer
- Sistema de webhooks configurável via painel admin
- Integração pronta para N8N, Zapier e ferramentas externas
- Dashboard administrativo com gestão de integrações
- Documentação automática da API em /api/v1/status
- Correções de domínio padronizado para clinicaconexaomental.online
- Driver PostgreSQL corrigido (substituído Neon por pg)
- Servidor simplificado sem dependência do Vite
- Frontend compactado disponível em frontend-layouts.tar.gz"

# 3. Enviar para o GitHub
git push origin main
```

## 🔐 SE PEDIR AUTENTICAÇÃO:

1. **Crie um Personal Access Token:**
   - Vá em: GitHub → Settings → Developer settings → Personal access tokens
   - Clique em "Generate new token (classic)"
   - Selecione os escopos necessários (repo)
   - Copie o token gerado

2. **Use o token no lugar da senha:**
   - Username: seu-usuario-github
   - Password: cole-o-token-aqui

## 📁 PRINCIPAIS MUDANÇAS:

### **Backend:**
- `/server/api/` - API v1 completa
- `/server/admin/` - Rotas administrativas
- `/server/simple-server.ts` - Servidor sem Vite

### **Frontend:**
- Dashboard admin melhorado
- Componentes de integração
- Gestão de webhooks

### **Documentação:**
- `GUIA_API_INTEGRACOES.md`
- `TESTE_API_INTEGRACOES.md`
- Múltiplos guias de correção

Execute os comandos acima no terminal para atualizar seu repositório!