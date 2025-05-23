"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './RSVPCard.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import supabase from '@/utils/supabase';
import useBreakpoint from '@/app/hooks/useBreakpoint';
import RSVPConfirmation from './RSVPConfirmation'; // Importera bekräftelsekomponenten

const RSVPCard = ({ title, onSubmit }) => {
  const isMobile = useBreakpoint(800);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    participants: ''
  });
  // State för att kontrollera om bekräftelsen ska visas
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validera data före insättning
      if (!formData.companyName || !formData.email || !formData.participants) {
        alert('Vänligen fyll i alla obligatoriska fält');
        return;
      }
      
      // Konvertera deltagare till nummer och validera
      const attendeesCount = parseInt(formData.participants);
      if (isNaN(attendeesCount) || attendeesCount <= 0) {
        alert('Vänligen ange ett giltigt antal deltagare');
        return;
      }
      
      const { data, error } = await supabase
        .from('event_registrations')
        .insert([
          { 
            company_name: formData.companyName.trim(),
            email: formData.email.trim(),
            number_of_attendees: attendeesCount
          }
        ]);
      
      if (error) throw error;
      
      console.log('Anmälan skickad till databasen:', data);
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      // Återställ formuläret
      setFormData({
        companyName: '',
        email: '',
        participants: ''
      });
      
      // Visa bekräftelseöverlag istället för alert
      setShowConfirmation(true);
      
    } catch (error) {
      console.error('Fel vid skickande till databasen:', error);
      alert(`Ett fel uppstod när din anmälan skulle skickas: ${error.message}. Vänligen försök igen.`);
    }
  };

  // Funktion för att stänga bekräftelsen
  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <section className={styles.rsvpCardContainer}>
      {/* Bekräftelseöverlag */}
      {showConfirmation && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <RSVPConfirmation />
            <Button 
              className={buttonStyles.filledBlack}
              onClick={closeConfirmation}
              style={{ marginTop: '20px', width: '8rem', padding: '0.7rem' }}
            >
              STÄNG
            </Button>
          </div>
        </div>
      )}
    
      <section className={styles.rsvpCard}>
        <div className={styles.applyWrapper}>
          <div className={styles.formWrapper}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>ANMÄLAN TILL EVENT 23/4</div>
              <Image
                src="/logos/white-main.svg"
                alt="Company Logo"
                width={100}
                height={100}
                className={styles.image}
              />
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="companyName" className={styles.label}>
                  *FÖRETAGSNAMN
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  placeholder="ex. Företag AB"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  *EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="exempel@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="participants" className={styles.label}>
                  *HUR MÅNGA ÄR NI SOM VILL DELTA?
                </label>
                <input
                  type="number"
                  id="participants"
                  name="participants"
                  placeholder="ex. 2"
                  value={formData.participants}
                  onChange={handleChange}
                  className={styles.input}
                  min="1"
                  required
                />
              </div>

              <div className={styles.buttonContainer}>
                <Button type="submit" className={buttonStyles.filledWhite} style={{ width: '100%' }}>
                  ANMÄL TILL EVENT
                </Button>
              </div>
            </form>
          </div>

          {!isMobile && (
            <section className={styles.rsvpImage}>
              <Image 
                src="/heroImage.png"
                alt="Yrgo logotyp"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </section>
          )}
        </div>
      </section>
    </section>
  );
};

export default RSVPCard;