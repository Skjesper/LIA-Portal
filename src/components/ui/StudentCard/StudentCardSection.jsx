import React from 'react';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import StudentCard from './StudentCard';
import styles from '@/components/ui/StudentCard/StudentCard.module.css';

const StudentCardSection = () => {
  return (
    <div className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}><span>02/</span>Studenter</h2>

        
        <div className={styles.infoWrapper}>
        <p className={styles.sectionText}>
        Möt framtidens kreatörer och problemlösare! Här hittar du studerande från Yrgos utbildningar inom Digital Design och Webbutveckling.
        </p>
        <p className={styles.sectionText}>
        Utforska deras profiler och upptäck deras kompetenser. Det här är er möjlighet att hitta er rätta match inför kommande LIA-perioder!
        </p>
        </div>
        </div>
        <section className={styles.studentCardContainer}>
        <StudentCard 
        title="DIGITAL DESIGNERS"
        variant="designer"
        
      />

      <StudentCard 
       title="WEBBUTVECKLARE"
      variant="webDev"
        
      />
      </section>
    </div>
  );
};

export default StudentCardSection;