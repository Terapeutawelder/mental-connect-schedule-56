const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'conexao_mental',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const createTables = async () => {
  try {
    console.log('🔄 Iniciando configuração do banco de dados...');

    // Criar extensões necessárias
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ Extensão uuid-ossp criada');

    // Criar tipos enum
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('patient', 'professional', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✅ Enum user_role criado');

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✅ Enum appointment_status criado');

    // Criar tabela profiles
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        password_hash TEXT,
        phone TEXT,
        role user_role NOT NULL DEFAULT 'patient',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela profiles criada');

    // Criar tabela professionals
    await pool.query(`
      CREATE TABLE IF NOT EXISTS professionals (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        bio TEXT,
        crp TEXT,
        specialties TEXT[],
        hourly_rate NUMERIC,
        available_hours JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        UNIQUE(profile_id)
      )
    `);
    console.log('✅ Tabela professionals criada');

    // Criar tabela appointments
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
        scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
        duration_minutes INTEGER NOT NULL DEFAULT 60,
        status appointment_status NOT NULL DEFAULT 'scheduled',
        notes TEXT,
        video_room_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela appointments criada');

    // Criar função para atualizar updated_at
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    console.log('✅ Função update_updated_at_column criada');

    // Criar triggers para updated_at
    await pool.query(`
      DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
      CREATE TRIGGER update_profiles_updated_at
        BEFORE UPDATE ON profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS update_professionals_updated_at ON professionals;
      CREATE TRIGGER update_professionals_updated_at
        BEFORE UPDATE ON professionals
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
      CREATE TRIGGER update_appointments_updated_at
        BEFORE UPDATE ON appointments
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Triggers para updated_at criados');

    // Criar índices para performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_professionals_profile_id ON professionals(profile_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_appointments_professional_id ON appointments(professional_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)');
    console.log('✅ Índices criados');

    // Criar usuário admin padrão se não existir
    const adminExists = await pool.query(
      "SELECT id FROM profiles WHERE email = 'admin@conexaomental.online'"
    );

    if (adminExists.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const adminPassword = await bcrypt.hash('admin123456', 12);
      
      await pool.query(`
        INSERT INTO profiles (email, full_name, password_hash, role)
        VALUES ('admin@conexaomental.online', 'Administrador', $1, 'admin')
      `, [adminPassword]);
      
      console.log('✅ Usuário admin criado');
      console.log('📧 Email: admin@conexaomental.online');
      console.log('🔑 Senha: admin123456');
      console.log('⚠️  IMPORTANTE: Altere a senha do admin após o primeiro login!');
    } else {
      console.log('ℹ️  Usuário admin já existe');
    }

    console.log('🎉 Configuração do banco de dados concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  createTables();
}

module.exports = createTables;