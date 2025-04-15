'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import CompanyProfileView from '@/components/Profile/Company/Company';

export default async function CompanyProfilePage(props) {
  const params = await props.params;
  // The params object is already available, no need to await it
  const id = params.id;

  // Create a properly initialized cookie store
  const cookieStore = await cookies();

  // Create Supabase client with the cookie store
  const supabase = createServerComponentClient({ 
    cookies: () => cookieStore 
  });

  // Fetch the company data
  const { data: company, error } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !company) {
    return <div>Företag hittades inte.</div>;
  }

  return <CompanyProfileView company={company} />;
}