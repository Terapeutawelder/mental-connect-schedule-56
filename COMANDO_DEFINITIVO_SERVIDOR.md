# 🎯 COMANDO DEFINITIVO - SERVIDOR SIMPLES

## ✅ SOLUÇÃO SEM VITE:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# PARAR TUDO
pm2 delete all
pm2 kill

# TESTAR SERVIDOR SIMPLES SEM VITE
export NODE_ENV=development
export DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable"
tsx server/simple-server.ts &
SIMPLE_PID=$!

# AGUARDAR E TESTAR
sleep 20
echo "=== TESTE SERVIDOR SIMPLES ==="
SIMPLE_SIZE=$(curl -s http://127.0.0.1:5000 | wc -c)
echo "Servidor simples: $SIMPLE_SIZE bytes"

if [ "$SIMPLE_SIZE" -gt 500 ]; then
    echo "✅ SERVIDOR SIMPLES FUNCIONANDO!"
    curl -s http://127.0.0.1:5000 | head -3
    
    # PARAR E CRIAR PM2 COM SERVIDOR SIMPLES
    kill $SIMPLE_PID
    sleep 3
    
    # ECOSYSTEM COM SERVIDOR SIMPLES
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'conexaomental',
    script: 'tsx',
    args: 'server/simple-server.ts',
    env: {
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable'
    }
  }]
}
EOF
    
    # INICIAR PM2
    pm2 start ecosystem.config.js
    sleep 30
    
    # TESTE FINAL
    echo "=== TESTE FINAL ==="
    FINAL_SIZE=$(curl -s http://conexaomental.online | wc -c)
    echo "Domínio final: $FINAL_SIZE bytes"
    
    if [ "$FINAL_SIZE" -gt 500 ]; then
        echo "🎉 SUCESSO TOTAL!"
        curl -s http://conexaomental.online | grep -i "mental" && echo "✅ CONTEÚDO OK"
        pm2 status
    else
        echo "❌ Falha final, logs:"
        pm2 logs conexaomental --lines 5
    fi
else
    echo "❌ Servidor simples falhou:"
    kill $SIMPLE_PID 2>/dev/null
    ls -la server/simple-server.ts
    ls -la client/
fi
```

## 🎯 VANTAGENS SERVIDOR SIMPLES:
- ✅ Não usa Vite (sem imports problemáticos)
- ✅ Serve arquivos estáticos do client/ diretamente
- ✅ Mantém todas as APIs funcionando
- ✅ Mais estável e simples