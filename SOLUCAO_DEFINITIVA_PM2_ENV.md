# SOLUÇÃO DEFINITIVA - PM2 NÃO CARREGA .env

## ✅ COMANDOS DEFINITIVOS:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. PARAR TODOS OS PROCESSOS
pm2 delete all
pm2 kill

# 2. VERIFICAR SE .env EXISTE
cat .env

# 3. INICIAR COM VARIÁVEL EXPLÍCITA
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" pm2 start npm --name "conexaomental" -- start

# 4. OU CRIAR ARQUIVO PM2 ECOSYSTEM
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'conexaomental',
    script: 'npm',
    args: 'start',
    env: {
      DATABASE_URL: 'postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable',
      NODE_ENV: 'production'
    }
  }]
}
EOF

pm2 start ecosystem.config.js

# 5. AGUARDAR E TESTAR
sleep 15
curl -4 -v http://127.0.0.1:5000
curl -v http://conexaomental.online
```

## 🚀 SEQUÊNCIA COMPLETA:
```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729
pm2 delete all
pm2 kill

# Usar método 1 (mais direto)
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" pm2 start npm --name "conexaomental" -- start

sleep 15
pm2 logs conexaomental --lines 5
curl -4 -s http://127.0.0.1:5000 | head -5
curl -v http://conexaomental.online
```