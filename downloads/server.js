const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'conexaomental',
  password: 'postgres123!@#',
  port: 5432,
});

// Middlewares
app.use(helmet());
app.use(cors({
  origin: ['https://clinicaconexaomental.online', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela
  message: 'Muitas tentativas. Tente novamente em 15 minutos.'
});
app.use('/api/', limiter);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_conexao_mental_2024';

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Validação de entrada
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Rotas de Autenticação

// Registro
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name, role = 'patient' } = req.body;

    // Sanitizar entradas
    const sanitizedEmail = sanitizeInput(email?.toLowerCase());
    const sanitizedName = sanitizeInput(full_name);

    // Validações
    if (!sanitizedEmail || !password || !sanitizedName) {
      return res.status(400).json({ error: 'Email, senha e nome completo são obrigatórios' });
    }

    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    if (!['patient', 'professional', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role inválido' });
    }

    // Verificar se usuário já existe
    const existingUser = await pool.query(
      'SELECT * FROM profiles WHERE email = $1',
      [sanitizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const result = await pool.query(
      'INSERT INTO profiles (email, full_name, role, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role, created_at',
      [sanitizedEmail, sanitizedName, role, hashedPassword]
    );

    const user = result.rows[0];

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sanitizar entrada
    const sanitizedEmail = sanitizeInput(email?.toLowerCase());

    if (!sanitizedEmail || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Buscar usuário
    const result = await pool.query(
      'SELECT * FROM profiles WHERE email = $1',
      [sanitizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const user = result.rows[0];

    // Verificar se tem senha cadastrada
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Usuário não tem senha cadastrada. Entre em contato com o suporte.' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar token
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, created_at, updated_at FROM profiles WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Reset de senha (placeholder)
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    const sanitizedEmail = sanitizeInput(email?.toLowerCase());

    if (!sanitizedEmail) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Verificar se usuário existe
    const result = await pool.query(
      'SELECT * FROM profiles WHERE email = $1',
      [sanitizedEmail]
    );

    if (result.rows.length === 0) {
      // Por segurança, não revelamos se o email existe ou não
      return res.json({ message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha' });
    }

    // Aqui você implementaria o envio de email
    // Por enquanto, apenas retornamos sucesso
    res.json({ message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha' });
  } catch (error) {
    console.error('Erro no reset de senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Conexão Mental API'
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});