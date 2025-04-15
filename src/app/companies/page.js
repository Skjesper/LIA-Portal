'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/Sections/Sections';
import '@/components/styles/companies.css';
import styles from './CompaniesPage.module.css';
import CompanyCard from '@/components/ui/CompanyCard/CompanyCard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import useBreakpoint from '@/app/hooks/useBreakpoint';
import FilterPopup from '@/components/filter/FilterPopup';

export default function CompaniesPage() {
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  const isMobile = useBreakpoint(768);

  // Handle filters being applied from the popup
  const handleFiltersApplied = (data, filters) => {
    setFilteredCompanies(data);
    setActiveFilters(filters);
  };

  // Load all companies initially
  useEffect(() => {
    const fetchAllCompanies = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('company_profiles')
          .select('id, name, bio, accepts_digital_designer, accepts_webb_developer');
        
        if (error) throw error;
        
        setFilteredCompanies(data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCompanies();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '') {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Query the company_profiles table with search term
      const { data, error } = await supabase
        .from('company_profiles')
        .select('id, name, bio, accepts_digital_designer, accepts_webb_developer')
        .ilike('name', `%${searchQuery}%`);
      
      if (error) {
        throw error;
      }
      
      setFilteredCompanies(data || []);
      // Clear any active filters since we're now searching
      setActiveFilters({});
    } catch (error) {
      console.error('Error searching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter icon component
  const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  );

  return (
    <main>
      <Section style={{ background: 'var(--Background-Light)' }}>
        <h2 className="companiesTitle">Företag</h2>
        
        {/* Search and filter controls */}
        <div className={styles.searchFilterContainer}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Företagsnamn"
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
              aria-label="Sök företag efter namn"
            />
            <button 
              type="submit" 
              className={styles.searchButton}
              disabled={isLoading}
            >
              SÖK
            </button>
          </form>
          
          <FilterPopup 
            targetTable="company_profiles" 
            onFiltersApplied={handleFiltersApplied} 
            buttonText={isMobile ? "" : "FILTER"} 
            buttonIcon={<FilterIcon />}
            buttonClassName={styles.filterButton}
          />
        </div>
        
                  {/* Display active filters */}
          {Object.keys(activeFilters).length > 0 && (
            <div className={styles.activeFilters}>
              <div className={styles.filterTags}>
                {Object.entries(activeFilters).map(([column, values]) => (
                  values.map(value => (
                    <span key={`${column}-${value}`} className={styles.filterTag}>
                      {column === 'city' ? 'Stad' : 
                      column === 'location_status' ? 'Distans' :
                      column === 'accepts_digital_designer' ? 'Digital Designer' :
                      column === 'accepts_webb_developer' ? 'Webbutvecklare' : column} {value}
                    </span>
                  ))
                ))}
              </div>
            </div>
          )}

        
        {/* Display results count */}
        <div className={styles.resultsContainer}>
          <p className={styles.resultsCount}>
            {isLoading 
              ? 'Söker...' 
              : `${filteredCompanies.length} företag hittades`}
          </p>
        </div>
        
        {/* Companies list */}
        <div className="companiesListContainer">
          {filteredCompanies.length === 0 ? (
            searchQuery || Object.keys(activeFilters).length > 0 ? (
              <p className={styles.noResults}>Inga företag hittades med dessa filter eller sökterm.</p>
            ) : (
              <p className={styles.noResults}>Använd sökfältet eller filtret för att hitta företag.</p>
            )
          ) : (
            <div className={styles.companiesGrid}>
              {filteredCompanies.map((company) => (
                <CompanyCard 
                  key={company.id} 
                  title={company.name} 
                  text={company.bio}
                  acceptsDigitalDesigner={company.accepts_digital_designer}
                  acceptsWebDeveloper={company.accepts_webb_developer}
                />
              ))}
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}