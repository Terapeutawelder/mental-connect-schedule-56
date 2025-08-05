# 🚀 DEPLOY COM SUPABASE NO SERVIDOR

Como você já tem Supabase instalado, o processo fica muito mais simples!

## 📦 PREPARAR PARA DEPLOY

### 1. NO REPLIT - BUILD DE PRODUÇÃO:
```bash
# Build do frontend
npm run build

# Criar pacote de deploy
tar -czf deploy-supabase.tar.gz \
  server/ \
  client/dist/ \
  shared/ \
  drizzle.config.ts \
  tsconfig.json \
  .env.example
```

### 2. BAIXAR O ARQUIVO:
- Clique com botão direito em `deploy-supabase.tar.gz`
- Selecione "Download"

## 🖥️ NO SERVIDOR:

### 1. PREPARAR DIRETÓRIO:
```bash
# Criar diretório
sudo mkdir -p /var/www/clinicaconexaomental
cd /var/www/clinicaconexaomental

# Upload (do seu PC)
scp deploy-supabase.tar.gz root@157.173.120.220:/var/www/clinicaconexaomental/

# Extrair
tar -xzf deploy-supabase.tar.gz
```

### 2. CONFIGURAR SUPABASE:
```bash
# Criar arquivo .env
sudo nano /var/www/clinicaconexaomental/.env
```

Adicionar (ajuste com suas credenciais do Supabase):
```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=gerar_uma_chave_secreta_aqui

# Supabase Local
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=sua_anon_key_local
SUPABASE_SERVICE_KEY=sua_service_key_local

# Ou se preferir usar o banco PostgreSQL direto:
DATABASE_URL=postgresql://postgres:sua_senha@localhost:54322/postgres

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=seu_token_aqui
MERCADO_PAGO_PUBLIC_KEY=sua_chave_publica_aqui

# Domínio
VITE_API_URL=https://clinicaconexaomental.online
```

### 3. INSTALAR DEPENDÊNCIAS:
```bash
# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Criar package.json simplificado
cat > package.json << 'EOF'
{
  "name": "conexaomental",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server/simple-server.js"
  },
  "dependencies": {
    "express": "^4.21.1",
    "express-session": "^1.18.1",
    "pg": "^8.13.1",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5"
  }
}
EOF

# Instalar dependências mínimas
npm install
```

### 4. CRIAR SERVIDOR SIMPLIFICADO:
```bash
# Copiar o servidor simples
cp server/simple-server.ts server/simple-server.js

# Ajustar para production
sed -i 's/development/production/g' server/simple-server.js
```

### 5. CONFIGURAR PM2:
```bash
# Criar ecosystem
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'conexaomental',
    script: 'server/simple-server.js',
    cwd: '/var/www/conexaomental',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 2,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
}
EOF

# Iniciar
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. CONFIGURAR NGINX COM SUPABASE:
```bash
sudo nano /etc/nginx/sites-available/conexaomental
```

```nginx
server {
    listen 80;
    server_name conexaomental.online www.conexaomental.online;

    # App principal
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Supabase (se quiser expor)
    location /supabase/ {
        proxy_pass http://localhost:54321/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

### 7. ATIVAR E SSL:
```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d conexaomental.online -d www.conexaomental.online
```

## 🔧 INTEGRAÇÃO SUPABASE:

### Opção 1 - Usar Supabase Auth:
```javascript
// No frontend
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  'http://localhost:54321',
  'sua_anon_key'
)
```

### Opção 2 - Usar PostgreSQL direto:
```javascript
// No backend (já configurado)
import pg from 'pg'
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})
```

## ✅ VANTAGENS COM SUPABASE:

1. **Banco PostgreSQL** já configurado
2. **Autenticação** pronta (se quiser migrar)
3. **Realtime** disponível
4. **Storage** para arquivos
5. **Edge Functions** se precisar

## 🌐 DNS NA HOSTINGER:

```
Tipo: A
Nome: @
Valor: 157.173.120.220

Tipo: A
Nome: www
Valor: 157.173.120.220
```

## 📊 MONITORAR:

```bash
# Logs da aplicação
pm2 logs conexaomental

# Status Supabase
docker ps | grep supabase

# Testar API
curl http://localhost:3000/api/v1/status
```

Com Supabase, você tem toda a infraestrutura pronta! Precisa de ajuda com alguma parte específica?