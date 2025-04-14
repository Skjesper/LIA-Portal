'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Company.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';

const CompanyProfileView = () => {
  return (
    <div className={styles.componentContainer}>
      <div className={styles.returnButton}>
        <Link href="/">
          <Button className={buttonStyles.underlinedBlack}>Tillbaka</Button>
        </Link>
      </div>
      <section className={styles.companyContainer}>
        {/* Redigera profil knapp */}
        <div className={styles.editProfile}>
          <Link href="/profile/student/123/edit">
            <Button className={buttonStyles.filledBlack}>Redigera Profil</Button>
          </Link>
        </div>

        <section className={styles.cardContainer}>
           

            <section className={styles.profileHeader}>
            <h2>Företagnamn</h2>
            
            <section className={styles.linksContainer}>
              <div className={styles.links}>
                <Image 
                  src="/logos/LinkedinLogo.svg" 
                  alt="LinkedIn ikon" 
                  width={24} 
                  height={24} 
                />
                <span>LINKEDIN</span>
              </div>
              <div className={styles.links}>
                <Image 
                  src="/logos/Desktop.svg" 
                  alt="LinkedIn ikon" 
                  width={24} 
                  height={24} 
                />
                <span>HEMSIDA</span>
              </div>
            
              <div className={styles.links}>
                <Image 
                  src="/logos/mail.svg" 
                  alt="Portfolio ikon" 
                  width={24} 
                  height={24} 
                />
                <span>MAIL</span>
              </div>
            </section>

            </section>
            <section className={styles.profileBio}>
            <h2>Om företaget</h2>
            <p>
                texttext text text texttext text text texttext text text texttext 
                text text texttext text text texttext text text texttext text text 
                texttext text text
            </p>
            </section>

            <section className={styles.profileCity}>
            <h3>Ort</h3>
            <h2>Göteborg</h2>
            <h2>Stockholm</h2>
            </section>

            <section className={styles.profilePerks}>
            <h2>Roliga förmåner</h2>
            <p>
                texttext text text texttext text text texttext text text texttext 
                text text texttext text text texttext text text texttext text text 
                texttext text text
            </p>
            </section>
          
        </section>

       

        
    
      </section>
      </div>
    
  );
};

export default CompanyProfileView;