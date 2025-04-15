"use client";
import React, { useState } from 'react';
import StudentSignUpForm from './StudentSignUpForm';
import CompanySignUpForm from './CompanySignUpForm';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import Input, { inputStyles } from '@/components/ui/Input/Input';
import Image from 'next/image';
import style from './SignUpModal.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function SignUpModal({ isOpen, onClose, parentClose }) {
  const router = useRouter();
  const { supabase } = useAuth();
  const [activeTab, setActiveTab] = useState('student');
  const [showSignIn, setShowSignIn] = useState(false);
  const [signupState, setSignupState] = useState('form'); // 'form', 'verification', 'success'
  const [verificationEmail, setVerificationEmail] = useState('');
  
  if (!isOpen) return null;
  
  // Handle back button - either go back to sign in or close completely
  const handleBack = () => {
    if (parentClose) {
      // If we have a parent close function, go back to sign in
      onClose();
    } else {
      // Otherwise just close everything
      onClose();
    }
  };

  const redirectSignedIn = async () => {
    try {
      const savedEmail = localStorage.getItem('pendingEmail');
      const savedPassword = localStorage.getItem('pendingPassword');
      
      // Close the modal
      /* onClose();
      if (parentClose) parentClose(); */
      handleBack();
      // Redirect to login page
      /* router.push('/edit-profile'); */
      
    } catch (error) {
      console.error("Error during redirection:", error);
      alert("Ett oväntat fel inträffade. Försök igen.");
    }
  };

  
  const handleSignupSuccess = (email) => {
    setVerificationEmail(email);
    setSignupState('verification');
  };
  
  const renderContent = () => {
    switch (signupState) {
      case 'form':
        return (<>
              <Button 
                className={buttonStyles.underlinedWhite} 
                onClick={onClose} 
                style={{alignSelf: "flex-end", marginRight: "1.5rem"}}
              >
                STÄNG
                <Image
                  src="/icons/exit-white.svg"
                  alt="icon for exiting"
                  width={14}
                  height={14}
                />
              </Button>
          <article className={style.signUpContent}>
            <h3 className={style.formTitle}>SKAPA KONTO</h3>
            <p className={style.formText}>Välj om du är studerande eller från ett företag för att skapa ett konto</p>
            <fieldset className={style.signUpContentControler}>
              <button
                className={activeTab === 'student' ? style.active : style.inactive}
                onClick={() => setActiveTab('student')}
                style={{width:"50%"}}
              >
                STUDERANDE
              </button>
              <button
                className={activeTab === 'company' ? style.active : style.inactive}
                onClick={() => setActiveTab('company')}
                style={{width:"50%"}}
              >
                FÖRETAG
              </button>
            </fieldset>
            {/* Form container */}
            {activeTab === 'student' ? (
              <StudentSignUpForm
                onSuccess={(email) => handleSignupSuccess(email)}
                onClose={parentClose || onClose}
              />
            ) : (
              <CompanySignUpForm
                onSuccess={(email) => handleSignupSuccess(email)}
                onClose={parentClose || onClose}
              />
            )}
          </article>
          </>
        );
        
      case 'verification':
        return (
          <div className={style.welcomeMessage}>
            <h3 className={style.formTitle}>KONTO SKAPAT!</h3>
            <Image
              src="/icons/check_circle_white.svg"
              alt="email verification icon"
              width={73}
              height={73}
              style={{margin:"1rem 0 1.5rem 0"}}
            />
            <p className={style.formText}>
              Vi har skickat ett bekräftelsemail till <strong>{verificationEmail}</strong>
            </p>
            <p className={style.formText}>
              Klicka på länken i mailet för att bekräfta din e-post och slutföra registreringen.
            </p>
            <Button 
              className={buttonStyles.filledWhite}
              onClick={redirectSignedIn}
              style={{marginTop: "1rem"}}
            >
            JAG HAR VERIFIERAT MIN E-POST
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContainer}>
        <nav className={style.modalNavbar}>
          <button
            onClick={handleBack}
            className={style.logInNav}
          >
            LOGGA IN
          </button>
          <button
            className={style.signUpNav}
          >
            SKAPA KONTO
          </button>
        </nav>
        
        {renderContent()}
      </div>
    </div>
  );
}