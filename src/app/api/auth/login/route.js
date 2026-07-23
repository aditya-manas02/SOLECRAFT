import { NextResponse } from 'next/server';
import db from '@/db/connection';
import bcrypt from 'bcryptjs';
import { createSession, setSessionCookie } from '@/db/session';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password.', errors: { credentials: 'Required' } },
        { status: 400 }
      );
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.', errors: { credentials: 'Email or password is incorrect.' } },
        { status: 401 }
      );
    }

    // Create session
    const { sessionId, expiresAt } = createSession(user.id);

    const headers = new Headers();
    setSessionCookie(headers, sessionId, expiresAt);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role
        },
        message: 'Login successful!'
      },
      { headers }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
