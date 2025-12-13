import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    console.log('API /api/upload received request [V2-DYNAMIC]');

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
        let contentType = file.type;

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
                contentType = 'image/webp';
            } catch (error) {
                console.error('Image compression failed, saving original:', error);
            }
        }

        // --- NEW: Cloud Storage (Vercel Blob) Check ---
        if (process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN.trim() !== '') {
            try {
                const { put } = await import('@vercel/blob');

                console.log('Attempting Vercel Blob upload...');
                const blob = await put(filename, finalBuffer, {
                    access: 'public',
                    contentType,
                    token: process.env.BLOB_READ_WRITE_TOKEN
                });
                console.log('Vercel Blob upload success:', blob.url);

                return NextResponse.json({ url: blob.url });
            } catch (err: any) {
                console.error('Vercel Blob upload failed:', err);

                // If on Vercel, do NOT fallback to local (it will fail with EROFS)
                // Just return the specific error
                if (process.env.VERCEL) {
                    return NextResponse.json(
                        { error: `Vercel Blob Error: ${err.message || 'Unknown error'}. Check BLOB_READ_WRITE_TOKEN.` },
                        { status: 500 }
                    );
                }
                // If local (dev), allow falling back to local file system
                console.warn('Falling back to local storage provided we are not on Vercel...');
            }
        }
        // -----------------------------------------------

        // Fallback: Local Storage (Dev Mode ONLY)
        if (process.env.VERCEL) {
            console.error('Local upload attempted on Vercel environment (failed Blob backup).');
            return NextResponse.json({ error: 'Storage configuration error. Vercel Blob token missing or invalid.' }, { status: 500 });
        }

        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const path = join(uploadDir, filename);
        await writeFile(path, finalBuffer);

        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed: ' + (error as Error).message }, { status: 500 });
    }
}
