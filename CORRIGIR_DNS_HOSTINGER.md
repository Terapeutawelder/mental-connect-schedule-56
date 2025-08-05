# 🌐 CORRIGIR DNS HOSTINGER - DOMÍNIO APONTANDO PARA SERVIDOR ERRADO

## ❌ PROBLEMA IDENTIFICADO:
- DNS `clinicaconexaomental.online` aponta para outro servidor da Hostinger
- Servidor atual está funcionando perfeitamente em 127.0.0.1:5000
- Mas domínio não chega neste servidor

## ✅ SOLUÇÕES:

### OPÇÃO 1: CORRIGIR DNS NO PAINEL HOSTINGER
1. Acesse o painel da Hostinger
2. Vá em "Domínios" > "clinicaconexaomental.online"
3. Clique em "Gerenciar DNS"
4. Procure pelo registro A:
   ```
   Tipo: A
   Nome: @ (ou clinicaconexaomental.online)
   Valor: [IP_DO_SERVIDOR_ATUAL]
   ```
5. Altere o IP para o IP do servidor onde está rodando a aplicação
6. Salve e aguarde propagação (até 24h)

### OPÇÃO 2: DESCOBRIR IP DO SERVIDOR ATUAL
```bash
# No servidor atual, descobrir o IP público:
curl -4 ifconfig.me
# ou
dig +short myip.opendns.com @resolver1.opendns.com
# ou
wget -qO- http://ipecho.net/plain
```

### OPÇÃO 3: USAR SUBDOMÍNIO OU IP DIRETO
Se o IP do servidor atual for `123.456.789.012`, acesse:
- http://123.456.789.012 (IP direto)
- Ou configure um subdomínio: app.clinicaconexaomental.online

### OPÇÃO 4: MOVER APLICAÇÃO PARA SERVIDOR CORRETO
Se preferir manter o DNS atual:
1. Descobrir qual servidor a Hostinger está usando para o domínio
2. Fazer upload da aplicação para lá
3. Configurar a aplicação no servidor correto

## 🔍 VERIFICAR DNS ATUAL:
```bash
# Verificar para onde o domínio aponta:
nslookup clinicaconexaomental.online
dig clinicaconexaomental.online

# Verificar IP do servidor atual:
curl -4 ifconfig.me
```

## 🎯 TESTE RÁPIDO:
```bash
# 1. Descobrir IP do servidor atual
SERVER_IP=$(curl -s ifconfig.me)
echo "IP do servidor atual: $SERVER_IP"

# 2. Descobrir IP do domínio
DOMAIN_IP=$(dig +short clinicaconexaomental.online)
echo "IP do domínio: $DOMAIN_IP"

# 3. Comparar
if [ "$SERVER_IP" = "$DOMAIN_IP" ]; then
  echo "✅ DNS correto"
else
  echo "❌ DNS aponta para servidor errado"
  echo "Servidor atual: $SERVER_IP"
  echo "Domínio aponta para: $DOMAIN_IP"
fi
```

## ⚡ SOLUÇÃO TEMPORÁRIA:
Enquanto não corrige o DNS, use o IP direto:
```bash
SERVER_IP=$(curl -s ifconfig.me)
echo "Acesse temporariamente: http://$SERVER_IP"
```