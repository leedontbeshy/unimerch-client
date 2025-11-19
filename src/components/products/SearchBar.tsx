import React, { useState, useEffect, useCallback } from 'react';
import '../../css/product.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Tìm kiếm sản phẩm...',
  initialValue = '',
  debounceMs = 500
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery.trim());
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, debounceMs, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger immediate search on submit
    onSearch(searchQuery.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
      />
      <button type="submit" className="search-bar__button">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
