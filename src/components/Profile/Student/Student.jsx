'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Student.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';

const StudentProfileView = () => {
  return (
    <div className={styles.componentContainer}>
      <div className={styles.returnButton}>
        <Link href="/">
          <Button className={buttonStyles.underlinedBlack}>Tillbaka</Button>
        </Link>
      </div>
      <section className={styles.profileContainer}>
        {/* Redigera profil knapp */}
        <div className={styles.editProfile}>
          <Link href="/profile/student/123/edit">
            <Button className={buttonStyles.filledBlack}>Redigera Profil</Button>
          </Link>
        </div>

        <section className={styles.studentHeader}>
          {/* Profilbild */}
          <div className={styles.profileImg}>
            {/* <Image 
              src="/placeholder-profile.jpg" 
              alt="Profilbild för studenten" 
              width={200} 
              height={200} 
            /> */}
          </div>

          {/* Profilinformation */}
          <div className={styles.headerInfo}>
            <h1>Förnamn Efternamn</h1>

            {/* Utbildning/roll */}
            <div>
              <span>WEBBUTVECKLARE</span>
            </div>

            {/* Sociala länkar */}
            <div>
              <div>
                {/* <Image 
                  src="/linkedin-icon.svg" 
                  alt="LinkedIn ikon" 
                  width={24} 
                  height={24} 
                /> */}
                <span>LINKEDIN</span>
              </div>

              <div>
                {/* <Image 
                  src="/portfolio-icon.svg" 
                  alt="Portfolio ikon" 
                  width={24} 
                  height={24} 
                /> */}
                <span>PORTFOLIO</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.profileBio}>
          <h2>BIO</h2>
          <p>
            texttext text text texttext text text texttext text text texttext 
            text text texttext text text texttext text text texttext text text 
            texttext text text
          </p>
        </section>

        {/* Kunskaper sektion */}
        <section className={styles.profileKnowledge}>
          <h2>KUNSKAP</h2>
          <div>
            {["UNREAL ENGINE", "FIGMA", "PHOTOSHOP", "UNREAL ENGINE", "UNREAL ENGINE"].map((skill, index) => (
              <span key={index}>{skill}</span>
            ))}
          </div>
        </section>

        {/* CV sektion */}
        <section className={styles.profileCv}>
          <div className={styles.infoCv}>
          <h2>CV</h2>
            <p>Tryck för att ladda ner</p>
            </div>
          <div className={styles.downloadButton}>
            <Image 
              src="/logos/download_file.svg" 
              alt="Ladda ner ikon" 
              width={58} 
              height={58} 
            />
          </div>
        </section>
      </section>
      </div>
    
  );
};

export default StudentProfileView;