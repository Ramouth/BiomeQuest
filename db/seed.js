#!/usr/bin/env node

/**
 * Database Seeding Script
 * Creates biomequest.db and seeds it with initial data
 */

import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'biomequest.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const SEED_PATH = path.join(__dirname, 'seed.sql');

// Enable verbose mode for debugging
const sqlite3_db = sqlite3.verbose();

console.log('🌱 BiomeQuest Database Seeding Script');
console.log('=====================================\n');

// Check if database exists
const dbExists = fs.existsSync(DB_PATH);
if (dbExists) {
  console.log(`⚠️  Database already exists at ${DB_PATH}`);
  console.log('Backing up existing database...\n');
  const backupPath = path.join(__dirname, `biomequest.db.backup.${Date.now()}`);
  fs.copyFileSync(DB_PATH, backupPath);
  console.log(`✅ Backup created at: ${backupPath}\n`);
  
  // Delete existing database to start fresh
  fs.unlinkSync(DB_PATH);
  console.log('Removed existing database, creating new one...\n');
}

// Create database connection
const db = new sqlite3_db.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
    process.exit(1);
  }
  console.log('✅ Database created successfully\n');
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON;', (err) => {
    if (err) {
      console.error('❌ Error enabling foreign keys:', err);
      process.exit(1);
    }
    console.log('✅ Foreign keys enabled\n');
    applySchema();
  });
});

// Apply schema
function applySchema() {
  console.log('📋 Applying database schema...');
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  
  // Split by semicolon and filter empty statements and comments
  const statements = schema
    .split(';')
    .map(stmt => {
      // Remove comments and trim
      return stmt
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .trim();
    })
    .filter(stmt => stmt && stmt.length > 5);

  let completed = 0;
  const total = statements.length;

  const executeNext = (index) => {
    if (index >= total) {
      console.log(`\r✅ Schema applied successfully (${total} statements)\n`);
      applySeedData();
      return;
    }

    const statement = statements[index];
    db.run(statement, (err) => {
      if (err) {
        console.error(`\n❌ Error executing statement ${index + 1}:`, err.message);
        console.error('Statement:', statement.substring(0, 80) + '...');
        // Continue despite errors
      }
      completed++;
      if (completed % 5 === 0) {
        process.stdout.write(`\r  Progress: ${completed}/${total}`);
      }
      executeNext(index + 1);
    });
  };

  executeNext(0);
}

// Apply seed data
function applySeedData() {
  console.log('🌱 Inserting seed data...');
  const seed = fs.readFileSync(SEED_PATH, 'utf-8');
  
  // Split by semicolon and filter empty statements and comments
  const statements = seed
    .split(';')
    .map(stmt => {
      return stmt
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .trim();
    })
    .filter(stmt => stmt && stmt.length > 5);

  let completed = 0;
  const total = statements.length;

  const executeNext = (index) => {
    if (index >= total) {
      console.log(`\r✅ Seed data inserted (${total} statements)\n`);
      verifyData();
      return;
    }

    const statement = statements[index];
    db.run(statement, (err) => {
      if (err) {
        console.error(`\n❌ Error in seed ${index + 1}:`, err.message);
        // Continue despite errors
      }
      completed++;
      if (completed % 5 === 0) {
        process.stdout.write(`\r  Progress: ${completed}/${total}`);
      }
      executeNext(index + 1);
    });
  };

  executeNext(0);
}

// Verify seeded data
function verifyData() {
  console.log('✔️  Verifying data...\n');
  
  db.get('SELECT COUNT(*) as count FROM plants', (err, row) => {
    if (err) {
      console.error('Error counting plants:', err);
    } else {
      console.log(`   🌿 Plants: ${row.count}`);
    }
  });

  db.get('SELECT COUNT(*) as count FROM badges', (err, row) => {
    if (err) {
      console.error('Error counting badges:', err);
    } else {
      console.log(`   🏆 Badges: ${row.count}`);
    }
  });

  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (err) {
      console.error('Error counting users:', err);
    } else {
      console.log(`   👤 Users: ${row.count}`);
    }
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log(`📁 Database location: ${DB_PATH}\n`);
    
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
        process.exit(1);
      }
      process.exit(0);
    });
  });
}

// Handle errors
db.on('error', (err) => {
  console.error('Database error:', err);
  process.exit(1);
});
