# 🌐 TESTE DOMÍNIO CORRETO - conexaomental.online

## ✅ INFORMAÇÕES ATUALIZADAS:
- **conexaomental.online** → IP 157.173.120.220 (servidor atual) ✅
- **clinicaconexaomental.online** → servidor Hostinger ❌

## 🚀 COMANDOS PARA TESTAR DOMÍNIO FUNCIONANDO:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. TESTAR APLICAÇÃO LOCAL
echo "=== LOCAL ==="
curl -s http://127.0.0.1:5000 | wc -c

# 2. TESTAR DOMÍNIO QUE FUNCIONA
echo "=== DOMÍNIO CORRETO ==="
curl -s http://conexaomental.online | wc -c

# 3. BUSCAR CONTEÚDO ESPECÍFICO
echo "=== BUSCAR CONTEÚDO ==="
curl -s http://conexaomental.online | grep -i "sessão de acolhimento"
curl -s http://conexaomental.online | grep -i "como funciona"

# 4. VERIFICAR STATUS PM2
pm2 status

# 5. SE SITE CARREGOU CORRETAMENTE
echo "✅ SUCESSO! Site funcionando em http://conexaomental.online"
```

## 🔧 OPÇÕES DE SOLUÇÃO:

### OPÇÃO A: USAR DOMÍNIO QUE FUNCIONA
- Manter `conexaomental.online` (que já funciona)
- Reverter alguns arquivos para usar este domínio

### OPÇÃO B: CONFIGURAR DNS CLINICA
- Apontar `clinicaconexaomental.online` para 157.173.120.220
- Manter padronização atual

### OPÇÃO C: NGINX RESPONDER AMBOS
```bash
# Configurar Nginx para ambos os domínios:
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

sudo nginx -t
sudo systemctl reload nginx
```