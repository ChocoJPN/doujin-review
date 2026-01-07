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
        setIsAnimating(true);

        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);

        // 楽観的UI更新
        setLikes((prev) => newIsLiked ? prev + 1 : prev - 1);

        // ローカルストレージ更新
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        if (newIsLiked) {
            likedPosts[slug] = true;
        } else {
            delete likedPosts[slug];
        }
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

        try {
            await fetch('/api/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    action: newIsLiked ? 'increment' : 'decrement'
                }),
            });
        } catch (error) {
            console.error('Failed to update like:', error);
            // エラー時はロールバック
            setLikes((prev) => newIsLiked ? prev - 1 : prev + 1);
            setIsLiked(!newIsLiked);
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
