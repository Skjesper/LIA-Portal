
import Link from 'next/link';
import Button from '@/components/ui/Button/Button.jsx';
import styles from '@/components/ui/Button/Button.module.css'; // Lägg till denna import


export default function Home() {
  return (
    <div>
    <Button className={styles.filledBlack}>filled-black</Button>
    <Button className={styles.warning}>warning</Button>
    <Button className={styles.success}>warning</Button>
    <Button className={styles.filledWhite}>filledWhite</Button>
    <Button className={styles.warning}>warning</Button>
    <h2>Fokuserad knapp</h2>
      <Button className={styles.unfilledBlack}>Fokuserad</Button>
      <Button className={styles.unfilledWhite}>unfilledWhite</Button>
      <Button className={styles.unfilledBlack}>unfilledBlack</Button>
      <Button className={styles.underlinedWhite}>
     Button</Button>
      <Button className={styles.underlinedBlack}>Button</Button>
    
  </div>
  );
}