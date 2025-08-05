# 🎯 COMANDO FINAL - TSX DIRETO

## EXECUTE AGORA NO SERVIDOR:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# PARAR PM2 QUE ESTÁ FALHANDO
pm2 delete all
pm2 kill

# TESTAR TSX DIRETAMENTE
export NODE_ENV=development
export DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable"
tsx server/index.ts &
TSX_PID=$!

# AGUARDAR 20 SEGUNDOS
sleep 20

# TESTAR SE FUNCIONA
echo "=== TESTE LOCAL ==="
LOCAL_SIZE=$(curl -s http://127.0.0.1:5000 | wc -c)
echo "Local: $LOCAL_SIZE bytes"

if [ "$LOCAL_SIZE" -gt 1000 ]; then
    echo "✅ TSX FUNCIONANDO!"
    curl -s http://127.0.0.1:5000 | head -5
    
    # PARAR TSX E CRIAR PM2 CORRETO
    kill $TSX_PID
    sleep 3
    
    # CRIAR ECOSYSTEM CORRETO
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'conexaomental',
    script: 'tsx',
    args: 'server/index.ts',
    env: {
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable'
    }
  }]
}
EOF
    
    # INICIAR PM2 COM TSX
    pm2 start ecosystem.config.js
    
    # AGUARDAR E TESTAR FINAL
    sleep 30
    echo "=== TESTE PM2 ==="
    PM2_SIZE=$(curl -s http://127.0.0.1:5000 | wc -c)
    echo "PM2: $PM2_SIZE bytes"
    
    echo "=== TESTE DOMÍNIO ==="
    DOMAIN_SIZE=$(curl -s http://conexaomental.online | wc -c)
    echo "Domínio: $DOMAIN_SIZE bytes"
    
    if [ "$DOMAIN_SIZE" -gt 1000 ]; then
        echo "🎉 SUCESSO TOTAL!"
        curl -s http://conexaomental.online | grep -i "sessão de acolhimento" && echo "✅ CONTEÚDO ENCONTRADO"
        curl -s http://conexaomental.online | grep -i "planos" && echo "✅ PLANOS ENCONTRADOS"
    else
        echo "❌ Domínio não funciona, verificar PM2:"
        pm2 logs conexaomental --lines 3
    fi
else
    echo "❌ TSX falhou, verificar erro:"
    kill $TSX_PID 2>/dev/null
    ls -la server/index.ts
    tsx --version
fi
```

## 🎯 RESULTADO ESPERADO:
- ✅ TSX funciona local >1KB
- ✅ PM2 com ecosystem.config.js estável  
- ✅ Domínio >1KB funcionando
- ✅ "Sessão de Acolhimento" e "Planos" encontrados