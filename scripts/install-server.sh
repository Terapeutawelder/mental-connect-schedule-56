#!/bin/bash

# Script de Instalação Automática - Servidor Contabo
# Execute como root: sudo bash install-server.sh

set -e

echo "🚀 Iniciando instalação automática do servidor..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Verificar se está executando como root
if [ "$EUID" -ne 0 ]; then
    log_error "Execute como root: sudo bash install-server.sh"
    exit 1
fi

# 1. Atualizar sistema
log_info "Atualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar dependências
log_info "Instalando dependências..."
apt install -y postgresql postgresql-contrib ufw nginx certbot python3-certbot-nginx htop curl wget git nano

# 3. Configurar PostgreSQL
log_info "Configurando PostgreSQL..."

# Backup dos arquivos originais
cp /etc/postgresql/*/main/postgresql.conf /etc/postgresql/*/main/postgresql.conf.backup
cp /etc/postgresql/*/main/pg_hba.conf /etc/postgresql/*/main/pg_hba.conf.backup

# Configurar postgresql.conf
PG_VERSION=$(ls /etc/postgresql/)
PG_CONF="/etc/postgresql/${PG_VERSION}/main/postgresql.conf"

# Configurações de segurança e performance
cat >> $PG_CONF << 'EOF'

# Configurações personalizadas
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
EOF

# Configurar pg_hba.conf
PG_HBA="/etc/postgresql/${PG_VERSION}/main/pg_hba.conf"
cat > $PG_HBA << 'EOF'
# PostgreSQL Client Authentication Configuration File

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             postgres                                peer
local   all             all                                     peer

# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256

# IPv6 local connections:
host    all             all             ::1/128                 scram-sha-256

# Allow replication connections from localhost, by a user with the replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            scram-sha-256
host    replication     all             ::1/128                 scram-sha-256

# Conexões externas seguras (substitua pelo seu IP se necessário)
host    all             all             0.0.0.0/0               scram-sha-256
EOF

# 4. Reiniciar PostgreSQL
log_info "Reiniciando PostgreSQL..."
systemctl restart postgresql
systemctl enable postgresql

# 5. Configurar usuário e senha do PostgreSQL
log_info "Configurando usuário PostgreSQL..."
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres123!@#';"

# 6. Criar banco de dados
log_info "Criando banco de dados..."
sudo -u postgres createdb conexaomental

# 7. Configurar Firewall
log_info "Configurando firewall..."
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 5432

# 8. Configurar Nginx básico
log_info "Configurando Nginx..."
systemctl enable nginx
systemctl start nginx

# Criar configuração básica do site
cat > /etc/nginx/sites-available/conexaomental << 'EOF'
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 9. Instalar Node.js
log_info "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 10. Criar usuário para aplicação
log_info "Criando usuário para aplicação..."
useradd -m -s /bin/bash app || true
usermod -aG sudo app || true

# 11. Configurar estrutura de diretórios
log_info "Configurando estrutura de diretórios..."
mkdir -p /opt/conexaomental
chown app:app /opt/conexaomental

# 12. Criar script de status
cat > /usr/local/bin/server-status << 'EOF'
#!/bin/bash
echo "=== STATUS DO SERVIDOR ==="
echo "PostgreSQL: $(systemctl is-active postgresql)"
echo "Nginx: $(systemctl is-active nginx)"
echo "UFW: $(ufw status | head -1)"
echo "Espaço em disco: $(df -h / | tail -1 | awk '{print $5}')"
echo "Memória: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "==========================="
EOF
chmod +x /usr/local/bin/server-status

# 13. Mostrar informações finais
log_info "Instalação concluída! 🎉"
echo ""
echo "=== INFORMAÇÕES IMPORTANTES ==="
echo "IP do Servidor: $(curl -s ifconfig.me)"
echo "PostgreSQL Port: 5432"
echo "Database: conexaomental"
echo "User: postgres"
echo "Password: postgres123!@#"
echo ""
echo "String de conexão:"
echo "postgresql://postgres:postgres123!%40%23@157.173.120.220:5432/conexaomental"
echo ""
echo "=== PRÓXIMOS PASSOS ==="
echo "1. Configure o DNS no Hostinger:"
echo "   - Tipo A: @ -> 157.173.120.220"
echo "   - Tipo A: www -> 157.173.120.220"
echo ""
echo "2. Execute o script de migração:"
echo "   psql -h localhost -U postgres -d conexaomental -f migrate-to-contabo.sql"
echo ""
echo "3. Para verificar status: server-status"
echo ""
log_warn "Lembre-se de alterar a senha do PostgreSQL em produção!"