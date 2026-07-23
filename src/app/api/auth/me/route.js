import { NextResponse } from 'next/server';
import { getSessionUser } from '@/db/session';

export async function GET(request) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        created_at: user.created_at
      },
      message: ''
    });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
