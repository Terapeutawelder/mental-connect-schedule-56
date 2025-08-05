# 🎯 FORÇAR PRODUCTION MODE - SOLUÇÃO DEFINITIVA

## ❌ PROBLEMA: Aplicação roda em development mesmo com NODE_ENV=production

## ✅ SOLUÇÃO COMPLETA NO SERVIDOR:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. PARAR TUDO COMPLETAMENTE
pm2 delete all
pm2 kill
pkill -f npm
pkill -f node

# 2. VERIFICAR SE PAROU
ps aux | grep -E "(npm|node)" | grep -v grep

# 3. CRIAR .env EXPLÍCITO
cat > .env << 'EOF'
DATABASE_URL=postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable
NODE_ENV=production
EOF

# 4. EXPORTAR VARIÁVEIS EXPLICITAMENTE
export NODE_ENV=production
export DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable"

# 5. VERIFICAR BUILD EXISTE
ls -la dist/index.js
ls -la dist/public/

# 6. TESTAR BUILD DIRETAMENTE
node dist/index.js &
sleep 10
curl -s http://127.0.0.1:5000 | head -10
pkill -f "node dist"

# 7. RESTART PM2 COM VARIÁVEIS EXPLÍCITAS
pm2 start dist/index.js --name "conexaomental" --node-args="--env-file=.env"

# 8. OU ALTERNATIVA COM NPM START FORÇADO
pm2 delete all
NODE_ENV=production DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" pm2 start "NODE_ENV=production npm start" --name "conexaomental"

# 9. AGUARDAR INICIALIZAÇÃO
sleep 30

# 10. TESTAR SE ESTÁ EM PRODUCTION
curl -s http://127.0.0.1:5000 | grep -E "(vite|development)" && echo "❌ AINDA EM DEV" || echo "✅ EM PRODUCTION"

# 11. TESTAR TAMANHO DA RESPOSTA
LOCAL_SIZE=$(curl -s http://127.0.0.1:5000 | wc -c)
echo "Tamanho resposta: $LOCAL_SIZE bytes"

# 12. SE FUNCIONAR LOCAL, TESTAR DOMÍNIO
curl -s http://conexaomental.online | wc -c
```

## 🎯 RESULTADO ESPERADO:
- Não deve aparecer `/@vite/client` no HTML
- Deve carregar arquivos de `dist/public/`
- Resposta >50KB com conteúdo estático
- Domínio funcionando sem Connection Refused