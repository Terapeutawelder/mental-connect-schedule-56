#!/bin/bash

# Script de Instalação Automática - API Conexão Mental
# Execute como root: sudo bash install-api.sh

set -e

echo "🚀 Iniciando instalação da API Conexão Mental..."

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
    log_error "Execute como root: sudo bash install-api.sh"
    exit 1
fi

# 1. Atualizar Node.js se necessário
log_step "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    log_info "Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
else
    log_info "Node.js já instalado: $(node --version)"
fi

# 2. Instalar PM2 globalmente
log_step "Instalando PM2..."
npm install -g pm2

# 3. Criar diretório da API
log_step "Configurando diretório da API..."
mkdir -p /opt/conexaomental/api
cd /opt/conexaomental/api

# 4. Copiar arquivos (assumindo que estão no mesmo diretório)
log_step "Copiando arquivos da API..."
cp /tmp/conexao-mental-api/* . 2>/dev/null || {
    log_error "Arquivos não encontrados em /tmp/conexao-mental-api/"
    log_info "Certifique-se de que todos os arquivos estão no diretório correto"
    exit 1
}

# 5. Instalar dependências
if [ -f "package.json" ]; then
    log_info "Instalando dependências..."
    npm install
else
    log_error "package.json não encontrado! Certifique-se de copiar todos os arquivos."
    exit 1
fi

# 6. Gerar chave JWT segura
log_step "Gerando chave JWT..."
JWT_SECRET=$(openssl rand -base64 32)
sed -i "s/sua_chave_secreta_super_segura_conexao_mental_2024/$JWT_SECRET/g" .env
log_info "Chave JWT gerada e configurada."

# 7. Configurar PM2
log_step "Configurando PM2..."
# O arquivo ecosystem.config.js já deve estar presente

# 8. Criar diretório de logs
mkdir -p /var/log/pm2

# 9. Parar aplicação se estiver rodando
pm2 stop conexao-mental-api 2>/dev/null || true
pm2 delete conexao-mental-api 2>/dev/null || true

# 10. Iniciar aplicação
log_step "Iniciando aplicação..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 11. Configurar Nginx
log_step "Configurando Nginx..."
cp nginx-site.conf /etc/nginx/sites-available/conexaomental

# Ativar site
ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
if nginx -t; then
    systemctl reload nginx
    log_info "Nginx configurado com sucesso."
else
    log_error "Erro na configuração do Nginx."
    exit 1
fi

# 12. Configurar firewall
log_step "Configurando firewall..."
ufw allow 3001

# 13. Testar API
log_step "Testando API..."
sleep 3
if curl -f http://localhost:3001/api/health &>/dev/null; then
    log_info "API funcionando corretamente!"
else
    log_warn "API pode não estar respondendo ainda. Verifique os logs: pm2 logs"
fi

# 14. Mostrar informações finais
echo ""
echo "=== INSTALAÇÃO CONCLUÍDA! 🎉 ==="
echo "API URL: https://clinicaconexaomental.online/api"
echo "Health Check: https://clinicaconexaomental.online/api/health"
echo ""
echo "=== COMANDOS ÚTEIS ==="
echo "Status da API: pm2 status"
echo "Logs da API: pm2 logs conexao-mental-api"
echo "Reiniciar API: pm2 restart conexao-mental-api"
echo "Parar API: pm2 stop conexao-mental-api"
echo ""
echo "=== PRÓXIMOS PASSOS ==="
echo "1. Teste a API: curl https://clinicaconexaomental.online/api/health"
echo "2. Configure SSL: certbot --nginx -d clinicaconexaomental.online"
echo "3. Teste o login no frontend: https://clinicaconexaomental.online/auth"
echo ""
log_info "Instalação concluída com sucesso!"