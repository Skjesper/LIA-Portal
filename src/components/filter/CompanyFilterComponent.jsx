'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [pendingChange, setPendingChange] = useState(null);
  const supabase = createClientComponentClient();

  // Update selectedOptions when initialFilterValues changes
  useEffect(() => {
    if (initialFilterValues && initialFilterValues.length > 0) {
      setSelectedOptions(initialFilterValues);
    }
  }, [initialFilterValues]);

  // Handle pending filter changes in an effect
  useEffect(() => {
    if (pendingChange !== null && onFilterChange) {
      onFilterChange(column, pendingChange);
      setPendingChange(null);
    }
  }, [pendingChange, onFilterChange, column]);

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
          // For array columns
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
      
      // Schedule the notification for the next render cycle
      setPendingChange(updated);
      
      return updated;
    });
  }, [multiSelect]);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setSelectedOptions([]);
    setPendingChange([]);
  }, []);

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
  const supabase = createClientComponentClient();

  // Use initialData and initialFilters if provided
  useEffect(() => {
    if (initialData && initialFilters) {
      setActiveFilters(initialFilters);
      if (onFiltersApplied) {
        onFiltersApplied(initialData, initialFilters);
      }
      setIsInitialLoad(false);
    }
  }, [initialData, initialFilters, onFiltersApplied]);

  // Fetch initial data on component mount if no initialData provided
  useEffect(() => {
    if (!initialData && isInitialLoad) {
      const fetchInitialData = async () => {
        try {
          const { data, error } = await supabase.from(targetTable).select('*');
          
          if (error) {
            console.error('Error fetching initial data:', error);
            return;
          }
          
          if (onFiltersApplied && data) {
            onFiltersApplied(data, {});
            setIsInitialLoad(false);
          }
        } catch (error) {
          console.error('Error loading initial data:', error);
        }
      };
      
      fetchInitialData();
    }
  }, [supabase, targetTable, onFiltersApplied, isInitialLoad, initialData]);

  // Safely update filters without causing state update errors
  const handleFilterChange = useCallback((column, selectedValues) => {
    setActiveFilters(prev => {
      // Create a new object to avoid reference issues
      const updatedFilters = { ...prev };
      
      if (selectedValues && selectedValues.length > 0) {
        updatedFilters[column] = [...selectedValues];
      } else {
        delete updatedFilters[column];
      }
      
      return updatedFilters;
    });
  }, []);

  // Apply filters when they change, with debounce to avoid too many calls
  useEffect(() => {
    // Skip if it's the initial load or we don't have any active filters yet
    if (isInitialLoad) {
      return;
    }
    
    const applyFilters = async () => {
      try {
        let query = supabase.from(targetTable).select('*');
        
        // Apply each active filter
        Object.entries(activeFilters).forEach(([column, values]) => {
          if (values && values.length > 0) {
            // Special handling for boolean columns
            if (column === 'accepts_digital_designer' || column === 'accepts_webb_developer') {
              // Assuming the values are strings like 'true', 'false'
              const booleanValues = values.map(v => v === 'true');
              query = query.in(column, booleanValues);
            } 
            // Special handling for city which may have strange formatting 
            else if (column === 'city') {
              // Create an OR condition for each city value
              values.forEach((city, index) => {
                // For the first city, use .ilike, for subsequent cities use .or
                if (index === 0) {
                  query = query.ilike(column, `%${city}%`);
                } else {
                  query = query.or(`${column}.ilike.%${city}%`);
                }
              });
            }
            // For regular columns
            else {
              query = query.in(column, values);
            }
          }
        });
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error applying filters:', error);
          // Försök med en enklare fråga om det var ett fel med filtreringen
          const { data: fallbackData, error: fallbackError } = await supabase
            .from(targetTable)
            .select('*');
            
          if (fallbackError) {
            console.error('Failed to fetch fallback data:', fallbackError);
            return;
          }
          
          // Manuell filtrering på klientsidan som backup
          let filteredData = fallbackData;
          
          Object.entries(activeFilters).forEach(([column, values]) => {
            if (values && values.length > 0) {
              if (column === 'accepts_digital_designer' || column === 'accepts_webb_developer') {
                // För boolean-värden
                const wantTrue = values.includes('true');
                filteredData = filteredData.filter(item => 
                  wantTrue ? item[column] === true : true
                );
              } else if (column === 'city') {
                // För städer, gör enkel delsträngsmatchning
                filteredData = filteredData.filter(item => {
                  const cityValue = String(item[column] || '');
                  return values.some(city => 
                    cityValue.toLowerCase().includes(city.toLowerCase())
                  );
                });
              } else if (column === 'location_status') {
                // För location_status
                filteredData = filteredData.filter(item => 
                  values.includes(item[column])
                );
              }
            }
          });
          
          // Använd den manuellt filtrerade datan
          if (onFiltersApplied) {
            onFiltersApplied(filteredData, activeFilters);
          }
          
          return;
        }
        
        if (onFiltersApplied && data) {
          onFiltersApplied(data, activeFilters);
        }
      } catch (error) {
        console.error('Error in applyFilters:', error);
      }
    };
    
    // Create a debounced function to avoid applying filters too frequently
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 100);
    
    // Cleanup
    return () => clearTimeout(timeoutId);
  }, [activeFilters, supabase, targetTable, onFiltersApplied, isInitialLoad]);

  // Get initialFilterValues for each filter section
  const getInitialFilterValues = useCallback((column) => {
    if (activeFilters && activeFilters[column]) {
      return activeFilters[column];
    }
    return [];
  }, [activeFilters]);

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