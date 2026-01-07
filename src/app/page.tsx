import { getAllPosts } from '@/lib/posts';
import SearchablePostList from '@/components/SearchablePostList';
import styles from './page.module.css';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          未知の扉を開く、<br />
          同人誌レビュー
        </h1>
        <p className={styles.heroSubtitle}>
          情熱の結晶である同人誌。その魅力を余すことなく伝えます。
        </p>
      </section>

      <section className={styles.latestReviews}>
        <h2 className={styles.sectionTitle}>新着レビュー</h2>
        <SearchablePostList initialPosts={posts} />
      </section>
    </div>
  );
}
