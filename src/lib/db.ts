import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

function getSupabase() {
    if (_supabase) return _supabase;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 環境変数が未設定、あるいは文字列の "undefined" になっている場合のチェック
    if (!url || !key || url === 'undefined' || key === 'undefined') {
        return null;
    }

    try {
        _supabase = createClient(url, key);
        return _supabase;
    } catch (error) {
        console.error('Failed to initialize Supabase client:', error);
        return null;
    }
}

export type PostStats = {
    views: number;
    likes: number;
};

// 閲覧数の加算
export async function incrementView(slug: string): Promise<number> {
    const supabase = getSupabase();
    if (!supabase) {
        console.warn('Supabase client is not initialized. Check your environment variables.');
        return 0;
    }

    const { data, error } = await supabase.rpc('increment_view', { page_slug: slug });

    if (error) {
        console.error('Error incrementing view:', error);
        // RPCがない場合の代替策（upsert）
        const stats = await getPostStats(slug);
        const { data: upsertData, error: upsertError } = await supabase
            .from('stats')
            .upsert({ slug, views: stats.views + 1 }, { onConflict: 'slug' })
            .select()
            .single();

        if (upsertError) return stats.views;
        return upsertData.views;
    }

    return data;
}

// いいねの加算
export async function incrementLike(slug: string): Promise<number> {
    const supabase = getSupabase();
    if (!supabase) {
        console.warn('Supabase client is not initialized. Check your environment variables.');
        return 0;
    }

    const { data, error } = await supabase.rpc('increment_like', { page_slug: slug });

    if (error) {
        console.error('Error incrementing like:', error);
        // RPCがない場合の代替策
        const stats = await getPostStats(slug);
        const { data: upsertData, error: upsertError } = await supabase
            .from('stats')
            .upsert({ slug, likes: stats.likes + 1 }, { onConflict: 'slug' })
            .select()
            .single();

        if (upsertError) return stats.likes;
        return upsertData.likes;
    }

    return data;
}

// いいねの減算
export async function decrementLike(slug: string): Promise<number> {
    const supabase = getSupabase();
    if (!supabase) {
        console.warn('Supabase client is not initialized. Check your environment variables.');
        return 0;
    }

    const { data, error } = await supabase.rpc('decrement_like', { page_slug: slug });

    if (error) {
        console.error('Error decrementing like:', error);
        // RPCがない場合の代替策
        const stats = await getPostStats(slug);
        const { data: upsertData, error: upsertError } = await supabase
            .from('stats')
            .upsert({ slug, likes: Math.max(0, stats.likes - 1) }, { onConflict: 'slug' })
            .select()
            .single();

        if (upsertError) return stats.likes;
        return upsertData.likes;
    }

    return data;
}

// 特定記事のスタッツ取得
export async function getPostStats(slug: string): Promise<PostStats> {
    const supabase = getSupabase();
    if (!supabase) {
        return { views: 0, likes: 0 };
    }

    const { data, error } = await supabase
        .from('stats')
        .select('views, likes')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        return { views: 0, likes: 0 };
    }

    return {
        views: data.views || 0,
        likes: data.likes || 0
    };
}

// 全記事のスタッツ取得
export async function getAllStats(): Promise<Record<string, PostStats>> {
    const supabase = getSupabase();
    if (!supabase) {
        return {};
    }

    const { data, error } = await supabase
        .from('stats')
        .select('slug, views, likes');

    if (error || !data) {
        return {};
    }

    const stats: Record<string, PostStats> = {};
    data.forEach((item: any) => {
        stats[item.slug] = {
            views: item.views || 0,
            likes: item.likes || 0
        };
    });

    return stats;
}
