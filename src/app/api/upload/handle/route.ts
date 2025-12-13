import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                // Security: Check auth cookie
                const cookieStore = await cookies();
                const authToken = cookieStore.get('gmrt_auth_token');

                if (authToken?.value !== 'authenticated') {
                    throw new Error('Unauthorized');
                }

                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm', 'application/pdf'],
                    tokenPayload: JSON.stringify({
                        uploadedBy: 'admin',
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                console.log('Client-side upload completed:', blob.url);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }, // The webhook will retry 5 times if you return 400
        );
    }
}
