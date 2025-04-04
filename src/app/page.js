import Link from 'next/link';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import pageStyles from './page.module.css'; // Importera page.module.css
import Section from '@/components/Sections/Sections';
import RSVPCard from '@/components/RSVPCard/RSVPCard';
import Label, { labelStyles } from '@/components/ui/Label/Label';
import RandomCompanies from '@/components/ui/CompanyCard/RandomCompanies';
import CompanyCardSection from '@/components/ui/CompanyCard/CompanySection';
import styles from '@/components/RSVPCard/RSVPCard.module.css';


export default function Home() {
  return (
    <main>
      <Section>
        <div className={pageStyles.applyWrapper}>
          <h2>01/Anmälan</h2>
          <p className={pageStyles.sectionText}>
            Lorem ipsum dolor sit amet si consectetur. Sagittis faucibus vita in faucibus nunc. 
            Semper nun sodales malesuada. Non habitant.
          </p>
          <RSVPCard />
        </div>
      </Section>

      <Section>
     
      <CompanyCardSection />
      </Section>
      
    </main>
  );
}