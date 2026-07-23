import { NextResponse } from 'next/server';
import db from '@/db/connection';
import bcrypt from 'bcryptjs';
import { getSessionUser } from '@/db/session';

export async function PUT(request) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const { current_password, password } = await request.json();

    if (!current_password || !password) {
      return NextResponse.json(
        { success: false, message: 'Please fill all password fields.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    // Get current password from DB
    const dbUser = db.prepare('SELECT password FROM users WHERE id = ?').get(user.id);
    
    if (!bcrypt.compareSync(current_password, dbUser.password)) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect.', errors: { current_password: 'Does not match.' } },
        { status: 422 }
      );
    }

    const newHash = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(newHash, user.id);

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Password updated.'
    });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
