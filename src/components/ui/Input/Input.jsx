// Input.jsx
import React from 'react';
import styles from '@/components/ui/Input/Input.module.css';

// Exportera styles så att andra komponenter kan använda dem
export const inputStyles = styles;

const Input = ({ children, className, ...props }) => {
  const inputClassName = className ? `${styles.button} ${className}` : styles.button;
  
  return (
    <input className={inputClassName} {...props}>
      {children}
    </input>
  );
};

export default Input;