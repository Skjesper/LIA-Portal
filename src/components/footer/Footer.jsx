'use client';

import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import useBreakpoint from '@/app/hooks/useBreakpoint';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Footer() {
  const isMobile = useBreakpoint(768);
  const { isLoggedIn, userType, userProfile } = useAuth();

  // Get the appropriate profile link based on user type (copied from Header)
  const getProfileLink = () => {
    if (!isLoggedIn || !userProfile) return '/profile';
    
    const userId = userProfile.id;
    
    if (userType === 'student') {
      return `/student/${userId}`;
    } else if (userType === 'company') {
      return `/company/${userId}`;
    }
  
    return '/profile';
  }

  if(!isMobile) return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <Image
          src="/logos/white-main.svg"
          alt="Huvudlogotyp"
          className={styles.logoContainerImg}
          width={243}
          height={221}
        />
        <nav className={styles.Nav}>
            <div className={styles.linkGroupOne}>
              <Link href="/event" className={styles.link}>
                Event
              </Link>
              {isLoggedIn ? (
                <Link href={getProfileLink()} className={styles.link}>
                  <span className={buttonStyles.underlinedWhite}>Min Profil</span>
                </Link>
              ) : (
                <Link href="/login" className={styles.link}>
                  <span className={buttonStyles.underlinedWhite}>Logga in</span>
                </Link>
              )}
            </div>
    
            <div className={styles.linkGroupTwo}>
              <Link href="/companies" className={styles.link}>
                Företag
              </Link>
              <Link href="/students" className={styles.link}>
                Studerande
              </Link>
            </div>
    
            <div className={styles.linkGroupThree}>
              <Link href="https://linkedin.com" className={styles.link}>
                Linkedin
              </Link>
              <Link href="/event" className={styles.link}>
                Event
              </Link>
            </div>
        </nav>
      </div>
        <Image 
          src="/logos/yrgo-logo-white-flipped.svg"
          alt="Yrgo logotyp"
          width={120}
          height={40}
          className={styles.logo}
        />
    </footer>
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <Image
          src="/logos/white-main.svg"
          alt="Huvudlogotyp"
          className={styles.logoContainerImg}
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
            {isLoggedIn ? (
              <Link href={getProfileLink()} className={styles.link}>
                <span className={buttonStyles.underlinedWhite}>Min Profil</span>
              </Link>
            ) : (
              <Link href="/login" className={styles.link}>
                <span className={buttonStyles.underlinedWhite}>Logga in</span>
              </Link>
            )}
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