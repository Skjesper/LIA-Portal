import styles from './Footer.module.css';
import Link from 'next/link';


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.leftContainer}>
      <Link href="/students" className={styles.link}>
            Studerande
          </Link>
          <Link href="/companies" className={styles.link}>
            Företag
          </Link>
          <Link href="/event" className={styles.link}>
            Event
          </Link>
        <p className={styles.text}>© 2025 Ditt företag</p>
      </div>
    </footer>
  );
}