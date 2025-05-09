'use client';

import { useState, useEffect } from 'react';
import CompanyCard from '@/components/ui/CompanyCard/CompanyCard';
import styles from '@/components/ui/CompanyCard/CompanyCard.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchCompanies() {
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

        // Set companies using spread operator to create a new array
        setCompanies([...data]);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to load companies');
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []); // Only run once on mount

  if (loading) return <div>Loading companies...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', width: '100%' }}>
      {companies.map((company) => (
        <CompanyCard 
          key={company.id || 'default-id'} // Fallback-id om company.id är undefined
          id={company.id || 'default-id'}
          title={company.name} 
          text={company.bio}
          acceptsDigitalDesigner={company.accepts_digital_designer}
          acceptsWebDeveloper={company.accepts_webb_developer}
        />
      ))}
    </div>
  );
}