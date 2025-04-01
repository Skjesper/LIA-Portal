
import Link from 'next/link';
import Button from '@/components/ui/Button/Button.jsx';
import styles from '@/components/ui/Button/Button.module.css'; // Lägg till denna import


export default function Home() {
  return (
    <div>
    <Button className={styles.filledBlack}>filled-black</Button>
    <Button className={styles.warning}>warning</Button>
    <Button className={styles.success}>warning</Button>
    <Button className={styles.warning}>warning</Button>
    <Button className={styles.warning}>warning</Button>
    
    
  </div>
  );
}