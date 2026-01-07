'use client';

import { useEffect, useRef } from 'react';

export default function ViewCounter({ slug }: { slug: string }) {
    const hasIncremented = useRef(false);

    useEffect(() => {
        if (hasIncremented.current) return;
        hasIncremented.current = true;

        const incrementView = async () => {
            try {
                await fetch('/api/view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug }),
                });
            } catch (error) {
                console.error('Failed to increment view:', error);
            }
        };
        incrementView();
    }, [slug]);

    return null;
}
