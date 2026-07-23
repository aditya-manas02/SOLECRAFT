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

    const designs = db.prepare(`
      SELECT sd.*, s.name as shoe_name, s.slug as shoe_slug, s.base_price, s.model_file, s.thumbnail as shoe_thumbnail, s.available_materials, s.available_soles
      FROM shoe_designs sd
      JOIN shoes s ON sd.shoe_id = s.id
      WHERE sd.user_id = ?
      ORDER BY sd.created_at DESC
    `).all(user.id);

    const parsedDesigns = designs.map(d => ({
      id: d.id,
      user_id: d.user_id,
      shoe_id: d.shoe_id,
      design_name: d.design_name,
      material: d.material,
      sole_type: d.sole_type,
      color_zones: JSON.parse(d.color_zones),
      monogram_text: d.monogram_text,
      monogram_type: d.monogram_type,
      template_name: d.template_name,
      design_thumbnail: d.design_thumbnail,
      is_public: Boolean(d.is_public),
      share_token: d.share_token,
      config_json: d.config_json ? JSON.parse(d.config_json) : null,
      size: d.size,
      total_price: d.total_price,
      created_at: d.created_at,
      updated_at: d.updated_at,
      shoe: {
        id: d.shoe_id,
        name: d.shoe_name,
        slug: d.shoe_slug,
        base_price: d.base_price,
        model_file: d.model_file,
        thumbnail: d.shoe_thumbnail,
        available_materials: JSON.parse(d.available_materials),
        available_soles: JSON.parse(d.available_soles)
      }
    }));

    return NextResponse.json({
      success: true,
      data: parsedDesigns,
      message: ''
    });
  } catch (error) {
    console.error('List user designs error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
