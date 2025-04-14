'use client';
import { useState, useEffect } from 'react'; // Lägg till denna rad
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
  // Format the student name
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (student.profile_picture) {
      const { data } = supabase
        .storage
        .from('profile-picture')
        .getPublicUrl(student.profile_picture);
      
      if (data?.publicUrl) {
        setProfileImageUrl(data.publicUrl);
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
  
  // Default profile image if none provided
  const profileImage = student.profile_picture || '/placeholder-profile.jpg';

  return (
    <article className={styles.studentCard}>
      <h2 className={styles.studentName}>
        <span>{student.first_name}</span>
        <span><br />{student.last_name}</span>
      </h2>

      <div className={styles.cardContent}>
        <div className={styles.imageContainer}>
          {profileImageUrl ? (
            <Image 
              src={profileImageUrl}
              alt={`Profilbild för ${student.first_name} ${student.last_name}`}
              width={100}
              height={100}
              className={styles.profileImage}
            />
          ) : (
            <Image
              src="/placeholder/placeholder.jpg"
              alt="Placeholder Profile Image"
              width={100}
              height={100}
              className={styles.profileImage}
            />
          )}
        </div>
        
        <div className={styles.studentInfo}>
          <Label className={labelStyles.unfilled}>
            {getProgramDisplay(student.education_program)}
          </Label>
          
          <ul className={styles.skillsList}>
            {student.knowledge && student.knowledge.map((skill) => (
              <li key={skill} className={styles.skillItem}>
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
