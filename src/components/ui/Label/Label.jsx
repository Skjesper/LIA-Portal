import React from 'react';
import styles from '@/components/ui/Label/Label.module.css';

export const labelStyles = styles;

const Label = ({ children, className, ...props }) => {
  const labelClassName = className ? `${styles.label} ${className}` : styles.label;
  
  return (
    <div className={labelClassName} {...props}>
      {children}
    </div>
  );
};

export default Label;