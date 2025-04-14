import React from 'react';
import Image from 'next/image';
import styles from '@/components/ui/CompanyCard/CompanyCard.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import Label, { labelStyles } from '../Label/Label';


const CompanyCard = ({ 
  title, 
  text, 
  className, 
  acceptsDigitalDesigner,
  acceptsWebDeveloper,
  ...props 
}) => {
  // För felsökning
  console.log("Digital Designer:", acceptsDigitalDesigner, typeof acceptsDigitalDesigner);
  console.log("Web Developer:", acceptsWebDeveloper, typeof acceptsWebDeveloper);
  const companyCardClassName = className ? `${styles.companyCard} ${className}` : styles.companyCard;

  return (
    <div className={companyCardClassName} {...props}>
      <section className={styles.titleContainer}>
        <div className={styles.title}>{title}</div>
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
      
      {/* Display job types accepted by the company */}
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
      <Button className={buttonStyles.underlinedWhite} type="submit">Om företaget</Button>
      </div>
    </div>
  );
};

export default CompanyCard;