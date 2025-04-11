import React from 'react';
import Image from 'next/image';
import styles from '@/components/ui/StudentCard/StudentCard.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';

const StudentCard = ({ title, count, text, className, variant = 'designer', ...props }) => {
  // Grundklassen som alltid används
  const baseClassName = styles.studentCard;
  
  // Lägg till variantspecifik klass om variant är angiven
  const variantClassName = variant ? styles[variant] : '';
  
  // Kombinera alla klasser
  const cardClassName = className 
    ? `${baseClassName} ${variantClassName} ${className}` 
    : `${baseClassName} ${variantClassName}`;
    
  // Välj rätt knappstil baserat på variant
  const buttonStyle = variant === 'webDev' ? buttonStyles.underlinedBlack : buttonStyles.underlinedWhite;

  return (
    <div className={cardClassName} {...props}>
      <section className={styles.titleContainer}>
        <div className={styles.title}>{title}</div>
        <div className={styles.imageContainer}>
        <Image
            src={variant === 'webDev' ? '/logos/black-main.svg' : '/logos/white-main.svg'}
            alt="Company Logo"
            width={150}
            height={150}
            
        />
        </div>
      </section>
      
      {count && <p className={styles.count}>{count}</p>}
      
      {text && <p className={styles.cardText}>{text}</p>}
      
      <Button className={buttonStyle} type="submit">
        {variant === 'webDev' ? 'Se alla webbutvecklare' : 'Se alla designers'}
      </Button>
    </div>
  );
};

export default StudentCard;