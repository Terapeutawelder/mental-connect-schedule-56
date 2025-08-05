# CORREÇÃO NGINX + PM2 - SITE ATUALIZADO

## 🔴 PROBLEMAS IDENTIFICADOS:
1. Nginx apontando para pasta errada: `/opt/mental-connect-schedule-56/dist`
2. PM2 não conseguindo rodar aplicação na porta 5000
3. Configuração do Nginx quebrada

## ✅ SOLUÇÃO COMPLETA:

Execute os comandos abaixo no servidor:

### 1. CORRIGIR NGINX
```bash
# Deletar configuração antiga
sudo rm /etc/nginx/sites-enabled/conexaomental
sudo rm /etc/nginx/sites-available/conexaomental

# Criar nova configuração
sudo tee /etc/nginx/sites-available/conexaomental > /dev/null <<'EOF'
server {
    listen 80;
    server_name clinicaconexaomental.online www.clinicaconexaomental.online;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name clinicaconexaomental.online www.clinicaconexaomental.online;
    
    # SSL certificados (mantendo os existentes)
    ssl_certificate /etc/letsencrypt/live/conexaomental.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/conexaomental.online/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # Proxy para aplicação Node.js
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }
}
EOF

# Ativar site
sudo ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. CORRIGIR PM2
```bash
# Parar PM2
pm2 delete all

# Ir para pasta correta
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# Verificar se tem o arquivo start-production.js
ls -la start-production.js

# Se não existir, criar
cat > start-production.js << 'EOF'
const { spawn } = require('child_process');

console.log('🚀 Iniciando aplicação em produção...');

const child = spawn('npm', ['start'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    NODE_ENV: 'production',
    DATABASE_URL: process.env.DATABASE_URL
  },
  stdio: 'inherit'
});

child.on('error', (error) => {
  console.error('❌ Erro ao iniciar aplicação:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`📊 Aplicação terminou com código: ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});
EOF

# Iniciar com PM2
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental" pm2 start start-production.js --name "conexaomental"

# Verificar status
pm2 status
pm2 logs conexaomental --lines 10
```

### 3. TESTAR
```bash
# Aguardar 5 segundos
sleep 5

# Testar localhost
curl http://localhost:5000

# Se funcionar, testar conteúdo
curl http://localhost:5000 | grep -i "planos"
```

### 4. SE NÃO FUNCIONAR, ALTERNATIVA:
```bash
# Rodar diretamente
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental" npm start &

# Aguardar e testar
sleep 10
curl http://localhost:5000
```

## 🎯 RESULTADO ESPERADO:
- Nginx proxy funcionando
- PM2 aplicação rodando porta 5000
- Site mostrando seções de Planos, FAQ, "O que você procura tratar?"
- Profissionais reais do banco de dados