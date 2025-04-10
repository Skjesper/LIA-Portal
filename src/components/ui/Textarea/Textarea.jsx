// Textarea.jsx
import React from 'react';
import styles from '@/components/ui/Textarea/Textarea.module.css';

// Exportera styles så att andra komponenter kan använda dem
export const textareaStyles = styles;

const Textarea = ({ children, className, ...props }) => {
  const textareaClassName = className ? `${styles.button} ${className}` : styles.button;
  
  return (
    <textarea className={textareaClassName} {...props}>
      {children}
    </textarea>
  );
};

export default Textarea;