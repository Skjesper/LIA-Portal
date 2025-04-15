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
        <nav className={style.modalNavbar}>
            <button 
              onClick={handleBack}
              className={style.logInNav}
            >
              LOGGA IN
            </button>
            <button 
              /* onClick={openSignUp} */
              className={style.signUpNav}
            >
              SKAPA KONTO
            </button>
        </nav>
        <Button className={buttonStyles.underlinedWhite} /* onClick={onClose} */ style={{alignSelf: "flex-end", marginRight: "1.5rem"}}>
          STÄNG
          <Image
            src="/icons/exit-white.svg"
            alt="icon for exiting"
            width={14}
            height={14}
          />
        </Button>

        <article className={style.logInContent}>
          <h3 className={style.formTitle}>SKAPA KONTO</h3>
          <p className={style.formText}>Välj om du är studerande eller från ett företag för att skapa ett konto</p>
          
          <fieldset className={style.logInContentControler}>
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
          <div className="formContainer">
            {activeTab === 'student' ? (
              <StudentSignUpForm onSuccess={parentClose || onClose} />
            ) : (
              <CompanySignUpForm onSuccess={parentClose || onClose} />
            )}
          </div>
        </article>
      </div>
    </div>
  );
}