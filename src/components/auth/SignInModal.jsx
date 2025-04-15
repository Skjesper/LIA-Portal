"use client";
import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import SignUpModal from './SignUpModal';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import Input, { inputStyles } from '@/components/ui/Input/Input';
import Image from 'next/image';
import style from './SignInModal.module.css';

export default function SignInModal({ isOpen, onClose }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        setMessage({
          type: 'success',
          text: 'Sign in successful! Redirecting...'
        });
        
        // Clear form
        setEmail('');
        setPassword('');
        
        // Redirect after short delay
        setTimeout(() => {
          onClose(); // Close the modal
          router.push('/dashboard'); // Redirect to dashboard or appropriate page
        }, 1000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred during sign in'
      });
    } finally {
      setLoading(false);
    }
  };

  // Switch to sign up modal
  const openSignUp = () => {
    setShowSignUp(true);
  };

  // Go back to sign in from sign up
  const closeSignUp = () => {
    setShowSignUp(false);
  };

  // If sign up is shown, render that instead
  if (showSignUp) {
    return <SignUpModal isOpen={true} onClose={closeSignUp} parentClose={onClose} />;
  }

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className={style.modalContainer}>
        <div className={style.modalNavbar}>
          <button 
            onClick={openSignUp}
            className={style.logInNav}
          >
            LOGGA IN
          </button>
          <button 
            onClick={openSignUp}
            className={style.signUpNav}
          >
            SKAPA KONTO
          </button>
        </div>
        <Button className={buttonStyles.underlinedBlack} onClick={onClose} style={{alignSelf: "flex-end", marginRight: "1.5rem"}}>
          STÄNG
          <Image
            src="/icons/exit-black.svg"
            alt="icon for exiting"
            width={14}
            height={14}
          />
        </Button>
        
        <form onSubmit={handleSignIn} className={style.logInForm}>
        <h3 className={style.formTitle}>HEJ!</h3>
        <p className={style.formText}>Skriv in e-post och lösenord för att logga in</p>
          {message && (
            <div className={message.type === 'success' ? 'success' : 'error'}>
              {message.text}
            </div>
          )}
          
          <div className="formGroup">
            <label htmlFor="email" className={style.label}>*EMAIL</label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyles.inputBlack}
              required
              placeholder="exempel@mail.com"
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="password" className={style.label}>*LÖSENORD</label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyles.inputBlack}
              required
              placeholder="Skriv in ditt lösenord"
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className={buttonStyles.filledBlack}
            style={{ width: "9rem", padding: "0.875rem 2rem", alignSelf:"center", marginTop:"0.5rem"}}
          >
            {loading ? 'LOGGAR IN...' : 'LOGGA IN'}
          </Button>
        </form>
      </div>
    </div>
  );
}