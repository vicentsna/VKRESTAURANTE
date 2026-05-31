-- MIGRATION: ADICIONAR COLUNA DE OPÇÕES E VARIAÇÕES AOS PRODUTOS
-- Cole e execute no SQL Editor do seu painel Supabase

ALTER TABLE dishes ADD COLUMN IF NOT EXISTS options JSONB;
