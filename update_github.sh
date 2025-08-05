#!/bin/bash

# Script para atualizar o GitHub com todas as novas funcionalidades

echo "🚀 Atualizando repositório GitHub..."

# Verificar status
echo "📋 Status atual:"
git status --short

# Adicionar todos os arquivos
echo -e "\n📦 Adicionando arquivos..."
git add -A

# Criar commit com mensagem detalhada
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

Novos arquivos:
- server/api/ - Implementação completa da API v1
- server/admin/integrations.ts - Gestão de integrações
- client/src/components/admin/AdminIntegrations.tsx
- client/src/components/admin/AdminWebhooks.tsx
- GUIA_API_INTEGRACOES.md - Documentação completa
- TESTE_API_INTEGRACOES.md - Exemplos de uso"

# Enviar para o GitHub
echo -e "\n📤 Enviando para o GitHub..."
git push origin main

echo -e "\n✅ Atualização concluída!"
echo "📊 Últimos commits:"
git log --oneline -5