import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const body = await request.json();
    const { password } = body;

    // In a real app, use a more secure way to manage secrets, but for this simple use case:
    // Default password is 'admin' if not set in env
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

    if (password === ADMIN_PASSWORD) {
        // Create a simple session cookie
        const cookieStore = await cookies();
        cookieStore.set('gmrt_auth_token', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
