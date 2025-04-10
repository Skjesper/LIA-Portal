'use client'

import { useState, useEffect } from 'react';
import mockCompanies from '@/data/mockCompanies';
import CompanyCard from '@/components/ui/CompanyCard/CompanyCard';
import styles from '@/components/ui/CompanyCard/CompanyCard.module.css';
import useBreakpoint from '@/app/hooks/useBreakpoint';

const RandomCompanies = () => {
  const [randomCompanies, setRandomCompanies] = useState([]);
  const isMobile = useBreakpoint(1279); // Använder breakpoint på 768px1279px
  
  useEffect(() => {
    // Shuffla mockCompanies
    const shuffled = [...mockCompanies].sort(() => 0.5 - Math.random());
    
    // Visa 2 kort på mobil, 3 kort på desktop
    const numCards = isMobile ? 2 : 3;
    
    // Uppdatera state med rätt antal kort
    setRandomCompanies(shuffled.slice(0, numCards));
  }, [isMobile]); // Kör om när isMobile ändras

  return (
    <>
      {randomCompanies.map((company) => (
        <CompanyCard 
          key={company.id} 
          title={company.name} 
          text={company.description} 
          className={styles.companyCardFlex}
        />
      ))}
    </>
  );
};

export default RandomCompanies;