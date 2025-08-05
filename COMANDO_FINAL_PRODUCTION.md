# 🚀 COMANDO FINAL - PRODUCTION MODE NO SERVIDOR

Execute exatamente estes comandos no servidor:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. PARAR TUDO
pm2 delete all
pm2 kill

# 2. CRIAR .env
cat > .env << 'EOF'
DATABASE_URL=postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable
NODE_ENV=production
EOF

# 3. VERIFICAR SE BUILD EXISTE
ls -la dist/index.js

# 4. SE BUILD NÃO EXISTIR, GERAR
npm run build

# 5. TESTAR BUILD DIRETAMENTE (SEM PM2)
NODE_ENV=production node dist/index.js &
NODEJS_PID=$!

# 6. AGUARDAR 15 SEGUNDOS
sleep 15

# 7. TESTAR SE ESTÁ EM PRODUCTION
curl -s http://127.0.0.1:5000 | grep "vite" && echo "❌ DEV MODE" || echo "✅ PRODUCTION MODE"

# 8. VERIFICAR TAMANHO
curl -s http://127.0.0.1:5000 | wc -c

# 9. PARAR TESTE
kill $NODEJS_PID

# 10. SE FUNCIONOU, USAR PM2
pm2 start "node dist/index.js" --name "conexaomental"

# 11. AGUARDAR PM2
sleep 20

# 12. TESTAR COM PM2
curl -s http://127.0.0.1:5000 | wc -c

# 13. CONFIGURAR NGINX
sudo tee /etc/nginx/sites-available/conexaomental << 'EOF'
server {
    listen 80 default_server;
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

# 14. ATIVAR NGINX
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 15. TESTAR DOMÍNIO FINAL
curl -s http://conexaomental.online | wc -c
curl -s http://conexaomental.online | grep -i "sessão de acolhimento"

echo "✅ TESTE COMPLETO!"
```

## 🎯 RESULTADO ESPERADO:
- Teste direto: >50KB sem menção a "vite"
- PM2: aplicação rodando em production
- Domínio: funcionando sem Connection Refused
- Conteúdo: "Sessão de Acolhimento" encontrado