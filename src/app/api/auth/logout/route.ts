import { NextRequest, NextResponse } from 'next/server';
import { initDb } from '@/lib/db';
import { deleteSession, clearSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await initDb();
        const token = request.cookies.get('wayfare_session')?.value;

        if (token) {
            await deleteSession(token);
        }

        const cookie = clearSessionCookie();
        const response = NextResponse.json({ success: true });
        response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2]);

        return response;
    } catch (error) {
        console.error('POST /api/auth/logout error:', error);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}
