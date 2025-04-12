'use client';

import { useState, useEffect, useRef } from 'react';
import FilterComponent from '@/components/filter/FilterComponent';
import styles from '@/components/filter/FilterPopup.module.css';

/**
 * A popup component that displays the filtering interface when a button is clicked
 * @param {Object} props 
 * @param {string} props.targetTable - The name of the main table to filter results from
 * @param {Function} props.onFiltersApplied - Callback with filtered data and filter state
 * @param {string} props.buttonText - Text to display on the toggle button
 * @param {React.ReactNode} props.buttonIcon - Optional icon to show on the button
 * @param {string} props.buttonClassName - Optional custom class for the button
 */
const FilterPopup = ({
  targetTable = 'student_profiles',
  onFiltersApplied,
  buttonText = 'Filter',
  buttonIcon = null,
  buttonClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
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
  
  // Handle filters applied and close popup
  const handleFiltersApplied = (data, filters) => {
    if (onFiltersApplied) {
      onFiltersApplied(data, filters);
    }
    
    // Option: Auto-close after applying filters
    // setIsOpen(false);
  };

  return (
    <div className={styles.filterPopupContainer}>
      <button 
        ref={buttonRef}
        className={`${styles.filterButton} ${buttonClassName}`}
        onClick={togglePopup}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {buttonIcon && <span className={styles.buttonIcon}>{buttonIcon}</span>}
        {buttonText}
      </button>
      
      {isOpen && (
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
              >
                ×
              </button>
            </div>
            
            <div className={styles.popupBody}>
              <FilterComponent 
                targetTable={targetTable} 
                onFiltersApplied={handleFiltersApplied} 
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterPopup;