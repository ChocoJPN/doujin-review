import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">
                        世の中に同人誌を広めたい
                    </Link>
                </div>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>ホーム</Link>
                    {/* 今後追加予定のリンク
          <Link href="/about" className={styles.navLink}>このサイトについて</Link>
          */}
                </nav>
            </div>
        </header>
    );
}
