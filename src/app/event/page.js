// src/app/companies/page.js
import CompanyProfileView from '@/components/Profile/Company/Company';
import StudentProfileView from '@/components/Profile/Student/Student';
import RSVPConfirmation from '@/components/RSVPCard/RSVPConfirmation';
import RSVPpage from '@/components/RSVPCard/RSVPpage';
import Section from '@/components/Sections/Sections';
import Link from 'next/link';

export default function Companies() {
  return (
    // <Section>
    //   <RSVPpage></RSVPpage>
    // </Section>

    <RSVPConfirmation></RSVPConfirmation>
  
  );
}