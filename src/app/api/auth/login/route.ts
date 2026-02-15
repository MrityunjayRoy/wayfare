import { NextRequest, NextResponse } from 'next/server';
import getDb, { initDb } from '@/lib/db';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await initDb();
        const db = getDb();
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const result = await db.execute({
            sql: 'SELECT id, password_hash FROM users WHERE username = ?',
            args: [username.toLowerCase().trim()],
        });

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        const user = result.rows[0];
        const valid = await verifyPassword(password, user.password_hash as string);

        if (!valid) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        const token = await createSession(user.id as string);
        const cookie = setSessionCookie(token);

        const response = NextResponse.json({
            id: user.id,
            username: username.toLowerCase().trim(),
        });
        response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2]);

        return response;
    } catch (error) {
        console.error('POST /api/auth/login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
