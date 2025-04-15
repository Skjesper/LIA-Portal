'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './Student.module.css';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import Label, { labelStyles } from '@/components/ui/Label/Label';
import { useAuth } from '@/components/auth/AuthProvider';

const StudentProfileView = ({ student }) => {
  const { isLoggedIn, userType, user } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [cvUrl, setCvUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const supabase = createClientComponentClient();
  
  const {
    id,
    first_name,
    last_name,
    profile_picture,
    education_program,
    linkedin_url,
    portfolio_url,
    bio,
    cv,
    knowledge,
    previous_experience
  } = student;

  // Check if the current user is the owner of this student profile
  const isStudentOwner = isLoggedIn && userType === 'student' && user?.id === id;
  const PLACEHOLDER_IMAGE = '/placeholder/placeholder.png';

  // Get public URLs for stored files
  useEffect(() => {
    if (profile_picture) {
      try {
        const { data } = supabase
          .storage
          .from('profile-picture')
          .getPublicUrl(profile_picture);
        
        if (data?.publicUrl) {
          setProfileImageUrl(data.publicUrl);
        }
      } catch (error) {
        console.error('Error getting profile image URL:', error);
        setImageError(true);
      }
    }
    
    if (cv) {
      try {
        const { data } = supabase
          .storage
          .from('cv')
          .getPublicUrl(cv);
        
        if (data?.publicUrl) {
          setCvUrl(data.publicUrl);
        }
      } catch (error) {
        console.error('Error getting CV URL:', error);
      }
    }
  }, [profile_picture, cv, supabase]);

  // Hantera bildfel
  const handleImageError = () => {
    console.log('Image failed to load, using placeholder');
    setImageError(true);
  };

  // Avgör vilken bild som ska visas
  const displayImageSrc = profileImageUrl && !imageError 
    ? profileImageUrl 
    : PLACEHOLDER_IMAGE;

  // Format program display
  const getProgramDisplay = (program) => {
    switch(program) {
      case 'Webbutveckling':
        return 'WEBBUTVECKLARE';
      case 'Digital Design':
        return 'DIGITAL DESIGNER';
      default:
        return program?.toUpperCase() || '';
    }
  };

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

      <section className={styles.profileContainer}>
        {/* Only show edit button if the user is the student owner */}
        {isStudentOwner && (
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

        <section className={styles.studentHeader}>
          {/* Profile picture */}
          <div className={styles.profileImg}>
            <Image 
              src={displayImageSrc}
              alt={`Profilbild för ${first_name} ${last_name}`}
              fill
              style={{ objectFit: 'cover' }}
              onError={handleImageError}
              priority
            />
          </div>

          {/* Profile information */}
          <div className={styles.headerInfo}>
            <h1>{first_name} {last_name}</h1>

            {/* Education/role */}
            <div className={styles.educationRole}>
              <Label className={labelStyles.unfilled}>{getProgramDisplay(education_program)}</Label>
            </div>

            {/* Social links */}
            <section className={styles.linksContainer}>
              {linkedin_url && (
                <div className={styles.links}>
                  <Image 
                    src="/logos/LinkedinLogo.svg" 
                    alt="LinkedIn ikon" 
                    width={24} 
                    height={24} 
                  />
                  <a href={linkedin_url} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
                </div>
              )}
              
              {portfolio_url && (
                <div className={styles.links}>
                  <Image 
                    src="/logos/Desktop.svg" 
                    alt="Portfolio ikon" 
                    width={24} 
                    height={24} 
                  />
                  <a href={portfolio_url} target="_blank" rel="noopener noreferrer">PORTFOLIO</a>
                </div>
              )}
            </section>
          </div>
        </section>

      <section className={styles.infoCards}>
        <section className={styles.profileBio}>
          <h2>BIO</h2>
          <p>{bio}</p>
        </section>

        {/* Knowledge section */}
        {knowledge && knowledge.length > 0 && (
          <section className={styles.profileKnowledge}>
            <h2>KUNSKAP</h2>
            <div className={styles.knowledgeList}>
              {knowledge.map((skill, index) => (
                <Label className={labelStyles.filled} key={index}>{skill}</Label>
              ))}
            </div>
          </section>
        )}

        {/* CV section */}
        {cv && cvUrl && (
          <section className={styles.profileCv}>
            <div className={styles.infoCv}>
              <h2>CV</h2>
              <p>Tryck för att ladda ner</p>
            </div>
            <a 
              href={cvUrl}
              download 
              className={styles.downloadButton}
            >
              <Image 
                src="/logos/download_file.svg" 
                alt="Ladda ner ikon" 
                width={58} 
                height={58} 
              />
            </a>
          </section>
        )}

          {previous_experience && (
          <section className={styles.profileExperience}>
              <h2>Tidigare erfarenhet</h2>
              <p>{previous_experience}</p>
          </section>
        )}
      </section>
    </section>
    </div>
  );
};

export default StudentProfileView;