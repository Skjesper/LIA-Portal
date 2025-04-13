'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/StudentProfileCard/StudentProfileCard.module.css';

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
  const studentName = `${student.first_name} ${student.last_name}`;
  
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
      <h2 className={styles.studentName}>{studentName}</h2>

          <div className={styles.cardContent}>
        <div className={styles.imageContainer}>
          {/* <Image 
            src={profileImage}
            alt={`Profilbild av ${studentName}`}
            width={224}
            height={224}
            className={styles.profileImage}
            priority
          /> */}
        </div>
        
        <div className={styles.studentInfo}>
          <div className={styles.programBadge}>
            {getProgramDisplay(student.education_program)}
          </div>
          
          <ul className={styles.skillsList}>
            {student.knowledge && student.knowledge.map((skill) => (
              <li key={skill} className={styles.skillItem}>
                <span className={styles.bulletPoint}>•</span> {skill}
              </li>
            ))}
          </ul>
          
          <Link href={`/students/${student.id}`} className={styles.profileLink}>
            SE PROFIL
          </Link>
        </div>
      </div>
    </article>
  );
};

export default StudentProfileCard;