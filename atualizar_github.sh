#!/bin/bash

echo "🚀 Atualizando repositório GitHub..."
echo "📦 Repositório: https://github.com/Terapeutawelder/mental-connect-schedule-56"
echo ""

# Verificar status
echo "📋 Verificando status..."
git status --short

# Adicionar todos os arquivos
echo -e "\n📦 Adicionando todos os arquivos..."
git add -A

# Verificar o que foi adicionado
echo -e "\n✅ Arquivos preparados para commit:"
git status --short

# Criar commit
echo -e "\n💾 Criando commit..."
git commit -m "feat: API externa completa com webhooks e integrações

- Implementada API REST completa em /api/v1 com autenticação Bearer
- Sistema de webhooks configurável via painel admin
- Integração pronta para N8N, Zapier e ferramentas externas
- Dashboard administrativo com gestão de integrações
- Documentação automática da API em /api/v1/status
- Correções de domínio padronizado para conexaomental.online
- Driver PostgreSQL corrigido (substituído Neon por pg)
- Servidor simplificado sem dependência do Vite
- Frontend compactado disponível em frontend-layouts.tar.gz

Novos arquivos principais:
- server/api/v1/ - API completa
- server/admin/integrations.ts - Gestão de integrações
- client/src/components/admin/AdminIntegrations.tsx
- client/src/components/admin/AdminWebhooks.tsx
- GUIA_API_INTEGRACOES.md - Documentação completa"

# Enviar para GitHub
echo -e "\n📤 Enviando para GitHub..."
echo "⚠️  Se pedir senha, use um Personal Access Token do GitHub"
git push origin main

# Verificar resultado
if [ $? -eq 0 ]; then
    echo -e "\n✅ Atualização concluída com sucesso!"
    echo -e "\n📊 Últimos 5 commits:"
    git log --oneline -5
else
    echo -e "\n❌ Erro ao enviar para GitHub"
    echo "💡 Dica: Crie um Personal Access Token em:"
    echo "   GitHub → Settings → Developer settings → Personal access tokens"
    echo "   Use o token como senha quando solicitado"
fi