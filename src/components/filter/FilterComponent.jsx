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
      
      // Notify parent component about changes
      if (onFilterChange) {
        onFilterChange(column, updated);
      }
      
      return updated;
    });
  }, [column, multiSelect, onFilterChange]);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setSelectedOptions([]);
    if (onFilterChange) {
      onFilterChange(column, []);
    }
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
 * Main filter component that combines multiple filter sections
 * @param {Object} props
 * @param {string} props.targetTable - The name of the main table to filter results from
 * @param {Function} props.onFiltersApplied - Callback with filtered data and filter state
 * @param {Array} props.initialData - Initial data to use instead of fetching
 * @param {Object} props.initialFilters - Initial filters to apply
 */
const FilterComponent = ({
  targetTable = 'student_profiles',
  onFiltersApplied,
  initialData,
  initialFilters
}) => {
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
            // För array-kolumnen knowledge
            if (column === 'knowledge') {
              // För knowledge, använd case insensitive jämförelse eftersom databasen har "Figma" men i UI visar vi "FIGMA"
              // Vi använder den exakta textfallet som finns i databasen
              // Anpassa värdena baserat på databasens format
              const correctCaseValues = values.map(v => {
                // Konvertera UI-värde till databas-format
                if (typeof v === 'string') {
                  // Konvertera till korrekt format baserat på vad som finns i databasen
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
                    default: return v; // Använd originalvärdet om ingen mapping finns
                  }
                }
                return String(v);
              });
              
              query = query.overlaps(column, correctCaseValues);
            } else {
              // För vanliga kolumner som education_program
              query = query.in(column, values);
            }
          }
        });
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error applying filters:', error, JSON.stringify(error));
          // Alternativt logga hela query-objektet för att se vad som skickas till Supabase
          console.error('Query state:', activeFilters);
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
        
        <section aria-labelledby="lia-period-heading">
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
        </section>
        
        <section aria-labelledby="ort-heading">
          <h2 id="ort-heading" className={styles.title}>ORT</h2>
          <FilterSection
            title=""
            tableName={targetTable}
            column="location"
            options={[
              { value: "GÖTEBORG", label: "GÖTEBORG" },
              { value: "STOCKHOLM", label: "STOCKHOLM" },
              { value: "ANNAT", label: "ANNAT" }
            ]}
            onFilterChange={handleFilterChange}
            multiSelect={true}
            initialFilterValues={getInitialFilterValues('location')}
          />
        </section>
        
        <section aria-labelledby="distans-heading">
          <h2 id="distans-heading" className={styles.title}>DISTANS</h2>
          <FilterSection
            title=""
            tableName={targetTable}
            column="remote_options"
            options={[
              { value: "ON SITE", label: "ON SITE" },
              { value: "HYBRID", label: "HYBRID" },
              { value: "REMOTE", label: "REMOTE" }
            ]}
            onFilterChange={handleFilterChange}
            multiSelect={true}
            initialFilterValues={getInitialFilterValues('remote_options')}
          />
        </section>
      </form>
    </aside>
  );
};

export default FilterComponent;