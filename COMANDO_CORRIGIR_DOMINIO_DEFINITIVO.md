# 🎯 COMANDO DEFINITIVO - CORRIGIR DOMÍNIO NO SERVIDOR

## ✅ ARQUIVOS CORRIGIDOS NO REPLIT:
- CORRIGIR_NGINX_E_DATABASE.md ✅
- RESOLVER_502_BAD_GATEWAY.md ✅ 
- SERVIDOR_SCRIPT_INSTALACAO.sh ✅
- CORRIGIR_DOMINIO_FINAL.md ✅

## 🚀 EXECUTE NO SERVIDOR PARA CORRIGIR DEFINITIVAMENTE:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. PARAR APLICAÇÃO
pm2 delete all
pm2 kill

# 2. CORRIGIR NGINX COM DOMÍNIO CORRETO
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
        
        # Headers anti-cache
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
}
EOF

# 3. ATIVAR SITE
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/

# 4. VALIDAR E RECARREGAR NGINX
sudo nginx -t
sudo systemctl reload nginx

# 5. RESTART APLICAÇÃO
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" NODE_ENV=production pm2 start npm --name "conexaomental" -- start

# 6. AGUARDAR INICIALIZAÇÃO
sleep 30

# 7. TESTAR APLICAÇÃO LOCAL
curl -s http://127.0.0.1:5000 | wc -c
echo "Tamanho da resposta local (deve ser >50KB)"

# 8. TESTAR DOMÍNIO CORRETO
curl -s http://conexaomental.online | wc -c
echo "Tamanho da resposta domínio (deve ser >50KB)"

# 9. VERIFICAR CONTEÚDO ESPECÍFICO
curl -s http://conexaomental.online | grep -i "sessão de acolhimento"
curl -s http://conexaomental.online | grep -i "como funciona o atendimento"

# 10. SE HTTPS REDIRECIONAR, TESTAR HTTPS
curl -s https://conexaomental.online | wc -c
curl -s https://conexaomental.online | grep -i "sessão de acolhimento"

# 11. VERIFICAR STATUS
pm2 status
pm2 logs conexaomental --lines 5
```

## 🎯 RESULTADO ESPERADO:
- Resposta local e domínio >50KB (não 687 bytes)
- Encontrar "Sessão de Acolhimento" no HTML
- Encontrar "Como funciona o atendimento online?" no HTML
- Site carregando com 4 planos de preços e FAQ

## ⚠️ IMPORTANTE:
- **DOMÍNIO CORRETO**: conexaomental.online
- **NUNCA MAIS USAR**: clinicaconexaomental.online (nome muito longo)
- Todos os arquivos de configuração foram corrigidos no Replit