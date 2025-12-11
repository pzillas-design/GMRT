import { PostEditor } from '@/components/PostEditor';

export default async function CreatePost({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <PostEditor lang={lang as 'de' | 'en'} />;
}
