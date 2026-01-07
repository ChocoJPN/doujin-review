import Link from 'next/link';
import { Post } from '@/lib/posts';
import styles from './ReviewCard.module.css';

type Props = {
    post: Post & {
        views?: number;
        likes?: number;
    };
};

export default function ReviewCard({ post }: Props) {
    return (
        <Link href={`/blog/${post.slug}`} className={styles.card}>
            <div className={styles.thumbnailWrapper}>
                {post.thumbnail ? (
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        className={styles.thumbnail}
                        style={post.thumbnailPosition ? { objectPosition: post.thumbnailPosition } : undefined}
                    />
                ) : (
                    <div className={styles.placeholderThumbnail}>
                        <span>No Image</span>
                    </div>
                )}
                <div className={styles.ratingBadge}>
                    ★ {post.rating}
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.meta}>
                    <div className={styles.date}>{post.date}</div>
                    {(post.views !== undefined || post.likes !== undefined) && (
                        <div className={styles.stats}>
                            {post.views !== undefined && <span>👁 {post.views}</span>}
                            {post.likes !== undefined && <span>♥ {post.likes}</span>}
                        </div>
                    )}
                </div>
                {post.tags && post.tags.length > 0 && (
                    <div className={styles.tags}>
                        {post.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <h3 className={styles.title}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
            </div>
        </Link>
    );
}
