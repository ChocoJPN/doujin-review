import Link from 'next/link';
import { Post } from '@/lib/posts';
import styles from './ReviewCard.module.css';

type Props = {
    post: Post;
};

export default function ReviewCard({ post }: Props) {
    return (
        <Link href={`/blog/${post.slug}`} className={styles.card}>
            <div className={styles.thumbnailWrapper}>
                {post.thumbnail ? (
                    <img src={post.thumbnail} alt={post.title} className={styles.thumbnail} />
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
                <div className={styles.date}>{post.date}</div>
                <h3 className={styles.title}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
            </div>
        </Link>
    );
}
