import { cookies } from 'next/headers';
import getDb, { initDb } from './db';

const SESSION_COOKIE = 'wayfare_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// --- Password hashing using Web Crypto API (PBKDF2) ---

async function deriveKey(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );
    return crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt as BufferSource,
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        256
    );
}

function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
    const arr = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    return Array.from(arr)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexToBuffer(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}

export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const derived = await deriveKey(password, salt);
    return `${bufferToHex(salt)}:${bufferToHex(derived)}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [saltHex, hashHex] = storedHash.split(':');
    const salt = hexToBuffer(saltHex);
    const derived = await deriveKey(password, salt);
    return bufferToHex(derived) === hashHex;
}

// --- Session management ---

function generateToken(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return bufferToHex(bytes);
}

export async function createSession(userId: string): Promise<string> {
    const db = getDb();
    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
    await db.execute({
        sql: 'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)',
        args: [token, userId, expiresAt],
    });
    return token;
}

export async function getSession(token: string): Promise<{ userId: string; username: string } | null> {
    const db = getDb();
    const result = await db.execute({
        sql: `SELECT s.user_id, s.expires_at, u.username
              FROM sessions s
              JOIN users u ON s.user_id = u.id
              WHERE s.token = ?`,
        args: [token],
    });

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    const expiresAt = new Date(row.expires_at as string);
    if (expiresAt < new Date()) {
        // Session expired, clean it up
        await db.execute({ sql: 'DELETE FROM sessions WHERE token = ?', args: [token] });
        return null;
    }

    return { userId: row.user_id as string, username: row.username as string };
}

export async function deleteSession(token: string): Promise<void> {
    const db = getDb();
    await db.execute({ sql: 'DELETE FROM sessions WHERE token = ?', args: [token] });
}

export async function getSessionFromCookies(): Promise<{ userId: string; username: string } | null> {
    await initDb();
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return getSession(token);
}

export function setSessionCookie(token: string): { name: string; value: string; options: Record<string, unknown> } {
    return {
        name: SESSION_COOKIE,
        value: token,
        options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_DURATION_MS / 1000,
        },
    };
}

export function clearSessionCookie(): { name: string; value: string; options: Record<string, unknown> } {
    return {
        name: SESSION_COOKIE,
        value: '',
        options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        },
    };
}
