// page.js for displaying a user profile in Next.js App Router
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const params = useParams();
  const supabase = createClientComponentClient();
  
  // Get the user ID from the URL params
  const userId = params?.id;
  
  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        
        if (!userId) {
          throw new Error('No user ID provided');
        }
        
        // Fetch the student profile from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        // Fetch the user data to get email (if needed)
        const { data: userData, error: userError } = await supabase
          .from('users') // Adjust this to your actual users table
          .select('*')
          .eq('id', userId)
          .single();
          
        if (userError && userError.message !== 'No rows found') {
          throw userError;
        }
        
        setProfile(profileData);
        setUser(userData);
        
      } catch (error) {
        console.error('Error loading profile:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    getProfile();
  }, [userId, supabase]);
  
  if (loading) {
    return <div>Laddar profil...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (!profile) {
    return <div>Ingen profil hittades</div>;
  }
  
  return (
    <div>
      <div>
        <h1>{profile.first_name} {profile.last_name}</h1>
        <div>{profile.education_program}</div>
        
        {profile.profile_picture && (
          <div>
            <img 
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-picture/${profile.profile_picture}`} 
              alt={`${profile.first_name} ${profile.last_name}`} 
              width={200}
              height={200}
            />
          </div>
        )}
        
        <div>
          {profile.linkedin_url && (
            <div>
              <span>LINKEDIN</span>
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                {profile.linkedin_url}
              </a>
            </div>
          )}
          
          {profile.portfolio_url && (
            <div>
              <span>PORTFOLIO</span>
              <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">
                {profile.portfolio_url}
              </a>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h2>BIO</h2>
        <p>{profile.bio}</p>
      </div>
      
      <div>
        <h2>KUNSKAP</h2>
        <ul>
          {profile.knowledge && profile.knowledge.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2>CV</h2>
        {profile.cv ? (
          <a 
            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cv/${profile.cv}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Öppna CV
          </a>
        ) : (
          <p>Inget CV tillgängligt</p>
        )}
      </div>
      
      <div>
        <Link href={`/profile/${userId}/edit`}>
          REDIGERA PROFIL
        </Link>
      </div>
    </div>
  );
}