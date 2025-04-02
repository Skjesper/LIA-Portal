import React from 'react';
import Image from 'next/image';
import styles from '@/components/ui/CompanyCard/CompanyCard.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';

const CompanyCard = ({ title, text, className, ...props }) => {
  const companyCardClassName = className ? `${styles.companyCard} ${className}` : styles.companyCard;

  return (
    <div className={companyCardClassName} {...props}>
      <section className={styles.titleContainer}>
        <div className={styles.title}>{title}</div>
        <div className={styles.imageContainer}>
          <Image
            src="/logos/white-main.svg" // Bilden är statisk
            alt="Company Logo"
            width={100}
            height={100}
            className={styles.image}
          />
        </div>
      </section>
      <p className={styles.text}>{text}</p>
      <Button className={buttonStyles.underlinedWhite} type="submit">Om företaget</Button>
    </div>
  );
};

export default CompanyCard;
