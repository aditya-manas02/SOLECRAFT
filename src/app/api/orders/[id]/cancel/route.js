import { NextResponse } from 'next/server';
import db from '@/db/connection';
import { getSessionUser } from '@/db/session';

export async function POST(request, context) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(id, user.id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    // Check cancellation window (24h)
    const orderTime = new Date(order.created_at + ' UTC').getTime(); // handle SQLite timestamp string
    const nowTime = Date.now();
    const diffHours = (nowTime - orderTime) / (1000 * 60 * 60);

    if (diffHours > 24) {
      return NextResponse.json(
        { success: false, message: 'Cancellation window (24h) has passed.' },
        { status: 422 }
      );
    }

    // Update order status to cancelled
    const updateOrder = db.prepare('UPDATE orders SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const insertUpdate = db.prepare('INSERT INTO order_updates (order_id, status, note) VALUES (?, "cancelled", "Order cancelled by customer.")');

    const runTransaction = db.transaction(() => {
      updateOrder.run(id);
      insertUpdate.run(id);
    });

    runTransaction();

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Order cancelled.'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
