'use client';

import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import useBreakpoint from '@/app/hooks/useBreakpoint';

export default function Footer() {

  const isMobile = useBreakpoint(768);
  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <Image
          src="/logos/white-main.svg"
          alt="Huvudlogotyp"
          width={130}
          height={45}
        />
      </div>
      
      <nav className={styles.Nav}>
        <div className={styles.NavLinks}>
          <div className={styles.linkGroup}>
            <Link href="/event" className={styles.link}>
              Event
            </Link>
            <Link href="/login" className={styles.link}>
              <span className={buttonStyles.underlinedWhite}>Logga in</span>
            </Link>
          </div>
  
          <div className={styles.linkGroup}>
            <Link href="/companies" className={styles.link}>
              Företag
            </Link>
            <Link href="/students" className={styles.link}>
              Studerande
            </Link>
          </div>
  
          <div className={styles.linkGroup}>
            <Link href="https://linkedin.com" className={styles.link}>
              Linkedin
            </Link>
            <Link href="/event" className={styles.link}>
              Event
            </Link>
          </div>
        </div>
      </nav>
      
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