import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('gmrt_auth_token');

    if (authToken && authToken.value === 'authenticated') {
        return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
}

export const dynamic = 'force-dynamic';
