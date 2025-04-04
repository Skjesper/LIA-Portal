"use client";
import React, { useState } from 'react';
import StudentSignUpForm from './StudentSignUpForm';
import CompanySignUpForm from './CompanySignUpForm';

export default function SignUpModal({ isOpen, onClose, parentClose }) {
  const [activeTab, setActiveTab] = useState('student');

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
      <div className="modalContainer">
        <button className="backButton" onClick={handleBack}>
          TILLBAKA
        </button>
        
        <h2 className="modalTitle">SKAPA KONTO</h2>
        
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