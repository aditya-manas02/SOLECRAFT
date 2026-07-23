import { NextResponse } from 'next/server';
import db from '@/db/connection';

export async function GET(request, context) {
  try {
    const { token } = await context.params;

    const design = db.prepare(`
      SELECT sd.*, s.name as shoe_name, s.slug as shoe_slug, s.base_price, s.model_file, s.thumbnail as shoe_thumbnail, s.available_materials, s.available_soles
      FROM shoe_designs sd
      JOIN shoes s ON sd.shoe_id = s.id
      WHERE sd.share_token = ?
    `).get(token);

    if (!design) {
      return NextResponse.json(
        { success: false, message: 'Shared design not found.' },
        { status: 404 }
      );
    }

    const parsedDesign = {
      id: design.id,
      user_id: design.user_id,
      shoe_id: design.shoe_id,
      design_name: design.design_name,
      material: design.material,
      sole_type: design.sole_type,
      color_zones: JSON.parse(design.color_zones),
      monogram_text: design.monogram_text,
      monogram_type: design.monogram_type,
      template_name: design.template_name,
      design_thumbnail: design.design_thumbnail,
      is_public: Boolean(design.is_public),
      share_token: design.share_token,
      config_json: design.config_json ? JSON.parse(design.config_json) : null,
      size: design.size,
      total_price: design.total_price,
      created_at: design.created_at,
      updated_at: design.updated_at,
      shoe: {
        id: design.shoe_id,
        name: design.shoe_name,
        slug: design.shoe_slug,
        base_price: design.base_price,
        model_file: design.model_file,
        thumbnail: design.shoe_thumbnail,
        available_materials: JSON.parse(design.available_materials),
        available_soles: JSON.parse(design.available_soles)
      }
    };

    return NextResponse.json({
      success: true,
      data: parsedDesign,
      message: ''
    });
  } catch (error) {
    console.error('Get shared design error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
