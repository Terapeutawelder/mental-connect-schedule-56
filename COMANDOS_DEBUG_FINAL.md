# 🔍 DEBUG FINAL - SITE DESATUALIZADO

## ✅ CÓDIGO CORRETO CONFIRMADO:
- PricingSection.tsx tem os 4 planos (R$ 37,90 / R$ 57,90 / R$ 97,90 / R$ 197,90) ✅
- FAQSection.tsx tem as 10 perguntas ✅  
- Index.tsx importa ambos componentes ✅

## 🎯 PROBLEMA IDENTIFICADO:
**O servidor pode estar servindo build antigo ou arquivos em cache**

## 🚀 COMANDOS DEFINITIVOS PARA RESOLVER:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. PARAR APLICAÇÃO
pm2 delete all

# 2. REBUILD COMPLETO
rm -rf dist/
npm run build

# 3. VERIFICAR SE ARQUIVOS FORAM ATUALIZADOS
ls -la dist/
ls -la dist/public/

# 4. RESTART COM BUILD NOVO
DATABASE_URL="postgresql://cloud_admin@localhost:5432/conexaomental?sslmode=disable" pm2 start npm --name "conexaomental" -- start

# 5. AGUARDAR E TESTAR
sleep 15
curl -s http://127.0.0.1:5000 | grep -i "sessão de acolhimento\|hipnoterapia\|como funciona o atendimento"

# 6. LIMPAR CACHE NGINX FORÇADAMENTE
sudo nginx -s reload

# 7. TESTAR DOMÍNIO
curl -s http://clinicaconexaomental.online | grep -i "sessão de acolhimento\|faq"
```

## 🔧 ALTERNATIVA - VERIFICAR DIRETÓRIO CORRETO:
```bash
# Verificar se estamos no diretório certo
pwd
find /var/www -name "package.json" -type f
cd $(find /var/www -name "package.json" -type f | head -1 | xargs dirname)
pwd
```

## 💡 TESTE DIRETO DO CÓDIGO:
```bash
# Verificar se o código atual tem os componentes corretos
grep -r "Sessão de Acolhimento" client/src/
grep -r "Como funciona o atendimento" client/src/
```

## 🎯 RESULTADO ESPERADO NO CURL:
- "Sessão de Acolhimento"
- "R$ 37,90"
- "Hipnoterapia" 
- "Como funciona o atendimento online?"
- "Garantia de 7 dias"