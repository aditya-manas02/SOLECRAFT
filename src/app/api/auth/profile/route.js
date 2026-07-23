import { NextResponse } from 'next/server';
import db from '@/db/connection';
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

    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required.' },
        { status: 400 }
      );
    }

    // Check unique email if it changed
    if (email !== user.email) {
      const emailExists = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, user.id);
      if (emailExists) {
        return NextResponse.json(
          { success: false, message: 'Email is already taken.', errors: { email: 'Taken' } },
          { status: 422 }
        );
      }
    }

    db.prepare('UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(name, email, user.id);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name,
        email,
        avatar: user.avatar,
        role: user.role
      },
      message: 'Profile updated.'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
