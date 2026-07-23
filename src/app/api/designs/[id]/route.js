import { NextResponse } from 'next/server';
import db from '@/db/connection';
import { getSessionUser } from '@/db/session';

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const design = db.prepare(`
      SELECT sd.*, s.name as shoe_name, s.slug as shoe_slug, s.base_price, s.model_file, s.thumbnail as shoe_thumbnail, s.available_materials, s.available_soles
      FROM shoe_designs sd
      JOIN shoes s ON sd.shoe_id = s.id
      WHERE sd.id = ?
    `).get(id);

    if (!design) {
      return NextResponse.json(
        { success: false, message: 'Design not found.' },
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
    console.error('Get single design error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    // Verify ownership
    const design = db.prepare('SELECT id FROM shoe_designs WHERE id = ? AND user_id = ?').get(id, user.id);
    if (!design) {
      return NextResponse.json(
        { success: false, message: 'Design not found or unauthorized.' },
        { status: 404 }
      );
    }

    const fields = [];
    const values = [];

    if (body.design_name !== undefined) {
      fields.push('design_name = ?');
      values.push(body.design_name);
    }
    if (body.is_public !== undefined) {
      fields.push('is_public = ?');
      values.push(body.is_public ? 1 : 0);
    }
    if (body.material !== undefined) {
      fields.push('material = ?');
      values.push(body.material);
    }
    if (body.sole_type !== undefined) {
      fields.push('sole_type = ?');
      values.push(body.sole_type);
    }
    if (body.color_zones !== undefined) {
      fields.push('color_zones = ?');
      values.push(JSON.stringify(body.color_zones));
    }
    if (body.total_price !== undefined) {
      fields.push('total_price = ?');
      values.push(body.total_price);
    }
    if (body.size !== undefined) {
      fields.push('size = ?');
      values.push(body.size);
    }

    if (fields.length === 0) {
      return NextResponse.json({ success: true, message: 'No fields to update.' });
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id, user.id);

    const updateQuery = `UPDATE shoe_designs SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
    db.prepare(updateQuery).run(...values);

    // Retrieve updated design
    const updated = db.prepare(`
      SELECT sd.*, s.name as shoe_name, s.slug as shoe_slug, s.base_price, s.model_file, s.thumbnail as shoe_thumbnail, s.available_materials, s.available_soles
      FROM shoe_designs sd
      JOIN shoes s ON sd.shoe_id = s.id
      WHERE sd.id = ?
    `).get(id);

    const parsedUpdated = {
      ...updated,
      color_zones: JSON.parse(updated.color_zones),
      config_json: updated.config_json ? JSON.parse(updated.config_json) : null,
      is_public: Boolean(updated.is_public),
      shoe: {
        id: updated.shoe_id,
        name: updated.shoe_name,
        slug: updated.shoe_slug,
        base_price: updated.base_price,
        model_file: updated.model_file,
        thumbnail: updated.shoe_thumbnail,
        available_materials: JSON.parse(updated.available_materials),
        available_soles: JSON.parse(updated.available_soles)
      }
    };

    return NextResponse.json({
      success: true,
      data: parsedUpdated,
      message: 'Design updated.'
    });
  } catch (error) {
    console.error('Update design error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Verify ownership
    const design = db.prepare('SELECT id FROM shoe_designs WHERE id = ? AND user_id = ?').get(id, user.id);
    if (!design) {
      return NextResponse.json(
        { success: false, message: 'Design not found or unauthorized.' },
        { status: 404 }
      );
    }

    db.prepare('DELETE FROM shoe_designs WHERE id = ? AND user_id = ?').run(id, user.id);

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Design deleted.'
    });
  } catch (error) {
    console.error('Delete design error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
