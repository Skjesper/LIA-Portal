'use client';

import { useState, useEffect, useRef } from 'react';
import FilterComponent from '@/components/filter/FilterComponent';
import styles from '@/components/filter/FilterPopup.module.css';

/**
 * A simplified popup component that displays the filtering interface
 */
const FilterPopup = ({
  targetTable = 'student_profiles',
  onFiltersApplied,
  buttonText = 'Filter',
  buttonIcon = null,
  buttonClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFilters, setHasFilters] = useState(false);
  const [savedData, setSavedData] = useState([]);
  const [savedFilters, setSavedFilters] = useState({});
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Toggle popup open/closed
  const togglePopup = () => {
    setIsOpen(prev => !prev);
  };
  
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen && 
        popupRef.current && 
        !popupRef.current.contains(event.target) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Add body overflow hidden when popup is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);
  
  // Handle filters applied and save data/filters
  const handleFiltersApplied = (data, filters) => {
    const hasActiveFilters = filters && Object.keys(filters).length > 0;
    setHasFilters(hasActiveFilters);
    
    // Save data and filters
    setSavedData(data || []);
    setSavedFilters(filters || {});
    
    // Mark initial load as done
    if (!initialLoadDone) {
      setInitialLoadDone(true);
    }
    
    // Pass data up to parent
    if (onFiltersApplied) {
      onFiltersApplied(data, filters);
    }
  };

  return (
    <div className={styles.filterPopupContainer}>
      <button 
        ref={buttonRef}
        className={`${styles.filterButton} ${buttonClassName} ${hasFilters ? styles.hasFilters : ''}`}
        onClick={togglePopup}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        type="button"
      >
        {buttonIcon && <span className={styles.buttonIcon}>{buttonIcon}</span>}
        {buttonText}
        {hasFilters && (
          <span className={styles.filterBadge} />
        )}
      </button>
      
      {isOpen ? (
        <>
          <div className={styles.overlay} aria-hidden="true" />
          <div 
            ref={popupRef}
            className={styles.popupContent}
            role="dialog"
            aria-modal="true"
            aria-label="Filtreringsalternativ"
          >
            <div className={styles.popupHeader}>
              <h2 className={styles.popupTitle}>Filter</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Stäng filtreringsfönster"
                type="button"
              >
                ×
              </button>
            </div>
            
            <div className={styles.popupBody}>
              <FilterComponent 
                targetTable={targetTable} 
                onFiltersApplied={handleFiltersApplied}
                initialData={initialLoadDone ? savedData : undefined}
                initialFilters={initialLoadDone ? savedFilters : undefined}
              />
            </div>
          </div>
        </>
      ) : (
        // När popupen är stängd, hämta endast initial data om det inte redan gjorts
        !initialLoadDone && (
          <div style={{ display: 'none', position: 'absolute', visibility: 'hidden' }}>
            <FilterComponent 
              targetTable={targetTable}
              onFiltersApplied={handleFiltersApplied}
            />
          </div>
        )
      )}
    </div>
  );
};

export default FilterPopup;