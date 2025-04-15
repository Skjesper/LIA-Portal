// Section.jsx
import React from 'react';
import styles from '@/components/Sections/Sections.module.css';

// Exportera styles så att andra komponenter kan använda dem
export const sectionStyles = styles;

const Section = ({ children, className, ...props }) => {

  // Kombinera section-klassen från CSS-modulen med eventuella ytterligare klasser
  const sectionClassName = className ? `${styles.section} ${className}` : styles.section;
  
  return (
    <section className={sectionClassName} {...props}>
      {children}
    </section>
  );
};

export default Section;