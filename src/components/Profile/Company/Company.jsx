'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Company.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import Label, { labelStyles } from '@/components/ui/Label/Label';

const CompanyProfileView = ({ company }) => {
  const {
    name,
    email,
    city,
    bio,
    fun_benefits,
    linkedin,
    website,
  } = company;



  return (
    <div className={styles.componentContainer}>
      <div className={styles.returnButton}>
        <Link href="/">
          <Button className={buttonStyles.underlinedBlack}>Tillbaka</Button>
        </Link>
      </div>

      <section className={styles.companyContainer}>
        <div className={styles.editProfile}>
          <Link href={`/profile/company/${company.id}/edit`}>
            <Button className={buttonStyles.filledBlack}>Redigera Profil</Button>
          </Link>
        </div>

        <section className={styles.cardContainer}>
          <section className={styles.profileHeader}>
            <h2>{name}</h2>

            <section className={styles.linksContainer}>
              {linkedin && (
                <div className={styles.links}>
                  <Image src="/logos/LinkedinLogo.svg" alt="LinkedIn ikon" width={24} height={24} />
                  <a href={linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
                </div>
              )}
              {website && (
                <div className={styles.links}>
                  <Image src="/logos/Desktop.svg" alt="Webbplats ikon" width={24} height={24} />
                  <a href={website} target="_blank" rel="noopener noreferrer">HEMSIDA</a>
                </div>
              )}
              {email && (
                <div className={styles.links}>
                  <Image src="/logos/mail.svg" alt="Mail ikon" width={24} height={24} />
                  <a href={`mailto:${email}`}>MAIL</a>
                </div>
              )}
            </section>
          </section>

          <section className={styles.profileBio}>
            <h2>Om företaget</h2>
            <p>{bio}</p>
          </section>

          {city && (
            <section className={styles.profileCity}>
              <h3>Ort</h3>
              {city.map((city, index) => (
                <h2 key={index}>{city}</h2>
              ))}
            </section>
          )}

          <section className={styles.profilePerks}>
            <h2>Roliga förmåner</h2>
            {fun_benefits && fun_benefits.length > 0 ? (
                <div className={styles.benefitsList}>
                {fun_benefits.map((benefit, index) => (
                    <Label className={labelStyles.filled} key={index}>{benefit}</Label>
                ))}
                </div>
            ) : (
                <p>Inga förmåner angivna</p>
            )}
          </section>
        </section>
      </section>
    </div>
  );
};

export default CompanyProfileView;
