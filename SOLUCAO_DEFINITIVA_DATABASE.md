# SOLUÇÃO DEFINITIVA - ERRO DE CERTIFICADO SSL

## 🔍 PROBLEMA:
O banco Neon está configurado para `conexaomental.online` mas o servidor tenta conectar via `localhost`, causando erro de certificado SSL.

## ✅ SOLUÇÃO DEFINITIVA:

### 1. CONFIGURAR DATABASE_URL CORRETO NO .env:
```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# Criar arquivo .env com DATABASE_URL correto
cat > .env << 'EOF'
DATABASE_URL="postgresql://cloud_admin@conexaomental.online:5432/conexaomental?sslmode=require"
NODE_ENV=production
EOF

# OU, se precisar desabilitar SSL (menos seguro):
cat > .env << 'EOF'
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable"
NODE_ENV=production
EOF
```

### 2. REINICIAR COM ARQUIVO .env:
```bash
pm2 delete all

# Usar o arquivo .env (PM2 carrega automaticamente)
pm2 start npm --name "conexaomental" -- start

# Aguardar inicialização
sleep 15

# Testar
curl -s http://localhost:5000 | head -10
curl -s http://localhost:5000 | grep -i "planos\|faq"
```

### 3. SE AINDA NÃO FUNCIONAR, FORÇA A VARIÁVEL:
```bash
pm2 delete all

# Forçar variável com hostname correto
DATABASE_URL="postgresql://cloud_admin@conexaomental.online:5432/conexaomental?sslmode=require" pm2 start npm --name "conexaomental" -- start

# OU sem SSL:
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" pm2 start npm --name "conexaomental" -- start

sleep 15
curl -v http://localhost:5000
```

## 🎯 EXECUTE ESTA SEQUÊNCIA:
```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729
pm2 delete all

# Tentar com hostname correto primeiro
cat > .env << 'EOF'
DATABASE_URL="postgresql://cloud_admin@conexaomental.online:5432/conexaomental?sslmode=require"
NODE_ENV=production
EOF

pm2 start npm --name "conexaomental" -- start
sleep 15
curl -s http://localhost:5000 | head -10

# Se não funcionar, usar localhost sem SSL
pm2 delete all
cat > .env << 'EOF'
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable"
NODE_ENV=production
EOF

pm2 start npm --name "conexaomental" -- start
sleep 15
curl -s http://localhost:5000 | head -10
curl -s http://localhost:5000 | grep -i "planos\|faq"
```