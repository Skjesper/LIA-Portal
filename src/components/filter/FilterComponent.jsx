'use client';

import { useState, useEffect } from 'react';
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
 */
const FilterSection = ({
  title,
  tableName,
  column,
  options: predefinedOptions,
  onFilterChange,
  multiSelect = true,
  clearText = "Rensa alla"
}) => {
  const [options, setOptions] = useState(predefinedOptions || []);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const supabase = createClientComponentClient();

  // Fetch available options from the database if not provided
  useEffect(() => {
    const fetchOptions = async () => {
      if (predefinedOptions) {
        return;
      }

      try {
        // Get distinct values from the specified column
        const { data, error } = await supabase
          .from(tableName)
          .select(column)
          .not(column, 'is', null);

        if (error) {
          throw error;
        }

        // Extract unique values (this handles array columns too)
        let uniqueValues = [];
        
        if (data) {
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
        console.error(`Error fetching ${column} options:`, error);
      }
    };

    fetchOptions();
  }, [supabase, tableName, column, predefinedOptions]);

  // Handle option selection
  const handleOptionClick = (optionValue) => {
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
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedOptions([]);
    if (onFilterChange) {
      onFilterChange(column, []);
    }
  };

  return (
    <section className={styles.filterSection} aria-labelledby={`filter-${column}`}>
      <header className={styles.filterHeader}>
        {title && <h3 id={`filter-${column}`} className={styles.filterTitle}>{title}</h3>}
        {selectedOptions.length > 0 && (
          <button 
            onClick={clearSelections} 
            className={styles.clearButton}
            aria-label={`${clearText} ${title}`}
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
 */
const FilterComponent = ({
  targetTable = 'student_profiles',
  onFiltersApplied
}) => {
  const [activeFilters, setActiveFilters] = useState({});
  const supabase = createClientComponentClient();

  // Handle filter changes from child components
  const handleFilterChange = (column, selectedValues) => {
    setActiveFilters(prev => {
      const updatedFilters = {
        ...prev,
        [column]: selectedValues
      };
      
      // If the selected values array is empty, remove the filter
      if (selectedValues.length === 0) {
        delete updatedFilters[column];
      }
      
      return updatedFilters;
    });
  };

  // Apply filters when they change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        let query = supabase.from(targetTable).select('*');
        
        // Apply each active filter
        Object.entries(activeFilters).forEach(([column, values]) => {
          if (values.length > 0) {
            // For array columns like knowledge/skills
            if (column === 'knowledge') {
              // Filter records where the array column contains ANY of the selected values
              query = query.contains(column, values);
            } else {
              // For regular columns like education_program
              query = query.in(column, values);
            }
          }
        });
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Send filtered data back to parent
        if (onFiltersApplied) {
          onFiltersApplied(data, activeFilters);
        }
      } catch (error) {
        console.error('Error applying filters:', error);
      }
    };
    
    applyFilters();
  }, [activeFilters, supabase, targetTable, onFiltersApplied]);

  return (
    <aside className={styles.filterContainer} aria-label="Filtreringsverktyg">
      <form>
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
          />
        </section>
        
        <section aria-labelledby="kompetenser-heading">
          <h2 id="kompetenser-heading" className={styles.title}>KOMPETENSER</h2>
          <FilterSection
            title=""
            tableName={targetTable}
            column="knowledge"
            options={[
              { value: "FIGMA", label: "FIGMA" },
              { value: "WEBFLOW", label: "WEBFLOW" },
              { value: "ILLUSTRATOR", label: "ILLUSTRATOR" },
              { value: "PHOTOSHOP", label: "PHOTOSHOP" },
              { value: "UNREAL ENGINE", label: "UNREAL ENGINE" },
              { value: "FRAMER", label: "FRAMER" },
              { value: "AFTER EFFECTS", label: "AFTER EFFECTS" },
              { value: "BLENDER", label: "BLENDER" },
              { value: "HTML", label: "HTML" },
              { value: "CSS", label: "CSS" },
              { value: "JAVASCRIPT", label: "JAVASCRIPT" },
              { value: "SQL", label: "SQL" }
            ]}
            onFilterChange={handleFilterChange}
            multiSelect={true}
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
          />
        </section>
      </form>
    </aside>
  );
};

export default FilterComponent;