"use client";
import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
  const [signedIn, setSignedIn] = useState(false);
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
        setSignedIn(true);
        
        // Clear form
        setEmail('');
        setPassword('');

        // Check if user needs to complete their profile
        const needsProfileCompletion = localStorage.getItem('needsProfileCompletion');
        
        if (needsProfileCompletion === 'true') {
          // New user, redirect to edit-profile
          localStorage.removeItem('needsProfileCompletion');
          router.push('/edit-profile');
        }
        
        // Redirect after short delay
        setTimeout(() => {
          onClose(); // Close the modal
        }, 2000);
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

  if (!signedIn) return (
    <div className={style.modalOverlay}>
      <div className={style.modalContainer}>
        <div className={style.modalNavbar}>
          <button 
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

  return (
    <div className={style.modalOverlay}>
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
      <div className={style.welcomeMessage}>
        <h3 className={style.formTitle}>VÄLKOMMEN TILLBAKA!</h3>
        <Image
          src="/icons/check_circle_black.svg"
          alt="icon signaling success"
          width={73}
          height={73}
          style={{margin:"1rem  0 1.5rem 0"}}
        />
        <p className={style.formText}>Du är nu inloggad</p>
      </div>
    </div>
  </div>
  );
}