#!/bin/bash

# Script para inicializar o banco de dados PostgreSQL local
# Execute este script no seu servidor após a instalação

echo "🔧 Inicializando banco de dados conexaomental..."

# Verificar se o PostgreSQL está rodando
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Executar o script SQL
echo "📊 Executando configuração do banco..."
sudo -u postgres psql -d conexaomental -f /root/scripts/setup-database.sql

if [ $? -eq 0 ]; then
    echo "✅ Banco de dados configurado com sucesso!"
    echo ""
    echo "📋 Credenciais de acesso:"
    echo "🔐 Admin: contato@conexaomental.online / admin123"
    echo "🗄️  Banco: conexaomental"
    echo "👤 Usuário: postgres"
    echo "🔑 Senha: W83683601r@#"
    echo ""
    echo "🚀 Sistema pronto para uso!"
else
    echo "❌ Erro ao configurar o banco de dados!"
    exit 1
fi