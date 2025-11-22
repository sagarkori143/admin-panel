-- ZEN Code Gateway Database Schema
-- Run this script to create the initial database schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  oidc_sub VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Quotas table
CREATE TABLE IF NOT EXISTS quotas (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  tokens_per_minute INTEGER DEFAULT 10000,
  tokens_per_day INTEGER DEFAULT 100000,
  requests_per_minute INTEGER DEFAULT 10,
  concurrent_requests INTEGER DEFAULT 2,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Policies table
CREATE TABLE IF NOT EXISTS policies (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  mcp_whitelist JSONB DEFAULT '[]'::jsonb,
  web_search_enabled BOOLEAN DEFAULT false,
  allowed_tools JSONB DEFAULT '["code", "file"]'::jsonb,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  action VARCHAR(100) NOT NULL,
  prompt TEXT,
  tokens_used INTEGER,
  response_time FLOAT,
  user_request JSONB,
  server_computation JSONB,
  model_response JSONB,
  status VARCHAR(50) DEFAULT 'success',
  metadata JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_user_timestamp ON audit_logs(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_status ON audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_audit_server_computation ON audit_logs USING GIN (server_computation);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_oidc_sub ON users(oidc_sub);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotas_updated_at BEFORE UPDATE ON quotas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
