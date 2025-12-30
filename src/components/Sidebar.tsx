'use client';

import { useState } from 'react';
import { Hospital, RegionFilter as RegionFilterType } from '@/types/hospital';
import { SearchInput } from './SearchInput';
import { RegionFilter } from './RegionFilter';
import { HospitalList } from './HospitalList';
import { Cross, Menu, X } from 'lucide-react';

interface SidebarProps {
  hospitals: Hospital[];
  totalCount: number;
  search: string;
  region: RegionFilterType;
  selectedHospital: Hospital | null;
  onSearchChange: (value: string) => void;
  onRegionChange: (value: RegionFilterType) => void;
  onSelectHospital: (hospital: Hospital) => void;
}

export function Sidebar({
  hospitals,
  totalCount,
  search,
  region,
  selectedHospital,
  onSearchChange,
  onRegionChange,
  onSelectHospital,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectHospital = (hospital: Hospital) => {
    onSelectHospital(hospital);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          flex items-center gap-2 px-6 py-3.5
          bg-teal-600 text-white rounded-full
          font-semibold text-sm shadow-lg
          hover:bg-teal-500 transition-colors
        "
      >
        <Menu className="w-[18px] h-[18px]" />
        Hospital List
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-full max-w-[420px] h-full
          bg-paper flex flex-col
          border-r border-ink/5
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="
            lg:hidden absolute top-4 right-4 z-10
            w-8 h-8 rounded-full bg-paper-warm
            flex items-center justify-center
          "
        >
          <X className="w-4 h-4 text-ink-muted" />
        </button>

        {/* Header */}
        <header className="px-7 pt-8 pb-6 bg-gradient-to-b from-paper to-paper-warm border-b border-ink/5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <Cross className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px] font-medium text-ink">
              Ohio Hospitals Atlas
            </span>
          </div>
          <h1 className="font-display text-[32px] font-light leading-tight tracking-tight text-ink mb-1.5">
            Find <em className="font-normal italic text-teal-600">Healthcare</em> Near You
          </h1>
          <p className="text-sm text-ink-muted">
            <span className="font-semibold text-teal-600">{totalCount}</span> hospitals across Ohio
          </p>
        </header>

        {/* Search & Filters */}
        <div className="px-7 py-5 border-b border-ink/5 space-y-4">
          <SearchInput value={search} onChange={onSearchChange} />
          <RegionFilter value={region} onChange={onRegionChange} />
        </div>

        {/* Hospital List */}
        <HospitalList
          hospitals={hospitals}
          totalCount={totalCount}
          selectedHospital={selectedHospital}
          onSelectHospital={handleSelectHospital}
        />
      </aside>
    </>
  );
}
