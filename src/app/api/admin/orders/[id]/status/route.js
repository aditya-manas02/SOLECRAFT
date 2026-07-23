import { NextResponse } from 'next/server';
import db from '@/db/connection';
import { getSessionUser } from '@/db/session';

export async function PUT(request, context) {
  try {
    const user = getSessionUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const { status } = await request.json();

    const allowedStatuses = ['placed', 'accepted', 'rejected', 'manufacturing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status provided.' },
        { status: 400 }
      );
    }

    const order = db.prepare('SELECT id FROM orders WHERE id = ?').get(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    const updateOrder = db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const insertUpdate = db.prepare('INSERT INTO order_updates (order_id, status, note) VALUES (?, ?, ?)');

    const runTransaction = db.transaction(() => {
      updateOrder.run(status, id);
      insertUpdate.run(id, status, `Order status updated to ${status} by Administrator.`);
    });

    runTransaction();

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Admin update order status error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
