#!/bin/bash

# Script de Backup Automático do PostgreSQL
# Adicione ao crontab: 0 2 * * * /opt/conexaomental/scripts/backup-db.sh

set -e

# Configurações
DB_NAME="conexaomental"
DB_USER="postgres"
DB_PASSWORD="postgres123!@#"
BACKUP_DIR="/opt/backups/postgresql"
RETENTION_DAYS=30

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Nome do arquivo com timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/conexaomental_backup_$TIMESTAMP.sql"

# Logs
LOG_FILE="/var/log/backup-db.log"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log_message "Iniciando backup do banco de dados..."

# Exportar senha para pg_dump
export PGPASSWORD=$DB_PASSWORD

# Executar backup
if pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_FILE; then
    # Comprimir backup
    gzip $BACKUP_FILE
    BACKUP_FILE="${BACKUP_FILE}.gz"
    
    log_message "Backup criado com sucesso: $BACKUP_FILE"
    
    # Verificar tamanho do backup
    BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)
    log_message "Tamanho do backup: $BACKUP_SIZE"
    
    # Remover backups antigos
    find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
    log_message "Backups antigos removidos (mais de $RETENTION_DAYS dias)"
    
    # Enviar notificação de sucesso (opcional)
    # curl -X POST "https://api.telegram.org/botTOKEN/sendMessage" \
    #      -d "chat_id=CHAT_ID&text=✅ Backup realizado com sucesso: $BACKUP_SIZE"
    
else
    log_message "ERRO: Falha ao criar backup!"
    
    # Enviar notificação de erro (opcional)
    # curl -X POST "https://api.telegram.org/botTOKEN/sendMessage" \
    #      -d "chat_id=CHAT_ID&text=❌ ERRO: Falha no backup do banco de dados!"
    
    exit 1
fi

# Limpar variável de senha
unset PGPASSWORD

log_message "Processo de backup finalizado."

# Mostrar estatísticas
echo "=== ESTATÍSTICAS DE BACKUP ==="
echo "Total de backups: $(ls -1 $BACKUP_DIR/*.sql.gz 2>/dev/null | wc -l)"
echo "Espaço ocupado: $(du -sh $BACKUP_DIR | cut -f1)"
echo "Backup mais recente: $(ls -lt $BACKUP_DIR/*.sql.gz 2>/dev/null | head -1 | awk '{print $9}' | xargs basename 2>/dev/null || echo 'Nenhum')"