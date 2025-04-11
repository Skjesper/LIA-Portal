// MultiSelectDropdown.jsx
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './MultiSelectDropdown.module.css';

const MultiSelectDropdown = ({ 
  options, 
  selectedValues = [], 
  onChange,
  placeholder = "Select options",
  maxHeight = "200px"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedValues);
  const dropdownRef = useRef(null);

  // Sync with parent component if selectedValues changes
  useEffect(() => {
    setSelected(selectedValues);
  }, [selectedValues]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (value) => {
    let newSelected;
    if (selected.includes(value)) {
      newSelected = selected.filter(item => item !== value);
    } else {
      newSelected = [...selected, value];
    }
    
    setSelected(newSelected);
    
    
    if (onChange) {
      onChange(newSelected);
    }
  };



  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        type="button"
        className={styles.dropdownButton}
        onClick={toggleDropdown}
      >
        <span className={styles.buttonText}>{"Välj kunskaper i listan"}</span>
        <Image
            src={isOpen ? "/icons/chevron_down.svg" : "/icons/chevron_up.svg"}
            alt="icon for removing"
            width={40}
            height={40}
            className={styles.arrowIcon}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={styles.dropdown}>
          <div 
            className={styles.optionsContainer}
            style={{ maxHeight, overflowY: 'scroll' }}
          >
            {options.map((option) => (
              <label
                key={option.value}
                className={styles.option}
              >
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selected.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                />
                <span className={styles.optionLabel}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;