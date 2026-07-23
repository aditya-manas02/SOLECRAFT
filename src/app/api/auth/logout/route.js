import { NextResponse } from 'next/server';
import { getSessionUser, deleteSession, clearSessionCookie } from '@/db/session';

export async function POST(request) {
  try {
    const user = getSessionUser(request);
    
    const headers = new Headers();
    clearSessionCookie(headers);

    if (user) {
      deleteSession(user.sessionId);
    }

    return NextResponse.json(
      { success: true, message: 'Logged out successfully.' },
      { headers }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
