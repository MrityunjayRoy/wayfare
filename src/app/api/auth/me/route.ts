import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSessionFromCookies();

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        return NextResponse.json({
            id: session.userId,
            username: session.username,
        });
    } catch (error) {
        console.error('GET /api/auth/me error:', error);
        return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
    }
}
