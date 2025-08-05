# CORRIGIR NGINX 403 E DATABASE SSL

## 1. CORRIGIR .env COM DATABASE_URL SEM SSL:
```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

cat > .env << 'EOF'
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable"
NODE_ENV=production
EOF
```

## 2. CORRIGIR CONFIGURAÇÃO NGINX:
```bash
# Verificar configuração atual
sudo cat /etc/nginx/sites-available/conexaomental

# Sobrescrever com configuração correta
sudo tee /etc/nginx/sites-available/conexaomental << 'EOF'
server {
    listen 80;
    server_name clinicaconexaomental.online www.clinicaconexaomental.online;
    
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

# Ativar site
sudo ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/

# Remover default se existir
sudo rm -f /etc/nginx/sites-enabled/default

# Testar e recarregar
sudo nginx -t
sudo systemctl reload nginx
```

## 3. REINICIAR APLICAÇÃO:
```bash
pm2 delete all
pm2 start npm --name "conexaomental" -- start
```

## 4. TESTAR:
```bash
# Testar local
curl -4 -s http://127.0.0.1:5000 | head -5

# Testar domínio
curl -v http://conexaomental.online
```