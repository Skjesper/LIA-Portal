import mockCompanies from '@/data/mockCompanies';
import CompanyCard from '@/components/ui/CompanyCard/CompanyCard';

export default function CompaniesList() {
  return (
    <div>
      {mockCompanies.map((company) => (
        <CompanyCard 
          key={company.id} 
          title={company.name} 
          text={company.description} 
        />
      ))}
    </div>
  );
}
