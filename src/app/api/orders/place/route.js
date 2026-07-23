import { NextResponse } from 'next/server';
import db from '@/db/connection';
import { getSessionUser } from '@/db/session';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, shipping_address, customer_name, customer_email, payment_method } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || !shipping_address || !customer_name || !customer_email) {
      return NextResponse.json(
        { success: false, message: 'Missing required order details.' },
        { status: 400 }
      );
    }

    // Sum up price
    const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);

    const trackingNumber = 'SC-' + crypto.randomBytes(5).toString('hex').toUpperCase();

    // Start database transaction
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        user_id, design_id, status, total_price, shipping_address,
        customer_name, customer_email, tracking_number, payment_status, payment_method
      )
      VALUES (?, NULL, 'placed', ?, ?, ?, ?, ?, 'pending', ?)
    `);

    const insertItem = db.prepare(`
      INSERT INTO order_items (
        order_id, shoe_id, price, material, color, size, config_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertUpdate = db.prepare(`
      INSERT INTO order_updates (order_id, status, note)
      VALUES (?, 'placed', ?)
    `);

    let orderId;
    
    // Execute as transaction
    const runTransaction = db.transaction(() => {
      const result = insertOrder.run(
        user.id,
        totalPrice,
        shipping_address,
        customer_name,
        customer_email,
        trackingNumber,
        payment_method || 'cod'
      );
      orderId = result.lastInsertRowid;

      for (const item of items) {
        const configJson = {
          material: item.material || 'leather',
          sole_type: item.sole_type || 'flat',
          color_zones: item.color_zones,
          monogram_text: item.monogram_text || null,
          monogram_type: item.monogram_type || null
        };

        insertItem.run(
          orderId,
          item.shoe_id,
          item.total_price,
          item.material || 'leather',
          JSON.stringify(item.color_zones),
          item.size || '9',
          JSON.stringify(configJson)
        );
      }

      insertUpdate.run(orderId, 'Order placed successfully.');
    });

    runTransaction();

    // Clear cart cookie
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      `solecraft_cart=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          order_id: orderId,
          tracking_number: trackingNumber,
          status: 'placed',
          total_price: totalPrice
        },
        message: 'Order placed successfully!'
      },
      { status: 201, headers }
    );
  } catch (error) {
    console.error('Place order error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
