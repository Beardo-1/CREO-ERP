import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchAll, SearchResult } from '../../services/SearchService';
import { useNavigate } from 'react-router-dom';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await searchAll(query);
      setResults(res);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onResultClick = (route: string) => {
    setQuery('');
    setResults([]);
    navigate(route);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative text-gray-600 focus-within:text-gray-800">
        <input
          type="search"
          className="py-2 text-sm text-gray-900 bg-white rounded-full pl-10 pr-4 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <li className="p-4 text-center text-gray-500">Loading...</li>
          ) : (
            results.map((r, idx) => (
              <li
                key={`${r.type}-${r.id}-${idx}`}
                className="px-4 py-2 hover:bg-orange-100 cursor-pointer flex justify-between"
                onClick={() => onResultClick(r.route)}
              >
                <span>{r.label}</span>
                <span className="text-xs text-gray-500 uppercase">{r.type}</span>
              </li>
            ))
          )}
          {!loading && results.length === 0 && (
            <li className="p-4 text-center text-gray-500">No results</li>
          )}
        </ul>
      )}
    </div>
  );
}; 