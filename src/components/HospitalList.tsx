'use client';

import { useRef, useEffect } from 'react';
import { Hospital } from '@/types/hospital';
import { MapPin, Search } from 'lucide-react';

interface HospitalListProps {
  hospitals: Hospital[];
  totalCount: number;
  selectedHospital: Hospital | null;
  onSelectHospital: (hospital: Hospital) => void;
}

export function HospitalList({
  hospitals,
  totalCount,
  selectedHospital,
  onSelectHospital,
}: HospitalListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll to selected hospital
  useEffect(() => {
    if (selectedHospital) {
      const itemEl = itemRefs.current.get(selectedHospital.id);
      if (itemEl) {
        itemEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedHospital]);

  if (hospitals.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-paper-warm flex items-center justify-center mb-4">
          <Search className="w-6 h-6 text-ink-faint" />
        </div>
        <h3 className="font-display text-lg font-medium text-ink mb-1">
          No hospitals found
        </h3>
        <p className="text-sm text-ink-muted">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-ink/15"
      >
        <div className="py-2">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              ref={(el) => {
                if (el) itemRefs.current.set(hospital.id, el);
              }}
              onClick={() => onSelectHospital(hospital)}
              className={`
                px-7 py-4 cursor-pointer
                border-l-[3px] border-transparent
                transition-all duration-150
                relative
                after:absolute after:bottom-0 after:left-7 after:right-7
                after:h-px after:bg-ink/5
                ${
                  selectedHospital?.id === hospital.id
                    ? 'bg-teal-50 border-l-teal-600'
                    : 'hover:bg-paper-warm'
                }
              `}
            >
              <h4 className="text-[15px] font-medium text-ink mb-1 leading-tight">
                {hospital.name}
              </h4>
              <div className="flex items-center gap-1.5 text-[13px] text-ink-muted">
                <MapPin className="w-3 h-3 opacity-60" />
                <span>{hospital.city}</span>
                <span
                  className={`
                    ml-auto px-2 py-0.5 text-[11px] font-medium
                    rounded uppercase tracking-wide
                    ${
                      selectedHospital?.id === hospital.id
                        ? 'bg-white text-teal-600'
                        : 'bg-paper-warm text-ink-faint'
                    }
                  `}
                >
                  {hospital.county}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-7 py-3 bg-paper-warm border-t border-ink/5">
        <p className="text-xs text-ink-faint font-medium uppercase tracking-wider">
          Showing {hospitals.length} of {totalCount} hospitals
        </p>
      </div>
    </div>
  );
}
