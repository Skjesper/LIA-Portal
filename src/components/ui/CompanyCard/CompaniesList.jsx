'use client';

import { useState, useEffect } from 'react';
import CompanyCard from '@/components/ui/CompanyCard/CompanyCard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from '@/components/ui/CompanyCard/CompanyCard.module.css';

export default function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const { data, error } = await supabase
          .from('company_profiles')
          .select('id, name, bio');
        
        if (error) throw error;
        
        setCompanies(data);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to load companies');
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  if (loading) return <div>Loading companies...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', width: '100%' }}>
      {companies.map((company) => (
        <CompanyCard 
          key={company.id} 
          title={company.name} 
          text={company.bio} // Use bio from database instead of description
        />
      ))}
    </div>
  );
}