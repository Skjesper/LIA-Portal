import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.Nav}>
        <div className={styles.logoContainer}>
          <Image
            src="/logos/white-main.svg"
            alt="Huvudlogotyp"
            width={130}
            height={45}
          />
        </div>
        
        <div className={styles.NavLinks}>
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
      </div>
      
      <div className={styles.login}>
        <Link href="/login" className={styles.link}>
          Logga in
        </Link>
      </div>
      
      <div className={styles.rightContainer}>
        <Image 
          src="/logos/yrgo-logo-white.svg"
          alt="Yrgo logotyp"
          width={120}
          height={40}
          className={styles.logo}
        />
      </div>
    </footer>
  );
}