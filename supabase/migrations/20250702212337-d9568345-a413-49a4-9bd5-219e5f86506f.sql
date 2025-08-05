-- Adicionar coluna password_hash à tabela profiles para autenticação personalizada
ALTER TABLE public.profiles ADD COLUMN password_hash TEXT;

-- Criar índice para melhorar performance nas consultas por email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Criar índice para password_hash (útil para validações)
CREATE INDEX IF NOT EXISTS idx_profiles_password_hash ON public.profiles(password_hash) WHERE password_hash IS NOT NULL;