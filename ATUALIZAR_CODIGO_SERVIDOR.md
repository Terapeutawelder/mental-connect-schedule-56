# 🚀 ATUALIZAR CÓDIGO NO SERVIDOR

## 1. BAIXAR NOVA VERSÃO DO REPLIT:
```bash
cd /var/www/conexaomental/Downloads
wget https://replit.com/@TerapeutaWelder/clinica-conexao-mental/zip -O nova-versao.zip
unzip nova-versao.zip
```

## 2. OU USAR GIT PARA PUXAR MUDANÇAS:
```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# Backup da versão atual
cp -r . ../backup-$(date +%Y%m%d-%H%M%S)

# Puxar do GitHub (se configurado)
git pull origin main

# OU substituir arquivos específicos
# Baixar Index.tsx atualizado
wget https://raw.githubusercontent.com/Terapeutawelder/clinicaconexaomental/main/client/src/pages/Index.tsx -O client/src/pages/Index.tsx
```

## 3. REBUILD E RESTART FORÇADO:
```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# Parar tudo
pm2 delete all
pm2 kill

# Limpar cache completamente
rm -rf dist/ node_modules/.vite node_modules/.cache

# Reinstalar dependências
npm install

# Build novo
npm run build

# Verificar build
ls -la dist/
du -sh dist/

# Restart
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" NODE_ENV=production pm2 start npm --name "conexaomental" -- start

# Aguardar
sleep 30

# Teste
curl -s http://127.0.0.1:5000 | wc -c
curl -s http://127.0.0.1:5000 | grep -i "sessão de acolhimento"
```

## 4. SE AINDA NÃO FUNCIONAR - SUBSTITUIÇÃO MANUAL:
```bash
# Verificar se PricingSection tem o conteúdo correto
grep -n "Sessão de Acolhimento" client/src/components/sections/PricingSection.tsx

# Verificar se FAQSection tem o conteúdo correto  
grep -n "Como funciona o atendimento" client/src/components/sections/FAQSection.tsx

# Se não tiver, substituir manualmente os arquivos
```