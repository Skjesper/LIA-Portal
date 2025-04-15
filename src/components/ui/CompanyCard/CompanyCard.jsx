import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/ui/CompanyCard/CompanyCard.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import Label, { labelStyles } from '../Label/Label';

const CompanyCard = ({ 
  id,
  title, 
  text, 
  className, 
  acceptsDigitalDesigner,
  acceptsWebDeveloper,
  ...props 
}) => {
  console.log('CompanyCard id:', id);
  const companyCardClassName = className ? `${styles.companyCard} ${className}` : styles.companyCard;

  return (
    <div className={companyCardClassName} {...props}>
      <section className={styles.titleContainer}>
        <div className={styles.title}>{title}</div>
        <div className={styles.imageContainer}>
          <Image
            src="/logos/white-main.svg"
            alt="Company Logo"
            width={32}
            height={32}
            className={styles.image}
          />
        </div>
      </section>
      
      <div className={styles.jobTypes}>
        {(acceptsDigitalDesigner === true || acceptsDigitalDesigner === 'TRUE') && (
          <Label className={labelStyles.unfilled}>Digital Designer</Label>
        )}
        {(acceptsWebDeveloper === true || acceptsWebDeveloper === 'TRUE') && (
          <Label className={labelStyles.unfilled}>Webbutvecklare</Label>
        )}
      </div>

      <p className={styles.cardText}>{text}</p>
      <div className={styles.buttonWrapper}>
  {id ? (
    <Link href={`/company/${id}`}>
      <Button className={buttonStyles.underlinedWhite} type="button">
        Om företaget
      </Button>
    </Link>
  ) : (
    <Button className={buttonStyles.underlinedWhite} type="button" disabled>
      Om företaget
    </Button>
  )}
</div>
    </div>
  );
};

export default CompanyCard;
