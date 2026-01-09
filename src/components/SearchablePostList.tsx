'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/posts';
import ReviewCard from '@/components/ReviewCard';
import styles from './SearchablePostList.module.css';
import { PostStats } from '@/lib/db';

type Props = {
    initialPosts: Post[];
};

type SortType = 'date' | 'likes' | 'views';

export default function SearchablePostList({ initialPosts }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState<SortType>('date');
    const [stats, setStats] = useState<Record<string, PostStats>>({});

    // 統計データの取得
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats', { cache: 'no-store' });
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();

        // ページに戻ってきたとき（フォーカス時）に最新データを取得
        window.addEventListener('focus', fetchStats);
        return () => window.removeEventListener('focus', fetchStats);
    }, []);

    // データのマージとフィルタリング
    // Post型に views, likes プロパティはないため、拡張して扱う
    const processedPosts = initialPosts.map(post => ({
        ...post,
        views: stats[post.slug]?.views || 0,
        likes: stats[post.slug]?.likes || 0,
    })).filter((post) => {
        const term = searchTerm.toLowerCase();
        const inTitle = post.title.toLowerCase().includes(term);
        const inTags = post.tags.some(tag => tag.toLowerCase().includes(term));
        const inExcerpt = post.excerpt.toLowerCase().includes(term);

        return inTitle || inTags || inExcerpt;
    });

    // ソート処理
    const sortedPosts = [...processedPosts].sort((a, b) => {
        if (sortType === 'likes') {
            // いいね順（同数の場合は日付順）
            return b.likes - a.likes || new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (sortType === 'views') {
            // 閲覧数順
            return b.views - a.views || new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
            // 新着順 (日付)
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
    });

    return (
        <div>
            <div className={styles.controls}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${sortType === 'date' ? styles.activeTab : ''}`}
                        onClick={() => setSortType('date')}
                    >
                        新着順
                    </button>
                    <button
                        className={`${styles.tab} ${sortType === 'likes' ? styles.activeTab : ''}`}
                        onClick={() => setSortType('likes')}
                    >
                        人気順 (いいね)
                    </button>
                    <button
                        className={`${styles.tab} ${sortType === 'views' ? styles.activeTab : ''}`}
                        onClick={() => setSortType('views')}
                    >
                        閲覧数順
                    </button>
                </div>

                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder="キーワード、タグで検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {sortedPosts.length > 0 ? (
                <div className={styles.grid}>
                    {sortedPosts.map((post) => (
                        <ReviewCard
                            key={post.slug}
                            post={post}
                        // ReviewCard側で表示するための追加プロパティを渡す場合は
                        // ReviewCardのProps変更が必要だが、今回はReviewCardをそのまま使う想定なら
                        // ここで post オブジェクトに views/likes が含まれている状態で渡しても
                        // 型定義上無視されるだけで動作はするはず。
                        // ただし、ReviewCardで表示するためにはReviewCardの修正も必要。
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.noResults}>
                    <p>一致する作品が見つかりませんでした。</p>
                </div>
            )}
        </div>
    );
}
