'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import useBreakpoint from '@/app/hooks/useBreakpoint';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import MobileDropdown from '@/components/ui/MobileDropdown/MobileDropdown';
import styles from './Header.module.css';

export default function Header() {
  const isMobile = useBreakpoint(1279); // Use 768px as breakpoint
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, userType, userProfile, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Get the appropriate profile link based on user type
  const getProfileLink = () => {
    if (userType === 'student') {
      return '/edit-profile';
    } else if (userType === 'company') {
      return '/company/profile';
    }
    
    return '/profile';
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <>
      <header className={styles.header}>
        <section className={styles.headerLeft}>
          <div className={styles.logo}>
            <Link href="/">
              <Image
                src="/logos/yrgo-logo-black.svg"
                alt="Company Logo"
                width={50}
                height={30}
                className={styles.image}
              />
            </Link>
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
          </section>
        ) : (
          // Desktop view
          <>
            <section className={styles.headerCenter}>
              <nav className={styles.desktopNavbar} aria-label="Main Navigation">
                <ul>
                  <li>
                    <Link href="#event" scroll={true}>
                        <Button 
                          className={buttonStyles.underlinedBlack}
                          style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}
                        >
                          event
                        </Button>
                    </Link>
                   
                  </li>
                  <li>
                    <Link href="/companies">
                      <Button 
                        className={buttonStyles.underlinedBlack}
                        style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}
                      >
                        Företag
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link href="/students">
                      <Button 
                        className={buttonStyles.underlinedBlack}
                        style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}
                      >
                        Studenter
                      </Button>
                    </Link>
                  </li>
                </ul>
              </nav>
            </section>
            <section className={styles.headerRight}>
              {isLoggedIn ? (
                <ul>
                  <li>
                  <Link href={getProfileLink()}>
                    <Button className={buttonStyles.underlinedBlack}
                    style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}
                    >
                      Min Profil
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button 
                    className={buttonStyles.filledBlack} 
                    onClick={handleSignOut}
                  >
                    LOGGA UT
                  </Button>
                </li>
                </ul>
              ) : (
                <Link href="/login">
                  <Button className={buttonStyles.primaryBlack}>
                    Logga in
                  </Button>
                </Link>
              )}
            </section>
          </>
        )}
      </header>

      {/* Mobile dropdown */}
      <MobileDropdown isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}