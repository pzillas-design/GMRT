import { PostEditor } from '@/components/PostEditor';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CreatePost({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('gmrt_auth_token');

    if (!token || token.value !== 'authenticated') {
        redirect(`/${lang}/login`);
    }

    return <PostEditor lang={lang as 'de' | 'en'} />;
}
