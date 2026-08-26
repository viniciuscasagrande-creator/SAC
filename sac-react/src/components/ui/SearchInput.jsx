import React from 'react';
import { Search } from 'lucide-react';

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Buscar...', 
  className = '',
  ...props 
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder-slate-400 shadow-xs transition-all"
        {...props}
      />
    </div>
  );
}
