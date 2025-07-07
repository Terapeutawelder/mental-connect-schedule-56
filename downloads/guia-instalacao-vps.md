# 🚀 Guia de Instalação Completa - Clínica Conexão Mental
## VPS: 157.173.120.220

### Pré-requisitos
- Servidor VPS Ubuntu 20.04+ ou Debian 11+
- Acesso root via SSH
- Domínio configurado (opcional)

---

## 📦 PASSO 1: Preparar Arquivos no Servidor

### 1.1 Conectar ao servidor
```bash
ssh root@157.173.120.220
```

### 1.2 Criar diretório temporário
```bash
mkdir -p /tmp/conexao-mental-install
cd /tmp/conexao-mental-install
```

### 1.3 Baixar arquivos de instalação
Execute os comandos abaixo para criar os arquivos necessários:

```bash
# Script principal de instalação do servidor
cat > install-server.sh << 'EOF'
#!/bin/bash

# Script de Instalação Automática - Clínica Conexão Mental
# Execute como root: sudo bash install-server.sh

set -e

echo "🚀 Iniciando instalação da Clínica Conexão Mental..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logs
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar se está executando como root
if [ "$EUID" -ne 0 ]; then
    log_error "Execute como root: sudo bash install-server.sh"
    exit 1
fi

# 1. Atualizar sistema
log_step "Atualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar dependências
log_step "Instalando dependências..."
apt install -y postgresql postgresql-contrib ufw nginx certbot python3-certbot-nginx htop curl wget git nano pm2

# 3. Instalar Node.js 18
log_step "Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 4. Configurar PostgreSQL
log_step "Configurando PostgreSQL..."

# Backup dos arquivos originais
cp /etc/postgresql/*/main/postgresql.conf /etc/postgresql/*/main/postgresql.conf.backup
cp /etc/postgresql/*/main/pg_hba.conf /etc/postgresql/*/main/pg_hba.conf.backup

# Configurar postgresql.conf
PG_VERSION=$(ls /etc/postgresql/)
PG_CONF="/etc/postgresql/${PG_VERSION}/main/postgresql.conf"

# Configurações de segurança e performance
cat >> $PG_CONF << 'PGEOF'

# Configurações personalizadas Conexão Mental
listen_addresses = '*'
port = 5432
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB

# Configurações de log
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 10MB
log_min_messages = warning
log_min_error_statement = error
log_min_duration_statement = 1000
PGEOF

# Configurar pg_hba.conf
PG_HBA="/etc/postgresql/${PG_VERSION}/main/pg_hba.conf"
cat > $PG_HBA << 'HBAEOF'
# PostgreSQL Client Authentication Configuration File

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             postgres                                peer
local   all             all                                     peer

# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256

# IPv6 local connections:
host    all             all             ::1/128                 scram-sha-256

# Allow replication connections from localhost
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            scram-sha-256
host    replication     all             ::1/128                 scram-sha-256

# Conexões externas seguras para Conexão Mental
host    all             all             0.0.0.0/0               scram-sha-256
HBAEOF

# 5. Reiniciar PostgreSQL
log_step "Reiniciando PostgreSQL..."
systemctl restart postgresql
systemctl enable postgresql

# 6. Configurar usuário e senha do PostgreSQL
log_step "Configurando usuário PostgreSQL..."
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'ConexaoMental2024!@#';"

# 7. Criar banco de dados
log_step "Criando banco de dados..."
sudo -u postgres createdb conexaomental

# 8. Configurar Firewall
log_step "Configurando firewall..."
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 5432
ufw allow 3001

# 9. Configurar diretórios da aplicação
log_step "Configurando diretórios..."
mkdir -p /opt/conexaomental/{frontend,api}
useradd -m -s /bin/bash conexaomental || true
chown -R conexaomental:conexaomental /opt/conexaomental

# 10. Configurar Nginx
log_step "Configurando Nginx..."
systemctl enable nginx
systemctl start nginx

# Criar configuração do site
cat > /etc/nginx/sites-available/conexaomental << 'NGINXEOF'
server {
    listen 80;
    server_name 157.173.120.220 conexaomental.online www.conexaomental.online;
    
    # Frontend (React)
    location / {
        root /opt/conexaomental/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache estático
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
NGINXEOF

ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 11. Instalar PM2 globalmente
log_step "Instalando PM2..."
npm install -g pm2

# 12. Criar script de status
cat > /usr/local/bin/conexao-status << 'STATUSEOF'
#!/bin/bash
echo "=== STATUS CLÍNICA CONEXÃO MENTAL ==="
echo "PostgreSQL: $(systemctl is-active postgresql)"
echo "Nginx: $(systemctl is-active nginx)"
echo "UFW: $(ufw status | head -1)"
echo "PM2 Processes:"
pm2 list
echo "Espaço em disco: $(df -h / | tail -1 | awk '{print $5}')"
echo "Memória: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "======================================"
STATUSEOF
chmod +x /usr/local/bin/conexao-status

# 13. Migração do banco de dados
log_step "Executando migração do banco..."
sudo -u postgres psql -d conexaomental -f /tmp/conexao-mental-install/migrate.sql

# 14. Mostrar informações finais
log_step "Instalação do servidor concluída! 🎉"
echo ""
echo "=== INFORMAÇÕES DO SERVIDOR ==="
echo "IP do Servidor: 157.173.120.220"
echo "PostgreSQL Port: 5432"
echo "Database: conexaomental"
echo "User: postgres"
echo "Password: ConexaoMental2024!@#"
echo ""
echo "String de conexão:"
echo "postgresql://postgres:ConexaoMental2024!%40%23@157.173.120.220:5432/conexaomental"
echo ""
echo "=== PRÓXIMOS PASSOS ==="
echo "1. Execute: bash install-api.sh"
echo "2. Execute: bash install-frontend.sh"
echo "3. Configure SSL: certbot --nginx -d conexaomental.online"
echo "4. Para verificar status: conexao-status"
echo ""
log_warn "Guarde bem a senha do PostgreSQL!"

EOF

chmod +x install-server.sh
```

### 1.4 Criar script de migração do banco
```bash
cat > migrate.sql << 'EOF'
-- Migração do banco Clínica Conexão Mental
-- Baseado no Supabase para PostgreSQL standalone

-- 1. Criar tipos enum
CREATE TYPE user_role AS ENUM ('patient', 'professional', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- 2. Criar tabela profiles
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

-- 3. Criar tabela professionals
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

-- 4. Criar tabela appointments
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

-- 5. Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Criar triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Criar índices para performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_professionals_profile_id ON professionals(profile_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_professional_id ON appointments(professional_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);

-- 8. Inserir usuário administrador
INSERT INTO profiles (user_id, email, full_name, role, password_hash) VALUES 
('123e4567-e89b-12d3-a456-426614174000', 'admin@conexaomental.com', 'Administrador Sistema', 'admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/SjClOK5cG');

-- 9. Comentários
COMMENT ON TABLE profiles IS 'Tabela de perfis de usuários do sistema';
COMMENT ON TABLE professionals IS 'Dados específicos dos profissionais de saúde mental';
COMMENT ON TABLE appointments IS 'Agendamentos de consultas e sessões';

EOF
```

### 1.5 Criar script de instalação da API
```bash
cat > install-api.sh << 'EOF'
#!/bin/bash

# Script de Instalação da API - Clínica Conexão Mental
# Execute após install-server.sh

set -e

echo "🔧 Instalando API Conexão Mental..."

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 1. Criar estrutura da API
log_step "Criando estrutura da API..."
cd /opt/conexaomental/api

# 2. Criar package.json
cat > package.json << 'PKGEOF'
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
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
PKGEOF

# 3. Instalar dependências
log_step "Instalando dependências..."
npm install

# 4. Criar arquivo .env
cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=3001
JWT_SECRET=ConexaoMental_JWT_Secret_2024_Super_Segura_157.173.120.220
DB_HOST=localhost
DB_PORT=5432
DB_NAME=conexaomental
DB_USER=postgres
DB_PASSWORD=ConexaoMental2024!@#
ENVEOF

# 5. Criar server.js
cat > server.js << 'SERVEREOF'
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middlewares
app.use(helmet());
app.use(cors({
  origin: ['http://157.173.120.220', 'https://conexaomental.online', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
app.use('/api/', limiter);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rotas de Autenticação

// Registro
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name, role = 'patient' } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, senha e nome completo são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar se usuário já existe
    const existingUser = await pool.query(
      'SELECT * FROM profiles WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Gerar UUID para user_id
    const userId = require('crypto').randomUUID();

    // Criar usuário
    const result = await pool.query(
      'INSERT INTO profiles (user_id, email, full_name, role, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, role, created_at',
      [userId, email.toLowerCase(), full_name, role, hashedPassword]
    );

    const user = result.rows[0];

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const result = await pool.query(
      'SELECT * FROM profiles WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const user = result.rows[0];

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar token
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, created_at, updated_at FROM profiles WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Clínica Conexão Mental API',
    version: '1.0.0'
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Conexão Mental rodando na porta ${PORT}`);
});
SERVEREOF

# 6. Criar configuração do PM2
cat > ecosystem.config.js << 'ECOEOF'
module.exports = {
  apps: [{
    name: 'conexao-mental-api',
    script: 'server.js',
    instances: 1,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/pm2/conexao-mental-api-error.log',
    out_file: '/var/log/pm2/conexao-mental-api-out.log',
    log_file: '/var/log/pm2/conexao-mental-api.log',
    time: true,
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
ECOEOF

# 7. Ajustar permissões
chown -R conexaomental:conexaomental /opt/conexaomental/api

# 8. Iniciar com PM2
log_step "Iniciando API com PM2..."
cd /opt/conexaomental/api
sudo -u conexaomental pm2 start ecosystem.config.js
sudo -u conexaomental pm2 save
pm2 startup

# 9. Testar API
log_step "Testando API..."
sleep 3
if curl -f http://localhost:3001/api/health &>/dev/null; then
    log_info "✅ API funcionando corretamente!"
else
    echo "⚠️  API pode não estar respondendo ainda. Verifique: pm2 logs conexao-mental-api"
fi

echo ""
echo "🎉 API instalada com sucesso!"
echo "URL: http://157.173.120.220:3001/api"
echo "Health: http://157.173.120.220:3001/api/health"
echo ""
echo "Comandos úteis:"
echo "- pm2 status"
echo "- pm2 logs conexao-mental-api"
echo "- pm2 restart conexao-mental-api"

EOF

chmod +x install-api.sh
```

### 1.6 Criar script de instalação do frontend
```bash
cat > install-frontend.sh << 'EOF'
#!/bin/bash

# Script de Instalação do Frontend - Clínica Conexão Mental

set -e

echo "🎨 Instalando Frontend Conexão Mental..."

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 1. Clonar repositório (substitua pela URL real do seu repositório)
log_step "Baixando código do frontend..."
cd /opt/conexaomental

# Se você tem o código em um repositório Git, use:
# git clone https://github.com/seu-usuario/conexao-mental.git frontend
# cd frontend

# Para este exemplo, vamos criar uma estrutura básica
mkdir -p frontend/dist
cd frontend

# 2. Instalar dependências (se você tem package.json)
# npm install

# 3. Construir para produção
# npm run build

# 4. Para este exemplo, vamos criar um index.html básico
log_step "Criando build de produção..."
cat > dist/index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clínica Conexão Mental</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            color: white;
            padding: 2rem;
        }
        .logo {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .title {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .button {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid white;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-block;
            margin: 0 10px;
            transition: all 0.3s ease;
        }
        .button:hover {
            background: white;
            color: #667eea;
        }
        .status {
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🧠</div>
        <h1 class="title">Clínica Conexão Mental</h1>
        <p class="subtitle">Plataforma de Teleconsultas em Saúde Mental</p>
        
        <div>
            <a href="/api/health" class="button" target="_blank">Status da API</a>
            <a href="mailto:contato@conexaomental.com" class="button">Contato</a>
        </div>
        
        <div class="status">
            <h3>✅ Sistema Instalado com Sucesso!</h3>
            <p>Servidor: 157.173.120.220</p>
            <p>Frontend: Operacional</p>
            <p>API: http://157.173.120.220:3001/api</p>
            <p>Banco de Dados: PostgreSQL Configurado</p>
        </div>
    </div>
    
    <script>
        // Verificar status da API
        fetch('/api/health')
            .then(response => response.json())
            .then(data => {
                console.log('API Status:', data);
            })
            .catch(error => {
                console.error('API Error:', error);
            });
    </script>
</body>
</html>
HTMLEOF

# 5. Ajustar permissões
chown -R conexaomental:conexaomental /opt/conexaomental/frontend

# 6. Recarregar Nginx
systemctl reload nginx

log_info "✅ Frontend instalado!"
echo ""
echo "🌐 Acesse: http://157.173.120.220"
echo "📊 API Health: http://157.173.120.220/api/health"
echo ""
echo "Para fazer deploy do seu código React:"
echo "1. Copie os arquivos do build para: /opt/conexaomental/frontend/dist/"
echo "2. Execute: systemctl reload nginx"

EOF

chmod +x install-frontend.sh
```

---

## 📋 PASSO 2: Executar Instalação

### 2.1 Executar instalação do servidor
```bash
cd /tmp/conexao-mental-install
bash install-server.sh
```

### 2.2 Executar instalação da API
```bash
bash install-api.sh
```

### 2.3 Executar instalação do frontend
```bash
bash install-frontend.sh
```

---

## 🧪 PASSO 3: Verificar Instalação

### 3.1 Verificar status geral
```bash
conexao-status
```

### 3.2 Testar API
```bash
curl http://157.173.120.220:3001/api/health
```

### 3.3 Testar site
```bash
curl http://157.173.120.220
```

---

## 🔧 PASSO 4: Configurações Pós-Instalação

### 4.1 Configurar SSL (Opcional)
```bash
# Se você tem um domínio configurado
certbot --nginx -d conexaomental.online
```

### 4.2 Configurar backup automático
```bash
# Criar script de backup
cat > /opt/conexaomental/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/conexaomental/backups"
mkdir -p $BACKUP_DIR
pg_dump -h localhost -U postgres -d conexaomental > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/conexaomental/backup.sh

# Adicionar ao cron para backup diário
echo "0 2 * * * /opt/conexaomental/backup.sh" | crontab -
```

---

## 📝 PASSO 5: Informações Importantes

### Credenciais do Sistema:
- **IP do Servidor:** 157.173.120.220
- **PostgreSQL:** 
  - Host: localhost
  - Port: 5432
  - Database: conexaomental
  - User: postgres
  - Password: ConexaoMental2024!@#
- **API:** http://157.173.120.220:3001/api
- **Frontend:** http://157.173.120.220

### Usuário Administrador Padrão:
- **Email:** admin@conexaomental.com
- **Senha:** admin123 (altere após primeiro login)

### Comandos Úteis:
```bash
# Verificar status
conexao-status

# Logs da API
pm2 logs conexao-mental-api

# Reiniciar API
pm2 restart conexao-mental-api

# Reiniciar Nginx
systemctl restart nginx

# Verificar PostgreSQL
systemctl status postgresql
```

### Estrutura de Diretórios:
```
/opt/conexaomental/
├── api/                 # Backend API
├── frontend/            # Frontend React
├── backups/            # Backups do banco
└── logs/               # Logs do sistema
```

---

## ⚠️ Importante:

1. **Altere as senhas padrão** em produção
2. **Configure SSL** para uso em produção
3. **Configure backups regulares**
4. **Monitore os logs** regularmente
5. **Mantenha o sistema atualizado**

Para suporte, mantenha os logs disponíveis e execute `conexao-status` para diagnóstico.