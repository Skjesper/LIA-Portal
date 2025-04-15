'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Company.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import Label, { labelStyles } from '@/components/ui/Label/Label';
import { useAuth } from '@/components/auth/AuthProvider';

const CompanyProfileView = ({ company }) => {
  const { isLoggedIn, userType, user } = useAuth();
  
  const {
    name,
    contact,
    city,
    bio,
    fun_benefits,
    linkedin_url,
    website_url,
    location_status,
    accepts_digital_designer,
    accepts_webb_developer
  } = company;

  // Check if the current user is the owner of this company profile
  const isCompanyOwner = isLoggedIn && userType === 'company' && user?.id === company.id;

  return (
    <div className={styles.componentContainer}>
      <div className={styles.returnButton}>
        <Link href="/">
        <div className={styles.buttonContent}>
        <Image 
          src="/logos/Button/ICON/Mobil/returnArrow.svg" 
          alt="Return arrow" 
          width={16} 
          height={16} 
        />
          <Button className={buttonStyles.underlinedBlack}>Tillbaka</Button>
          </div>
        </Link>
      </div>

      <section className={styles.companyContainer}>
        {/* Only show edit button if the user is the company owner */}
        {isCompanyOwner && (
           <div className={styles.editProfile}>
           <Link href={'/edit-profile'}>
             <Button className={buttonStyles.filledBlack}>
               <div className={styles.buttonContent}>
                 <Image 
                   src="/logos/edit_square.svg" 
                   alt="edit icon" 
                   width={16} 
                   height={16} 
                 />
                 Redigera Profil
               </div>
             </Button>
           </Link>
         </div>
        )}

        <section className={styles.cardContainer}>
          <section className={styles.profileHeader}>
            <h2>{name}</h2>
            <section className={styles.headerInfo}>

            <div className={styles.locationStatus}>
              {location_status && location_status !== 'NULL' && (
                <Label className={labelStyles.unfilled}>{location_status}</Label>
              )}
            </div>
              
            <div className={styles.jobTypes}>
              {(accepts_digital_designer === true || accepts_digital_designer === 'TRUE') && (
                <Label className={labelStyles.unfilled}>Digital Designer</Label>
              )}
              {(accepts_webb_developer === true || accepts_webb_developer === 'TRUE') && (
                <Label className={labelStyles.unfilled}>Webbutvecklare</Label>
              )}
            </div>

            </section>

            <section className={styles.linksContainer}>
              {linkedin_url && (
                <div className={styles.links}>
                  <Image src="/logos/LinkedinLogo.svg" alt="LinkedIn ikon" width={24} height={24} />
                  <a href={linkedin_url} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
                </div>
              )}
              {website_url && (
                <div className={styles.links}>
                  <Image src="/logos/Desktop.svg" alt="Webbplats ikon" width={24} height={24} />
                  <a href={website_url} target="_blank" rel="noopener noreferrer">HEMSIDA</a>
                </div>
              )}
              {contact && (
                <div className={styles.links}>
                  <Image src="/logos/mail.svg" alt="Mail ikon" width={24} height={24} />
                  <a href={`mailto:${contact}`}>MAIL</a>
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