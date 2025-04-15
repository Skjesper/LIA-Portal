'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle email verification callback
  useEffect(() => {
    // Check if we're on a page with a verification code
    const code = searchParams.get('code');
    const type = searchParams.get('type');
    
    if (code && type === 'email_confirmation') {
      const handleEmailConfirmation = async () => {
        setIsVerifying(true);
        try {
          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Error verifying email:', error);
            return;
          }
          
          // Get the newly verified session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            // Redirect to edit profile page after verification
            router.push('/edit-profile');
          }
        } catch (error) {
          console.error('Error during email verification:', error);
        } finally {
          setIsVerifying(false);
        }
      };
      
      handleEmailConfirmation();
    }
  }, [searchParams, supabase.auth, router]);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          setUser(session.user);
          // Fetch user type
          if (session.user.id) {
            const { data: userData, error: userTypeError } = await supabase
              .from('user_types')
              .select('user_type')
              .eq('user_id', session.user.id)
              .single();
              
            if (userTypeError && userTypeError.code !== 'PGRST116') {
              console.error('Error fetching user type:', userTypeError);
            } else if (userData) {
              setUserType(userData.user_type);
              // Fetch profile data based on user type
              const profileTable = userData.user_type === 'student' ? 'student_profiles' : 'company_profiles';
              const idField = userData.user_type === 'student' ? 'id' : 'id';
              
              const { data: profileData, error: profileError } = await supabase
                .from(profileTable)
                .select('*')
                .eq(idField, session.user.id)
                .single();
                
              if (profileError && profileError.code !== 'PGRST116') {
                console.error(`Error fetching ${userData.user_type} profile:`, profileError);
              } else if (profileData) {
                setUserProfile(profileData);
              }
            }
          }
        } else {
          setUser(null);
          setUserType(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Unexpected error in getSession:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      getSession();
    });
    
    getSession();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    userType,
    userProfile,
    isLoggedIn: !!user,
    loading,
    isVerifying,
    supabase,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}