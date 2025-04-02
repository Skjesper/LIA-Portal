// CompanyCard.jsx
import React from 'react';
import Image from 'next/image';
import styles from '@/components/ui/CompanyCard/CompanyCard.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';

const CompanyCard = ({ children, className, ...props }) => {
  const companyCardClassName = className ? `${styles.companyCard} ${className}` : styles.companyCard;
  
  return (
    <div className={companyCardClassName} {...props}>
      {children}
      <section className={styles.titleContainer}>
      <div className={styles.title}>FÖRETAGSNAMN</div>
      <div className={styles.imageContainer}>
          <Image
            src="/logos/white-main.svg"
            alt="Company Logo"
            width={100}
            height={100}
            className={styles.image}
          />
        </div>
      </section>
      <p className={styles.companyCard}>Lorem ipsum dolor sit amet consectetur. Pulvinar tempus mi congue elementum lectus. Odio pellentesque posuere sapien enim at lacus.</p>
      <Button className={buttonStyles.underlinedWhite} type="submit">Om företaget</Button>
    </div>
  );
};

export default CompanyCard;