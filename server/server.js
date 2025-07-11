const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'conexao_mental',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'https://conexaomental.online',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Muitas tentativas. Tente novamente em alguns minutos.' }
});
app.use('/api/', limiter);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';

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

// Middleware de autorização
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }
    next();
  };
};

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message 
    });
  }
});

// ===== ROTAS DE AUTENTICAÇÃO =====

// Cadastro
app.post('/api/auth/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').trim().isLength({ min: 2 }),
  body('role').optional().isIn(['patient', 'professional', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
    }

    const { email, password, full_name, role = 'patient' } = req.body;

    // Verificar se usuário já existe
    const existingUser = await pool.query(
      'SELECT id FROM profiles WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Criar usuário
    const result = await pool.query(
      'INSERT INTO profiles (email, full_name, password_hash, role, user_id) VALUES ($1, $2, $3, $4, gen_random_uuid()) RETURNING id, email, full_name, role, created_at',
      [email, full_name, passwordHash, role]
    );

    const user = result.rows[0];

    // Gerar JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
app.post('/api/auth/signin', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { email, password } = req.body;

    // Buscar usuário
    const result = await pool.query(
      'SELECT id, email, full_name, password_hash, role, created_at, updated_at FROM profiles WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = result.rows[0];

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar token (rota /me)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, created_at, updated_at FROM profiles WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Reset de senha (placeholder)
app.post('/api/auth/reset-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  res.json({ message: 'Email de recuperação enviado (funcionalidade em desenvolvimento)' });
});

// ===== ROTAS DE PROFISSIONAIS =====

// Criar perfil profissional
app.post('/api/professionals', authenticateToken, requireRole(['professional', 'admin']), [
  body('bio').optional().trim(),
  body('crp').optional().trim(),
  body('specialties').optional().isArray(),
  body('hourly_rate').optional().isNumeric(),
  body('available_hours').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
    }

    const { bio, crp, specialties, hourly_rate, available_hours } = req.body;

    // Verificar se já existe perfil profissional
    const existing = await pool.query(
      'SELECT id FROM professionals WHERE profile_id = $1',
      [req.user.id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Perfil profissional já existe' });
    }

    const result = await pool.query(
      'INSERT INTO professionals (profile_id, bio, crp, specialties, hourly_rate, available_hours) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, bio, crp, specialties, hourly_rate, JSON.stringify(available_hours)]
    );

    res.status(201).json({
      message: 'Perfil profissional criado com sucesso',
      professional: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao criar perfil profissional:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar profissionais
app.get('/api/professionals', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.bio,
        p.crp,
        p.specialties,
        p.hourly_rate,
        p.available_hours,
        pr.full_name,
        pr.email
      FROM professionals p
      JOIN profiles pr ON p.profile_id = pr.id
      WHERE pr.role = 'professional'
      ORDER BY pr.full_name
    `);

    res.json({ professionals: result.rows });
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTAS DE AGENDAMENTOS =====

// Criar agendamento
app.post('/api/appointments', authenticateToken, [
  body('professional_id').isUUID(),
  body('scheduled_at').isISO8601(),
  body('duration_minutes').optional().isInt({ min: 30, max: 180 }),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
    }

    const { professional_id, scheduled_at, duration_minutes = 60, notes } = req.body;

    // Verificar se o profissional existe
    const professional = await pool.query(
      'SELECT id FROM professionals WHERE id = $1',
      [professional_id]
    );

    if (professional.rows.length === 0) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }

    // Verificar conflitos de horário
    const scheduledDate = new Date(scheduled_at);
    const endTime = new Date(scheduledDate.getTime() + duration_minutes * 60000);

    const conflicts = await pool.query(`
      SELECT id FROM appointments 
      WHERE professional_id = $1 
      AND status NOT IN ('cancelled', 'completed')
      AND (
        (scheduled_at <= $2 AND scheduled_at + INTERVAL '1 minute' * duration_minutes > $2) OR
        (scheduled_at < $3 AND scheduled_at + INTERVAL '1 minute' * duration_minutes >= $3) OR
        (scheduled_at >= $2 AND scheduled_at < $3)
      )
    `, [professional_id, scheduledDate, endTime]);

    if (conflicts.rows.length > 0) {
      return res.status(409).json({ error: 'Horário não disponível' });
    }

    const result = await pool.query(
      'INSERT INTO appointments (patient_id, professional_id, scheduled_at, duration_minutes, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, professional_id, scheduled_at, duration_minutes, notes]
    );

    res.status(201).json({
      message: 'Agendamento criado com sucesso',
      appointment: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar agendamentos do usuário
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    let query;
    let params;

    if (req.user.role === 'admin') {
      // Admin vê todos os agendamentos
      query = `
        SELECT 
          a.*,
          pat.full_name as patient_name,
          pat.email as patient_email,
          prof.full_name as professional_name,
          prof.email as professional_email
        FROM appointments a
        JOIN profiles pat ON a.patient_id = pat.id
        JOIN professionals p ON a.professional_id = p.id
        JOIN profiles prof ON p.profile_id = prof.id
        ORDER BY a.scheduled_at DESC
      `;
      params = [];
    } else if (req.user.role === 'professional') {
      // Profissional vê seus agendamentos
      query = `
        SELECT 
          a.*,
          pat.full_name as patient_name,
          pat.email as patient_email
        FROM appointments a
        JOIN profiles pat ON a.patient_id = pat.id
        JOIN professionals p ON a.professional_id = p.id
        WHERE p.profile_id = $1
        ORDER BY a.scheduled_at DESC
      `;
      params = [req.user.id];
    } else {
      // Paciente vê seus agendamentos
      query = `
        SELECT 
          a.*,
          prof.full_name as professional_name,
          prof.email as professional_email
        FROM appointments a
        JOIN professionals p ON a.professional_id = p.id
        JOIN profiles prof ON p.profile_id = prof.id
        WHERE a.patient_id = $1
        ORDER BY a.scheduled_at DESC
      `;
      params = [req.user.id];
    }

    const result = await pool.query(query, params);
    res.json({ appointments: result.rows });

  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar status do agendamento
app.patch('/api/appointments/:id', authenticateToken, [
  body('status').isIn(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    // Verificar permissões
    let query;
    let params;

    if (req.user.role === 'admin') {
      query = 'SELECT * FROM appointments WHERE id = $1';
      params = [id];
    } else if (req.user.role === 'professional') {
      query = `
        SELECT a.* FROM appointments a
        JOIN professionals p ON a.professional_id = p.id
        WHERE a.id = $1 AND p.profile_id = $2
      `;
      params = [id, req.user.id];
    } else {
      query = 'SELECT * FROM appointments WHERE id = $1 AND patient_id = $2';
      params = [id, req.user.id];
    }

    const appointment = await pool.query(query, params);

    if (appointment.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Atualizar agendamento
    const updateQuery = notes 
      ? 'UPDATE appointments SET status = $1, notes = $2, updated_at = NOW() WHERE id = $3 RETURNING *'
      : 'UPDATE appointments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
    
    const updateParams = notes ? [status, notes, id] : [status, id];
    
    const result = await pool.query(updateQuery, updateParams);

    res.json({
      message: 'Agendamento atualizado com sucesso',
      appointment: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTAS ADMINISTRATIVAS =====

// Listar todos os usuários (admin apenas)
app.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.email,
        p.full_name,
        p.role,
        p.phone,
        p.created_at,
        p.updated_at,
        CASE 
          WHEN prof.id IS NOT NULL THEN TRUE 
          ELSE FALSE 
        END as has_professional_profile
      FROM profiles p
      LEFT JOIN professionals prof ON p.id = prof.profile_id
      ORDER BY p.created_at DESC
    `);

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas (admin apenas)
app.get('/api/admin/stats', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const stats = await Promise.all([
      pool.query('SELECT COUNT(*) as total_users FROM profiles'),
      pool.query('SELECT COUNT(*) as total_professionals FROM professionals'),
      pool.query('SELECT COUNT(*) as total_appointments FROM appointments'),
      pool.query('SELECT COUNT(*) as pending_appointments FROM appointments WHERE status = \'scheduled\''),
      pool.query('SELECT COUNT(*) as completed_appointments FROM appointments WHERE status = \'completed\'')
    ]);

    res.json({
      total_users: parseInt(stats[0].rows[0].total_users),
      total_professionals: parseInt(stats[1].rows[0].total_professionals),
      total_appointments: parseInt(stats[2].rows[0].total_appointments),
      pending_appointments: parseInt(stats[3].rows[0].pending_appointments),
      completed_appointments: parseInt(stats[4].rows[0].completed_appointments)
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Middleware de tratamento de erros 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de tratamento de erros globais
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
});