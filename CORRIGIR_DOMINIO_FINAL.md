# 🎯 CORREÇÃO DEFINITIVA DE DOMÍNIO

## ✅ PROBLEMA IDENTIFICADO:
- Nginx configurado para: **clinicaconexaomental.online**
- Teste sendo feito em: **conexaomental.online** 
- **DOMÍNIO CORRETO**: conexaomental.online

## 🚀 COMANDOS PARA CORRIGIR NO SERVIDOR:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. CONFIRMAR CONFIGURAÇÃO NGINX CORRETA
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

# 2. VALIDAR E RECARREGAR NGINX
sudo nginx -t
sudo systemctl reload nginx

# 3. TESTAR COM DOMÍNIO CORRETO
curl -v http://conexaomental.online
curl -s http://conexaomental.online | wc -c
curl -s http://conexaomental.online | grep -i "sessão de acolhimento"

# 4. SE HTTPS REDIRECIONAR, TESTAR HTTPS
curl -s https://clinicaconexaomental.online | wc -c
curl -s https://clinicaconexaomental.online | grep -i "sessão de acolhimento"

# 5. VERIFICAR STATUS DA APLICAÇÃO
pm2 status
pm2 logs conexaomental --lines 10
```

## 🎯 RESULTADO ESPERADO:
- curl deve retornar mais de 50KB (não 687 bytes)
- Deve encontrar "Sessão de Acolhimento" no HTML
- Site deve carregar com 4 planos e FAQ

## ⚠️ IMPORTANTE:
- **SEMPRE usar**: clinicaconexaomental.online
- **NUNCA usar**: conexaomental.online (sem "clinica")
- Se https redirecionar, usar https://clinicaconexaomental.online