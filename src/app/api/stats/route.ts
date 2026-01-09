import { NextResponse } from 'next/server';
import { getAllStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    const stats = await getAllStats();
    return NextResponse.json(stats);
}
