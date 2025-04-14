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
        // Fetch all companies from Supabase with additional fields
        const { data, error } = await supabase
          .from('company_profiles')
          .select('id, name, bio, accepts_digital_designer, accepts_webb_developer');
        
        if (error) throw error;

        // För felsökning: logga den första företagsposten
        if (data.length > 0) {
          console.log("Första företaget:", data[0]);
          console.log("Digital Designer:", data[0].accepts_digital_designer, typeof data[0].accepts_digital_designer);
          console.log("Webb Developer:", data[0].accepts_webb_developer, typeof data[0].accepts_webb_developer);
        }

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
          key={company.id || 'default-id'} // Fallback-id om company.id är undefined
          id={company.id || 'default-id'}
          title={company.name} 
          text={company.bio}
          acceptsDigitalDesigner={company.accepts_digital_designer}
          acceptsWebDeveloper={company.accepts_webb_developer}
          className={styles.companyCardFlex}
        />
      ))}
    </>
  );
};

export default RandomCompanies;
