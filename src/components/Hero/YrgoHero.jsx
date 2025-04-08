import React from 'react';
import styles from '@/components/Hero/YrgoHero.module.css';
import '@/components/styles/colors.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';

const YrgoHero = () => {
  return (
<section className={styles.heroSection}>
      <h1 className={styles.heroTitle}>Välkommen på mingel hos Yrgo</h1>
    <section className={styles.infoTextContainer}>
        <section className={styles.infoText}>
            <p className={styles.text}>
            Onsdag den 23 april kl 13:00–15:00 
            Visual Arena
            </p>
            <p className={styles.text}>
            Webbutvecklare och Digital Designers på Yrgo
            </p>
        </section>
        <Button className={buttonStyles.underlinedBlack}>Anmäl dig</Button>
    </section>
        <section className={styles.heroImage}>

        </section>
        <section className={styles.attendingCompanies}>

        </section>
        <section className={styles.aboutEventContainer}>
            <div className={styles.text}>
                Om eventet:
            </div>
            <div className={styles.text}>
            Välkomna på mingelevent för att hitta framtida medarbetare i ert företag eller bara jobba tillsammans under LIA. Ni kommer att träffa Webbutvecklare och Digital Designers från Yrgo som vill visa vad de har jobbat med under året och vi hoppas att ni hittar en match. 
            </div>
        </section>
    </section>
  );
};

export default YrgoHero;