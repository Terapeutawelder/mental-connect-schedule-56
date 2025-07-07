# 🚀 Instalação da API Conexão Mental

## 📦 Arquivos Incluídos
- `install-api.sh` - Script de instalação automática
- `package.json` - Dependências Node.js
- `server.js` - Servidor Express principal
- `.env` - Variáveis de ambiente
- `ecosystem.config.js` - Configuração PM2
- `nginx-site.conf` - Configuração Nginx

## ⚡ Instalação Rápida

### 1. Conectar ao servidor
```bash
ssh root@157.173.120.220
```

### 2. Fazer upload dos arquivos
```bash
# Criar diretório temporário
mkdir -p /tmp/conexao-mental-api
cd /tmp/conexao-mental-api

# Fazer upload de todos os arquivos
# Use scp, rsync ou seu método preferido
```

### 3. Executar instalação automática
```bash
# Dar permissão de execução
chmod +x install-api.sh

# Executar instalação
./install-api.sh
```

## ✅ O que o script faz automaticamente:
- ✅ Verifica/instala Node.js
- ✅ Instala PM2
- ✅ Copia arquivos para `/opt/conexaomental/api`
- ✅ Instala dependências
- ✅ Gera chave JWT segura
- ✅ Configura PM2
- ✅ Configura Nginx
- ✅ Configura firewall
- ✅ Inicia serviços

## 🧪 Teste final
```bash
curl https://conexaomental.online/api/health
```

**🎉 Pronto! Sua API estará funcionando!**