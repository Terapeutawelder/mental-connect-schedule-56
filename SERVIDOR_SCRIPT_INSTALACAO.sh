#!/bin/bash

echo "🚀 Iniciando instalação limpa do Conexão Mental..."

# 1. Limpar instalação anterior
echo "🧹 Removendo instalação anterior..."
sudo rm -rf /var/www/conexaomental
sudo rm -rf /var/www/clinicaconexaomental*
pm2 delete all 2>/dev/null || true

# 2. Criar diretório e baixar arquivos
echo "📁 Criando diretório do projeto..."
sudo mkdir -p /var/www/conexaomental
cd /var/www/conexaomental

# 3. Baixar arquivo limpo (substitua pela URL do seu arquivo)
echo "⬇️ Baixando código fonte..."
wget https://github.com/SEU_USUARIO/conexao-mental/archive/main.tar.gz -O projeto.tar.gz
tar -xzf projeto.tar.gz --strip-components=1
rm projeto.tar.gz

# 4. Configurar permissões
echo "🔐 Configurando permissões..."
sudo chown -R $USER:$USER /var/www/conexaomental

# 5. Instalar Node.js 18 se necessário
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 6. Instalar dependências
echo "📚 Instalando dependências..."
npm install

# 7. Configurar ambiente
echo "⚙️ Configurando ambiente..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✏️ Configure o arquivo .env com suas credenciais:"
    echo "   - DATABASE_URL"
    echo "   - MERCADO_PAGO_ACCESS_TOKEN"
    echo "   - MERCADO_PAGO_PUBLIC_KEY"
    nano .env
fi

# 8. Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# 9. Configurar Nginx
echo "🌐 Configurando Nginx..."
sudo tee /etc/nginx/sites-available/conexaomental > /dev/null <<EOF
server {
    listen 80;
    server_name conexaomental.online www.conexaomental.online;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# 10. Ativar site
echo "🔗 Ativando configuração do Nginx..."
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/conexaomental /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 11. Iniciar aplicação
echo "🚀 Iniciando aplicação..."
pm2 start npm --name "conexaomental" -- start
pm2 startup
pm2 save

# 12. Verificar funcionamento
echo "🔍 Verificando funcionamento..."
sleep 5
echo "Testando localhost:5000..."
curl -s http://localhost:5000 | head -5

echo "Testando domínio..."
curl -s https://conexaomental.online | head -5

echo "✅ Instalação concluída!"
echo "📊 Status dos serviços:"
pm2 status
echo ""
echo "🌐 Site disponível em: https://conexaomental.online"
echo "📱 Para verificar logs: pm2 logs conexaomental"
echo "🔄 Para reiniciar: pm2 restart conexaomental"