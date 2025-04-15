"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './RSVPCard.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import supabase from '@/utils/supabase';
import useBreakpoint from '@/app/hooks/useBreakpoint';

const RSVPCard = ({ title, onSubmit }) => {
  const isMobile = useBreakpoint(1080);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    participants: ''
  });

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
      // Ta bort id-fältet helt från insert-anropet
      // Låt databasen hantera id:t (efter att du ändrat begränsningen)
      const { data, error } = await supabase
        .from('event_registrations')
        .insert([
          { 
            company_name: formData.companyName,
            email: formData.email,
            number_of_attendees: parseInt(formData.participants), 
            created_at: new Date()
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
      
      alert('Tack för din anmälan!');
      
    } catch (error) {
      console.error('Fel vid skickande till databasen:', error);
      alert('Ett fel uppstod när din anmälan skulle skickas. Vänligen försök igen.');
    }
  };

  return (
    <section className={styles.rsvpCardContainer}>
      <h2 className={styles.sectionTitle}><span>01/</span>Anmälan</h2>
      <p className={styles.sectionText}>
        Detta är ett unikt tillfälle att bygga relationer med studerande från Yrgo och för att hitta nya kompetenser till ert team. Anmäl ert företag idag för att hitta potentiella praktikanter och för att få delta på ett underbart event! 
      </p>
    
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
      src="/heroimage.png"
      alt="Yrgo logotyp"
      fill  // fyller hela förälderns yta
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
