import { NextResponse } from 'next/server';
import db from '@/db/connection';
import { getSessionUser } from '@/db/session';

export async function GET(request) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const orders = db.prepare(`
      SELECT o.*, sd.design_name, sd.color_zones, sd.material as design_material, s.name as shoe_name
      FROM orders o
      LEFT JOIN shoe_designs sd ON o.design_id = sd.id
      LEFT JOIN shoes s ON sd.shoe_id = s.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `).all(user.id);

    const mappedOrders = orders.map(order => {
      // Fetch items for each order
      const items = db.prepare(`
        SELECT oi.*, s.name as shoe_name, s.thumbnail as shoe_thumbnail
        FROM order_items oi
        LEFT JOIN shoes s ON oi.shoe_id = s.id
        WHERE oi.order_id = ?
      `).all(order.id);

      return {
        id: order.id,
        tracking_number: order.tracking_number,
        status: order.status,
        total_price: order.total_price,
        payment_status: order.payment_status,
        shipping_address: order.shipping_address,
        size: order.size,
        created_at: order.created_at,
        design: order.design_id ? {
          id: order.design_id,
          design_name: order.design_name,
          color_zones: JSON.parse(order.color_zones),
          material: order.design_material,
          shoe_name: order.shoe_name
        } : null,
        items: items.map(it => ({
          ...it,
          color: it.color ? JSON.parse(it.color) : null,
          config_json: it.config_json ? JSON.parse(it.config_json) : null
        }))
      };
    });

    return NextResponse.json({
      success: true,
      data: mappedOrders,
      message: ''
    });
  } catch (error) {
    console.error('Fetch user orders error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
