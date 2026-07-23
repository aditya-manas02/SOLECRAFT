import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
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

    return NextResponse.json({
      success: true,
      data: cart,
      message: ''
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
