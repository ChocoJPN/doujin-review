'use client';

import { useState, useEffect } from 'react';
import styles from './LikeButton.module.css';

type Props = {
    slug: string;
    initialLikes: number;
};

export default function LikeButton({ slug, initialLikes }: Props) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // 初期化：ローカルストレージを確認
    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        if (likedPosts[slug]) {
            setIsLiked(true);
        }
    }, [slug]);

    const handleLike = async () => {
        if (isAnimating) return; // 連続クリック防止
        setIsAnimating(true);

        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);

        // 楽観的UI更新：0未満にならないように制限
        setLikes((prev) => newIsLiked ? prev + 1 : Math.max(0, prev - 1));

        // ローカルストレージ更新
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        if (newIsLiked) {
            likedPosts[slug] = true;
        } else {
            delete likedPosts[slug];
        }
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

        try {
            const response = await fetch('/api/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    action: newIsLiked ? 'increment' : 'decrement'
                }),
            });

            if (!response.ok) throw new Error('Failed to update like');

            const data = await response.json();
            // サーバーからの最新のいいね数で同期
            if (typeof data.likes === 'number') {
                setLikes(data.likes);
            }
        } catch (error) {
            console.error('Failed to update like:', error);
            // エラー時はロールバック
            setLikes((prev) => newIsLiked ? Math.max(0, prev - 1) : prev + 1);
            setIsLiked(!newIsLiked);

            // ローカルストレージもロールバック
            if (newIsLiked) {
                delete likedPosts[slug];
            } else {
                likedPosts[slug] = true;
            }
            localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        }

        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <button
            className={`${styles.button} ${isLiked ? styles.liked : ''} ${isAnimating ? styles.animating : ''}`}
            onClick={handleLike}
            aria-label={isLiked ? "いいねを取り消す" : "いいね！"}
        >
            <span className={styles.icon}>{isLiked ? '♥' : '♡'}</span>
            <span className={styles.count}>{likes}</span>
        </button>
    );
}
