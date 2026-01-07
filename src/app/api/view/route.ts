import { NextResponse } from 'next/server';
import { incrementView } from '@/lib/db';

export async function POST(request: Request) {
    const { slug } = await request.json();

    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const views = incrementView(slug);
    return NextResponse.json({ views });
}
