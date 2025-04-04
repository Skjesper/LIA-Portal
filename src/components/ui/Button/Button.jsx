// Button.jsx
import React from 'react';
import styles from '@/components/ui/Button/Button.module.css';

// Exportera styles så att andra komponenter kan använda dem
export const buttonStyles = styles;

const Button = ({ children, className, ...props }) => {
  const buttonClassName = className ? `${styles.button} ${className}` : styles.button;
  
  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;