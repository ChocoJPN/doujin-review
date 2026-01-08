import { NextResponse } from 'next/server';
import { getAllStats } from '@/lib/db';

export async function GET() {
    const stats = await getAllStats();
    return NextResponse.json(stats);
}
