import { createClient } from '@libsql/client';

const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function initDb() {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS memories (
            id TEXT PRIMARY KEY,
            image_url TEXT NOT NULL,
            assigned_date TEXT NOT NULL,
            message TEXT,
            mode_type TEXT NOT NULL DEFAULT 'travel',
            created_at TEXT NOT NULL
        )
    `);
}

export default db;
