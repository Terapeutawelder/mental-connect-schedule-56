# Corrigir Problema DATABASE_URL

## 🔴 PROBLEMA IDENTIFICADO:
- Aplicação não consegue ler o arquivo .env
- DATABASE_URL não está sendo carregado

## 🔧 SOLUÇÃO - Execute no servidor:

### 1. Parar aplicação atual
```bash
pm2 delete all
```

### 2. Verificar localização correta
```bash
pwd
ls -la
```

### 3. Criar arquivo .env corretamente
```bash
cat > .env << 'EOF'
DATABASE_URL=postgresql://cloud_admin@localhost:5432/conexaomental
MERCADO_PAGO_ACCESS_TOKEN=TEST-123456-test
MERCADO_PAGO_PUBLIC_KEY=TEST-123456-test
NODE_ENV=production
PORT=5000
EOF
```

### 4. Verificar se arquivo foi criado
```bash
cat .env
ls -la .env
```

### 5. Testar conexão com banco
```bash
sudo -u postgres psql -d conexaomental -c "SELECT version();"
```

### 6. Rebuild e reiniciar
```bash
npm run build
pm2 start npm --name "conexaomental" -- start
```

### 7. Verificar logs
```bash
pm2 logs conexaomental --lines 5
```

## 🎯 ALTERNATIVA: Usar variáveis de ambiente direto

Se o .env não funcionar, inicie com variáveis diretas:

```bash
pm2 delete all
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental" PORT=5000 NODE_ENV=production pm2 start npm --name "conexaomental" -- start
```

## 🧪 TESTAR FUNCIONAMENTO:

```bash
# Verificar status
pm2 status

# Testar aplicação
curl http://localhost:5000

# Ver logs
pm2 logs conexaomental --lines 10
```

**Execute os comandos acima na sequência e me informe o resultado!**