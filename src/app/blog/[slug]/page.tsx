import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { getPostStats } from '@/lib/db';
import { MDXRemote } from 'next-mdx-remote/rsc';
import styles from './page.module.css';
import { notFound } from 'next/navigation';
import LikeButton from '@/components/LikeButton';
import ViewCounter from '@/components/ViewCounter';

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) {
        return {
            title: '記事が見つかりません',
        };
    }
    return {
        title: `${post.title} | 世の中に同人誌を広めたい`,
        description: post.excerpt,
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    const stats = getPostStats(slug);


    if (!post) {
        notFound();
    }

    return (
        <article className={styles.article}>
            <ViewCounter slug={slug} />
            <header className={styles.header}>
                <div className={styles.meta}>
                    <time dateTime={post.date}>{post.date}</time>
                    <span className={styles.rating}>★ {post.rating}</span>
                    <span className={styles.views}>👁 {stats.views} views</span>
                </div>
                <h1 className={styles.title}>{post.title}</h1>
                {post.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        className={styles.thumbnail}
                        style={post.thumbnailPosition ? { objectPosition: post.thumbnailPosition } : undefined}
                    />
                )}
            </header>
            <div className={styles.content}>
                <MDXRemote source={post.content} />
            </div>

            <div className={styles.actions}>
                <LikeButton slug={slug} initialLikes={stats.likes} />
            </div>
        </article>
    );
}
