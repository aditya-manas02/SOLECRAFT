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
    const {
      shoe_id,
      design_name,
      material,
      sole_type,
      color_zones,
      monogram_text,
      monogram_type,
      template_name,
      total_price,
      is_public,
      size,
      config_json
    } = body;

    if (!shoe_id || !material || !sole_type || !color_zones || total_price === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required design fields.' },
        { status: 400 }
      );
    }

    // Verify shoe exists
    const shoe = db.prepare('SELECT id, name, slug, base_price, model_file, thumbnail, available_materials, available_soles FROM shoes WHERE id = ?').get(shoe_id);
    if (!shoe) {
      return NextResponse.json(
        { success: false, message: 'Invalid shoe selected.' },
        { status: 400 }
      );
    }

    const shareToken = crypto.randomBytes(8).toString('hex'); // 16 characters hex representation

    const insertStmt = db.prepare(`
      INSERT INTO shoe_designs (
        user_id, shoe_id, design_name, material, sole_type, color_zones,
        monogram_text, monogram_type, template_name, total_price,
        is_public, size, config_json, share_token
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      user.id,
      shoe_id,
      design_name || 'My Design',
      material,
      sole_type,
      JSON.stringify(color_zones),
      monogram_text || null,
      monogram_type || null,
      template_name || null,
      total_price,
      is_public ? 1 : 0,
      size || null,
      config_json ? JSON.stringify(config_json) : null,
      shareToken
    );

    const designId = result.lastInsertRowid;

    // Fetch newly created design
    const design = db.prepare('SELECT * FROM shoe_designs WHERE id = ?').get(designId);

    const mappedDesign = {
      ...design,
      color_zones: JSON.parse(design.color_zones),
      config_json: design.config_json ? JSON.parse(design.config_json) : null,
      is_public: Boolean(design.is_public),
      shoe: {
        ...shoe,
        available_materials: JSON.parse(shoe.available_materials),
        available_soles: JSON.parse(shoe.available_soles)
      }
    };

    return NextResponse.json(
      {
        success: true,
        data: mappedDesign,
        message: 'Design saved successfully!'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Save design error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
