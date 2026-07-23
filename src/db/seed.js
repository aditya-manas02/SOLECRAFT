import db from './connection.js';
import bcrypt from 'bcryptjs';

export function seed() {
  console.log('Seeding SQLite database...');

  try {
    // ── Create Demo Users ──
    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `);

    const adminHash = bcrypt.hashSync('password', 10);
    const demoHash = bcrypt.hashSync('password', 10);

    insertUser.run('Admin', 'admin@solecraft.com', adminHash, 'admin');
    insertUser.run('Demo User', 'demo@solecraft.com', demoHash, 'user');
    insertUser.run('Test User', 'test@example.com', demoHash, 'user');

    console.log('Users seeded.');

    // ── Create Shoes ──
    const insertShoe = db.prepare(`
      INSERT OR IGNORE INTO shoes (name, slug, base_price, model_file, thumbnail, available_materials, available_soles, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const materials = [
      { id: 'leather', label: 'Full-Grain Leather', price: 0 },
      { id: 'suede', label: 'Premium Suede', price: 15 },
      { id: 'patent', label: 'Patent Leather', price: 25 }
    ];

    const soles = [
      { id: 'flat', label: 'Flat Sole', price: 0 },
      { id: 'chunky', label: 'Chunky Sole', price: 20 }
    ];

    const materialsJson = JSON.stringify(materials);
    const solesJson = JSON.stringify(soles);

    const models = [
      { name: 'Classic High Sneakers', path: 'black_converse/scene.gltf' },
      { name: 'Ray II Boots', path: 'boot_for_ray_ii/scene.gltf' },
      { name: 'Lowpoly Sneakers', path: 'cheap_nameless_sneakers_lowpoly/scene.gltf' },
      { name: 'Combat Boots', path: 'combat_ankle_boot_-_bota/scene.gltf' },
      { name: 'Classic Converse', path: 'converse_classic/scene.gltf' },
      { name: 'Run Star Hike', path: 'converse_run_star_hike_bw/scene.gltf' },
      { name: 'Mid-Poly Cowboy', path: 'cowboy_shoes_-_mid_poly/scene.gltf' },
      { name: 'Timeless Moccasin', path: 'mocasin_timeless_piel_becerro_negro/scene.gltf' },
      { name: 'Sweet Piano Shoes', path: 'my_sweet_piano_shoes_with_bones/scene.gltf' },
      { name: 'Air 720 Max', path: 'nike_air_720/scene.gltf' },
      { name: 'Air Jordan High', path: 'nike_air_jordan/scene.gltf' },
      { name: 'RTFKT Creator One', path: 'rtfkt_creator_one/scene.gltf' },
      { name: 'Chromalite RTFKT', path: 'rtfktchallenge_-_chromalite/scene.gltf' },
      { name: 'Seen Sneakers', path: 'sneakers-seen/scene.gltf' },
      { name: 'Unbranded White', path: 'unbranded_white_sneaker/scene.gltf' },
      { name: 'Asics Performance', path: 'asics_shoe/scene.gltf' },
      { name: 'Classic Leather', path: 'leather_shoes/scene.gltf' },
      { name: 'Provocative Pink', path: 'provocative_pink_shoes/scene.gltf' },
      { name: 'Adidas Sports', path: 'scanned_adidas_sports_shoe/scene.gltf' },
      { name: 'Generic Shoes', path: 'shoes/scene.gltf' },
      { name: 'Test Shoes', path: 'shoes_test/scene.gltf' },
      { name: 'Steampunk Classics', path: 'steampunk_shoe/scene.gltf' }
    ];

    for (const m of models) {
      // Slugify helper
      const slug = m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const price = Math.floor(Math.random() * (250 - 80 + 1)) + 80;
      insertShoe.run(
        m.name,
        slug,
        price,
        m.path,
        '/images/placeholders/shoe.jpg',
        materialsJson,
        solesJson,
        1
      );
    }

    console.log('Shoes catalog seeded.');

    // ── Seed Sneaker Parts ──
    const insertPart = db.prepare(`
      INSERT OR IGNORE INTO sneaker_parts (part_name, part_type, material, price_modifier)
      VALUES (?, ?, ?, ?)
    `);

    const parts = [
      { part_name: 'sole', part_type: 'color_zone', material: 'rubber', price_modifier: 0 },
      { part_name: 'upper', part_type: 'color_zone', material: 'leather', price_modifier: 0 },
      { part_name: 'toe', part_type: 'color_zone', material: 'leather', price_modifier: 0 },
      { part_name: 'tongue', part_type: 'color_zone', material: 'mesh', price_modifier: 0 },
      { part_name: 'heel', part_type: 'color_zone', material: 'leather', price_modifier: 0 },
      { part_name: 'laces', part_type: 'color_zone', material: 'nylon', price_modifier: 0 },
      { part_name: 'logo', part_type: 'accessory', material: null, price_modifier: 5 },
      { part_name: 'ankle_strap', part_type: 'accessory', material: 'leather', price_modifier: 10 },
      { part_name: 'reflective_strip', part_type: 'accessory', material: null, price_modifier: 8 }
    ];

    for (const part of parts) {
      insertPart.run(part.part_name, part.part_type, part.material, part.price_modifier);
    }

    console.log('Sneaker parts seeded.');
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}
