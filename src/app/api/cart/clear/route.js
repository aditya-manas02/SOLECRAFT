import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      `solecraft_cart=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
    );

    return NextResponse.json(
      { success: true, message: 'Cart cleared' },
      { headers }
    );
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
