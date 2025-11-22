// Simple admin authentication utility
// In production, integrate with your OIDC provider

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || []

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export function validateAdminToken(token: string): boolean {
  // Placeholder for OIDC token validation
  // In production, validate against your OIDC provider
  return !!token
}
