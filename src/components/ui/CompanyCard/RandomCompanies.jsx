'use client';

import { useState, useEffect } from 'react';
import CompanyCard from '@/components/ui/CompanyCard/CompanyCard';
import styles from '@/components/ui/CompanyCard/CompanyCard.module.css';
import useBreakpoint from '@/app/hooks/useBreakpoint';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const RandomCompanies = () => {
  const [randomCompanies, setRandomCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useBreakpoint(1279); // Using breakpoint at 1279px
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    async function fetchRandomCompanies() {
      try {
        // Fetch all companies from Supabase
        const { data, error } = await supabase
          .from('company_profiles')
          .select('id, name, bio');
        
        if (error) throw error;
        
        // Shuffle the companies array
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        
        // Determine number of cards based on screen size
        const numCards = isMobile ? 2 : 3;
        
        // Set the first numCards companies
        setRandomCompanies(shuffled.slice(0, numCards));
      } catch (err) {
        console.error('Error fetching random companies:', err);
        setError('Failed to load companies');
      } finally {
        setLoading(false);
      }
    }

    fetchRandomCompanies();
  }, [isMobile]); // Run when isMobile changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      {randomCompanies.map((company) => (
        <CompanyCard 
          key={company.id} 
          title={company.name} 
          text={company.bio}
          className={styles.companyCardFlex}
        />
      ))}
    </>
  );
};

export default RandomCompanies;