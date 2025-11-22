import { neon } from "@neondatabase/serverless"

// Singleton pattern for database connection
let sql: ReturnType<typeof neon> | null = null

export function getDB() {
  if (!sql) {
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      console.error(
        "[Closed Code Admin] DATABASE_URL environment variable is not set. Please configure your database connection in environment variables.",
      )
      return null
    }
    sql = neon(dbUrl)
  }
  return sql
}

// Database types
export interface User {
  id: string
  email: string
  oidc_sub: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface Quota {
  user_id: string
  tokens_per_minute: number
  tokens_per_day: number
  requests_per_minute: number
  concurrent_requests: number
  updated_at: string
}

export interface Policy {
  user_id: string
  mcp_whitelist: string[]
  web_search_enabled: boolean
  allowed_tools: string[]
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  timestamp: string
  action: string
  prompt?: string
  tokens_used?: number
  response_time?: number
  user_request?: Record<string, unknown>
  server_computation?: Record<string, unknown>
  model_response?: Record<string, unknown>
  status: string
  metadata?: Record<string, unknown>
}
