import { NextResponse } from 'next/server';
import db from '@/db/connection';
import { getSessionUser } from '@/db/session';

export async function GET(request, context) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const order = db.prepare(`
      SELECT o.*, sd.design_name, sd.color_zones, sd.material as design_material, s.name as shoe_name
      FROM orders o
      LEFT JOIN shoe_designs sd ON o.design_id = sd.id
      LEFT JOIN shoes s ON sd.shoe_id = s.id
      WHERE o.id = ? AND o.user_id = ?
    `).get(id, user.id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    // Fetch items
    const items = db.prepare(`
      SELECT oi.*, s.name as shoe_name, s.thumbnail as shoe_thumbnail
      FROM order_items oi
      LEFT JOIN shoes s ON oi.shoe_id = s.id
      WHERE oi.order_id = ?
    `).all(order.id);

    // Fetch updates
    const updates = db.prepare(`
      SELECT * FROM order_updates WHERE order_id = ? ORDER BY created_at DESC
    `).all(order.id);

    const parsedOrder = {
      ...order,
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
      })),
      updates
    };

    return NextResponse.json({
      success: true,
      data: parsedOrder,
      message: ''
    });
  } catch (error) {
    console.error('Get single order error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
