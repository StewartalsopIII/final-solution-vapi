import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { password, action } = await req.json()

    if (action === 'logout') {
      const response = NextResponse.json({ success: true })
      response.cookies.delete('admin_session')
      return response
    }

    if (action === 'login') {
      if (!password) {
        return NextResponse.json({ error: 'Password is required' }, { status: 400 })
      }

      if (!verifyPassword(password)) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }

      const sessionToken = createSession()
      const response = NextResponse.json({ success: true })

      response.cookies.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      })

      return response
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}