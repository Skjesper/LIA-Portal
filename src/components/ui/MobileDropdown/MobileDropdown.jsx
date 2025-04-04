'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './MobileDropdown.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';

export default function MobileDropdown({ isOpen, onClose }) {
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.menuOverlay}>
      <div className={styles.closeButtonContainer}>
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Stäng meny"
        >
          STÄNG <span className={styles.closeIcon}>✕</span>
        </button>
      </div>

      <nav className={styles.menuNavigation}>
        <ul className={styles.menuLinks}>
          <li>
            <Link href="/studerande" onClick={onClose} className={styles.menuLink}>
              STUDERANDE
            </Link>
          </li>
          <li>
            <Link href="/foretag" onClick={onClose} className={styles.menuLink}>
              FÖRETAG
            </Link>
          </li>
          <li>
            <Link href="/event" onClick={onClose} className={styles.menuLink}>
              EVENT
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.menuFooter}>
        <Link href="/login">
          <Button className={buttonStyles.filledBlack}>LOGGA IN</Button>
        </Link>
        <Link href="/register">
        <Button className={buttonStyles.filledBlack}>Skapa konto</Button>
        </Link>
      </div>
    </div>
  );
}