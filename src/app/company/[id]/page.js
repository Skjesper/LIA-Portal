import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import CompanyProfileView from '@/components/Profile/Company/Company';

export default async function CompanyProfilePage({ params }) {
  const supabase = createServerComponentClient({ cookies });
  const { id } = params;

  const { data: company, error } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('id', 'c55325da-c481-4552-a073-99fc3b44bebc')
    .single();

  if (error || !company) {
    return <div>Företag hittades inte.</div>;
  }

  return <CompanyProfileView company={company} />;
}
