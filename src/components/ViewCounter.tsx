'use client';

import { useEffect, useRef } from 'react';

const VIEWED_POSTS_KEY = 'viewed_posts';

type ViewCounterProps = {
    slug: string;
    onViewCountUpdate?: (views: number) => void;
};

export default function ViewCounter({ slug, onViewCountUpdate }: ViewCounterProps) {
    const hasIncremented = useRef(false);

    useEffect(() => {
        if (hasIncremented.current) return;
        hasIncremented.current = true;

        const incrementView = async () => {
            try {
                // localStorageから閲覧済み記事のリストを取得
                const viewedPostsStr = localStorage.getItem(VIEWED_POSTS_KEY);
                const viewedPosts: string[] = viewedPostsStr ? JSON.parse(viewedPostsStr) : [];

                // 既に閲覧済みの場合はカウントしない
                if (viewedPosts.includes(slug)) {
                    return;
                }

                // APIコールで閲覧数を増やす
                const response = await fetch('/api/view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug }),
                });

                const data = await response.json();

                // localStorageに閲覧済みとして記録
                viewedPosts.push(slug);
                localStorage.setItem(VIEWED_POSTS_KEY, JSON.stringify(viewedPosts));

                // 最新の閲覧数を親コンポーネントに通知
                if (onViewCountUpdate && data.views) {
                    onViewCountUpdate(data.views);
                }
            } catch (error) {
                console.error('Failed to increment view:', error);
            }
        };
        incrementView();
    }, [slug, onViewCountUpdate]);

    return null;
}
