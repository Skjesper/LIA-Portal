// Section.jsx
import React from 'react';
import styles from '@/components/Sections/Sections.module.css';
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