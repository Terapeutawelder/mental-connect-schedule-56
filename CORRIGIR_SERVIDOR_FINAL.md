# 🚨 CORREÇÃO URGENTE - SERVIDOR NÃO FUNCIONA

## ❌ PROBLEMAS IDENTIFICADOS:
1. `vite: not found` - Vite não instalado no servidor
2. `Cannot find package 'vite'` - Build importando Vite incorretamente
3. Aplicação crashando (166 bytes apenas)

## ✅ SOLUÇÃO COMPLETA:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. PARAR TUDO
pm2 delete all
pm2 kill

# 2. LIMPAR E REINSTALAR DEPENDÊNCIAS
rm -rf node_modules
rm -rf dist
rm package-lock.json

# 3. INSTALAR DEPENDÊNCIAS GLOBALMENTE
npm install -g vite esbuild typescript tsx

# 4. INSTALAR DEPENDÊNCIAS LOCAIS
npm install

# 5. VERIFICAR SE VITE FOI INSTALADO
which vite
npm list vite

# 6. GERAR BUILD CORRETO
npm run build

# 7. VERIFICAR BUILD GERADO
ls -la dist/
ls -la dist/public/

# 8. CRIAR .env CORRETO
cat > .env << 'EOF'
NODE_ENV=production
DATABASE_URL=postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable
EOF

# 9. TESTAR BUILD DIRETAMENTE
export NODE_ENV=production
export DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable"
node dist/index.js &
BUILD_PID=$!

# 10. AGUARDAR E TESTAR
sleep 15
echo "=== TESTE LOCAL ==="
LOCAL_SIZE=$(curl -s http://127.0.0.1:5000 | wc -c)
echo "Tamanho: $LOCAL_SIZE bytes (deve ser >50KB)"

# 11. VERIFICAR PRODUCTION MODE
curl -s http://127.0.0.1:5000 | grep "vite" && echo "❌ DEV MODE" || echo "✅ PRODUCTION MODE"

# 12. PARAR TESTE
kill $BUILD_PID
sleep 3

# 13. SE FUNCIONOU LOCAL, INICIAR PM2
if [ "$LOCAL_SIZE" -gt 10000 ]; then
    echo "✅ Local funcionando, iniciando PM2..."
    pm2 start dist/index.js --name "conexaomental"
    sleep 20
    
    # 14. VERIFICAR PM2
    pm2 status
    pm2 logs conexaomental --lines 3
    
    # 15. TESTAR COM PM2
    PM2_SIZE=$(curl -s http://127.0.0.1:5000 | wc -c)
    echo "PM2 tamanho: $PM2_SIZE bytes"
    
    # 16. CONFIGURAR NGINX
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    
    # 17. TESTE FINAL DOMÍNIO
    sleep 5
    DOMAIN_SIZE=$(curl -s http://conexaomental.online | wc -c)
    echo "Domínio: $DOMAIN_SIZE bytes"
    
    if [ "$DOMAIN_SIZE" -gt 10000 ]; then
        echo "🎉 SUCESSO! Site funcionando em http://conexaomental.online"
        curl -s http://conexaomental.online | grep -i "sessão de acolhimento" && echo "✅ CONTEÚDO OK"
    else
        echo "❌ Domínio ainda não funciona"
        pm2 logs conexaomental --lines 5
    fi
else
    echo "❌ Build local falhou, verificar logs:"
    ls -la dist/
    cat dist/index.js | head -10
fi
```

## 🎯 RESULTADO ESPERADO:
- ✅ Vite instalado corretamente
- ✅ Build gerado sem erros  
- ✅ Local >50KB funcionando
- ✅ PM2 online estável
- ✅ Domínio >50KB funcionando
- ✅ "Sessão de Acolhimento" encontrado

## ⚠️ SE AINDA FALHAR:
```bash
# Alternativa: usar npm start em vez do build
pm2 delete all
pm2 start "npm start" --name "conexaomental"
```