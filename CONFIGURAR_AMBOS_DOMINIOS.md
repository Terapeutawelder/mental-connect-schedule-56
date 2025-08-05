# 🌐 CONFIGURAR NGINX PARA AMBOS OS DOMÍNIOS

## ✅ SOLUÇÃO: NGINX ACEITAR AMBOS DOMÍNIOS

Execute no servidor:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. CONFIGURAR NGINX PARA AMBOS DOMÍNIOS
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

# 2. TESTAR E RECARREGAR NGINX
sudo nginx -t
sudo systemctl reload nginx

# 3. TESTAR AMBOS DOMÍNIOS
echo "=== TESTANDO conexaomental.online ==="
curl -s http://conexaomental.online | wc -c

echo "=== TESTANDO clinicaconexaomental.online ==="  
curl -s http://clinicaconexaomental.online | wc -c

# 4. BUSCAR CONTEÚDO EM AMBOS
curl -s http://conexaomental.online | grep -i "sessão de acolhimento"
curl -s http://clinicaconexaomental.online | grep -i "sessão de acolhimento"

echo "✅ AMBOS DOMÍNIOS CONFIGURADOS!"
```

## 🎯 RESULTADO ESPERADO:
- conexaomental.online: >50KB ✅
- clinicaconexaomental.online: >50KB ✅ (quando DNS propagar)
- Aplicação funcionando em ambos domínios