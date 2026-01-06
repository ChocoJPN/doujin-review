import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} 世の中に同人誌を広めたい All Rights Reserved.</p>
        </footer>
    );
}
