#!/bin/bash

echo "🚀 Instalando Conexão Mental Backend..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instalando Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Verificar se PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL não encontrado. Instalando PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

# Verificar se PM2 está instalado globalmente
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2 globalmente..."
    sudo npm install -g pm2
fi

# Instalar dependências
echo "📦 Instalando dependências do Node.js..."
npm install

# Configurar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "⚙️ Criando arquivo de configuração .env..."
    cp .env.example .env
    
    # Gerar JWT secret aleatório
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i "s/seu_jwt_secret_super_seguro_aqui/$JWT_SECRET/" .env
    
    echo "📝 Configure o arquivo .env com suas informações do PostgreSQL"
    echo "📍 Arquivo: $(pwd)/.env"
fi

# Configurar banco de dados
echo "🗄️ Configurando banco de dados..."

# Verificar se a database existe
DB_NAME=$(grep DB_NAME .env | cut -d '=' -f2)
DB_USER=$(grep DB_USER .env | cut -d '=' -f2)

if [ -z "$DB_NAME" ]; then
    DB_NAME="conexao_mental"
fi

if [ -z "$DB_USER" ]; then
    DB_USER="postgres"
fi

# Criar database se não existir
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"

echo "✅ Database '$DB_NAME' configurada"

# Executar setup do banco
echo "🔧 Executando setup das tabelas..."
node scripts/setup-database.js

# Configurar PM2
echo "🔄 Configurando PM2..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'conexao-mental-api',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

# Configurar Nginx (se disponível)
if command -v nginx &> /dev/null; then
    echo "🌐 Configurando Nginx..."
    
    cat > /tmp/conexaomental-api.conf << 'EOF'
server {
    listen 80;
    server_name conexaomental.online;

    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name conexaomental.online;

    # Configurações SSL (ajuste os caminhos dos certificados)
    ssl_certificate /etc/letsencrypt/live/conexaomental.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/conexaomental.online/privkey.pem;
    
    # Configurações de segurança SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Configurações de proxy para a API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Headers de CORS
        add_header 'Access-Control-Allow-Origin' 'https://conexaomental.online' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization' always;
        
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://conexaomental.online';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # Configuração para servir o frontend (ajuste o caminho)
    location / {
        root /var/www/conexaomental.online;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Headers de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

    echo "📋 Configuração do Nginx criada em /tmp/conexaomental-api.conf"
    echo "📝 Para aplicar, execute:"
    echo "   sudo cp /tmp/conexaomental-api.conf /etc/nginx/sites-available/"
    echo "   sudo ln -sf /etc/nginx/sites-available/conexaomental-api.conf /etc/nginx/sites-enabled/"
    echo "   sudo nginx -t"
    echo "   sudo systemctl reload nginx"
fi

echo ""
echo "🎉 Instalação concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o arquivo .env com suas credenciais do PostgreSQL"
echo "2. Inicie o servidor: pm2 start ecosystem.config.js"
echo "3. Configure o Nginx (se necessário)"
echo "4. Configure SSL com Let's Encrypt (se necessário)"
echo ""
echo "🔧 Comandos úteis:"
echo "   pm2 start ecosystem.config.js  # Iniciar servidor"
echo "   pm2 stop conexao-mental-api    # Parar servidor"
echo "   pm2 restart conexao-mental-api # Reiniciar servidor"
echo "   pm2 logs conexao-mental-api    # Ver logs"
echo "   pm2 monit                      # Monitorar processo"
echo ""
echo "🌐 API estará disponível em: https://conexaomental.online/api"
echo "🔍 Health check: https://conexaomental.online/api/health"
echo ""
echo "👤 Usuário admin criado:"
echo "   Email: admin@conexaomental.online"
echo "   Senha: admin123456"
echo "   ⚠️  ALTERE A SENHA APÓS O PRIMEIRO LOGIN!"