// CompanyCard.jsx
import React from 'react';
import styles from '@/components/ui/CompanyCard/CompanyCard.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';

const CompanyCard = ({ children, className, ...props }) => {
  const companyCardClassName = className ? `${styles.companyCard} ${className}` : styles.companyCard;
  
  return (
    <div className={companyCardClassName} {...props}>
      {children}
    </div>
  );
};

export default CompanyCard;