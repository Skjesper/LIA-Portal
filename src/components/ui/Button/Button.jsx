
// Button.jsx
import React from 'react';
import styles from '@/components/ui/Button/Button.module.css';


const Button = ({ children, className, ...props }) => {
  // Använd styles.button från CSS-modulen som basklass
  // Observera att vi använder styles.button här, baserat på vanliga namnkonventioner för CSS-moduler
  const buttonClassName = className ? `${styles.button} ${className}` : styles.button;
  
  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;