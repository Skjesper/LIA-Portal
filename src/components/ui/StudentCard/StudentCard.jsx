'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/components/ui/StudentCard/StudentCard.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const StudentCard = ({ title, count: initialCount, text, className, variant = 'designer', ...props }) => {
  const [count, setCount] = useState(initialCount || "0 ST.");
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        setLoading(true);
        
        // Determine which program to count based on the variant
        let programToCount;
        if (variant === 'webDev') {
          programToCount = "Webbutveckling";
        } else if (variant === 'designer') {
          programToCount = "Digital Design";  // Matching the exact value from your form
        }
        
        if (programToCount) {
          // Query Supabase for students with the matching program
          const { data, error } = await supabase
            .from('student_profiles')
            .select('id')
            .eq('education_program', programToCount);
          
          if (error) {
            console.error('Error fetching student count:', error);
            return;
          }
          
          // Update the count with the number of students found
          setCount(`${data.length} ST.`);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch count if initialCount is not provided
    if (!initialCount) {
      fetchStudentCount();
    } else {
      setLoading(false);
    }
  }, [variant, initialCount]);

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
      
      <p className={styles.count}>{loading ? "Laddar..." : count}</p>
      
      {text && <p className={styles.cardText}>{text}</p>}
      <Link href="/students">
      <Button className={buttonStyle} type="submit">
        {variant === 'webDev' ? 'Se alla webbutvecklare' : 'Se alla designers'}
      </Button>
      </Link>
    </div>
  );
};

export default StudentCard;