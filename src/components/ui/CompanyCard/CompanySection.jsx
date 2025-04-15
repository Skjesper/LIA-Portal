import React from 'react';
import Link from 'next/link';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import RandomCompanies from '@/components/ui/CompanyCard/RandomCompanies';
import styles from '@/components/ui/CompanyCard/CompanyCard.module.css';

const CompanySection = () => {
  return (
    <div className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}><span>03/</span>Företag</h2>

        
        <div className={styles.applyWrapper}>
        <p className={styles.sectionText}>
            Lorem ipsum dolor sit amet si consectetur. Sagittis faucibus vita in faucibus nunc. 
            Semper nun sodales malesuada. Non habitant.
        </p>
        <p className={styles.sectionText}>
            Lorem ipsum dolor sit amet si consectetur. Sagittis faucibus vita in faucibus nunc. 
            Semper nun sodales malesuada. Non habitant.
        </p>
        <Link href="/companies">
        <Button style={{ whiteSpace: 'nowrap' }} className={buttonStyles.underlinedBlack}>
  Se alla företag
</Button>
        </Link>
        </div>
        </div>
        <div className={styles.flexCompaniesContainer}>
        <RandomCompanies />
      </div>
    </div>
  );
};

export default CompanySection;