"use client";
import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function CompanySignUpForm({ onSuccess }) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      // Sign up the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: 'company',
            company_name: companyName
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        setMessage({
          type: 'success',
          text: 'Registration successful! Redirecting to profile setup...'
        });
        
        // Clear form
        setCompanyName('');
        setEmail('');
        setPassword('');
        
        // Add a short delay before redirecting
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(); // Close the modal
          }
          router.push('/edit-profile');
        }, 1500); // 1.5 seconds
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred during sign-up'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          {message.text}
        </div>
      )}
      
      <div className="formGroup">
        <label htmlFor="companyName">*FÖRETAGSNAMS</label>
        <input
          type="text"
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          placeholder="ex. Företag AB"
        />
      </div>
      
      <div className="formGroup">
        <label htmlFor="email">*EMAIL</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="exempel@mail.com"
        />
      </div>
      
      <div className="formGroup">
        <label htmlFor="password">*LÖSENORD</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Välj ett lösenord"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'SKAPA KONTO'}
      </button>
    </form>
  );
}