# Como Configurar o Arquivo .env no Servidor

## 🔧 VOCÊ PRECISA PREENCHER COM DADOS REAIS

O arquivo `.env` precisa das suas credenciais verdadeiras para funcionar:

### 1. DATABASE_URL (Obrigatório)
```
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
```

**Exemplo real:**
```
DATABASE_URL=postgresql://postgres:minhasenha@localhost:5432/conexaomental
```

**OU se usar Neon/Supabase:**
```
DATABASE_URL=postgresql://user:password@ep-123.us-east-1.aws.neon.tech/neondb
```

### 2. Chaves do Mercado Pago (Para pagamentos)
```
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-1234567890-xxxxxx-yyyyyy
MERCADO_PAGO_PUBLIC_KEY=APP_USR-abcdef-123456-789012
```

**Como obter:**
1. Acesse: https://www.mercadopago.com.br/developers
2. Entre na sua conta
3. Vá em "Suas integrações" > "Criar aplicação"
4. Copie as chaves de TESTE primeiro (para testar)
5. Depois use as chaves de PRODUÇÃO

### 3. Configuração de ambiente
```
NODE_ENV=production
PORT=5000
```

## 📝 EXEMPLO COMPLETO DO .env

```bash
# Banco de dados (OBRIGATÓRIO - substitua pelos seus dados)
DATABASE_URL=postgresql://postgres:suasenha@localhost:5432/conexaomental

# Mercado Pago (OBRIGATÓRIO para pagamentos)
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-1234567890-070325-abcdef123456-789012345
MERCADO_PAGO_PUBLIC_KEY=APP_USR-fedcba98-7654-3210-9876-543210fedcba

# Configuração do servidor
NODE_ENV=production
PORT=5000
```

## 🚨 IMPORTANTE:

### SEM DATABASE_URL = aplicação não funciona
- O sistema precisa do banco para login, cadastros, etc.
- Se não tiver PostgreSQL, pode usar Neon (gratuito)

### SEM Mercado Pago = pagamentos não funcionam  
- O site carrega, mas botões de pagamento dão erro
- Para testar: use chaves de TESTE primeiro

### Onde conseguir DATABASE_URL:

**Opção 1: PostgreSQL local**
```bash
sudo -u postgres createdb conexaomental
DATABASE_URL=postgresql://postgres:senha@localhost:5432/conexaomental
```

**Opção 2: Neon (gratuito)**
1. Acesse: https://neon.tech
2. Crie conta gratuita
3. Crie novo projeto
4. Copie a connection string

**Opção 3: Supabase (gratuito)**
1. Acesse: https://supabase.com
2. Crie projeto
3. Settings > Database > Connection string

## ⚡ COMANDOS PARA CONFIGURAR:

```bash
cd /var/www/conexaomental/Downloads/conexao-mental-versao-atual-20250729
cp .env.example .env
nano .env
```

**No nano:**
1. Substitua cada valor pelos seus dados reais
2. Ctrl+X para sair
3. Y para salvar
4. Enter para confirmar

Depois:
```bash
npm install
npm run build
pm2 start npm --name "conexaomental" -- start
```

**Você tem essas credenciais ou precisa criar?**