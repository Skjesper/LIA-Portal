'use client';

import React from 'react';
import Image from 'next/image';
import styles from './RSVPConfirmation.module.css';

const RSVPConfirmation = () => {  // Korrigerad till en funktionskomponent
  return (
    <div className={styles.confirmationContainer}>
      <div className={styles.confirmationCard}>
      <div className={styles.titleWrapper}>
              <div className={styles.title}>ANMÄLAN TILL EVENT 23/4</div>
              <Image
                src="/logos/white-main.svg"
                alt="Company Logo"
                width={40}
                height={40}
                className={styles.image}
              />
            
        </div>
        
        <div className={styles.cardContent}>
          <h3 className={styles.text}>Tack för din anmälan!</h3>
          
          <p className={styles.text}>
            Vi ses den 23:e april kl. 13:00–15:00 på Visual Arena.
          </p>
          
          <p className={styles.text}>
            Mvh, Yrgos Webbutvecklare & Digitala Designers
          </p>
        </div>
      </div>
    </div>
  );
};

export default RSVPConfirmation;