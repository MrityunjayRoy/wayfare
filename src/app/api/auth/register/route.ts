import { NextRequest, NextResponse } from 'next/server';
import getDb, { initDb } from '@/lib/db';
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await initDb();
        const db = getDb();
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        if (username.length < 3 || username.length > 30) {
            return NextResponse.json({ error: 'Username must be between 3 and 30 characters' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // Check if username already exists
        const existing = await db.execute({
            sql: 'SELECT id FROM users WHERE username = ?',
            args: [username.toLowerCase().trim()],
        });

        if (existing.rows.length > 0) {
            return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
        }

        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const passwordHash = await hashPassword(password);
        const createdAt = new Date().toISOString();

        await db.execute({
            sql: 'INSERT INTO users (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)',
            args: [id, username.toLowerCase().trim(), passwordHash, createdAt],
        });

        const token = await createSession(id);
        const cookie = setSessionCookie(token);

        const response = NextResponse.json(
            { id, username: username.toLowerCase().trim() },
            { status: 201 }
        );
        response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2]);

        return response;
    } catch (error) {
        console.error('POST /api/auth/register error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
