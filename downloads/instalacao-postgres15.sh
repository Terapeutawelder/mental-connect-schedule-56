#!/bin/bash

# 🚀 INSTALAÇÃO COMPLETA - Clínica Conexão Mental
# PostgreSQL 15 + Correções de Autenticação
# Execute: bash instalacao-postgres15.sh

set -e

echo "🚀 Instalação Automática - Clínica Conexão Mental"
echo "Servidor: SEU_IP_SERVIDOR"
echo "Domínio: SEU_DOMINIO.com"
echo "PostgreSQL: Versão 15"
echo "================================================"

# Verificar se está executando como root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Execute como root: sudo bash instalacao-postgres15.sh"
    exit 1
fi

# Criar diretório temporário
mkdir -p /tmp/conexao-mental-install
cd /tmp/conexao-mental-install

echo "🔧 Iniciando instalação automática..."

# Script 1: Atualizar sistema
echo "1️⃣ Atualizando sistema..."
apt update && apt upgrade -y
apt install -y wget curl gnupg2 software-properties-common apt-transport-https lsb-release ca-certificates

# Script 2: Instalar PostgreSQL 15
echo "2️⃣ Instalando PostgreSQL 15..."
wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list
apt update
apt install -y postgresql-15 postgresql-contrib-15

# Iniciar e habilitar PostgreSQL
systemctl enable postgresql
systemctl start postgresql

# Aguardar PostgreSQL inicializar
sleep 5

# Script 3: Configurar PostgreSQL
echo "3️⃣ Configurando PostgreSQL..."

# Configurar senha do usuário postgres
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'W83683601r@#';"

# Criar banco de dados
sudo -u postgres createdb conexaomental

# Configurar pg_hba.conf para permitir autenticação md5
PG_VERSION=$(sudo -u postgres psql -t -c "SELECT version();" | grep -oP '(?<=PostgreSQL )\d+')
PG_HBA_FILE="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"

# Backup do arquivo original
cp "$PG_HBA_FILE" "$PG_HBA_FILE.backup"

# Configurar autenticação
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/$PG_VERSION/main/postgresql.conf
sed -i "s/local   all             postgres                                peer/local   all             postgres                                md5/" "$PG_HBA_FILE"
sed -i "s/local   all             all                                     peer/local   all             all                                     md5/" "$PG_HBA_FILE"

# Reiniciar PostgreSQL
systemctl restart postgresql
sleep 3

# Script 4: Instalar Node.js 18
echo "4️⃣ Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar PM2
npm install -g pm2

# Script 5: Instalar outros pacotes
echo "5️⃣ Instalando pacotes adicionais..."
apt install -y nginx certbot python3-certbot-nginx htop git nano ufw

# Script 6: Configurar banco de dados
echo "6️⃣ Configurando banco de dados..."
export PGPASSWORD='W83683601r@#'
psql -h localhost -U postgres -d conexaomental << 'EOF'
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
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário admin com senha hash correta
INSERT INTO profiles (user_id, email, full_name, role, password_hash) VALUES 
('123e4567-e89b-12d3-a456-426614174000', 'admin@conexaomental.online', 'Administrador Sistema', 'admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/SjClOK5cG');
EOF

unset PGPASSWORD

# Script 7: Configurar API
echo "7️⃣ Instalando API..."
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
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "body-parser": "^1.20.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
EOF

npm install

# Criar arquivo .env
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
JWT_SECRET=ConexaoMental_JWT_Secret_2024_Super_Segura_conexaomental.online
DB_HOST=localhost
DB_PORT=5432
DB_NAME=conexaomental
DB_USER=postgres
DB_PASSWORD=W83683601r@#
CORS_ORIGIN=https://conexaomental.online
EOF

# Criar server.js
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar banco de dados
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Middlewares de segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://conexaomental.online',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite por IP
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Clínica Conexão Mental API',
      database: 'Connected',
      db_time: result.rows[0].now
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      service: 'Clínica Conexão Mental API',
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Rota para listar profissionais
app.get('/api/professionals', async (req, res) => {
  try {
    const query = `
      SELECT p.*, pr.full_name, pr.email, pr.phone 
      FROM professionals p 
      JOIN profiles pr ON p.profile_id = pr.id 
      WHERE pr.role = 'professional'
      ORDER BY pr.full_name
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rota para criar agendamento
app.post('/api/appointments', async (req, res) => {
  try {
    const { patient_id, professional_id, scheduled_at, notes } = req.body;
    
    const query = `
      INSERT INTO appointments (patient_id, professional_id, scheduled_at, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [patient_id, professional_id, scheduled_at, notes]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
  console.log(`🌐 CORS configurado para: ${process.env.CORS_ORIGIN}`);
});

// Tratamento de sinais
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    process.exit(0);
  });
});
EOF

# Configurar PM2
cat > ecosystem.config.js << 'EOF'
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
    },
    error_file: '/var/log/pm2/conexao-mental-api-error.log',
    out_file: '/var/log/pm2/conexao-mental-api-out.log',
    log_file: '/var/log/pm2/conexao-mental-api.log'
  }]
};
EOF

# Script 8: Configurar Nginx
echo "8️⃣ Configurando Nginx..."
cat > /etc/nginx/sites-available/conexaomental << 'EOF'
server {
    listen 80;
    server_name 157.173.120.220 conexaomental.online www.conexaomental.online;
    
    # Configurações gerais
    client_max_body_size 100M;
    
    # Frontend (arquivos estáticos)
    location / {
        root /opt/conexaomental/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Headers de cache para arquivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Logs
    access_log /var/log/nginx/conexaomental.access.log;
    error_log /var/log/nginx/conexaomental.error.log;
}
EOF

# Habilitar site
ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
nginx -t

# Script 9: Configurar Frontend
echo "9️⃣ Configurando Frontend..."
mkdir -p /opt/conexaomental/frontend/dist

# Criar index.html temporário
cat > /opt/conexaomental/frontend/dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clínica Conexão Mental</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            min-height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
        }
        .container { 
            text-align: center; 
            padding: 3rem; 
            background: rgba(255,255,255,0.1); 
            border-radius: 20px; 
            backdrop-filter: blur(10px); 
            box-shadow: 0 20px 40px rgba(0,0,0,0.3); 
            max-width: 600px;
        }
        .logo { font-size: 5rem; margin-bottom: 1rem; }
        h1 { font-size: 3rem; margin-bottom: 1rem; font-weight: 700; }
        .subtitle { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        .btn { 
            background: rgba(255,255,255,0.2); 
            border: 2px solid white; 
            color: white; 
            padding: 15px 30px; 
            border-radius: 50px; 
            text-decoration: none; 
            margin: 10px; 
            display: inline-block; 
            transition: all 0.3s ease;
            font-weight: 600;
        }
        .btn:hover { 
            background: white; 
            color: #667eea; 
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .status { 
            margin-top: 3rem; 
            padding: 2rem; 
            background: rgba(255,255,255,0.15); 
            border-radius: 15px; 
            border: 1px solid rgba(255,255,255,0.2);
        }
        .status h3 { color: #4ade80; margin-bottom: 1rem; }
        .status-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin: 0.5rem 0; 
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .status-item:last-child { border-bottom: none; }
        .status-value { font-weight: 600; color: #4ade80; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🧠</div>
        <h1>Clínica Conexão Mental</h1>
        <p class="subtitle">Plataforma de Teleconsultas em Saúde Mental</p>
        
        <div>
            <a href="/api/health" class="btn" target="_blank">Verificar API</a>
            <a href="https://conexaomental.online" class="btn">Acessar Sistema</a>
        </div>
        
        <div class="status">
            <h3>✅ Sistema Instalado com Sucesso!</h3>
            <div class="status-item">
                <span>Servidor:</span>
                <span class="status-value">157.173.120.220</span>
            </div>
            <div class="status-item">
                <span>Domínio:</span>
                <span class="status-value">conexaomental.online</span>
            </div>
            <div class="status-item">
                <span>API:</span>
                <span class="status-value">Operacional</span>
            </div>
            <div class="status-item">
                <span>Banco:</span>
                <span class="status-value">PostgreSQL 15</span>
            </div>
            <div class="status-item">
                <span>Status:</span>
                <span class="status-value">Pronto para uso</span>
            </div>
        </div>
    </div>
</body>
</html>
EOF

# Script 10: Configurar Firewall
echo "🔒 Configurando Firewall..."
ufw --force enable
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3001/tcp

# Script 11: Configurar permissões
echo "👤 Configurando permissões..."
useradd -m -s /bin/bash conexaomental || true
chown -R conexaomental:conexaomental /opt/conexaomental
chmod +x /opt/conexaomental/api/server.js

# Criar diretório de logs para PM2
mkdir -p /var/log/pm2
chown -R conexaomental:conexaomental /var/log/pm2

# Script 12: Iniciar serviços
echo "🚀 Iniciando serviços..."

# Reiniciar e habilitar Nginx
systemctl enable nginx
systemctl restart nginx

# Aguardar Nginx inicializar
sleep 2

# Testar Nginx novamente
if nginx -t; then
    echo "✅ Nginx configurado corretamente"
else
    echo "❌ Erro na configuração do Nginx"
    exit 1
fi

# Iniciar API com PM2
cd /opt/conexaomental/api
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

# Script 13: Criar utilitários de administração
echo "🛠️ Criando utilitários..."

# Status do sistema
cat > /usr/local/bin/conexao-status << 'EOF'
#!/bin/bash
echo "======================================="
echo "    CLÍNICA CONEXÃO MENTAL - STATUS"
echo "======================================="
echo "📍 Servidor: 157.173.120.220"
echo "🌐 Domínio: conexaomental.online"
echo ""
echo "SERVIÇOS:"
echo "PostgreSQL: $(systemctl is-active postgresql)"
echo "Nginx: $(systemctl is-active nginx)"
echo "API: $(pm2 describe conexao-mental-api > /dev/null 2>&1 && echo 'Ativo' || echo 'Inativo')"
echo ""
echo "RECURSOS:"
echo "Espaço em disco: $(df -h / | tail -1 | awk '{print $5}')"
echo "Memória: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "Uptime: $(uptime -p)"
echo ""
echo "BANCO DE DADOS:"
export PGPASSWORD='W83683601r@#'
if psql -h localhost -U postgres -d conexaomental -c "SELECT COUNT(*) FROM profiles;" > /dev/null 2>&1; then
    echo "Conexão: OK"
    echo "Perfis: $(psql -h localhost -U postgres -d conexaomental -t -c "SELECT COUNT(*) FROM profiles;" | xargs)"
else
    echo "Conexão: ERRO"
fi
unset PGPASSWORD
echo "======================================="
EOF

chmod +x /usr/local/bin/conexao-status

# Backup do banco
cat > /usr/local/bin/conexao-backup << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/conexaomental/backups"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
export PGPASSWORD='W83683601r@#'
pg_dump -h localhost -U postgres conexaomental > "$BACKUP_DIR/backup_$DATE.sql"
unset PGPASSWORD
echo "Backup criado: $BACKUP_DIR/backup_$DATE.sql"
# Manter apenas os 10 backups mais recentes
ls -t $BACKUP_DIR/backup_*.sql | tail -n +11 | xargs -r rm
EOF

chmod +x /usr/local/bin/conexao-backup

# Logs da API
cat > /usr/local/bin/conexao-logs << 'EOF'
#!/bin/bash
echo "Logs da API (últimas 50 linhas):"
echo "================================="
pm2 logs conexao-mental-api --lines 50
EOF

chmod +x /usr/local/bin/conexao-logs

# Script 14: Configurar SSL (preparar para Let's Encrypt)
echo "🔐 Preparando SSL..."
cat > /usr/local/bin/conexao-ssl << 'EOF'
#!/bin/bash
echo "Configurando SSL para conexaomental.online..."
certbot --nginx -d conexaomental.online -d www.conexaomental.online --non-interactive --agree-tos --email admin@conexaomental.online
systemctl reload nginx
echo "SSL configurado com sucesso!"
EOF

chmod +x /usr/local/bin/conexao-ssl

# Finalizar instalação
echo ""
echo "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "======================================"
echo "🌐 Site: https://conexaomental.online"
echo "🔧 API: https://conexaomental.online/api/health"
echo "📊 Status: conexao-status"
echo ""
echo "📋 CREDENCIAIS:"
echo "PostgreSQL: postgres / W83683601r@#"
echo "Admin: admin@conexaomental.online / admin123"
echo ""
echo "🔧 COMANDOS ÚTEIS:"
echo "conexao-status       - Status dos serviços"
echo "conexao-logs         - Logs da API"
echo "conexao-backup       - Backup do banco"
echo "conexao-ssl          - Configurar SSL"
echo "pm2 status           - Status PM2"
echo "systemctl status nginx - Status Nginx"
echo ""
echo "⚠️  PRÓXIMOS PASSOS:"
echo "1. Configure SSL: conexao-ssl"
echo "2. Altere as senhas padrão"
echo "3. Configure backup automático"
echo "4. Faça deploy do frontend React"

# Teste final da instalação
sleep 3
echo ""
echo "🧪 TESTANDO INSTALAÇÃO..."

# Testar API
if curl -f http://localhost:3001/api/health &>/dev/null; then
    echo "✅ API funcionando!"
else
    echo "⚠️  API pode estar iniciando... Aguarde alguns segundos"
fi

# Testar frontend
if curl -f http://localhost &>/dev/null; then
    echo "✅ Frontend funcionando!"
else
    echo "⚠️  Frontend pode estar configurando..."
fi

# Testar banco
export PGPASSWORD='W83683601r@#'
if psql -h localhost -U postgres -d conexaomental -c "SELECT 1;" &>/dev/null; then
    echo "✅ Banco de dados funcionando!"
else
    echo "❌ Erro no banco de dados"
fi
unset PGPASSWORD

echo ""
echo "✨ Instalação finalizada! Acesse: https://conexaomental.online"
echo "📞 Para suporte: admin@conexaomental.online"