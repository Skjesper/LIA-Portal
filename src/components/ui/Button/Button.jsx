// Button.jsx
import React from 'react';
import styles from '@/components/ui/Button/Button.module.css';

const Button = ({ children, className, ...props }) => {
  // Kombinera 'btn' med eventuella andra klasser
  const buttonClassName = className ? `btn ${className}` : 'btn';
  
  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;