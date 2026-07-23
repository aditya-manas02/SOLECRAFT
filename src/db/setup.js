import db from './connection.js';

console.log('Setting up SQLite database schema...');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    base_price DECIMAL(8, 2) NOT NULL,
    model_file TEXT NOT NULL,
    thumbnail TEXT,
    available_materials TEXT NOT NULL, -- JSON Stringified
    available_soles TEXT NOT NULL,     -- JSON Stringified
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shoe_designs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    shoe_id INTEGER NOT NULL,
    design_name TEXT NOT NULL,
    material TEXT NOT NULL,
    sole_type TEXT NOT NULL,
    color_zones TEXT NOT NULL, -- JSON Stringified
    monogram_text TEXT,
    monogram_type TEXT,
    template_name TEXT,
    design_thumbnail TEXT,
    is_public INTEGER DEFAULT 0,
    share_token TEXT UNIQUE,
    config_json TEXT,         -- JSON Stringified
    size TEXT,
    total_price DECIMAL(8, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(shoe_id) REFERENCES shoes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS sneaker_parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    part_name TEXT NOT NULL,
    part_type TEXT NOT NULL,
    material TEXT,
    color_options TEXT, -- JSON Stringified
    price_modifier DECIMAL(8, 2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    design_id INTEGER,
    status TEXT DEFAULT 'placed',
    total_price DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT,
    customer_name TEXT,
    customer_email TEXT,
    tracking_number TEXT UNIQUE,
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    size TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY(design_id) REFERENCES shoe_designs(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    shoe_id INTEGER,
    price DECIMAL(8, 2) NOT NULL,
    color TEXT,
    material TEXT,
    size TEXT,
    config_json TEXT, -- JSON Stringified
    quantity INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY(shoe_id) REFERENCES shoes(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    gateway TEXT NOT NULL,
    transaction_id TEXT,
    status TEXT DEFAULT 'pending',
    amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS order_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

console.log('Database tables created successfully!');

// Now trigger seeding
import('./seed.js').then(({ seed }) => {
  seed();
}).catch(err => {
  console.error('Error importing seeder:', err);
});
