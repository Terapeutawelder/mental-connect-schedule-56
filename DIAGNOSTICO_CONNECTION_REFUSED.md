# 🚨 DIAGNÓSTICO - ERR_CONNECTION_REFUSED

## ❌ PROBLEMA: conexaomental.online recusou conexão

## 🔍 COMANDOS PARA DIAGNOSTICAR:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. VERIFICAR STATUS PM2
pm2 status

# 2. VERIFICAR LOGS PM2
pm2 logs conexaomental --lines 10

# 3. VERIFICAR SE PORTA 5000 ESTÁ OCUPADA
netstat -tlnp | grep :5000
lsof -i :5000

# 4. VERIFICAR STATUS NGINX
sudo systemctl status nginx

# 5. VERIFICAR CONFIGURAÇÃO NGINX
sudo nginx -t
cat /etc/nginx/sites-enabled/conexaomental

# 6. TESTAR APLICAÇÃO LOCAL
curl -v http://127.0.0.1:5000

# 7. VERIFICAR PROCESSO NODE
ps aux | grep node
ps aux | grep npm

# 8. VERIFICAR PORTAS ABERTAS
ss -tlnp | grep :80
ss -tlnp | grep :5000
```

## ✅ SOLUÇÃO COMPLETA:

```bash
# RESTART COMPLETO DO SISTEMA

# 1. PARAR TUDO
pm2 delete all
pm2 kill
sudo systemctl stop nginx

# 2. VERIFICAR SE PROCESSOS PARARAM
ps aux | grep node | grep -v grep
killall node 2>/dev/null || true

# 3. CRIAR .env CORRETO
cat > .env << 'EOF'
DATABASE_URL=postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable
NODE_ENV=production
EOF

# 4. VERIFICAR BUILD EXISTE
ls -la dist/

# 5. SE BUILD NÃO EXISTIR, GERAR
npm run build

# 6. RESTART NGINX
sudo systemctl start nginx

# 7. CONFIGURAR NGINX AMBOS DOMÍNIOS
sudo tee /etc/nginx/sites-available/conexaomental << 'EOF'
server {
    listen 80 default_server;
    server_name conexaomental.online www.conexaomental.online clinicaconexaomental.online www.clinicaconexaomental.online;
    
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

# 8. ATIVAR SITE
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/

# 9. TESTAR E RECARREGAR NGINX
sudo nginx -t
sudo systemctl reload nginx

# 10. RESTART APLICAÇÃO
NODE_ENV=production pm2 start npm --name "conexaomental" -- start

# 11. AGUARDAR INICIALIZAÇÃO
sleep 45

# 12. VERIFICAR STATUS
pm2 status
pm2 logs conexaomental --lines 5

# 13. TESTAR LOCAL
curl -v http://127.0.0.1:5000

# 14. TESTAR DOMÍNIO
curl -v http://conexaomental.online

echo "✅ DIAGNÓSTICO COMPLETO!"
```