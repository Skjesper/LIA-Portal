'use client';
import { useState, useEffect } from 'react'; 
import Label, { labelStyles } from '@/components/ui/Label/Label';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/StudentProfileCard/StudentProfileCard.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Student profile card component matching the provided design
 * 
 * @param {Object} props
 * @param {Object} props.student - Student data object
 * @param {string} props.student.id - Student ID
 * @param {string} props.student.first_name - Student first name
 * @param {string} props.student.last_name - Student last name
 * @param {string} props.student.education_program - Student education program
 * @param {string} props.student.profile_picture - URL to student profile picture
 * @param {Array<string>} props.student.knowledge - Array of student's skills/knowledge
 */
const StudentProfileCard = ({ student }) => {
  // State for profile image
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const supabase = createClientComponentClient();
  
  // Konstant för placeholder-bild
  const PLACEHOLDER_IMAGE = '/placeholder/placeholder.png';

  // UseEffect to get the public URL for profile picture from Supabase storage
  useEffect(() => {
    if (student.profile_picture) {
      try {
        const { data } = supabase
          .storage
          .from('profile-picture')
          .getPublicUrl(student.profile_picture);
        
        if (data?.publicUrl) {
          setProfileImageUrl(data.publicUrl);
        }
      } catch (error) {
        console.error('Error getting profile image URL:', error);
        setImageError(true);
      }
    }
  }, [student.profile_picture, supabase]);

  // Format the education program display text
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

  // Hantera bildfel
  const handleImageError = () => {
    console.log('Image failed to load, using placeholder');
    setImageError(true);
  };

  // Avgör vilken bild som ska visas
  const displayImageSrc = profileImageUrl && !imageError 
    ? profileImageUrl 
    : PLACEHOLDER_IMAGE;

  return (
    <article className={styles.studentCard}>
      <h2 className={styles.studentName}>
        <span>{student.first_name}</span>
        <span><br />{student.last_name}</span>
      </h2>

      <div className={styles.cardContent}>
        <div className={styles.imageContainer}>
          <Image 
            src={displayImageSrc}
            alt={`Profilbild för ${student.first_name} ${student.last_name}`}
            width={100}
            height={100}
            className={styles.profileImage}
            onError={handleImageError}
            priority
          />
        </div>
        
        <div className={styles.studentInfo}>
          <Label className={labelStyles.unfilled}>
            {getProgramDisplay(student.education_program)}
          </Label>
          
          {/* Skills list with a limit of 3 skills */}
          <ul className={styles.skillsList}>
            {student.knowledge && student.knowledge.slice(0, 3).map((skill, index) => (
              <li key={index} className={styles.skillItem}>
                <span className={styles.bulletPoint}>•</span> {skill}
              </li>
            ))}
          </ul>
          
          <div className={styles.buttonWrapper}>
            <Link href={`/student/${student.id}`} className={styles.profileLink}>
              SE PROFIL
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default StudentProfileCard;