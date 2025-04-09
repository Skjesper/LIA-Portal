import Link from 'next/link';
import Button, { buttonStyles } from '@/components/ui/Button/Button';
import pageStyles from './page.module.css'; // Importera page.module.css
import Section from '@/components/Sections/Sections';
import RSVPCard from '@/components/RSVPCard/RSVPCard';
import Label, { labelStyles } from '@/components/ui/Label/Label';
import RandomCompanies from '@/components/ui/CompanyCard/RandomCompanies';
import CompanyCardSection from '@/components/ui/CompanyCard/CompanySection';
import styles from '@/components/RSVPCard/RSVPCard.module.css';
import YrgoHero from '@/components/Hero/YrgoHero';
import StudentCard from '@/components/ui/StudentCard/StudentCard';


export default function Home() {
  return (
    <main>
      <YrgoHero/>
      <Section>
       
          <RSVPCard />
        
      </Section>
      <Section>
      <StudentCard 
        title="DIGITAL DESIGNERS"
        count="25 ST."
        variant="student"
        
      />

      <StudentCard 
        title="WEBBUTVECKLARE"
        count="25 ST."
        variant="webDev"
        
      />
      </Section>

      <Section>
     
      <CompanyCardSection />
      </Section>
      
    </main>
  );
}