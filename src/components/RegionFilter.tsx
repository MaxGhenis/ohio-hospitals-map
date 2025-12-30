'use client';

import { RegionFilter as RegionFilterType } from '@/types/hospital';
import { getRegionOptions } from '@/lib/hospitals';

interface RegionFilterProps {
  value: RegionFilterType;
  onChange: (value: RegionFilterType) => void;
}

export function RegionFilter({ value, onChange }: RegionFilterProps) {
  const options = getRegionOptions();

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-3.5 py-1.5 text-[13px] font-medium
            border rounded-full transition-all duration-150
            ${
              value === option.value
                ? 'bg-teal-600 border-teal-600 text-white'
                : 'bg-white border-ink/10 text-ink-muted hover:border-teal-500 hover:text-teal-600'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
