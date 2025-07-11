# Conexão Mental - Backend API

Backend completo em Node.js/Express para a plataforma Conexão Mental, com autenticação, gestão de profissionais e agendamentos.

## 🚀 Características

- **Autenticação JWT** completa (signup, signin, logout)
- **Gestão de usuários** (pacientes, profissionais, admin)
- **Sistema de agendamentos** com verificação de conflitos
- **Perfis profissionais** com especialidades e horários
- **API RESTful** com validação de dados
- **PostgreSQL** como banco de dados
- **Rate limiting** e segurança com Helmet
- **PM2** para gerenciamento de processos

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- PM2 (para produção)
- Nginx (recomendado para proxy reverso)

## ⚡ Instalação Rápida

```bash
# Clonar e entrar na pasta do servidor
cd server

# Executar script de instalação
chmod +x install.sh
./install.sh
```

## 🔧 Instalação Manual

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar configurações
nano .env
```

### 3. Configurar PostgreSQL

```bash
# Criar database
sudo -u postgres createdb conexao_mental

# Executar setup das tabelas
node scripts/setup-database.js
```

### 4. Iniciar servidor

```bash
# Desenvolvimento
npm run dev

# Produção com PM2
pm2 start ecosystem.config.js
```

## 🌐 Configuração do Nginx

Exemplo de configuração para proxy reverso:

```nginx
server {
    listen 443 ssl http2;
    server_name conexaomental.online;

    # Configurações SSL
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    # Proxy para API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS Headers
        add_header 'Access-Control-Allow-Origin' 'https://conexaomental.online' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
    }

    # Frontend
    location / {
        root /var/www/conexaomental.online;
        try_files $uri $uri/ /index.html;
    }
}
```

## 📚 Endpoints da API

### Autenticação

- `POST /api/auth/signup` - Cadastro de usuário
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Perfil do usuário logado
- `POST /api/auth/reset-password` - Reset de senha

### Profissionais

- `GET /api/professionals` - Listar profissionais
- `POST /api/professionals` - Criar perfil profissional

### Agendamentos

- `GET /api/appointments` - Listar agendamentos
- `POST /api/appointments` - Criar agendamento
- `PATCH /api/appointments/:id` - Atualizar agendamento

### Administração

- `GET /api/admin/users` - Listar usuários (admin)
- `GET /api/admin/stats` - Estatísticas (admin)

### Utilitários

- `GET /api/health` - Health check

## 🔐 Segurança

- Senhas hasheadas com bcrypt (salt 12)
- Tokens JWT com expiração de 7 dias
- Rate limiting (100 requests/15min)
- Headers de segurança com Helmet
- Validação de entrada com express-validator
- CORS configurado

## 🗄️ Estrutura do Banco

### Tabelas Principais

- **profiles** - Dados dos usuários
- **professionals** - Perfis profissionais
- **appointments** - Agendamentos

### Tipos Enum

- **user_role**: patient, professional, admin
- **appointment_status**: scheduled, confirmed, in_progress, completed, cancelled

## 🔧 Comandos PM2

```bash
# Iniciar
pm2 start ecosystem.config.js

# Parar
pm2 stop conexao-mental-api

# Reiniciar
pm2 restart conexao-mental-api

# Ver logs
pm2 logs conexao-mental-api

# Monitorar
pm2 monit

# Salvar configuração
pm2 save

# Auto-inicialização
pm2 startup
```

## 📊 Monitoramento

### Health Check

```bash
curl https://conexaomental.online/api/health
```

### Logs

```bash
# PM2 logs
pm2 logs conexao-mental-api

# Logs do sistema
sudo journalctl -u nginx -f
```

## 🚨 Solução de Problemas

### Erro de conexão com PostgreSQL

```bash
# Verificar status
sudo systemctl status postgresql

# Reiniciar PostgreSQL
sudo systemctl restart postgresql

# Verificar logs
sudo journalctl -u postgresql -f
```

### Erro de permissões

```bash
# Verificar owner dos arquivos
sudo chown -R $USER:$USER /path/to/server

# Dar permissão de execução
chmod +x install.sh
```

### Erro de porta em uso

```bash
# Verificar processo na porta 3001
sudo lsof -i :3001

# Matar processo se necessário
sudo kill -9 PID
```

## 🔄 Backup e Restore

### Backup do banco

```bash
pg_dump -U postgres -h localhost conexao_mental > backup.sql
```

### Restore do banco

```bash
psql -U postgres -h localhost conexao_mental < backup.sql
```

## 📝 Logs e Debug

Os logs incluem:
- Tentativas de autenticação
- Erros de validação
- Consultas ao banco
- Requests HTTP

Para debug detalhado, defina `NODE_ENV=development` no .env.

## 🛡️ Configuração SSL

### Com Let's Encrypt

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d conexaomental.online

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 👥 Usuário Admin Padrão

**Email:** admin@conexaomental.online  
**Senha:** admin123456

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

## 🆘 Suporte

Para problemas ou dúvidas:
1. Verificar logs com `pm2 logs`
2. Testar health check: `/api/health`
3. Verificar configuração do .env
4. Reiniciar serviços se necessário