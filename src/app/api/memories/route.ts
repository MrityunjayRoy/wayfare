import { NextRequest, NextResponse } from 'next/server';
import db, { initDb } from '@/lib/db';
import { put } from '@vercel/blob';
import { Memory } from '@/lib/types';

// GET /api/memories — fetch all memories
export async function GET() {
    try {
        await initDb();
        const result = await db.execute(
            'SELECT * FROM memories ORDER BY assigned_date ASC, created_at ASC'
        );
        const memories: Memory[] = result.rows.map((row) => ({
            id: row.id as string,
            image_url: row.image_url as string,
            assigned_date: row.assigned_date as string,
            message: row.message as string | undefined,
            mode_type: row.mode_type as 'travel' | 'static',
            created_at: row.created_at as string,
        }));
        return NextResponse.json(memories);
    } catch (error) {
        console.error('GET /api/memories error:', error);
        return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
    }
}

// POST /api/memories — create a new memory
export async function POST(request: NextRequest) {
    try {
        await initDb();
        const formData = await request.formData();
        const file = formData.get('image') as File;
        const assignedDate = formData.get('assigned_date') as string;
        const message = formData.get('message') as string | null;
        const modeType = (formData.get('mode_type') as string) || 'travel';

        if (!file || !assignedDate) {
            return NextResponse.json({ error: 'Image and date are required' }, { status: 400 });
        }

        // Upload image to Vercel Blob
        const blob = await put(`wayfare/${Date.now()}-${file.name}`, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const createdAt = new Date().toISOString();

        await db.execute({
            sql: 'INSERT INTO memories (id, image_url, assigned_date, message, mode_type, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            args: [id, blob.url, assignedDate, message || null, modeType, createdAt],
        });

        const memory: Memory = {
            id,
            image_url: blob.url,
            assigned_date: assignedDate,
            message: message || undefined,
            mode_type: modeType as 'travel' | 'static',
            created_at: createdAt,
        };

        return NextResponse.json(memory, { status: 201 });
    } catch (error) {
        console.error('POST /api/memories error:', error);
        return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 });
    }
}
