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
    knowledge
  } = student;

  // Check if the current user is the owner of this student profile
  const isStudentOwner = isLoggedIn && userType === 'student' && user?.id === id;

  // Get public URLs for stored files
  useEffect(() => {
    if (profile_picture) {
      const { data } = supabase
        .storage
        .from('profile-picture')
        .getPublicUrl(profile_picture);
      
      if (data?.publicUrl) {
        setProfileImageUrl(data.publicUrl);
      }
    }
    
    if (cv) {
      const { data } = supabase
        .storage
        .from('cv')
        .getPublicUrl(cv);
      
      if (data?.publicUrl) {
        setCvUrl(data.publicUrl);
      }
    }
  }, [profile_picture, cv, supabase]);

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
            <Link href={`/profile/student/${id}/edit`}>
            
              <Button className={buttonStyles.filledBlack}>Redigera Profil</Button>
            </Link>
          </div>
        )}

        <section className={styles.studentHeader}>
          {/* Profile picture */}
          <div className={styles.profileImg}>
            {profileImageUrl && (
              <Image 
              src={profileImageUrl}
              alt={`Profilbild för ${first_name} ${last_name}`}
              fill
              style={{ objectFit: 'cover' }}
            />
            )}
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
      </section>
    </div>
  );
};

export default StudentProfileView;