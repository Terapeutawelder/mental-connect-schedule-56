# 📋 DADOS PARA PERSONALIZAÇÃO - INSTALAÇÃO AUTOMÁTICA

## 🔧 Dados que você precisa personalizar antes da instalação:

### 1. **SERVIDOR E DOMÍNIO** (Linhas 10-11)
```bash
# Substitua pelos seus dados:
echo "Servidor: SEU_IP_SERVIDOR"        # Ex: 192.168.1.100
echo "Domínio: SEU_DOMINIO.com"         # Ex: minhaclinica.com.br
```

### 2. **CONFIGURAÇÃO NGINX** (Linha 353)
```bash
server_name SEU_IP_SERVIDOR SEU_DOMINIO.com www.SEU_DOMINIO.com;
```

### 3. **CORS DA API** (Linha 197)
```bash
CORS_ORIGIN=https://SEU_DOMINIO.com
```

### 4. **EMAIL ADMIN** (Linha 147 e 620)
```bash
# Admin inicial do sistema:
'admin@SEU_DOMINIO.com'

# SSL/Certificado:
--email admin@SEU_DOMINIO.com
```

### 5. **FRONTEND TEMPORÁRIO** (Linhas 487-491)
```html
<span class="status-value">SEU_IP_SERVIDOR</span>
<span class="status-value">SEU_DOMINIO.com</span>
```

### 6. **UTILITÁRIOS DE STATUS** (Linhas 562-563)
```bash
echo "📍 Servidor: SEU_IP_SERVIDOR"
echo "🌐 Domínio: SEU_DOMINIO.com"
```

### 7. **MENSAGENS FINAIS** (Linhas 631-632, 682)
```bash
echo "🌐 Site: https://SEU_DOMINIO.com"
echo "🔧 API: https://SEU_DOMINIO.com/api/health"
echo "✨ Instalação finalizada! Acesse: https://SEU_DOMINIO.com"
```

## ⚠️ SENHAS E SEGURANÇA (OPCIONAL - RECOMENDADO ALTERAR):

### 8. **SENHA POSTGRESQL** (Linhas 50, 85, 196, 576, 595, 673)
```bash
# Senha atual: W83683601r@#
# Substitua por uma senha mais segura
```

### 9. **JWT_SECRET** (Linha 191)
```bash
# Gere uma chave mais segura:
JWT_SECRET=SUA_CHAVE_JWT_SUPER_SEGURA_AQUI
```

### 10. **ADMIN INICIAL** (Linha 147)
```bash
# Email e dados do admin inicial
'admin@SEU_DOMINIO.com', 'Seu Nome', 'admin'
```

## 🚀 EXEMPLO PRÁTICO:

Se seu servidor é `45.67.89.123` e domínio é `psicologiavirtual.com.br`:

```bash
# Substitua:
SEU_IP_SERVIDOR → 45.67.89.123
SEU_DOMINIO.com → psicologiavirtual.com.br
admin@SEU_DOMINIO.com → admin@psicologiavirtual.com.br
https://SEU_DOMINIO.com → https://psicologiavirtual.com.br
```

## 📝 CHECKLIST ANTES DE EXECUTAR:

- [ ] Substitui IP do servidor em todas as ocorrências
- [ ] Substitui domínio em todas as ocorrências  
- [ ] Configurei DNS apontando para o servidor
- [ ] Alterei email do admin
- [ ] Optei por alterar senhas (recomendado)
- [ ] Tenho acesso SSH root ao servidor

## 🎯 DEPOIS DE PERSONALIZAR:

1. Salve o arquivo personalizado
2. Envie para seu servidor via SCP/SFTP
3. Execute: `chmod +x instalacao-postgres15.sh`
4. Execute: `sudo ./instalacao-postgres15.sh`