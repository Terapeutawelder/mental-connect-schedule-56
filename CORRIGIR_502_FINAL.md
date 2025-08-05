# 🚨 CORRIGIR 502 BAD GATEWAY - SOLUÇÃO FINAL

## ❌ PROBLEMA: 502 Bad Gateway em conexaomental.online

## ✅ COMANDOS PARA CORRIGIR:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. VERIFICAR STATUS PM2
pm2 status

# 2. VERIFICAR SE APLICAÇÃO ESTÁ NA PORTA 5000
netstat -tlnp | grep :5000
ss -tlnp | grep :5000

# 3. TESTAR APLICAÇÃO LOCAL
curl -v http://127.0.0.1:5000

# 4. SE APLICAÇÃO NÃO ESTIVER RODANDO, RESTART
pm2 delete all

# 5. CRIAR .env CORRETO
cat > .env << 'EOF'
DATABASE_URL=postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable
NODE_ENV=production
EOF

# 6. RESTART APLICAÇÃO
pm2 start npm --name "conexaomental" -- start

# 7. AGUARDAR INICIALIZAÇÃO
sleep 30

# 8. TESTAR NOVAMENTE LOCAL
curl -s http://127.0.0.1:5000 | wc -c

# 9. CONFIGURAR NGINX PARA AMBOS DOMÍNIOS
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
        
        # Headers anti-cache
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
}
EOF

# 10. ATIVAR SITE
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/

# 11. TESTAR E RECARREGAR NGINX
sudo nginx -t
sudo systemctl reload nginx

# 12. TESTAR DOMÍNIOS
echo "=== TESTANDO conexaomental.online ==="
curl -s http://conexaomental.online | wc -c

# 13. BUSCAR CONTEÚDO
curl -s http://conexaomental.online | grep -i "sessão de acolhimento"

echo "✅ CORREÇÃO COMPLETA!"
```

## 🎯 RESULTADO ESPERADO:
- PM2 status: online ✅
- Local 127.0.0.1:5000: >50KB ✅
- conexaomental.online: >50KB ✅
- Conteúdo carregando corretamente ✅