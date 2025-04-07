'use client'

import { useState, useEffect } from 'react';
import mockCompanies from '@/data/mockCompanies'; // Ersätt med API-anrop senare
import CompanyCard from '@/components/ui/CompanyCard/CompanyCard';
import styles from '@/components/ui/CompanyCard/CompanyCard.module.css';

const RandomCompanies = () => {
  const [randomCompanies, setRandomCompanies] = useState([]);

  useEffect(() => {
    const shuffled = [...mockCompanies].sort(() => 0.5 - Math.random());
    setRandomCompanies(shuffled.slice(0, 2));
  }, []);

  return (
    <>
      {randomCompanies.map((company) => (
        <CompanyCard 
          key={company.id} 
          title={company.name} 
          text={company.description} 
          className={styles.companyCardFlex} // Lägg till en specifik klass för flex-items
        />
      ))}
    </>
  );
};

export default RandomCompanies;