'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TestCompanyById() {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchCompany() {
      // Först hämta alla företags-ID för att se vad som finns
      const { data: companyIds, error: idsError } = await supabase
        .from('company_profiles')
        .select('id')
        .order('created_at', { ascending: false });
      
      if (idsError) {
        console.error('Fel vid hämtning av företags-IDs:', idsError);
      } else {
        console.log('Tillgängliga företags-IDs:', companyIds);
      }

      // Sedan hämtar vi det specifika företaget
      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('id', 'c55325da-c481-4552-a073-99fc3b44bebc') // <-- Ändra till ett ID du vet finns baserat på loggen ovan
        .single();

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        console.log('Company data:', data);
        setCompany(data);
      }
    }

    fetchCompany();
  }, [supabase]); // Lägg till supabase som beroende

  if (error) return <div>Fel: {error}</div>;
  if (!company) return <div>Laddar...</div>;

  return (
    <div>
      <h2>{company.name}</h2>
      <p>{company.bio}</p>
      <p><strong>Ort:</strong> {company.location}</p>
    </div>
  );
}