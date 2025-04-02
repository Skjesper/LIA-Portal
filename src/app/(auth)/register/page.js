"use client";
import React, { useState } from 'react';
import SignInModal from '@/components/auth/SignInModal';

export default function SignUp() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  return (
    <div>
      <h1>Welcome to My App</h1>
      
      {/* Button to open sign in modal */}
      <button onClick={openSignInModal}>Sign In / Sign Up</button>
      
      {/* Sign In Modal (which can lead to Sign Up) */}
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={closeSignInModal} 
      />
    </div>
  );
}