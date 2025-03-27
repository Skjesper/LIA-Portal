import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.Container}>
        <Image
          src="/logos/white-main.svg"
          alt="Huvudlogotyp"
          width={90}
          height={30}
        />
        <Link href="/students" className={styles.link}>
          Studerande
        </Link>
        <Link href="/companies" className={styles.link}>
          Företag
        </Link>
        <Link href="/event" className={styles.link}>
          Event
        </Link>
      </div>
      
      <Image 
        src="/logos/yrgo-logo-white.svg"
        alt="Yrgo logotyp"
        width={120}
        height={40}
        className={styles.logo}
      />
    </footer>
  );
}