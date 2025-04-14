"use client";
import React, { useState } from 'react';
import StudentSignUpForm from './StudentSignUpForm';
import CompanySignUpForm from './CompanySignUpForm';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import Input, { inputStyles } from '@/components/ui/Input/Input';
import Image from 'next/image';
import style from './SignUpModal.module.css';

export default function SignUpModal({ isOpen, onClose, parentClose }) {
  const [activeTab, setActiveTab] = useState('student');
  const [showSignIn, setShowSignIn] = useState(false);

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

  return (
    <div className="modalOverlay">
      <div className={style.modalContainer}>
        <div className={style.modalNavbar}>
            <button 
              onClick={handleBack}
              className={style.logInNav}
            >
              LOGGA IN
            </button>
            <button 
              /* onClick={openSignUp} */
              className={style.signInNav}
            >
              SKAPA KONTO
            </button>
        </div>
        <Button className={buttonStyles.underlinedWhite} /* onClick={onClose} */ style={{alignSelf: "flex-end", marginRight: "1.5rem"}}>
          STÄNG
          <Image
            src="/icons/exit-white.svg"
            alt="icon for exiting"
            width={10}
            height={10}
            style={{ marginLeft: '0.5rem' }}
          />
        </Button>
        
        <h3 className={style.formTitle}>SKAPA KONTO</h3>
        <p className={style.formText}>Välj om du är studerande eller från ett företag för att skapa ett konto</p>
        
        {/* Folder tabs for switching between student and company */}
        <div className="tabsContainer">
          <button 
            className={`tab ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
          >
            STUDERANDE
          </button>
          <button 
            className={`tab ${activeTab === 'company' ? 'active' : ''}`}
            onClick={() => setActiveTab('company')}
          >
            FÖRETAG
          </button>
        </div>
        
        {/* Form container */}
        <div className="formContainer">
          {activeTab === 'student' ? (
            <StudentSignUpForm onSuccess={parentClose || onClose} />
          ) : (
            <CompanySignUpForm onSuccess={parentClose || onClose} />
          )}
        </div>
      </div>
    </div>
  );
}