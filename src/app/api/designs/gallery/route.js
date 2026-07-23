import { NextResponse } from 'next/server';
import db from '@/db/connection';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const material = searchParams.get('material');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 12;
    const offset = (page - 1) * limit;

    let queryStr = `
      SELECT sd.*, s.name as shoe_name, s.slug as shoe_slug, s.base_price, s.model_file, s.thumbnail as shoe_thumbnail, s.available_materials, s.available_soles, u.name as user_name
      FROM shoe_designs sd
      JOIN shoes s ON sd.shoe_id = s.id
      JOIN users u ON sd.user_id = u.id
      WHERE sd.is_public = 1
    `;
    let countStr = `
      SELECT COUNT(*) as total
      FROM shoe_designs sd
      WHERE sd.is_public = 1
    `;

    const params = [];
    if (material) {
      queryStr += ` AND sd.material = ?`;
      countStr += ` AND sd.material = ?`;
      params.push(material);
    }

    // Get count
    const totalRow = db.prepare(countStr).get(...params);
    const total = totalRow ? totalRow.total : 0;

    // Get records
    queryStr += ` ORDER BY sd.created_at DESC LIMIT ? OFFSET ?`;
    const dbParams = [...params, limit, offset];
    const designs = db.prepare(queryStr).all(...dbParams);

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
      user: {
        name: d.user_name
      },
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

    const lastPage = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      success: true,
      data: parsedDesigns,
      message: '',
      meta: {
        current_page: page,
        last_page: lastPage,
        total: total
      }
    });
  } catch (error) {
    console.error('Gallery designs error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
