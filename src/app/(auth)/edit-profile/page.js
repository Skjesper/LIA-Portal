'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import EditStudentForm from './EditStudentForm';
import EditCompanyForm from './EditCompanyForm';
import Image from 'next/image';
import Section, { sectionStyles } from '@/components/Sections/Sections';

export default function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const supabase = createBrowserClient();
  
  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      
      // Get current user
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        setError('Du behöver vara inloggad för att redigera din profil!');
        setLoading(false);
        return ;
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
  if (error) return <div style={{color: 'var(--Primary-Red)', alignSelf:"center"}}> {error} </div>;



const handleDeleteAccount = async () => {
  if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    return;
  }
  
  setLoading(true);
  
  try {
    const profileTable = profile.type === 'student' ? 'student_profiles' : 'company_profiles';
    
    const { error: profileError } = await supabase
      .from(profileTable)
      .delete()
      .eq('id', user.id);
      
    if (profileError) throw profileError;
    
    const { error: userTypeError } = await supabase
      .from('user_types')
      .delete()
      .eq('user_id', user.id);
      
    if (userTypeError) throw userTypeError;
    
    // Check for files to delete from storage
    if (profile.type === 'student') {
      if (profile.data.cv) {
        await supabase.storage.from('cv').remove([profile.data.cv]);
      }
      else if (profile.data.profile_picture) {
        await supabase.storage.from('profile-picture').remove([profile.data.profile_picture]);
      }
    }
    
    // Delete user auth record
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
    if (authError) throw authError;
    
    // Sign out
    await supabase.auth.signOut();
    
    // Redirect to home
    router.push('/');
    
  } catch (error) {
    console.error('Error deleting account:', error);
    setError(`Failed to delete account: ${error.message}`);
    setLoading(false);
  }
};

  return (
    <main className="" 
    style={{
      backgroundColor:"var(--background-MediumLight)", 
      display:"flex", 
      flexDirection:"column", 
      alignItems:"flex-start"
      }}>
      <Button
        type="button"
        onClick={() => router.back()}
        className={buttonStyles.underlinedBlack}
        style={{ 
          margin: '1.5rem 0 1.5rem 2rem'
        }} 
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
      style={{ 
        color: 'var(--Primary-Dark)', 
        alignSelf:"center", 
        fontSize: "2rem",
        fontStyle: "italic",
        fontWeight: "530",
        lineHeight: "2rem",
        letterSpacing: "-0.06rem",
      }} 
      >REDIGERA PROFIL</h1>
      <Section className={sectionStyles.sectionInvertedColors}>
      {profile?.type === 'student' ? (
        <EditStudentForm user={user} profile={profile.data} />
      ) : profile?.type === 'company' ? (
        <EditCompanyForm user={user} profile={profile.data} />
      ) : (
        <div>Okänd typ av profil, kontakta support.</div>
      )}
      </Section>
      <Button
        type="button"
        onClick={handleDeleteAccount}
        disabled={loading}
        className={buttonStyles.underlinedBlack}
        style={{
          margin: '0 0 2rem 0',
          alignSelf:"center" 
        }}
      >
        <Image
          src="/icons/delete.svg"
          alt="Delete icon"
          width={15}
          height={15}
        />
        RADERA KONTO
      </Button>
    </main>
  );
}