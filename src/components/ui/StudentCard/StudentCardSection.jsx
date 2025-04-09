import React from 'react';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import StudentCard from './StudentCard';
import styles from '@/components/ui/StudentCard/StudentCard.module.css';

const StudentCardSection = () => {
  return (
    <div className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}><span>03/</span>Företag</h2>

        
        <div className={styles.infoWrapper}>
        <p className={styles.sectionText}>
            Lorem ipsum dolor sit amet si consectetur. Sagittis faucibus vita in faucibus nunc. 
            Semper nun sodales malesuada. Non habitant.
        </p>
        <p className={styles.sectionText}>
            Lorem ipsum dolor sit amet si consectetur. Sagittis faucibus vita in faucibus nunc. 
            Semper nun sodales malesuada. Non habitant.
        </p>
        <Button className={buttonStyles.underlinedBlack}>Se alla företag</Button>
        </div>
        </div>
        <section className={styles.studentCardContainer}>
        <StudentCard 
        title="DIGITAL DESIGNERS"
        count="25 ST."
        variant="student"
        
      />

      <StudentCard 
        title="WEBBUTVECKLARE"
        count="25 ST."
        variant="webDev"
        
      />
      </section>
    </div>
  );
};

export default StudentCardSection;