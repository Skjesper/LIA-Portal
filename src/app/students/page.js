import CompaniesList from '@/components/ui/CompanyCard/CompaniesList';
import Section from '@/components/Sections/Sections';
import '@/components/styles/companies.css'

export default function StudentsPage() {
  return (
    <main>
    <Section style={{ background: 'var(--Background-Light)' }}>
        <h2 className="companiesTitle">Studenter</h2>
        <div className="companiesListContainer">
        <CompaniesList />
        </div>
      </Section>
    </main>
  );
}