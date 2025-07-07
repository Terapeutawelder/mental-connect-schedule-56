# Configuração da API de Autenticação - Conexão Mental

## 📋 Resumo
Implementação de autenticação personalizada usando Node.js/Express no servidor Contabo, removendo dependência do Supabase Auth.

## 🚀 Instalação no Servidor

### 1. Conectar ao servidor
```bash
ssh root@157.173.120.220
```

### 2. Criar diretório da API
```bash
mkdir -p /opt/conexaomental/api
cd /opt/conexaomental/api
```

### 3. Copiar arquivos
Transfira os arquivos do diretório `server/` para `/opt/conexaomental/api/`:
- `package.json`
- `server.js`
- `.env`

### 4. Instalar dependências
```bash
npm install
```

### 5. Configurar variáveis de ambiente
Edite o arquivo `.env` e gere uma chave JWT segura:
```bash
# Gerar chave JWT aleatória
openssl rand -base64 32

# Editar .env
nano .env
```

Substitua `sua_chave_secreta_super_segura_conexao_mental_2024` pela chave gerada.

### 6. Configurar PM2 para produção
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Criar arquivo de configuração PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'conexao-mental-api',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

# Iniciar aplicação
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7. Configurar Nginx
Edite a configuração do Nginx:
```bash
nano /etc/nginx/sites-available/conexaomental
```

Adicione a configuração da API:
```nginx
server {
    listen 80;
    server_name conexaomental.online www.conexaomental.online;
    
    # Frontend (React)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://conexaomental.online' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://conexaomental.online' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}
```

Reinicie o Nginx:
```bash
nginx -t
systemctl reload nginx
```

### 8. Configurar firewall
```bash
ufw allow 3001
```

## 🔧 Configuração SSL (Opcional)
```bash
# Instalar certificado SSL
certbot --nginx -d conexaomental.online -d www.conexaomental.online
```

## 📊 Monitoramento

### Verificar status da API
```bash
pm2 status
pm2 logs conexao-mental-api
```

### Testar endpoints
```bash
# Health check
curl https://conexaomental.online/api/health

# Teste de registro
curl -X POST https://conexaomental.online/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"123456","full_name":"Teste Usuario"}'
```

## 🔒 Segurança

### 1. Alterar senhas padrão
- Trocar senha do PostgreSQL
- Usar chave JWT forte
- Configurar rate limiting

### 2. Backup automático
A API usa o mesmo banco PostgreSQL, então os backups existentes continuam funcionando.

### 3. Logs
```bash
# Ver logs da API
pm2 logs conexao-mental-api

# Ver logs do Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 🌐 Endpoints da API

### Autenticação
- `POST /api/auth/signup` - Cadastro
- `POST /api/auth/signin` - Login  
- `GET /api/auth/me` - Perfil do usuário
- `POST /api/auth/reset-password` - Reset de senha

### Health Check
- `GET /api/health` - Status da API

## 🔄 Diferenças do Supabase

1. **Tokens JWT** são gerenciados localmente
2. **Senhas** são hasheadas com bcrypt
3. **Sessões** são armazenadas no localStorage do frontend
4. **Roles** continuam funcionando normalmente
5. **Banco** usa a mesma tabela `profiles` com nova coluna `password_hash`

## 📝 Notas Importantes

- A migração já foi aplicada no banco (coluna `password_hash`)
- O frontend foi atualizado para usar a nova API
- Usuários existentes precisarão redefinir suas senhas
- Mantenha a chave JWT segura e privada