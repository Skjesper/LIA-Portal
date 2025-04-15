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
        Företagen på plats representerar olika delar av den digitala branschen. De är här för att nätverka och upptäcka ny kompetens.
        </p>
        <p className={styles.sectionText}>
        Ta del av deras presentationer, lär känna deras verksamheter och se vilka möjligheter som finns för LIA och framtida samarbeten.
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