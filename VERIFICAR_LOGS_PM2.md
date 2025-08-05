# VERIFICAR LOGS PM2 - APLICAÇÃO NÃO RESPONDE

## Execute no servidor:

```bash
# VERIFICAR LOGS DO PM2
pm2 logs conexaomental --lines 20

# SE NÃO MOSTRAR NADA, VERIFICAR STATUS DETALHADO
pm2 show conexaomental

# TESTAR PORTA ESPECÍFICA
netstat -tlnp | grep :5000

# SE ESTIVER VAZIA, REINICIAR COM LOGS
pm2 restart conexaomental --update-env
sleep 10
pm2 logs conexaomental --lines 10

# TESTAR NOVAMENTE
curl -v http://localhost:5000
```

Execute e me envie o resultado dos logs.