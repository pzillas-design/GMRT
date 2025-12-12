import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    console.log('API /api/upload received request');

    // Security check
    const cookieStore = await cookies();
    const authToken = cookieStore.get('gmrt_auth_token');

    console.log('Auth check - Token exists:', !!authToken, 'Value:', authToken?.value);

    if (!authToken || authToken.value !== 'authenticated') {
        console.error('Unauthorized upload attempt');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename base
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        let filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        let finalBuffer = buffer;

        // Image Compression (using sharp)
        if (file.type.startsWith('image/')) {
            try {
                const sharp = require('sharp'); // Dynamic require to avoid build issues if optional
                finalBuffer = await sharp(buffer)
                    .rotate() // Auto-rotate based on EXIF
                    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true }) // Max 1920px
                    .webp({ quality: 80 })
                    .toBuffer();

                // Change extension to webp
                filename = filename.replace(/\.[^.]+$/, '') + '.webp';
            } catch (error) {
                console.error('Image compression failed, saving original:', error);
            }
        }

        // --- NEW: Cloud Storage (Vercel Blob) Check ---
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            try {
                const { put } = await import('@vercel/blob');
                const contentType = file.type.startsWith('image/') ? 'image/webp' : file.type;

                const blob = await put(filename, finalBuffer, {
                    access: 'public',
                    contentType
                });

                return NextResponse.json({ url: blob.url });
            } catch (err) {
                console.error('Vercel Blob upload failed, falling back to local:', err);
                // Do NOT throw, allow fallback to local storage below
            }
        }
        // -----------------------------------------------

        // Fallback: Local Storage (Dev Mode)
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const path = join(uploadDir, filename);
        await writeFile(path, finalBuffer);

        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
