# Como Corrigir o Erro do GitHub

## 🔴 Erro identificado:
```
error: src refspec main does not match any
error: failed to push some refs to 'https://github.com/Terapeutawelder/clinicaconexaomental.git'
```

## 💡 Solução: Execute estes comandos no CMD

### 1. Verificar status atual
```cmd
cd C:\Users\Welder de Aquino\Downloads\conexao-mental-versao-atual-20250729
git status
```

### 2. Verificar se existe branch main
```cmd
git branch
```

### 3. Se não existir branch main, criar:
```cmd
git checkout -b main
```

### 4. Verificar se repositório existe no GitHub
O repositório deve estar em: `https://github.com/Terapeutawelder/clinicaconexaomental`

Se não existir, você precisa:
1. Ir para github.com
2. Clicar em "New repository" 
3. Nome: `clinicaconexaomental`
4. Deixar público
5. NÃO adicionar README
6. Criar repositório

### 5. Configurar remote corretamente
```cmd
git remote remove origin
git remote add origin https://github.com/Terapeutawelder/clinicaconexaomental.git
```

### 6. Fazer push forçado (primeira vez)
```cmd
git add .
git commit -m "Primeira versao completa do projeto"
git push -u origin main --force
```

### 7. Se pedir credenciais:
- **Username**: Terapeutawelder
- **Password**: Use Personal Access Token (não senha normal)

## 🔑 Como criar Personal Access Token

1. GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Expiration: No expiration
4. Marcar: ✅ repo, ✅ workflow, ✅ write:packages
5. Generate token
6. **COPIE o token** (só aparece uma vez)
7. Use esse token como senha no CMD

## 🎯 Comandos alternativos se continuar dando erro

### Opção A: Forçar push
```cmd
git push origin main --force
```

### Opção B: Redefinir tudo
```cmd
git init
git add .
git commit -m "Projeto completo"
git branch -M main
git remote add origin https://github.com/Terapeutawelder/clinicaconexaomental.git
git push -u origin main --force
```

### Opção C: Via GitHub Desktop (mais fácil)
1. Baixe GitHub Desktop
2. File → Add local repository
3. Escolha a pasta do projeto
4. Publish repository
5. Nome: clinicaconexaomental
6. Sync

## ✅ Verificar se funcionou

Depois do push, vá para:
`https://github.com/Terapeutawelder/clinicaconexaomental`

Deve aparecer todos os arquivos do projeto.

## 🚀 Próximo passo

Depois que o GitHub estiver atualizado, no servidor:
```bash
cd /var/www
sudo rm -rf conexaomental
sudo git clone https://github.com/Terapeutawelder/clinicaconexaomental.git conexaomental
cd conexaomental
sudo chown -R $USER:$USER .
npm install
# Seguir instalação...
```