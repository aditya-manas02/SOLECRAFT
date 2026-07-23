import { NextResponse } from 'next/server';
import db from '@/db/connection';

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const shoe = db.prepare('SELECT * FROM shoes WHERE id = ? AND is_active = 1').get(id);

    if (!shoe) {
      return NextResponse.json(
        { success: false, message: 'Shoe not found.' },
        { status: 404 }
      );
    }

    const parsedShoe = {
      ...shoe,
      available_materials: JSON.parse(shoe.available_materials),
      available_soles: JSON.parse(shoe.available_soles),
      is_active: Boolean(shoe.is_active)
    };

    return NextResponse.json({
      success: true,
      data: parsedShoe,
      message: ''
    });
  } catch (error) {
    console.error('Get shoe details error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
