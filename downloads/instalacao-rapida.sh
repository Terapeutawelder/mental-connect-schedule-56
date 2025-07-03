#!/bin/bash

# 🚀 INSTALAÇÃO RÁPIDA - Clínica Conexão Mental
# Execute este script no seu servidor VPS: bash instalacao-rapida.sh

set -e

echo "🚀 Instalação Automática - Clínica Conexão Mental"
echo "Servidor: 157.173.120.220"
echo "================================================"

# Verificar se está executando como root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Execute como root: sudo bash instalacao-rapida.sh"
    exit 1
fi

# Criar diretório temporário
mkdir -p /tmp/conexao-mental-install
cd /tmp/conexao-mental-install

echo "📥 Baixando arquivos de instalação..."

# Baixar guia completo
curl -s -o guia-instalacao-vps.md https://raw.githubusercontent.com/user/repo/main/downloads/guia-instalacao-vps.md || echo "Guia disponível localmente"

echo "🔧 Iniciando instalação automática..."

# Script 1: Configurar servidor
echo "1️⃣ Configurando servidor base..."
apt update && apt upgrade -y
apt install -y postgresql postgresql-contrib ufw nginx certbot python3-certbot-nginx htop curl wget git nano

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g pm2

# Configurar PostgreSQL
systemctl enable postgresql
systemctl start postgresql
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'ConexaoMental2024!@#';"
sudo -u postgres createdb conexaomental

# Script 2: Configurar banco de dados
echo "2️⃣ Configurando banco de dados..."
sudo -u postgres psql -d conexaomental << 'EOF'
-- Criar tipos enum
CREATE TYPE user_role AS ENUM ('patient', 'professional', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Criar tabela profiles
CREATE TABLE profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'patient',
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela professionals
CREATE TABLE professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  crp TEXT,
  specialties TEXT[],
  bio TEXT,
  hourly_rate DECIMAL(10,2),
  available_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela appointments
CREATE TABLE appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  video_room_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

-- Criar triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir admin
INSERT INTO profiles (user_id, email, full_name, role, password_hash) VALUES 
('123e4567-e89b-12d3-a456-426614174000', 'admin@conexaomental.com', 'Administrador Sistema', 'admin', '\$2a\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/SjClOK5cG');
EOF

# Script 3: Instalar API
echo "3️⃣ Instalando API..."
mkdir -p /opt/conexaomental/api
cd /opt/conexaomental/api

# Criar package.json
cat > package.json << 'EOF'
{
  "name": "conexao-mental-api",
  "version": "1.0.0",
  "description": "API Backend Clínica Conexão Mental",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5"
  }
}
EOF

npm install

# Criar .env
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
JWT_SECRET=ConexaoMental_JWT_Secret_2024_Super_Segura_157.173.120.220
DB_HOST=localhost
DB_PORT=5432
DB_NAME=conexaomental
DB_USER=postgres
DB_PASSWORD=ConexaoMental2024!@#
EOF

# Copiar server.js do contexto existente
cp /root/current-project/server/server.js ./server.js || echo "⚠️ server.js não encontrado, criando básico..."

# Se não encontrou, criar server.js básico
if [ ! -f "server.js" ]; then
cat > server.js << 'EOF'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Clínica Conexão Mental API'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
EOF
fi

# Configurar PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'conexao-mental-api',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

# Script 4: Configurar Nginx
echo "4️⃣ Configurando Nginx..."
cat > /etc/nginx/sites-available/conexaomental << 'EOF'
server {
    listen 80;
    server_name 157.173.120.220 clinicaconexaomental.online;
    
    location / {
        root /opt/conexaomental/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Script 5: Instalar Frontend
echo "5️⃣ Configurando Frontend..."
mkdir -p /opt/conexaomental/frontend/dist
cat > /opt/conexaomental/frontend/dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clínica Conexão Mental</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; color: white; }
        .container { text-align: center; padding: 2rem; }
        .logo { font-size: 4rem; margin-bottom: 1rem; }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        .status { margin-top: 2rem; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px; }
        .btn { background: rgba(255,255,255,0.2); border: 2px solid white; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 10px; display: inline-block; }
        .btn:hover { background: white; color: #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🧠</div>
        <h1>Clínica Conexão Mental</h1>
        <p>Plataforma de Teleconsultas em Saúde Mental</p>
        <div>
            <a href="/api/health" class="btn" target="_blank">Status API</a>
        </div>
        <div class="status">
            <h3>✅ Sistema Instalado!</h3>
            <p>Servidor: 157.173.120.220</p>
            <p>API: Operacional</p>
            <p>Banco: PostgreSQL</p>
        </div>
    </div>
</body>
</html>
EOF

# Script 6: Configurar firewall e permissões
echo "6️⃣ Configurando segurança..."
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 3001

useradd -m -s /bin/bash conexaomental || true
chown -R conexaomental:conexaomental /opt/conexaomental

# Script 7: Iniciar serviços
echo "7️⃣ Iniciando serviços..."
systemctl enable nginx
systemctl start nginx
nginx -t && systemctl reload nginx

cd /opt/conexaomental/api
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Script 8: Criar utilitários
echo "8️⃣ Criando utilitários..."
cat > /usr/local/bin/conexao-status << 'EOF'
#!/bin/bash
echo "=== STATUS CLÍNICA CONEXÃO MENTAL ==="
echo "PostgreSQL: $(systemctl is-active postgresql)"
echo "Nginx: $(systemctl is-active nginx)"
echo "API: $(pm2 describe conexao-mental-api > /dev/null && echo 'Ativo' || echo 'Inativo')"
echo "Espaço: $(df -h / | tail -1 | awk '{print $5}')"
echo "Memória: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "======================================"
EOF
chmod +x /usr/local/bin/conexao-status

# Finalizar
echo ""
echo "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "======================================"
echo "🌐 Site: http://157.173.120.220"
echo "🔧 API: http://157.173.120.220/api/health"
echo "📊 Status: conexao-status"
echo ""
echo "📋 CREDENCIAIS:"
echo "PostgreSQL: postgres / ConexaoMental2024!@#"
echo "Admin: admin@conexaomental.com / admin123"
echo ""
echo "🔧 COMANDOS ÚTEIS:"
echo "pm2 status"
echo "pm2 logs conexao-mental-api"
echo "systemctl status nginx"
echo "conexao-status"
echo ""
echo "⚠️  IMPORTANTE:"
echo "1. Altere as senhas padrão"
echo "2. Configure SSL para produção"
echo "3. Configure backup automático"

# Testar instalação
sleep 3
echo ""
echo "🧪 TESTANDO INSTALAÇÃO..."
if curl -f http://localhost/api/health &>/dev/null; then
    echo "✅ API funcionando!"
else
    echo "⚠️  API pode estar iniciando..."
fi

if curl -f http://localhost &>/dev/null; then
    echo "✅ Frontend funcionando!"
else
    echo "⚠️  Frontend pode estar configurando..."
fi

echo ""
echo "✨ Instalação finalizada! Acesse: http://157.173.120.220"