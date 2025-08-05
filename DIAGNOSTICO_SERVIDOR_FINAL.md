# 🔍 DIAGNÓSTICO SERVIDOR - 0 BYTES RETORNADOS

## ✅ PROBLEMA IDENTIFICADO:
- PM2 iniciado com sucesso (status: online)
- Mas curl retorna 0 bytes
- Possível problema: aplicação não subiu na porta 5000

## 🚀 COMANDOS PARA DIAGNOSTICAR E CORRIGIR:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. VERIFICAR LOGS DO PM2
pm2 logs conexaomental --lines 20

# 2. VERIFICAR SE PORTA 5000 ESTÁ ABERTA
netstat -tlnp | grep :5000
ss -tlnp | grep :5000

# 3. TESTAR APLICAÇÃO LOCAL DIRETAMENTE
curl -v http://127.0.0.1:5000

# 4. VERIFICAR STATUS DETALHADO PM2
pm2 describe conexaomental

# 5. SE NÃO ESTIVER FUNCIONANDO, RESTART COM LOGS
pm2 delete all
pm2 start npm --name "conexaomental" -- start --log-type json

# 6. AGUARDAR 30 SEGUNDOS E TESTAR
sleep 30
curl -s http://127.0.0.1:5000 | wc -c

# 7. SE AINDA NÃO FUNCIONAR, RODAR EM FOREGROUND PARA DEBUG
pm2 delete all
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" NODE_ENV=production npm start

# 8. EM OUTRA SESSÃO, TESTAR
curl -v http://127.0.0.1:5000
```

## 🎯 POSSÍVEIS CAUSAS:
1. Aplicação não conseguiu conectar no banco
2. Erro no build/código
3. Porta 5000 ocupada por outro processo
4. Problema com variáveis de ambiente

## 🔧 SOLUÇÃO ALTERNATIVA:
Se nada funcionar, usar arquivo .env:
```bash
echo 'DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable"' > .env
echo 'NODE_ENV=production' >> .env
pm2 restart conexaomental
```