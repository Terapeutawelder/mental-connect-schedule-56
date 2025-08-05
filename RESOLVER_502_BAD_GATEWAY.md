# RESOLVER 502 BAD GATEWAY - SOLUÇÃO DEFINITIVA

## 🔍 PROBLEMA IDENTIFICADO:
- Warning: "conflicting server name" = configurações duplicadas no Nginx
- 502 Bad Gateway = Nginx não consegue conectar na porta 5000
- curl local não retorna nada = aplicação pode estar com erro

## ✅ SOLUÇÃO COMPLETA:

### 1. LIMPAR CONFIGURAÇÕES DUPLICADAS DO NGINX:
```bash
# Verificar arquivos conflitantes
sudo find /etc/nginx -name "*.conf" -exec grep -l "conexaomental.online" {} \;

# Remover todas as configurações antigas
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/default*

# Criar configuração limpa
sudo tee /etc/nginx/sites-available/conexaomental << 'EOF'
server {
    listen 80;
    server_name conexaomental.online www.conexaomental.online;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. VERIFICAR E CORRIGIR APLICAÇÃO:
```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# Verificar logs PM2
pm2 logs conexaomental --lines 10

# Se houver erro, reiniciar com debug
pm2 delete all
pm2 start npm --name "conexaomental" -- start --log-type json

# Aguardar e verificar porta
sleep 10
netstat -tlnp | grep :5000
```

### 3. TESTAR APLICAÇÃO DIRETAMENTE:
```bash
# Testar se aplicação responde
curl -4 -v http://127.0.0.1:5000
curl -4 -s http://127.0.0.1:5000 | head -10

# Se não responder, rodar em foreground para debug
pm2 delete all
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" npm start
```

### 4. SEQUÊNCIA COMPLETA DE CORREÇÃO:
```bash
# LIMPEZA TOTAL
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/default*

# NOVA CONFIGURAÇÃO NGINX
sudo tee /etc/nginx/sites-available/conexaomental << 'EOF'
server {
    listen 80 default_server;
    server_name clinicaconexaomental.online www.clinicaconexaomental.online _;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# REINICIAR APLICAÇÃO
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729
pm2 delete all
pm2 start npm --name "conexaomental" -- start

# TESTAR
sleep 15
curl -4 -v http://127.0.0.1:5000
curl -v http://clinicaconexaomental.onlinenline
```