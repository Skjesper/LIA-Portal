'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.css';
import useBreakpoint from '@/app/hooks/useBreakpoint';
import Button, { buttonStyles } from '@/components/ui/Button/Button';

export default function Header() {
  const isMobile = useBreakpoint(768); // Use 768px as breakpoint
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <section className={styles.headerLeft}>
        <div className={styles.logo}>
        <Image
            src="/logos/yrgo-logo-black.svg"
            alt="Company Logo"
            width={50}
            height={30}
            className={styles.image}
          />
        </div>
      </section>
      
      {isMobile ? (
        // Mobile view
        <section className={styles.headerRight}>
          <Button 
            className={buttonStyles.underlinedBlack} 
            style={{ width: '100%', textAlign: 'center' }}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            Menu
          </Button>
          {isMenuOpen && (
            <nav className={styles.mobileMenuDropdown} id="mobile-menu" aria-label="Mobile Navigation">
              <ul>
                <li>
                  <Link href="/companies">
                    <button>companies</button>
                  </Link>
                </li>
                <li>
                  <Link href="/event">
                    <button>event</button>
                  </Link>
                </li>
                <li>
                  <Link href="/instruments">
                    <button>instruments</button>
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </section>
      ) : (
        // Desktop view
        <>
          <section className={styles.headerCenter}>
            <nav className={styles.desktopNavbar} aria-label="Main Navigation">
              <ul class>
                <li>
                  <Link href="/companies">
                    <Button className={buttonStyles.underlinedBlack}
                    style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}>companies</Button>
                  </Link>
                </li>
                <li>
                  <Link href="/event">
                  <Button className={buttonStyles.underlinedBlack}
                  style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}>event</Button>
                  </Link>
                </li>
                <li>
                  <Link href="/instruments">
                  <Button className={buttonStyles.underlinedBlack}
                  style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}>instruments</Button>
                  </Link>
                </li>
              </ul>
            </nav>
          </section>
          <section className={styles.headerRight}>
            <Button className={buttonStyles.primaryBlack}>
            Logga in</Button>
          </section>
        </>
      )}
    </header>
  );
}