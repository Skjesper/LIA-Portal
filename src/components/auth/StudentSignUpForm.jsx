"use client";
import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Input, { inputStyles } from '@/components/ui/Input/Input';
import Button, { buttonStyles } from '@/components/ui/Button/Button';

export default function StudentSignUpForm({ onSuccess }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
            user_type: 'student',
            first_name: firstName,
            last_name: lastName
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        localStorage.setItem('needsProfileCompletion', true);

        // Call onSuccess with the email address
        if (onSuccess) {
          onSuccess(email);
        }

        // Clear form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Ett fel uppstod vid registrering'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSignUp}
      style={{display:"flex", flexDirection:"column", gap:"0.5rem"}}
    >
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'} style={{color:"var(--Primary-Red)"}}>
          {message.text}
        </div>
      )}
      
      <div className="formGroup">
        <label htmlFor="firstName">*FÖRNAMN</label>
        <Input
          type="text"
          id="firstName"
          value={firstName}
          className={inputStyles.inputWhite}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Ex. Anna"
          required
        />
      </div>
      
      <div className="formGroup">
        <label htmlFor="lastName">*EFTERNAMN</label>
        <Input
          type="text"
          id="lastName"
          value={lastName}
          className={inputStyles.inputWhite}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Ex. Nilsson"
          required
        />
      </div>
      
      <div className="formGroup">
        <label htmlFor="email">*EMAIL</label>
        <Input
          type="email"
          id="email"
          value={email}
          className={inputStyles.inputWhite}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exempel@mail.com"
          required
        />
      </div>
      
      <div className="formGroup">
        <label htmlFor="password">*LÖSENORD</label>
        <Input
          type="password"
          id="password"
          value={password}
          className={inputStyles.inputWhite}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Välj ett lösenord"
          minLength={6}
        />
      </div>
      
      <Button
        type="submit"
        disabled={loading}
        className={buttonStyles.filledWhite}
        style={{width:"12rem", padding:"0.875rem 2rem", alignSelf:"center", marginTop:"1rem"}}
      >
        {loading ? 'SKAPAR KONTO...' : 'SKAPA KONTO'}
      </Button>
    </form>
  );
}