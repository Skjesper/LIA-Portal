import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h1 className={styles.title}>Footer placeholder</h1>
        <p className={styles.text}>© 2025 Ditt företag</p>
      </div>
    </footer>
  );
}