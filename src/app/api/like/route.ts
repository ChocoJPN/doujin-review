import { NextResponse } from 'next/server';
import { incrementLike, decrementLike } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    const { slug, action } = await request.json();

    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    let likes;
    if (action === 'decrement') {
        likes = await decrementLike(slug);
    } else {
        likes = await incrementLike(slug);
    }

    // ホームと詳細記事のキャッシュを無効化
    revalidatePath('/');
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({ likes });
}
