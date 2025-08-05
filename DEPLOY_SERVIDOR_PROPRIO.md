# 🚀 DEPLOY NO SERVIDOR PRÓPRIO (157.173.120.220)

## 📦 PREPARAR ARQUIVOS PARA DEPLOY

### 1. NO REPLIT - CRIAR BUILD DE PRODUÇÃO:
```bash
# Build do frontend
npm run build

# Criar arquivo de deploy
tar -czf deploy-conexaomental.tar.gz \
  server/ \
  client/dist/ \
  shared/ \
  package.json \
  package-lock.json \
  drizzle.config.ts \
  tsconfig.json \
  .env.production
```

### 2. BAIXAR O ARQUIVO:
- Clique com botão direito em `deploy-conexaomental.tar.gz`
- Selecione "Download"

## 🖥️ NO SERVIDOR (157.173.120.220):

### 1. UPLOAD E EXTRAÇÃO:
```bash
# Criar diretório
sudo mkdir -p /var/www/clinicaconexaomental
cd /var/www/clinicaconexaomental

# Upload via SCP (do seu computador):
scp deploy-conexaomental.tar.gz root@157.173.120.220:/var/www/clinicaconexaomental/

# Extrair arquivos
tar -xzf deploy-conexaomental.tar.gz
```

### 2. INSTALAR DEPENDÊNCIAS:
```bash
# Instalar Node.js se necessário
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar dependências do projeto
npm install --production
```

### 3. CONFIGURAR VARIÁVEIS DE AMBIENTE:
```bash
# Criar arquivo .env
sudo nano /var/www/conexaomental/.env
```

Adicionar:
```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=sua_chave_secreta_aqui
DATABASE_URL=postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable
MERCADO_PAGO_ACCESS_TOKEN=seu_token_aqui
MERCADO_PAGO_PUBLIC_KEY=sua_chave_publica_aqui
```

### 4. CONFIGURAR PM2:
```bash
# Criar ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'clinicaconexaomental',
    script: 'npm',
    args: 'run start',
    cwd: '/var/www/clinicaconexaomental',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
EOF

# Iniciar aplicação
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. CONFIGURAR NGINX:
```bash
sudo nano /etc/nginx/sites-available/clinicaconexaomental
```

Adicionar:
```nginx
server {
    listen 80;
    server_name clinicaconexaomental.online www.clinicaconexaomental.online;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. ATIVAR SITE:
```bash
sudo ln -s /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. CONFIGURAR SSL (HTTPS):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d conexaomental.online -d www.conexaomental.online
```

## 🌐 CONFIGURAR DNS NA HOSTINGER:

1. Acesse o painel da Hostinger
2. Vá em "DNS Zone Editor"
3. Adicione os registros:

```
Tipo: A
Nome: @
Valor: 157.173.120.220
TTL: 14400

Tipo: A  
Nome: www
Valor: 157.173.120.220
TTL: 14400
```

## ✅ VERIFICAR FUNCIONAMENTO:

```bash
# No servidor
pm2 status
pm2 logs conexaomental

# Testar localmente
curl http://localhost:3000

# Testar externamente (após DNS propagar)
curl https://conexaomental.online
```

## 🔧 COMANDOS ÚTEIS:

```bash
# Reiniciar aplicação
pm2 restart conexaomental

# Ver logs
pm2 logs conexaomental

# Monitorar
pm2 monit

# Parar aplicação
pm2 stop conexaomental
```

O site estará disponível em https://conexaomental.online após a propagação do DNS (pode levar até 48h).