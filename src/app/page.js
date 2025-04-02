import Link from 'next/link';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import pageStyles from './page.module.css'; // Importera page.module.css
import Section from '@/components/Sections/Sections';
import RSVPCard from '@/components/RSVPCard/RSVPCard';


export default function Home() {
  return (
    <main>
      <h1>Min webbsida</h1>
      
      <Section>
        <div className={pageStyles.applyWrapper}>
          <h2>01/Anmälan</h2>
          <p>Lorem ipsum dolor sit amet si consectetur. Sagittis faucibus vita in faucibus nunc. Semper nun sodales malesuada. Non habitant.</p>
          <RSVPCard></RSVPCard>
        </div>
      </Section>
      <Section>
        <div className={pageStyles.applyWrapper}>
          <h2>02/Företag</h2>

          <p>Lorem ipsum dolor sit amet si consectetur. Sagittis faucibus vita in faucibus nunc. Semper nun sodales malesuada. Non habitant.</p>
          <p>Lorem ipsum dolor sit amet si consectetur. Sagittis faucibus vita in faucibus nunc. Semper nun sodales malesuada. Non habitant.</p>
          <Button className={buttonStyles.underlinedBlack}>Se alla företag</Button>
        </div>
      </Section>
      <Section>
        <div className={pageStyles.applyWrapper}>
          <h2>03/Studenter</h2>
          <p>Lorem ipsum dolor sit amet si consectetur. Sagittis faucibus vita in faucibus nunc. Semper nun sodales malesuada. Non habitant.</p>
          <p>Lorem ipsum dolor sit amet si consectetur. Sagittis faucibus vita in faucibus nunc. Semper nun sodales malesuada. Non habitant.</p>
          <Button className={buttonStyles.underlinedBlack}>Se alla studenter</Button>
        </div>
      </Section>
      
    </main>
  );
}