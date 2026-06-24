import { useState, useEffect, useRef, useMemo } from 'react';
import indianCities from '../../data/cities';

interface AutocompleteInputProps {
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  error?: string;
}

export default function AutocompleteInput({
  label, icon, placeholder, value, onChange, onSelect, error,
}: AutocompleteInputProps) {
  const [query, setQuery] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return [];
    return indianCities
      .filter(c => c.toLowerCase().startsWith(q))
      .slice(0, 8)
      .map(c => ({ name: c, match: c.slice(0, q.length), rest: c.slice(q.length) }));
  }, [query]);

  const handleInput = (val: string) => {
    setQuery(val);
    onChange(val);
    setShowDropdown(val.trim().length > 0);
    setHighlightIndex(-1);
  };

  const handleSelect = (city: string) => {
    setQuery(city);
    onSelect(city);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightIndex].name);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{icon}</span>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          className={`input-field pl-10 ${error ? 'ring-2 ring-red-400' : ''}`}
          autoComplete="off"
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={s.name}
              onClick={() => handleSelect(s.name)}
              onMouseEnter={() => setHighlightIndex(i)}
              className={`px-4 py-2.5 cursor-pointer flex items-center gap-2 text-sm transition-colors ${
                i === highlightIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              } ${i !== suggestions.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <span className="text-gray-400 flex-shrink-0">📍</span>
              <span className="font-medium"><span className="text-blue-600">{s.match}</span>{s.rest}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
