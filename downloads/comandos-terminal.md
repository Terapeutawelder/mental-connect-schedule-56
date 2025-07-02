# 🖥️ Comandos do Terminal - Passo a Passo

## 🚀 Instalação Completa

### 1. Conectar ao servidor
```bash
ssh root@157.173.120.220
```

### 2. Fazer upload dos arquivos
```bash
# No seu computador local, fazer upload para o servidor
scp -r downloads/* root@157.173.120.220:/tmp/conexao-mental-api/

# Ou usando rsync (recomendado)
rsync -avz downloads/ root@157.173.120.220:/tmp/conexao-mental-api/
```

### 3. No servidor, executar instalação
```bash
# Ir para o diretório
cd /tmp/conexao-mental-api

# Dar permissão de execução
chmod +x install-api.sh

# Executar instalação automática
./install-api.sh
```

**⏱️ Tempo estimado: 3-5 minutos**

---

## ✅ Verificação da Instalação

### Verificar se tudo está funcionando
```bash
# 1. Status da API
pm2 status

# 2. Testar API localmente
curl http://localhost:3001/api/health

# 3. Testar API externamente
curl https://clinicaconexaomental.online/api/health

# 4. Status do Nginx
systemctl status nginx

# 5. Verificar portas abertas
netstat -tlnp | grep -E "(3001|80|443)"
```

---

## 🔧 Comandos de Manutenção

### Gerenciar a API
```bash
# Ver logs em tempo real
pm2 logs conexao-mental-api

# Reiniciar API
pm2 restart conexao-mental-api

# Parar API
pm2 stop conexao-mental-api

# Iniciar API
pm2 start conexao-mental-api

# Ver monitoramento
pm2 monit
```

### Gerenciar Nginx
```bash
# Testar configuração
nginx -t

# Recarregar configuração
systemctl reload nginx

# Reiniciar Nginx
systemctl restart nginx

# Ver logs de acesso
tail -f /var/log/nginx/access.log

# Ver logs de erro
tail -f /var/log/nginx/error.log
```

---

## 🔐 Configurar SSL (Certificado HTTPS)

### Instalar e configurar certificado SSL
```bash
# 1. Instalar Certbot
apt update
apt install certbot python3-certbot-nginx

# 2. Obter certificado SSL
certbot --nginx -d clinicaconexaomental.online -d www.clinicaconexaomental.online

# 3. Testar renovação automática
certbot renew --dry-run

# 4. Ver certificados instalados
certbot certificates
```

---

## 🧪 Testes da API

### Testar endpoints principais
```bash
# 1. Health Check
curl https://clinicaconexaomental.online/api/health

# 2. Teste de cadastro
curl -X POST https://clinicaconexaomental.online/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinica.com",
    "password": "admin123",
    "full_name": "Administrador",
    "role": "admin"
  }'

# 3. Teste de login
curl -X POST https://clinicaconexaomental.online/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinica.com",
    "password": "admin123"
  }'

# 4. Teste com token (substitua TOKEN_AQUI pelo token recebido no login)
curl -H "Authorization: Bearer TOKEN_AQUI" \
     https://clinicaconexaomental.online/api/auth/me
```

---

## 📊 Monitoramento

### Ver informações do sistema
```bash
# 1. Status geral do servidor
/usr/local/bin/server-status

# 2. Uso de recursos
htop

# 3. Espaço em disco
df -h

# 4. Memória
free -h

# 5. Processos da aplicação
ps aux | grep -E "(node|pm2|nginx)"
```

### Logs importantes
```bash
# 1. Logs da API (últimas 50 linhas)
pm2 logs conexao-mental-api --lines 50

# 2. Logs do sistema
tail -f /var/log/syslog

# 3. Logs do PostgreSQL
tail -f /var/log/postgresql/postgresql-*.log

# 4. Logs do Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🔧 Comandos de Backup

### Backup manual da API
```bash
# 1. Criar backup dos arquivos da API
tar -czf /opt/backups/api-backup-$(date +%Y%m%d-%H%M%S).tar.gz /opt/conexaomental/api

# 2. Backup do banco (já configurado automaticamente)
/opt/conexaomental/scripts/backup-db.sh

# 3. Ver backups existentes
ls -la /opt/backups/
```

---

## 🚨 Resolução de Problemas

### Problema: API não responde
```bash
# 1. Verificar se está rodando
pm2 status

# 2. Ver logs de erro
pm2 logs conexao-mental-api --err

# 3. Reiniciar se necessário
pm2 restart conexao-mental-api

# 4. Verificar porta
netstat -tlnp | grep 3001
```

### Problema: Erro 502 Bad Gateway
```bash
# 1. Verificar API
curl http://localhost:3001/api/health

# 2. Verificar configuração Nginx
nginx -t

# 3. Ver logs Nginx
tail -f /var/log/nginx/error.log

# 4. Reiniciar Nginx se necessário
systemctl restart nginx
```

### Problema: Erro de conexão com banco
```bash
# 1. Testar conexão PostgreSQL
psql -h localhost -U postgres -d conexaomental -c "SELECT version();"

# 2. Verificar se o banco existe
psql -h localhost -U postgres -l | grep conexaomental

# 3. Status do PostgreSQL
systemctl status postgresql
```

### Problema: Frontend não consegue acessar API
```bash
# 1. Verificar CORS no Nginx
cat /etc/nginx/sites-available/conexaomental | grep -A 10 "CORS"

# 2. Testar CORS
curl -H "Origin: https://clinicaconexaomental.online" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://clinicaconexaomental.online/api/auth/signin

# 3. Verificar logs do navegador (F12 > Console)
```

---

## 🔄 Atualizações

### Atualizar código da API
```bash
# 1. Parar aplicação
pm2 stop conexao-mental-api

# 2. Fazer backup
cp -r /opt/conexaomental/api /opt/conexaomental/api-backup-$(date +%Y%m%d)

# 3. Copiar novos arquivos
# (fazer upload dos arquivos atualizados)

# 4. Instalar dependências (se necessário)
cd /opt/conexaomental/api
npm install

# 5. Reiniciar aplicação
pm2 restart conexao-mental-api
```

---

## 📋 Checklist de Instalação

Marque conforme for completando:

- [ ] ✅ Conectar ao servidor
- [ ] ✅ Fazer upload dos arquivos
- [ ] ✅ Executar `install-api.sh`
- [ ] ✅ API respondendo no health check
- [ ] ✅ Nginx funcionando
- [ ] ✅ Configurar SSL (certbot)
- [ ] ✅ Testar cadastro de usuário
- [ ] ✅ Testar login
- [ ] ✅ Frontend conectando com API
- [ ] ✅ Configurar monitoramento

---

## 📞 Informações de Contato

- **API URL**: https://clinicaconexaomental.online/api
- **Health Check**: https://clinicaconexaomental.online/api/health
- **Servidor**: 157.173.120.220
- **Porta API**: 3001
- **Banco**: PostgreSQL (conexaomental)

## 🎯 Próximos Passos

1. **Configurar SSL** com Certbot
2. **Testar autenticação** no frontend
3. **Configurar monitoramento** com PM2
4. **Configurar backup automático** (já existe)
5. **Documentar API** (opcional)

**🚀 Sua API está pronta para produção!**