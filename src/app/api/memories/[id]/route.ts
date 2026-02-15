import { NextRequest, NextResponse } from 'next/server';
import db, { initDb } from '@/lib/db';
import { del } from '@vercel/blob';

// DELETE /api/memories/[id] — delete a memory
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await initDb();
        const { id } = await params;

        // Get the memory to find its image URL
        const result = await db.execute({
            sql: 'SELECT image_url FROM memories WHERE id = ?',
            args: [id],
        });

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
        }

        const imageUrl = result.rows[0].image_url as string;

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
