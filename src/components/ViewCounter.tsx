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
                // sessionStorageから閲覧済み記事のリストを取得 (ブラウザを閉じればリセットされる)
                const viewedPostsStr = sessionStorage.getItem(VIEWED_POSTS_KEY);
                const viewedPosts: string[] = viewedPostsStr ? JSON.parse(viewedPostsStr) : [];

                // 既にこのセッションで閲覧済みの場合はカウントしない
                if (viewedPosts.includes(slug)) {
                    console.log(`Already viewed ${slug} in this session.`);
                    return;
                }

                // APIコールで閲覧数を増やす
                const response = await fetch('/api/view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug }),
                });

                const data = await response.json();
                console.log('View count response:', data);

                // sessionStorageに閲覧済みとして記録
                viewedPosts.push(slug);
                sessionStorage.setItem(VIEWED_POSTS_KEY, JSON.stringify(viewedPosts));

                // 最新の閲覧数を親コンポーネントに通知 (0の場合も考慮して undefined チェックにする)
                if (onViewCountUpdate && data.views !== undefined) {
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
