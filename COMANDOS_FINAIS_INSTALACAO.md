# Comandos Finais para Instalação

## ✅ BANCO CONFIGURADO COM SUCESSO
- Banco `conexaomental` criado
- Usuário: `cloud_admin` (superuser)
- Sistema: Neon Database (PostgreSQL em nuvem)

## 🔧 CONFIGURE O .env AGORA:

Execute no servidor:
```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729
cp .env.example .env
nano .env
```

**Cole este conteúdo no .env:**
```env
# Banco de dados Neon
DATABASE_URL=postgresql://cloud_admin@localhost:5432/conexaomental

# Mercado Pago (opcional - use chaves de teste)
MERCADO_PAGO_ACCESS_TOKEN=TEST-123456-test
MERCADO_PAGO_PUBLIC_KEY=TEST-123456-test

# Configuração do servidor
NODE_ENV=production
PORT=5000
```

**Salvar: Ctrl+X → Y → Enter**

## 🚀 FINALIZAR INSTALAÇÃO:

```bash
# 1. Instalar dependências
npm install

# 2. Build do projeto
npm run build

# 3. Configurar Nginx
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

# 4. Ativar configuração
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 5. Parar PM2 anterior
pm2 delete all

# 6. Iniciar aplicação nova
pm2 start npm --name "conexaomental" -- start
pm2 startup
pm2 save
```

## 🧪 TESTAR:

```bash
# Status dos processos
pm2 status

# Testar local
curl http://localhost:5000

# Testar domínio
curl https://clinicaconexaomental.online

# Ver logs
pm2 logs conexaomental --lines 20
```

## ✅ O QUE DEVE FUNCIONAR:

- ✅ Site carrega: https://clinicaconexaomental.online
- ✅ Seções aparecem: Planos, FAQ, "O que você procura tratar?"
- ✅ Login funciona: /login-admin, /login-profissional, /login-paciente
- ✅ Dashboard admin: /admin (admin@test.com / 123456)

## 🔧 SE DER ERRO:

```bash
# Ver logs detalhados
pm2 logs conexaomental --lines 50

# Verificar arquivo .env
cat .env

# Testar conexão banco
sudo -u postgres psql -d conexaomental -c "SELECT version();"

# Reiniciar tudo
pm2 restart conexaomental
```

**Execute os comandos na sequência e me informe se algum der erro!**