import CompaniesList from '@/components/ui/CompanyCard/CompaniesList';
import Section from '@/components/Sections/Sections';
import './companies.css';

export default function CompaniesPage() {
  return (
    <main>
      <Section>
        <h2 className="companiesTitle">Företag</h2>
        <div className="companiesListContainer">
        <CompaniesList />
        </div>
      </Section>
    </main>
  );
}