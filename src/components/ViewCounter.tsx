'use client';

import { useEffect, useRef } from 'react';

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
                // Cookieから閲覧済みフラグを確認
                const cookieName = `viewed_${slug}`;
                const isViewed = document.cookie.split('; ').some(row => row.startsWith(`${cookieName}=`));

                if (isViewed) {
                    console.log(`Already viewed ${slug} recently (cookie found). Skipping increment.`);
                    return;
                }

                // APIコールで閲覧数を増やす
                const response = await fetch('/api/view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug }),
                });

                if (!response.ok) {
                    throw new Error('Failed to increment view');
                }

                const data = await response.json();
                console.log('View count response:', data);

                // Cookieに閲覧済みフラグをセット (24時間有効)
                const expires = new Date();
                expires.setHours(expires.getHours() + 24);
                document.cookie = `${cookieName}=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

                // 最新の閲覧数を親コンポーネントに通知
                if (onViewCountUpdate && typeof data.views === 'number') {
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
