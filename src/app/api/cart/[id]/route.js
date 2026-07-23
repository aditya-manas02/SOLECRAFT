import { NextResponse } from 'next/server';

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;

    // Read cart cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => c.trim().split('='))
    );
    
    const cartCookie = cookies['solecraft_cart'];
    let cart = [];

    if (cartCookie) {
      try {
        cart = JSON.parse(decodeURIComponent(cartCookie));
      } catch (e) {
        cart = [];
      }
    }

    const filteredCart = cart.filter(item => item.id !== id);

    const headers = new Headers();
    const cartString = encodeURIComponent(JSON.stringify(filteredCart));
    headers.append(
      'Set-Cookie',
      `solecraft_cart=${cartString}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}` // 30 days
    );

    return NextResponse.json(
      { success: true, message: 'Removed from cart' },
      { headers }
    );
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
