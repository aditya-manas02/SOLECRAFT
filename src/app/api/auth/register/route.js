import { NextResponse } from 'next/server';
import db from '@/db/connection';
import bcrypt from 'bcryptjs';
import { createSession, setSessionCookie } from '@/db/session';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide all details.', errors: { name: 'Required', email: 'Required', password: 'Required' } },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters.', errors: { password: 'Too short' } },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (userExists) {
      return NextResponse.json(
        { success: false, message: 'Email already registered.', errors: { email: 'Already exists' } },
        { status: 422 }
      );
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const insertStmt = db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, 'user')
    `);
    const info = insertStmt.run(name, email, passwordHash);
    const userId = info.lastInsertRowid;

    // Create session
    const { sessionId, expiresAt } = createSession(userId);

    const headers = new Headers();
    setSessionCookie(headers, sessionId, expiresAt);

    return NextResponse.json(
      {
        success: true,
        data: { id: userId, name, email, role: 'user' },
        message: 'Registration successful!'
      },
      { status: 201, headers }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
