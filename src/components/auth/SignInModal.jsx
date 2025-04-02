"use client";
import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import SignUpModal from './SignUpModal';

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
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          TILLBAKA
        </button>
        
        <h2 className="modal-title">LOGGA IN</h2>
        
        <form onSubmit={handleSignIn}>
          {message && (
            <div className={message.type === 'success' ? 'success' : 'error'}>
              {message.text}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="exempel@mail.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ange lösenord"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="primary-button"
          >
            {loading ? 'Loggar in...' : 'LOGGA IN'}
          </button>
        </form>
        
        <div className="separator">
          <span>eller</span>
        </div>
        
        <button 
          onClick={openSignUp}
          className="secondary-button"
        >
          SKAPA KONTO
        </button>
      </div>
    </div>
  );
}