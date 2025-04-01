"use client"

import React, { useState } from 'react';
import styles from './RSVPCard.module.css'; // Antar att du har en CSS-modul

const RSVPCard = ({ title, onSubmit }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.rsvpCard}>
      <h2 className={styles.title}>{title || 'ANMÄLAN TILL EVENT'}</h2>
      
      <form onSubmit={handleSubmit}>
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
          <button type="submit" className={styles.submitButton}>
            ANMÄL TILL EVENT
          </button>
        </div>
      </form>
    </div>
  );
};

export default RSVPCard;