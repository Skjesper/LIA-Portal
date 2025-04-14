'use client';

import { useState } from 'react';
import Section from '@/components/Sections/Sections';
import '@/components/styles/companies.css';
import styles from './StudentsPage.module.css';
import FilterPopup from '@/components/filter/FilterPopup';
import StudentProfileCard from '@/components/StudentProfileCard/StudentProfileCard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import useBreakpoint from '@/app/hooks/useBreakpoint';

export default function StudentsPage() {
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  const isMobile = useBreakpoint(768);

  // Handle filters being applied from the popup
  const handleFiltersApplied = (data, filters) => {
    setFilteredStudents(data);
    setActiveFilters(filters);
  };

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
      // Query the student_profiles table with search term
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .ilike('first_name', `%${searchQuery}%`)
        .or(`last_name.ilike.%${searchQuery}%`);
      
      if (error) {
        throw error;
      }
      
      setFilteredStudents(data || []);
      // Clear any active filters since we're now searching
      setActiveFilters({});
    } catch (error) {
      console.error('Error searching students:', error);
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
        <h2 className="companiesTitle">Studenter</h2>
        
        {/* Search and filter controls */}
        <div className={styles.searchFilterContainer}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Studentnamn"
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
              aria-label="Sök student efter namn"
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
            targetTable="student_profiles" 
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
                    {column === 'education_program' ? 'Inriktning' : 
                     column === 'knowledge' ? 'Kompetens' :
                     column === 'lia_period' ? 'LIA Period' :
                     column === 'location' ? 'Ort' :
                     column === 'remote_options' ? 'Distans' : column}: {value}
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
              : `${filteredStudents.length} studenter hittades`}
          </p>
        </div>
        
        {/* Students list */}
        <div className={styles.studentsContainer}>
          {filteredStudents.length === 0 ? (
            searchQuery || Object.keys(activeFilters).length > 0 ? (
              <p className={styles.noResults}>Inga studenter hittades med dessa filter eller sökterm.</p>
            ) : (
              <p className={styles.noResults}>Använd sökfältet eller filtret för att hitta studenter.</p>
            )
          ) : (
            <div className={styles.studentsGrid}>
              {filteredStudents.map(student => (
                <StudentProfileCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}