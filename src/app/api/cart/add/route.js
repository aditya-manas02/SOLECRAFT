import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    
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

    const item = {
      id: crypto.randomBytes(8).toString('hex'), // unique ID for item in cart
      shoe_id: body.shoe_id,
      material: body.material,
      sole_type: body.sole_type,
      color_zones: body.color_zones,
      monogram_text: body.monogram_text || null,
      monogram_type: body.monogram_type || null,
      total_price: body.total_price,
      added_at: new Date().toISOString()
    };

    cart.push(item);

    const headers = new Headers();
    const cartString = encodeURIComponent(JSON.stringify(cart));
    headers.append(
      'Set-Cookie',
      `solecraft_cart=${cartString}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}` // 30 days
    );

    return NextResponse.json(
      { success: true, message: 'Added to cart' },
      { headers }
    );
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
