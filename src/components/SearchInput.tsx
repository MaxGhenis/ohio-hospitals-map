'use client';

import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search hospitals, cities, or counties...',
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-faint pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full py-3.5 pl-12 pr-10
          bg-white border border-ink/10 rounded-xl
          text-[15px] text-ink placeholder:text-ink-faint
          shadow-sm
          transition-all duration-200
          focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            w-6 h-6 rounded-full bg-paper-warm
            flex items-center justify-center
            hover:bg-coral-50 transition-colors
          "
        >
          <X className="w-3 h-3 text-ink-muted" />
        </button>
      )}
    </div>
  );
}
