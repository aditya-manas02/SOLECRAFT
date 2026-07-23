import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'solecraft.db');

const db = new Database(DB_PATH, { verbose: console.log });

// Enable foreign key support in SQLite
db.pragma('foreign_keys = ON');

export default db;
