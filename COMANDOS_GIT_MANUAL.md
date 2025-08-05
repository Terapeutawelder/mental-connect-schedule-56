# 🚀 COMANDOS GIT - EXECUTAR UM POR VEZ

## ⚠️ IMPORTANTE: Execute cada comando separadamente e aguarde a resposta

### 1️⃣ Primeiro, verificar o status atual:
```bash
git branch
```

### 2️⃣ Remover o repositório antigo:
```bash
git remote remove origin
```

### 3️⃣ Adicionar o novo repositório:
```bash
git remote add origin https://github.com/Terapeutawelder/-clinica-conexao-mental.git
```

### 4️⃣ Verificar se foi adicionado:
```bash
git remote -v
```

### 5️⃣ Criar branch limpo:
```bash
git checkout -b deploy-novo
```

### 6️⃣ Adicionar arquivos (comando único):
```bash
git add -A
```

### 7️⃣ Fazer commit:
```bash
git commit -m "feat: Clínica Conexão Mental v1.0.0"
```

### 8️⃣ Fazer push forçado:
```bash
git push -u origin deploy-novo:main --force
```

## 🔑 QUANDO PEDIR CREDENCIAIS:
- **Username:** Terapeutawelder
- **Password:** [Cole seu Personal Access Token]

## ✅ SUCESSO
Se tudo der certo, você verá:
```
To https://github.com/Terapeutawelder/-clinica-conexao-mental.git
 * [new branch]      deploy-novo -> main
```

## 🆘 SE DER ERRO

### Erro de autenticação:
```bash
git config --global credential.helper store
```

### Erro de branch:
```bash
git branch -D deploy-novo
git checkout -b deploy-novo
```

### Erro de push:
```bash
git push origin deploy-novo:main --force
```

Execute os comandos um por vez no Shell!