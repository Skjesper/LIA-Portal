import Link from 'next/link';
import Button from '@/components/ui/Button/Button.jsx';
import buttonStyles from '@/components/ui/Button/Button.module.css';
import pageStyles from './page.module.css'; // Importera page.module.css
import Section from '@/components/Sections/Sections';

export default function Home() {
  return (
    <main>
      <h1>Min webbsida</h1>
      
      <Section>
        <div className={pageStyles.applyWrapper}>
          <h2>01/Anmälan</h2>
          <p>Lorem ipsum dolor sit amet si consectetur. Sagittis faucibus vita in faucibus nunc. Semper nun sodales malesuada. Non habitant.</p>
        </div>
      </Section>
      
      <Section className="highlight-section">
        <h2>En annan sektion</h2>
        <p>Mer innehåll här...</p>
      </Section>
    </main>
  );
}