# 🌐 CORREÇÃO DNS HOSTINGER - IP CORRETO IDENTIFICADO

## ✅ INFORMAÇÕES CONFIRMADAS:
- **IP do servidor atual**: `157.173.120.220`
- **Domínio**: `clinicaconexaomental.online`
- **Problema**: DNS aponta para servidor errado

## 🚀 COMANDOS PARA TESTAR NO SERVIDOR:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729

# 1. TESTAR APLICAÇÃO LOCAL
echo "=== TESTANDO APLICAÇÃO LOCAL ==="
curl -s http://127.0.0.1:5000 | wc -c

# 2. TESTAR PELO IP PÚBLICO DO SERVIDOR
echo "=== TESTANDO PELO IP PÚBLICO ==="
curl -s http://157.173.120.220 | wc -c

# 3. VERIFICAR STATUS PM2
pm2 status

# 4. SE NÃO FUNCIONAR, VERIFICAR LOGS
pm2 logs conexaomental --lines 10

# 5. SE PRECISAR RESTART
pm2 restart conexaomental
```

## 🔧 CORREÇÃO DNS NO PAINEL HOSTINGER:

### PASSO A PASSO:
1. **Acesse painel Hostinger**: https://hpanel.hostinger.com
2. **Vá em "Domínios"** → Localizar `clinicaconexaomental.online`
3. **Clique em "Gerenciar"** → "DNS / Nameservers"
4. **Procure registro A**:
   ```
   Tipo: A
   Nome: @ (ou vazio)
   Valor: [IP_ATUAL] ← ALTERAR PARA: 157.173.120.220
   ```
5. **Altere também WWW**:
   ```
   Tipo: A  
   Nome: www
   Valor: 157.173.120.220
   ```
6. **Salve** e aguarde propagação (30min - 24h)

## ⚡ TESTE APÓS CORREÇÃO DNS:
```bash
# Aguardar alguns minutos e testar:
curl -s http://clinicaconexaomental.online | wc -c
curl -s https://clinicaconexaomental.online | wc -c

# Buscar conteúdo específico:
curl -s http://clinicaconexaomental.online | grep -i "sessão de acolhimento"
```

## 🎯 RESULTADO ESPERADO:
- Local (127.0.0.1:5000): >50KB ✅
- IP público (157.173.120.220): >50KB ✅  
- Domínio (após DNS): >50KB ✅
- Conteúdo "Sessão de Acolhimento" encontrado ✅

## 📞 SOLUÇÃO TEMPORÁRIA:
Enquanto DNS não propaga, acesse:
**http://157.173.120.220**