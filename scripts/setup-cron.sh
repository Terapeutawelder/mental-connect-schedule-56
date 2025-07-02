#!/bin/bash

# Script para configurar tarefas automáticas (cron)

echo "🕒 Configurando tarefas automáticas..."

# Criar diretório para logs de cron se não existir
mkdir -p /var/log/cron

# Backup para o arquivo de cron atual
crontab -l > /tmp/current_cron 2>/dev/null || echo "" > /tmp/current_cron

# Adicionar tarefas ao cron
cat >> /tmp/current_cron << 'EOF'

# === CONEXÃO MENTAL - TAREFAS AUTOMÁTICAS ===

# Backup diário às 2h da manhã
0 2 * * * /opt/conexaomental/scripts/backup-db.sh >> /var/log/cron/backup.log 2>&1

# Limpeza de logs antigos (manter últimos 30 dias)
0 3 * * 0 find /var/log -name "*.log" -mtime +30 -delete

# Verificação de saúde do sistema às 6h
0 6 * * * /usr/local/bin/server-status >> /var/log/cron/health.log 2>&1

# Atualização automática de segurança (domingo às 4h)
0 4 * * 0 apt update && apt upgrade -y >> /var/log/cron/updates.log 2>&1

# Reinicialização semanal do Nginx (domingo às 5h)
0 5 * * 0 systemctl reload nginx >> /var/log/cron/nginx.log 2>&1

# Limpeza de backups antigos (manter últimos 30 dias)
0 1 * * * find /opt/backups -name "*.gz" -mtime +30 -delete

EOF

# Aplicar o novo crontab
crontab /tmp/current_cron

# Remover arquivo temporário
rm /tmp/current_cron

# Garantir que o serviço cron está rodando
systemctl enable cron
systemctl start cron

echo "✅ Tarefas automáticas configuradas:"
echo "   - Backup diário às 2h"
echo "   - Limpeza de logs aos domingos às 3h"
echo "   - Verificação de saúde às 6h"
echo "   - Atualizações de segurança aos domingos às 4h"
echo "   - Reinicialização do Nginx aos domingos às 5h"
echo ""
echo "Para ver as tarefas: crontab -l"
echo "Para editar as tarefas: crontab -e"
echo "Para ver logs: tail -f /var/log/cron/backup.log"