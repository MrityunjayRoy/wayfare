import { NextRequest, NextResponse } from 'next/server';
import { initDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow auth routes, static assets, and Next.js internals
    if (
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check session cookie
    const token = request.cookies.get('wayfare_session')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        await initDb();
        const session = await getSession(token);
        if (!session) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('wayfare_session');
            return response;
        }
    } catch {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
