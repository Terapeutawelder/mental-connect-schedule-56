# Scripts de Configuração do Servidor

Este diretório contém scripts para automatizar a configuração e manutenção do servidor Contabo.

## 📁 Arquivos

### 🚀 Instalação Principal
- **`install-server.sh`** - Script principal de instalação automática
- **`migrate-to-contabo.sql`** - Schema do banco de dados
- **`setup-cron.sh`** - Configuração de tarefas automáticas

### 🔄 Manutenção
- **`backup-db.sh`** - Script de backup automático do PostgreSQL
- **`docker-compose.yml`** - Configuração Docker para ambiente de produção

## 🛠️ Como Usar

### 1. Instalação Inicial (Ubuntu 20.04)

```bash
# Fazer upload dos scripts para o servidor
scp scripts/* root@157.173.120.220:/tmp/

# Conectar ao servidor
ssh root@157.173.120.220

# Dar permissão e executar
chmod +x /tmp/install-server.sh
cd /tmp && ./install-server.sh
```

### 2. Configurar Tarefas Automáticas

```bash
chmod +x /tmp/setup-cron.sh
./setup-cron.sh
```

### 3. Executar Migração do Banco

```bash
psql -h localhost -U postgres -d conexaomental -f /tmp/migrate-to-contabo.sql
```

## 🔧 Configuração DNS (Hostinger)

Após a instalação, configure o DNS:

1. Acesse o painel da Hostinger
2. Vá em **DNS Zone**
3. Adicione os registros:
   - **Tipo A**: `@` → `157.173.120.220`
   - **Tipo A**: `www` → `157.173.120.220`

## 📋 Verificações Pós-Instalação

```bash
# Verificar status dos serviços
server-status

# Testar conexão com banco
psql -h localhost -U postgres -d conexaomental -c "SELECT version();"

# Verificar logs
tail -f /var/log/postgresql/postgresql-*.log
```

## 🐳 Docker (Alternativo)

Para usar Docker em vez da instalação direta:

```bash
# Fazer upload do docker-compose.yml
scp docker-compose.yml root@157.173.120.220:/opt/conexaomental/

# Iniciar serviços
cd /opt/conexaomental
docker-compose up -d

# Com monitoramento (opcional)
docker-compose --profile monitoring up -d
```

## 📊 Comandos Úteis

### Backup Manual
```bash
/opt/conexaomental/scripts/backup-db.sh
```

### Ver Logs de Backup
```bash
tail -f /var/log/backup-db.log
```

### Verificar Espaço em Disco
```bash
df -h
du -sh /opt/backups/
```

### Monitorar Processos
```bash
htop
ps aux | grep postgres
```

## 🔐 Informações de Conexão

**String de Conexão:**
```
postgresql://postgres:postgres123!%40%23@157.173.120.220:5432/conexaomental
```

**Credenciais:**
- Host: `157.173.120.220`
- Porta: `5432`
- Banco: `conexaomental`
- Usuário: `postgres`
- Senha: `postgres123!@#`

## 🔒 Segurança

### Firewall (UFW)
- SSH (22): ✅ Liberado
- HTTP (80): ✅ Liberado
- HTTPS (443): ✅ Liberado
- PostgreSQL (5432): ✅ Liberado

### Recomendações
1. Altere as senhas padrão em produção
2. Configure SSL/TLS com Let's Encrypt
3. Monitore logs regularmente
4. Mantenha backups atualizados

## 🆘 Resolução de Problemas

### PostgreSQL não inicia
```bash
sudo systemctl status postgresql
sudo journalctl -u postgresql
```

### Erro de conexão
```bash
# Verificar se está escutando
netstat -tlnp | grep 5432

# Testar localmente
psql -h localhost -U postgres -c "SELECT 1;"
```

### Problemas de firewall
```bash
sudo ufw status
sudo ufw allow 5432
```

## 📞 Suporte

Para problemas específicos, verifique:
1. Logs do sistema: `/var/log/syslog`
2. Logs do PostgreSQL: `/var/log/postgresql/`
3. Status dos serviços: `server-status`