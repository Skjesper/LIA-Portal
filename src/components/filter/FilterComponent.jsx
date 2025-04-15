'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from '@/components/filter/FilterComponent.module.css';
import dynamic from 'next/dynamic';

/**
 * A reusable filter component for filtering data
 * @param {Object} props
 * @param {string} props.title - Title for the filter section
 * @param {string} props.tableName - Supabase table name to query
 * @param {string} props.column - Column name in the table to filter by
 * @param {Object} props.options - Predefined filter options (optional)
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {boolean} props.multiSelect - Allow multiple selections (default: true)
 * @param {string} props.clearText - Text for clearing filters
 * @param {Object} props.initialFilterValues - Initial selected values for this filter
 */
const FilterSection = ({
  title,
  tableName,
  column,
  options: predefinedOptions,
  onFilterChange,
  multiSelect = true,
  clearText = "Rensa alla",
  initialFilterValues = []
}) => {
  const [options, setOptions] = useState(predefinedOptions || []);
  const [selectedOptions, setSelectedOptions] = useState(initialFilterValues || []);
  const supabase = createClientComponentClient();

  // Update selectedOptions when initialFilterValues changes
  useEffect(() => {
    if (initialFilterValues && initialFilterValues.length > 0) {
      setSelectedOptions(initialFilterValues);
    }
  }, [initialFilterValues]);

  // Fetch available options from the database if not provided
  useEffect(() => {
    if (predefinedOptions) {
      return;
    }

    const fetchOptions = async () => {
      try {
        // Get distinct values from the specified column
        const { data, error } = await supabase
          .from(tableName)
          .select(column)
          .not(column, 'is', null);

        if (error) {
          console.error(`Error fetching ${column} options:`, error);
          return;
        }

        // Extract unique values (this handles array columns too)
        let uniqueValues = [];
        
        if (data && data.length > 0) {
          // For regular columns
          if (typeof data[0]?.[column] === 'string') {
            uniqueValues = [...new Set(data.map(item => item[column]))];
          } 
          // For array columns (like skills/knowledge)
          else if (Array.isArray(data[0]?.[column])) {
            const allValues = data.flatMap(item => item[column] || []);
            uniqueValues = [...new Set(allValues)];
          }
        }

        setOptions(uniqueValues.filter(Boolean).map(value => ({
          value,
          label: value
        })));
      } catch (error) {
        console.error(`Error in fetchOptions for ${column}:`, error);
      }
    };

    fetchOptions();
  }, [supabase, tableName, column, predefinedOptions]);

  // Handle option selection
  const handleOptionClick = useCallback((optionValue) => {
    setSelectedOptions(prev => {
      let updated;
      
      if (multiSelect) {
        // Toggle selection
        if (prev.includes(optionValue)) {
          updated = prev.filter(value => value !== optionValue);
        } else {
          updated = [...prev, optionValue];
        }
      } else {
        // Single selection mode
        updated = prev.includes(optionValue) ? [] : [optionValue];
      }
      
      // Notify parent component after state updates
      setTimeout(() => {
        if (onFilterChange) {
          onFilterChange(column, updated);
        }
      }, 0);
      
      return updated;
    });
  }, [column, multiSelect, onFilterChange]);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setSelectedOptions([]);
    // Notify parent after state is cleared
    setTimeout(() => {
      if (onFilterChange) {
        onFilterChange(column, []);
      }
    }, 0);
  }, [column, onFilterChange]);

  return (
    <section className={styles.filterSection} aria-labelledby={`filter-${column}`}>
      <header className={styles.filterHeader}>
        {title && <h3 id={`filter-${column}`} className={styles.filterTitle}>{title}</h3>}
        {selectedOptions.length > 0 && (
          <button 
            onClick={clearSelections} 
            className={styles.clearButton}
            aria-label={`${clearText} ${title}`}
            type="button"
          >
            {clearText}
          </button>
        )}
      </header>
      
      <fieldset className={styles.optionsFieldset}>
        <legend className={styles.visuallyHidden}>{title || column}</legend>
        <div className={styles.optionsContainer} role="group">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`${styles.optionButton} ${
                selectedOptions.includes(option.value) ? styles.selected : ''
              }`}
              aria-pressed={selectedOptions.includes(option.value)}
              type="button"
            >
              {option.label}
              {selectedOptions.includes(option.value) && (
                <span className={styles.closeIcon} aria-hidden="true">×</span>
              )}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
};

// Komponenten utan SSR för att undvika hydration-problem
const FilterComponentWithoutSSR = ({
  targetTable = 'student_profiles',
  onFiltersApplied,
  initialData,
  initialFilters
}) => {
  const [activeFilters, setActiveFilters] = useState(initialFilters || {});
  const [isInitialLoad, setIsInitialLoad] = useState(!initialData);
  const [isClient, setIsClient] = useState(false);
  const [allData, setAllData] = useState([]);
  const filteringRef = useRef(false);
  const initialPropsAppliedRef = useRef(false);
  const supabase = createClientComponentClient();

  // Markera att vi är på klientsidan efter första renderingen
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle initial data and filters without causing infinite loops
  useEffect(() => {
    // Only run this once
    if (initialPropsAppliedRef.current) return;
    
    if (initialData) {
      setAllData(initialData);
      
      if (initialFilters) {
        setActiveFilters(initialFilters);
      }
      
      if (onFiltersApplied) {
        // Apply initial filters
        if (initialFilters && Object.keys(initialFilters).length > 0) {
          const filteredData = filterData(initialData, initialFilters);
          onFiltersApplied(filteredData, initialFilters);
        } else {
          onFiltersApplied(initialData, {});
        }
      }
      
      setIsInitialLoad(false);
      initialPropsAppliedRef.current = true;
    }
  }, [initialData, initialFilters, onFiltersApplied]);

  // Fetch initial data on component mount if no initialData provided
  useEffect(() => {
    if (initialPropsAppliedRef.current) return;
    if (!initialData && isInitialLoad) {
      const fetchInitialData = async () => {
        try {
          const { data, error } = await supabase.from(targetTable).select('*');
          
          if (error) {
            console.error('Error fetching initial data:', error);
            return;
          }
          
          setAllData(data || []);
          
          if (onFiltersApplied && data) {
            onFiltersApplied(data, {});
            setIsInitialLoad(false);
          }
          
          initialPropsAppliedRef.current = true;
        } catch (error) {
          console.error('Error loading initial data:', error);
        }
      };
      
      fetchInitialData();
    }
  }, [supabase, targetTable, onFiltersApplied, isInitialLoad, initialData]);

  // Helper function to filter data - no state updates here
  const filterData = (data, filters) => {
    // If no filters or data, return data as is
    if (!filters || Object.keys(filters).length === 0 || !data || data.length === 0) {
      return data || [];
    }
    
    let filteredData = [...data];
    
    // Apply each filter
    Object.entries(filters).forEach(([column, values]) => {
      if (values && values.length > 0) {
        // Specialhantering för knowledge (array-kolumn)
        if (column === 'knowledge') {
          // Mappa UI-värden till databasvärden
          const correctCaseValues = values.map(v => {
            if (typeof v === 'string') {
              switch(v.toUpperCase()) {
                case 'FIGMA': return 'Figma';
                case 'ILLUSTRATOR': return 'Illustrator';
                case 'PHOTOSHOP': return 'Photoshop';
                case 'UNREAL ENGINE': return 'Unreal engine';
                case 'WEBFLOW': return 'Webflow';
                case 'FRAMER': return 'Framer';
                case 'AFTER EFFECTS': return 'After Effects';
                case 'BLENDER': return 'Blender';
                case 'HTML': return 'HTML';
                case 'CSS': return 'CSS';
                case 'JAVASCRIPT': return 'JavaScript';
                case 'SQL': return 'SQL';
                default: return v;
              }
            }
            return String(v);
          });
          
          // Kontrollera knowledge array-innehåll
          filteredData = filteredData.filter(student => {
            // Om studenten inte har knowledge-property eller det inte är en array
            if (!student.knowledge || !Array.isArray(student.knowledge)) {
              return false;
            }
            
            // Kontrollera om studenten har någon av de valda kompetenserna
            return correctCaseValues.some(value => 
              student.knowledge.includes(value)
            );
          });
        } 
        // Specialhantering för education_program (single-select)
        else if (column === 'education_program') {
          filteredData = filteredData.filter(student => 
            values.includes(student[column])
          );
        }
        // Hantering för övriga filter (multi-select)
        else {
          filteredData = filteredData.filter(student => 
            values.includes(student[column])
          );
        }
      }
    });
    
    return filteredData;
  };

  // Safely update filters without causing state update errors
  const handleFilterChange = useCallback((column, selectedValues) => {
    if (filteringRef.current) return; // Prevent overlapping updates
    filteringRef.current = true;
    
    setActiveFilters(prev => {
      const updatedFilters = { ...prev };
      
      if (selectedValues && selectedValues.length > 0) {
        updatedFilters[column] = [...selectedValues];
      } else {
        delete updatedFilters[column];
      }
      
      // Apply filters separately to avoid dependency cycles
      setTimeout(() => {
        const filteredData = filterData(allData, updatedFilters);
        if (onFiltersApplied) {
          onFiltersApplied(filteredData, updatedFilters);
        }
        filteringRef.current = false;
      }, 10);
      
      return updatedFilters;
    });
  }, [allData, onFiltersApplied]);

  // Get initialFilterValues for each filter section
  const getInitialFilterValues = useCallback((column) => {
    if (activeFilters && activeFilters[column]) {
      return activeFilters[column];
    }
    return [];
  }, [activeFilters]);

  // If not on client yet, show empty container
  if (!isClient) {
    return <aside className={styles.filterContainer} aria-label="Filtreringsverktyg"></aside>;
  }

  return (
    <aside className={styles.filterContainer} aria-label="Filtreringsverktyg">
      <form onSubmit={(e) => e.preventDefault()}>
        <section aria-labelledby="inriktning-heading">
          <h2 id="inriktning-heading" className={styles.title}>INRIKTNING</h2>
          <FilterSection
            title=""
            tableName={targetTable}
            column="education_program"
            options={[
              { value: "Webbutveckling", label: "WEBBUTVECKLING" },
              { value: "Digital Design", label: "DESIGN" }
            ]}
            onFilterChange={handleFilterChange}
            multiSelect={false}
            initialFilterValues={getInitialFilterValues('education_program')}
          />
        </section>
        
        <section aria-labelledby="kompetenser-heading">
          <h2 id="kompetenser-heading" className={styles.title}>KOMPETENSER</h2>
          <FilterSection
            title=""
            tableName={targetTable}
            column="knowledge"
            options={[
              { value: "Figma", label: "FIGMA" },
              { value: "Webflow", label: "WEBFLOW" },
              { value: "Illustrator", label: "ILLUSTRATOR" },
              { value: "Photoshop", label: "PHOTOSHOP" },
              { value: "Unreal engine", label: "UNREAL ENGINE" },
              { value: "Framer", label: "FRAMER" },
              { value: "After Effects", label: "AFTER EFFECTS" },
              { value: "Blender", label: "BLENDER" },
              { value: "HTML", label: "HTML" },
              { value: "CSS", label: "CSS" },
              { value: "JavaScript", label: "JAVASCRIPT" },
              { value: "SQL", label: "SQL" }
            ]}
            onFilterChange={handleFilterChange}
            multiSelect={true}
            initialFilterValues={getInitialFilterValues('knowledge')}
          />
        </section>
        
        {/* <section aria-labelledby="lia-period-heading">
          <h2 id="lia-period-heading" className={styles.title}>LIA PERIOD</h2>
          <FilterSection
            title=""
            tableName={targetTable}
            column="lia_period"
            options={[
              { value: "HÖST 2025", label: "HÖST 2025" },
              { value: "VÅR 2026", label: "VÅR 2026" }
            ]}
            onFilterChange={handleFilterChange}
            multiSelect={true}
            initialFilterValues={getInitialFilterValues('lia_period')}
          />
        </section> */}
        
        
        
       
      </form>
    </aside>
  );
};

// Exportera en dynamisk version utan SSR
const FilterComponent = dynamic(() => Promise.resolve(FilterComponentWithoutSSR), {
  ssr: false
});

export default FilterComponent;