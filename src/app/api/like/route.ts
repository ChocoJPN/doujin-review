import { NextResponse } from 'next/server';
import { incrementLike, decrementLike } from '@/lib/db';

export async function POST(request: Request) {
    const { slug, action } = await request.json();

    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    let likes;
    if (action === 'decrement') {
        likes = decrementLike(slug);
    } else {
        likes = incrementLike(slug);
    }

    return NextResponse.json({ likes });
}
