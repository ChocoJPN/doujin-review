import { NextResponse } from 'next/server';
import { incrementView } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    const { slug } = await request.json();

    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const views = await incrementView(slug);

    // ホームと詳細記事のキャッシュを無効化
    revalidatePath('/');
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({ views });
}
