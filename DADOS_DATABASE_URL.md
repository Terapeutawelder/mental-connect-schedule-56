# Como Preencher DATABASE_URL

## 🎯 FORMATO GERAL:
```
DATABASE_URL=postgresql://usuario:senha@servidor:porta/banco
```

## 📝 O QUE CADA PARTE SIGNIFICA:

### **usuario** = Nome do usuário do PostgreSQL
- Exemplo: `postgres` (padrão)
- Ou o usuário que você criou

### **senha** = Senha do usuário PostgreSQL  
- A senha que você definiu na instalação
- Exemplo: `123456`, `minhasenha`, `senha123`

### **servidor** = Endereço do servidor
- `localhost` (se PostgreSQL está no mesmo servidor)
- `127.0.0.1` (mesma coisa que localhost)
- IP do servidor se estiver em outro lugar

### **porta** = Porta do PostgreSQL
- `5432` (porta padrão do PostgreSQL)
- Pode ser outra se você mudou

### **banco** = Nome do banco de dados
- `conexaomental` (nome sugerido)
- Ou qualquer nome que você quiser

## 🔧 EXEMPLOS REAIS:

### **Se PostgreSQL estiver no mesmo servidor:**
```
DATABASE_URL=postgresql://postgres:123456@localhost:5432/conexaomental
```

### **Se você criou usuário específico:**
```
DATABASE_URL=postgresql://welder:minhasenha@localhost:5432/clinica
```

### **Se PostgreSQL estiver em outro servidor:**
```
DATABASE_URL=postgresql://usuario:senha@192.168.1.100:5432/conexaomental
```

## 🚀 COMO DESCOBRIR SEUS DADOS:

### 1. Verificar se PostgreSQL está instalado:
```bash
sudo systemctl status postgresql
```

### 2. Conectar como postgres (usuário padrão):
```bash
sudo -u postgres psql
```

### 3. Ver usuários existentes:
```sql
\du
```

### 4. Ver bancos existentes:
```sql
\l
```

### 5. Criar banco para o projeto:
```sql
CREATE DATABASE conexaomental;
```

### 6. Criar usuário específico (opcional):
```sql
CREATE USER welder WITH PASSWORD '123456';
GRANT ALL PRIVILEGES ON DATABASE conexaomental TO welder;
```

### 7. Sair do PostgreSQL:
```sql
\q
```

## 📋 EXEMPLO COMPLETO DE CONFIGURAÇÃO:

```bash
# Entrar no PostgreSQL
sudo -u postgres psql

# Criar banco e usuário
CREATE DATABASE conexaomental;
CREATE USER conexao WITH PASSWORD 'senha123';
GRANT ALL PRIVILEGES ON DATABASE conexaomental TO conexao;
\q

# No .env usar:
DATABASE_URL=postgresql://conexao:senha123@localhost:5432/conexaomental
```

## ⚠️ SE NÃO TIVER POSTGRESQL INSTALADO:

### Instalar PostgreSQL:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Configurar senha do postgres:
```bash
sudo -u postgres psql
ALTER USER postgres PASSWORD '123456';
\q
```

### Usar no .env:
```
DATABASE_URL=postgresql://postgres:123456@localhost:5432/conexaomental
```

## 🌐 ALTERNATIVAS ONLINE (MAIS FÁCIL):

### **Neon (Recomendado - Gratuito):**
1. Acesse: https://neon.tech
2. Crie conta
3. Criar projeto "conexaomental"
4. Copie a connection string
5. Cole no .env

### **Supabase (Gratuito):**
1. Acesse: https://supabase.com  
2. Crie projeto
3. Settings → Database → Connection string
4. Cole no .env

**Qual opção você prefere: PostgreSQL local ou serviço online?**