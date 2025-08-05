# DEBUG FINAL - APLICAÇÃO NÃO RESPONDE

## 🔍 PROBLEMA: 
- PM2 mostra "online" mas curl não conecta
- 2 instâncias rodando simultaneamente
- IPv6 tentando conectar (::1) mas falhando

## 🚨 COMANDOS DE DEBUG COMPLETO:

```bash
# 1. LIMPAR TUDO
pm2 delete all
pm2 kill

# 2. VERIFICAR PORTA 5000
netstat -tlnp | grep :5000
lsof -i :5000

# 3. VERIFICAR LOGS DETALHADOS
pm2 logs --lines 50

# 4. TESTAR CONEXÃO DIRETA (forçar IPv4)
curl -4 -v http://127.0.0.1:5000

# 5. INICIAR EM FOREGROUND PARA VER ERROS
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" npm start

# Se der erro, tentar modo desenvolvimento:
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" npm run dev
```

## 🎯 EXECUTE ESTA SEQUÊNCIA COMPLETA:

```bash
# PASSO 1: LIMPEZA TOTAL
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729
pm2 delete all
pm2 kill
pkill -f node
pkill -f npm

# PASSO 2: VERIFICAR PORTAS
echo "=== VERIFICANDO PORTA 5000 ==="
netstat -tlnp | grep :5000
lsof -i :5000

# PASSO 3: TESTAR EM FOREGROUND
echo "=== TESTANDO EM FOREGROUND ==="
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" npm start &
sleep 10

# PASSO 4: TESTAR CONEXÃO
echo "=== TESTANDO CONEXÃO ==="
curl -4 -v http://127.0.0.1:5000
curl -4 -s http://127.0.0.1:5000 | head -10

# PASSO 5: SE NÃO FUNCIONAR, MODO DEV
pkill -f node
pkill -f npm
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" npm run dev &
sleep 10
curl -4 -v http://127.0.0.1:5000
```

## 📋 EXECUTE E ME ENVIE:
1. Resultado do `netstat -tlnp | grep :5000`
2. Resultado do `npm start` em foreground (com erros)
3. Resultado do `curl -4 -v http://127.0.0.1:5000`