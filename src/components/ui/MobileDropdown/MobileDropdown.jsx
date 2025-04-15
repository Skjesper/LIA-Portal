'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import styles from './MobileDropdown.module.css';

export default function MobileDropdown({ isOpen, onClose }) {
  const router = useRouter();
  const { isLoggedIn, userType, userProfile, signOut } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  // Get display name based on user type
  const getDisplayName = () => {
    if (!userProfile) return '';
    
    if (userType === 'student') {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    } else if (userType === 'company') {
      return userProfile.company_name;
    }
    
    return '';
  };

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

  return (
    <div className={styles.menuOverlay}>
      <div className={styles.closeButtonContainer}>
        <Button 
          className={buttonStyles.underlinedBlack} 
          style={{ width: 'auto', textAlign: 'center' }}
          onClick={onClose}
          aria-label="Stäng meny"
        >
          STÄNG 
          <Image 
            src="/logos/black-x.svg" 
            alt="Stäng" 
            width={16} 
            height={16} 
            className={styles.closeIcon} 
          />
        </Button>
      </div>

      <nav className={styles.menuNavigation}>
        <ul className={styles.menuLinks}>
          <li>
            <Link href="/students" onClick={onClose} className={styles.menuLink}>
              STUDERANDE
            </Link>
          </li>
          <li>
            <Link href="/companies" onClick={onClose} className={styles.menuLink}>
              FÖRETAG
            </Link>
          </li>
          <li>
          
            <Link href="#event" scroll ={true} onClick={onClose} className={styles.menuLink}>
              EVENT
            </Link>
          </li>
          
          {/* Visa dessa länkar när användaren är inloggad */}
          {isLoggedIn && (
            <>
              <li>
                <Link href={getProfileLink()} onClick={onClose} className={styles.menuLink}>
                  DITT KONTO
                </Link>
              </li>
            </>
          )}
        </ul>
      <div className={styles.menuFooter}>
        {isLoggedIn ? (
          // Inloggad användare
          <>
            <div className={styles.userInfo}>
              <p>Inloggad som {getDisplayName()}</p>
            </div>
            <Button 
              className={buttonStyles.filledBlack} 
              onClick={handleSignOut}
            >
              LOGGA UT
            </Button>
          </>
        ) : (
          // Ej inloggad användare
          <>
            <Link href="/login" onClick={onClose}>
              <Button className={buttonStyles.filledBlack}>LOGGA IN</Button>
            </Link>
            <Link href="/register" onClick={onClose}>
              <Button className={buttonStyles.unfilledBlack}>SKAPA KONTO</Button>
            </Link>
          </>
        )}
      </div>
      </nav>

    </div>
  );
}