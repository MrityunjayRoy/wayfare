import { createClient, Client } from '@libsql/client';

let _db: Client | null = null;

function getDb(): Client {
    if (!_db) {
        _db = createClient({
            url: process.env.TURSO_DATABASE_URL!,
            authToken: process.env.TURSO_AUTH_TOKEN,
        });
    }
    return _db;
}

export async function initDb() {
    const db = getDb();
    await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    `);
    await db.execute(`
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    await db.execute(`
        CREATE TABLE IF NOT EXISTS memories (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL DEFAULT '',
            image_url TEXT NOT NULL,
            assigned_date TEXT NOT NULL,
            message TEXT,
            mode_type TEXT NOT NULL DEFAULT 'travel',
            created_at TEXT NOT NULL
        )
    `);

    // Migration: add user_id column to existing memories table if it's missing
    try {
        await db.execute(`ALTER TABLE memories ADD COLUMN user_id TEXT NOT NULL DEFAULT ''`);
    } catch {
        // Column already exists — ignore the error
    }
}

export default getDb;
