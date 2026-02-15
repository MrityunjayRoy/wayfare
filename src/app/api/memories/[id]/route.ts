import { NextRequest, NextResponse } from 'next/server';
import getDb, { initDb } from '@/lib/db';
import { del } from '@vercel/blob';
import { getSessionFromCookies } from '@/lib/auth';

// DELETE /api/memories/[id] — delete a memory (only if it belongs to the user)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await initDb();
        const session = await getSessionFromCookies();
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const db = getDb();
        const { id } = await params;

        // Get the memory and verify ownership
        const result = await db.execute({
            sql: 'SELECT image_url, user_id FROM memories WHERE id = ?',
            args: [id],
        });

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
        }

        const memory = result.rows[0];
        if (memory.user_id !== session.userId) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const imageUrl = memory.image_url as string;

        // Delete image from Vercel Blob
        try {
            await del(imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
        } catch (blobError) {
            console.warn('Failed to delete blob (may already be gone):', blobError);
        }

        // Delete from database
        await db.execute({
            sql: 'DELETE FROM memories WHERE id = ?',
            args: [id],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/memories/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
    }
}
