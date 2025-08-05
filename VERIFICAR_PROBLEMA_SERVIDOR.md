# Problema: Site Ainda com Versão Antiga

## 🔴 PROBLEMA IDENTIFICADO:
O site https://clinicaconexaomental.online ainda mostra:
- ❌ Versão antiga sem seções de Planos
- ❌ Sem FAQ
- ❌ Sem "O que você procura tratar?"
- ❌ Profissionais fictícios (Ana Paula, Carlos Roberto, etc.)

## 🔍 POSSÍVEIS CAUSAS:

### 1. Nginx ainda apontando para local errado
### 2. Aplicação rodando mas Nginx não está redirecionando
### 3. Cache do Cloudflare mostrando versão antiga
### 4. PM2 rodando mas não servindo arquivos corretos

## 🔧 COMANDOS PARA DIAGNOSTICAR:

Execute no servidor:

### Verificar configuração Nginx
```bash
sudo cat /etc/nginx/sites-enabled/conexaomental
sudo nginx -t
```

### Verificar se PM2 está realmente servindo
```bash
pm2 logs conexaomental --lines 20
curl -v http://localhost:5000
```

### Verificar estrutura de arquivos
```bash
pwd
ls -la
ls -la client/src/pages/
```

### Verificar se está na pasta correta
```bash
find /var/www -name "Index.tsx" -type f
```

## 🎯 SOLUÇÕES:

### Opção 1: Reconfigurar Nginx
```bash
sudo tee /etc/nginx/sites-available/conexaomental > /dev/null <<'EOF'
server {
    listen 80;
    server_name clinicaconexaomental.online www.clinicaconexaomental.online;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
EOF

sudo systemctl reload nginx
```

### Opção 2: Limpar cache Cloudflare
No painel Cloudflare → Caching → Purge Everything

### Opção 3: Verificar se PM2 está servindo corretamente
```bash
pm2 restart conexaomental
curl http://localhost:5000 | grep -i "planos\|faq"
```

### Opção 4: Mover para pasta raiz
```bash
cd /var/www
sudo rm -rf conexaomental_old
sudo mv conexaomental conexaomental_old
sudo cp -r conexaomental_old/Downloads/conexao-mental-versao-atual-20250729/* .
sudo chown -R $USER:$USER .
pm2 restart conexaomental
```

## 🧪 TESTE FINAL:
```bash
curl http://localhost:5000 | grep -i "planos"
```

Deve retornar conteúdo com "planos" se estiver funcionando.