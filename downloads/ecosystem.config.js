module.exports = {
  apps: [{
    name: 'conexao-mental-api',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/pm2/conexao-mental-api-error.log',
    out_file: '/var/log/pm2/conexao-mental-api-out.log',
    log_file: '/var/log/pm2/conexao-mental-api-combined.log',
    time: true
  }]
};