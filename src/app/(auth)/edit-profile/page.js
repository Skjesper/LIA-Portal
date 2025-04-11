'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import EditStudentForm from './EditStudentForm';
import EditCompanyForm from './EditCompanyForm';
import Image from 'next/image';

export default function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      
      // Get current user
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        setError('You must be logged in to edit your profile');
        setLoading(false);
        // Redirect to login page after a short delay
        setTimeout(() => router.push('/login'), 2000);
        return;
      }
      
      setUser(session.user);
      
      
      const { data: userData, error: userTypeError } = await supabase
        .from('user_types')
        .select('user_type')
        .eq('user_id', session.user.id)
        .single();
      
      if (userTypeError) {
        setError('Failed to fetch user type');
        setLoading(false);
        return;
      }
      
      // Get profile data based on user type
      const profileTable = userData.user_type === 'student' ? 'student_profiles' : 'company_profiles';
      const { data: profileData, error: profileError } = await supabase
        .from(profileTable)
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') { // Not found error
        setError(`Failed to fetch profile: ${profileError.message}`);
      }
      
      setProfile({
        type: userData.user_type,
        data: profileData || {} // Empty object if no profile exists yet
      });
      
      setLoading(false);
    }
    
    getProfile();
  }, [supabase, router]);
  
  if (loading) return <div className="">Loading profile information...</div>;
  if (error) return <div className="">{error}</div>;

  return (
    <div className="">
      <Button
        type="button"
        onClick={() => router.back()}
        className={buttonStyles.underlinedBlack}
        style={{ margin: '0 0 0 2rem' }} 
      >
        <Image
          src="/icons/arrow-left-black.svg"
          alt="Return Arrow"
          width={15}
          height={15}
        />
        Tillbaka
      </Button>
      
      <h1 
      style={{ margin: '1.5rem 0 0.5rem 2rem', color: 'var(--Primary-Red)', fontStyle: 'italic' }} 
      > REDIGERA PROFIL</h1>
      {profile?.type === 'student' ? (
        <EditStudentForm user={user} profile={profile.data} />
      ) : profile?.type === 'company' ? (
        <EditCompanyForm user={user} profile={profile.data} />
      ) : (
        <div>Unknown profile type. Please contact support.</div>
      )}
    </div>
  );
}