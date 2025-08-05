# Configuração do Banco PostgreSQL - PRONTO

## ✅ STATUS ATUAL:
- PostgreSQL instalado e rodando
- Localização: `/var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729`

## 🔧 CONFIGURAÇÃO DATABASE_URL:

Com base no seu servidor, use esta configuração no .env:

```
DATABASE_URL=postgresql://postgres:123456@localhost:5432/conexaomental
```

## 📝 COMANDOS PARA CONFIGURAR O .env:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729
cp .env.example .env
nano .env
```

**No editor nano, coloque:**
```
# Banco de dados
DATABASE_URL=postgresql://postgres:123456@localhost:5432/conexaomental

# Mercado Pago (opcional por enquanto)
MERCADO_PAGO_ACCESS_TOKEN=TEST-APP_USR-123456-test
MERCADO_PAGO_PUBLIC_KEY=TEST-APP_USR-123456-test

# Configuração do servidor
NODE_ENV=production
PORT=5000
```

**Salvar no nano:**
- Ctrl+X
- Y (para confirmar)
- Enter

## 🚀 PRÓXIMOS COMANDOS:

```bash
# Instalar dependências
npm install

# Build do projeto
npm run build

# Configurar Nginx
sudo tee /etc/nginx/sites-available/conexaomental > /dev/null <<'EOF'
server {
    listen 80;
    server_name clinicaconexaomental.online www.clinicaconexaomental.online;
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Ativar configuração Nginx
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Iniciar aplicação
pm2 start npm --name "conexaomental" -- start
pm2 startup
pm2 save
```

## 🧪 TESTAR FUNCIONAMENTO:

```bash
# Verificar se aplicação está rodando
pm2 status

# Testar localmente
curl http://localhost:5000

# Testar domínio
curl https://conexaomental.online

# Ver logs se der problema
pm2 logs conexaomental
```

## ✅ CREDENCIAIS CONFIGURADAS:

- **Banco**: conexaomental
- **Usuário**: postgres  
- **Senha**: 123456
- **Host**: localhost
- **Porta**: 5432

**Execute os comandos acima na sequência para finalizar a instalação!**