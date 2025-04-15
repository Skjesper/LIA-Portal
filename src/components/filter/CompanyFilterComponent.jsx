'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from '@/components/filter/FilterComponent.module.css';

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
      
      // Notify parent component about changes after state updates
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

/**
 * Company filter component for filtering company profiles data
 * @param {Object} props
 * @param {Function} props.onFiltersApplied - Callback with filtered data and filter state
 * @param {Array} props.initialData - Initial data to use instead of fetching
 * @param {Object} props.initialFilters - Initial filters to apply
 */
const CompanyFilterComponent = ({
  onFiltersApplied,
  initialData,
  initialFilters
}) => {
  const targetTable = 'company_profiles';
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
          
          if (onFiltersApplied) {
            onFiltersApplied(data || [], {});
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
        if (column === 'accepts_digital_designer' || column === 'accepts_webb_developer') {
          // Endast filtrera om "true" är vald
          if (values.includes('true')) {
            filteredData = filteredData.filter(company => company[column] === true);
          }
        } 
        else if (column === 'city') {
          filteredData = filteredData.filter(company => {
            if (!company[column]) return false;
            
            // Hantera både string och potentiellt JSON-string format
            let cityValue = company[column];
            try {
              // Om det är en JSON-string, gör om den till string
              if (typeof cityValue === 'string' && (cityValue.startsWith('{') || cityValue.startsWith('['))) {
                cityValue = JSON.parse(cityValue);
                // Om det blev en array/objekt, extrahera värden
                if (Array.isArray(cityValue)) {
                  cityValue = cityValue.join(' ');
                } else if (typeof cityValue === 'object') {
                  cityValue = Object.values(cityValue).join(' ');
                }
              }
            } catch (e) {
              // Ignorera parsningsfel och använd värdet som det är
            }
            
            // Konvertera till string och gör case-insensitive jämförelse
            const cityStr = String(cityValue).toLowerCase();
            return values.some(city => cityStr.includes(city.toLowerCase()));
          });
        }
        else if (column === 'location_status') {
          filteredData = filteredData.filter(company => {
            if (!company[column]) return false;
            return values.includes(company[column]);
          });
        }
        else {
          filteredData = filteredData.filter(company => 
            values.includes(company[column])
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
    return <aside className={styles.filterContainer} aria-label="Filtreringsverktyg för företag"></aside>;
  }

  return (
    <aside className={styles.filterContainer} aria-label="Filtreringsverktyg för företag">
      <form onSubmit={(e) => e.preventDefault()}>
        <section aria-labelledby="city-heading">
          <h2 id="city-heading" className={styles.title}>STAD</h2>
          <FilterSection
            title=""
            tableName={targetTable}
            column="city"
            options={[
              { value: "Stockholm", label: "STOCKHOLM" },
              { value: "Göteborg", label: "GÖTEBORG" }
            ]}
            onFilterChange={handleFilterChange}
            multiSelect={true}
            initialFilterValues={getInitialFilterValues('city')}
          />
        </section>
        
        <section aria-labelledby="location-status-heading">
          <h2 id="location-status-heading" className={styles.title}>DISTANS</h2>
          <FilterSection
            title=""
            tableName={targetTable}
            column="location_status"
            options={[
              { value: "On-site", label: "ON-SITE" },
              { value: "Hybrid", label: "HYBRID" },
              { value: "Remote", label: "REMOTE" }
            ]}
            onFilterChange={handleFilterChange}
            multiSelect={true}
            initialFilterValues={getInitialFilterValues('location_status')}
          />
        </section>
        
        <section aria-labelledby="accepts-heading">
          <h2 id="accepts-heading" className={styles.title}>ACCEPTERAR</h2>
          <FilterSection
            tableName={targetTable}
            column="accepts_digital_designer"
            options={[
              { value: "true", label: "Digital Designer" }
            ]}
            onFilterChange={handleFilterChange}
            multiSelect={false}
            initialFilterValues={getInitialFilterValues('accepts_digital_designer')}
          />
          
          <FilterSection
            tableName={targetTable}
            column="accepts_webb_developer"
            options={[
              { value: "true", label: "Webbutvecklare" }
            ]}
            onFilterChange={handleFilterChange}
            multiSelect={false}
            initialFilterValues={getInitialFilterValues('accepts_webb_developer')}
          />
        </section>
      </form>
    </aside>
  );
};

export default CompanyFilterComponent;