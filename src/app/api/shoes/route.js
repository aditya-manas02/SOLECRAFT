import { NextResponse } from 'next/server';
import db from '@/db/connection';

export async function GET() {
  try {
    const shoes = db.prepare('SELECT * FROM shoes WHERE is_active = 1').all();

    // Map and parse JSON fields
    const parsedShoes = shoes.map(shoe => ({
      ...shoe,
      available_materials: JSON.parse(shoe.available_materials),
      available_soles: JSON.parse(shoe.available_soles),
      is_active: Boolean(shoe.is_active)
    }));

    return NextResponse.json({
      success: true,
      data: parsedShoes,
      message: ''
    });
  } catch (error) {
    console.error('List shoes error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
