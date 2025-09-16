import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export interface Session {
  authenticated: boolean
  expiresAt: string
}

export function createSession(): string {
  const session: Session = {
    authenticated: true,
    expiresAt: new Date(Date.now() + SESSION_DURATION).toISOString()
  }
  return Buffer.from(JSON.stringify(session)).toString('base64')
}

export function verifySession(sessionToken: string): boolean {
  try {
    const session: Session = JSON.parse(Buffer.from(sessionToken, 'base64').toString())
    return session.authenticated && new Date() < new Date(session.expiresAt)
  } catch {
    return false
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!sessionToken) return false
    return verifySession(sessionToken)
  } catch {
    return false
  }
}

export function getSessionFromRequest(req: NextRequest): string | null {
  return req.cookies.get(SESSION_COOKIE_NAME)?.value || null
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  return !!(adminPassword && password === adminPassword)
}