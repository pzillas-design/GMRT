import { cookies } from 'next/headers';

/**
 * Safely checks if the current user is an admin by verifying the 'gmrt_auth_token' cookie.
 * Wraps the operation in a try-catch block to prevent server crashes if cookies() fails.
 */
export async function getIsAdmin(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('gmrt_auth_token');
        return token?.value === 'authenticated';
    } catch (error) {
        console.error('Error checking admin status:', error);
        // Default to false (not admin) if there's an error accessing cookies
        return false;
    }
}
