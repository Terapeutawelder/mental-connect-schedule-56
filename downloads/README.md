# 🚀 Instalação da API Conexão Mental

## 📋 Pré-requisitos
- Servidor Ubuntu 20.04+ 
- PostgreSQL instalado e configurado
- Nginx instalado
- Acesso root ao servidor

## 📦 Arquivos Incluídos
```
downloads/
├── install-api.sh          # Script de instalação automática
├── package.json            # Dependências Node.js
├── server.js              # Servidor Express principal
├── .env                   # Variáveis de ambiente
├── ecosystem.config.js    # Configuração PM2
├── nginx-site.conf        # Configuração Nginx
└── README.md              # Este arquivo
```

## ⚡ Instalação Rápida (Recomendada)

### 1. Fazer upload dos arquivos
```bash
# Conectar ao servidor
ssh root@157.173.120.220

# Criar diretório temporário
mkdir -p /tmp/conexao-mental-api
cd /tmp/conexao-mental-api

# Fazer upload de todos os arquivos do diretório downloads/
# Use scp, rsync ou seu método preferido
```

### 2. Executar instalação automática
```bash
# Dar permissão de execução
chmod +x install-api.sh

# Executar instalação
./install-api.sh
```

O script fará tudo automaticamente:
- ✅ Verificar/instalar Node.js
- ✅ Instalar PM2
- ✅ Copiar arquivos para `/opt/conexaomental/api`
- ✅ Instalar dependências
- ✅ Gerar chave JWT segura
- ✅ Configurar PM2
- ✅ Configurar Nginx
- ✅ Configurar firewall
- ✅ Iniciar serviços

---

## 🔧 Instalação Manual (Avançada)

### 1. Preparar ambiente
```bash
# Conectar ao servidor
ssh root@157.173.120.220

# Atualizar sistema
apt update && apt upgrade -y

# Verificar Node.js (instalar se necessário)
node --version || (curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt install -y nodejs)

# Instalar PM2
npm install -g pm2
```

### 2. Configurar aplicação
```bash
# Criar diretório
mkdir -p /opt/conexaomental/api
cd /opt/conexaomental/api

# Copiar arquivos (package.json, server.js, .env, ecosystem.config.js)
# ... (copiar todos os arquivos)

# Instalar dependências
npm install
```

### 3. Configurar segurança
```bash
# Gerar chave JWT
JWT_SECRET=$(openssl rand -base64 32)

# Substituir no .env
sed -i "s/sua_chave_secreta_super_segura_conexao_mental_2024/$JWT_SECRET/g" .env
```

### 4. Configurar PM2
```bash
# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Configurar auto-start
pm2 startup
```

### 5. Configurar Nginx
```bash
# Copiar configuração
cp nginx-site.conf /etc/nginx/sites-available/conexaomental

# Ativar site
ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar e recarregar
nginx -t && systemctl reload nginx
```

### 6. Configurar firewall
```bash
ufw allow 3001
```

---

## 🔍 Verificação

### Testar API
```bash
# Health check
curl http://localhost:3001/api/health

# Ou externamente
curl https://clinicaconexaomental.online/api/health
```

### Verificar status
```bash
# Status PM2
pm2 status

# Logs da aplicação
pm2 logs conexao-mental-api

# Status Nginx
systemctl status nginx
```

---

## 🛠️ Comandos Úteis

### Gerenciamento PM2
```bash
# Ver status
pm2 status

# Ver logs
pm2 logs conexao-mental-api

# Reiniciar
pm2 restart conexao-mental-api

# Parar
pm2 stop conexao-mental-api

# Ver monitoramento
pm2 monit
```

### Gerenciamento Nginx
```bash
# Testar configuração
nginx -t

# Recarregar configuração
systemctl reload nginx

# Ver logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Logs da aplicação
```bash
# Logs combinados
tail -f /var/log/pm2/conexao-mental-api-combined.log

# Logs de erro
tail -f /var/log/pm2/conexao-mental-api-error.log

# Logs de saída
tail -f /var/log/pm2/conexao-mental-api-out.log
```

---

## 🔐 Configurar SSL (Recomendado)

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx

# Obter certificado
certbot --nginx -d clinicaconexaomental.online -d www.clinicaconexaomental.online

# Renovação automática (já configurada)
crontab -l
```

---

## 🧪 Testes

### Teste de cadastro
```bash
curl -X POST https://clinicaconexaomental.online/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@clinica.com",
    "password": "123456",
    "full_name": "Teste Usuario",
    "role": "patient"
  }'
```

### Teste de login
```bash
curl -X POST https://clinicaconexaomental.online/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@clinica.com",
    "password": "123456"
  }'
```

---

## 🚨 Resolução de Problemas

### API não responde
```bash
# Verificar se está rodando
pm2 status

# Ver logs de erro
pm2 logs conexao-mental-api --err

# Reiniciar
pm2 restart conexao-mental-api
```

### Erro 502 (Bad Gateway)
```bash
# Verificar se API está rodando na porta 3001
netstat -tlnp | grep 3001

# Verificar configuração Nginx
nginx -t

# Ver logs Nginx
tail -f /var/log/nginx/error.log
```

### Erro de conexão com banco
```bash
# Testar conexão PostgreSQL
psql -h localhost -U postgres -d conexaomental -c "SELECT version();"

# Verificar se o banco existe
psql -h localhost -U postgres -l | grep conexaomental
```

### Problemas de CORS
```bash
# Verificar configuração Nginx
cat /etc/nginx/sites-available/conexaomental

# Verificar se headers CORS estão sendo enviados
curl -H "Origin: https://clinicaconexaomental.online" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://clinicaconexaomental.online/api/auth/signin
```

---

## 📞 Suporte

### Informações do sistema
```bash
# Versão Node.js
node --version

# Versão PM2
pm2 --version

# Status geral
/usr/local/bin/server-status
```

### Endpoints da API
- `GET /api/health` - Health check
- `POST /api/auth/signup` - Cadastro de usuário
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Perfil do usuário (autenticado)
- `POST /api/auth/reset-password` - Reset de senha

### Configurações importantes
- **API Port**: 3001
- **JWT Expiration**: 7 dias
- **Rate Limit**: 100 requests/15min
- **CORS Origins**: `https://clinicaconexaomental.online`

---

## 📝 Notas Finais

1. **Segurança**: A chave JWT é gerada automaticamente durante a instalação
2. **Backup**: O banco PostgreSQL continua sendo o mesmo, então os backups existentes funcionam
3. **Monitoramento**: Use PM2 para monitorar a aplicação
4. **SSL**: Configure SSL para produção usando Certbot
5. **Logs**: Monitore os logs regularmente para identificar problemas

**🎉 Pronto! Sua API está funcionando em: https://clinicaconexaomental.online/api**