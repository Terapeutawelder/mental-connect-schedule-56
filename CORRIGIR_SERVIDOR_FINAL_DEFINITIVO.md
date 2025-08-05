# 🎯 CORREÇÃO DEFINITIVA - SERVIDOR FINAL

## ✅ PROBLEMAS IDENTIFICADOS:
1. Build novo gerado (4.3M) mas servidor servindo arquivos antigos (687 bytes)
2. LSP error corrigido na interface Professional
3. Nginx com domínio incorreto (deve ser clinicaconexaomental.online)

## 🚀 COMANDOS DEFINITIVOS NO SERVIDOR:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. VERIFICAR SE APLICAÇÃO ESTÁ RODANDO
pm2 status

# 2. RESTART COMPLETO FORÇADO
pm2 delete all
pm2 kill

# 3. AGUARDAR LIMPEZA COMPLETA
sleep 5

# 4. RESTART COM NOVO BUILD
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" NODE_ENV=production pm2 start npm --name "conexaomental" -- start

# 5. AGUARDAR INICIALIZAÇÃO COMPLETA
sleep 30

# 6. VERIFICAR SE ESTÁ SERVINDO NOVO CONTEÚDO
curl -s http://127.0.0.1:5000 | wc -c
curl -s http://127.0.0.1:5000 | grep -i "sessão de acolhimento"

# 7. CORRIGIR NGINX PARA DOMÍNIO CORRETO
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

sudo nginx -t
sudo systemctl reload nginx

# 8. TESTE FINAL
curl -s https://conexaomental.online | grep -i "sessão de acolhimento"
```

## 🎯 RESULTADO ESPERADO:
- curl local deve retornar mais de 50KB (não 687 bytes)
- Deve encontrar "Sessão de Acolhimento" no HTML
- Site deve mostrar 4 planos de preços e FAQ

## 🔧 SE AINDA NÃO FUNCIONAR:
```bash
# Forçar rebuild sem cache
rm -rf node_modules/.vite dist/
npm run build
pm2 restart conexaomental
```