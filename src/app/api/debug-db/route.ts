import { NextResponse } from 'next/server';

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return NextResponse.json({
        url: url && url !== 'undefined' ? 'Configured' : 'Missing',
        key: key && key !== 'undefined' ? 'Configured' : 'Missing',
        url_preview: url ? (url.startsWith('http') ? url.substring(0, 15) + '...' : 'invalid') : 'none'
    });
}
