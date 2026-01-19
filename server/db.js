import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

const DB_PATH = path.join(__dirname, '..', 'db', 'biomequest.db');
const SCHEMA_PATH = path.join(__dirname, '..', 'db', 'schema.sql');
const SEED_PATH = path.join(__dirname, '..', 'db', 'seed.sql');

export async function initDatabase() {
  const SQL = await initSqlJs();

  // Load existing database or create new one
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log('Loaded existing database');
  } else {
    db = new SQL.Database();
    console.log('Created new database');

    // Run schema
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    db.run(schema);
    console.log('Schema applied');

    // Run seed data
    const seed = fs.readFileSync(SEED_PATH, 'utf-8');
    db.run(seed);
    console.log('Seed data inserted');

    // Save to file
    saveDatabase();
  }

  return db;
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

// Helper function to run queries and return results
export function query(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Helper function to run a single query and return first result
export function queryOne(sql, params = []) {
  const results = query(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Helper function to run insert/update/delete
export function run(sql, params = []) {
  db.run(sql, params);
  const changes = db.getRowsModified();

  // Get last insert rowid using a prepared statement for reliability
  const stmt = db.prepare("SELECT last_insert_rowid() as id");
  stmt.step();
  const lastInsertRowid = stmt.getAsObject().id;
  stmt.free();

  saveDatabase();
  return {
    lastInsertRowid,
    changes
  };
}

export default {
  initDatabase,
  getDatabase,
  saveDatabase,
  query,
  queryOne,
  run
};
