'use client';

import { Sidebar, HospitalMap, LoadingSpinner } from '@/components';
import { useHospitals } from '@/hooks/useHospitals';

export default function Home() {
  const {
    hospitals,
    filteredHospitals,
    isLoading,
    filters,
    selectedHospital,
    setSearch,
    setRegion,
    selectHospital,
  } = useHospitals();

  return (
    <div className="flex h-screen bg-paper overflow-hidden relative">
      {isLoading && <LoadingSpinner />}

      <Sidebar
        hospitals={filteredHospitals}
        totalCount={hospitals.length}
        search={filters.search}
        region={filters.region}
        selectedHospital={selectedHospital}
        onSearchChange={setSearch}
        onRegionChange={setRegion}
        onSelectHospital={selectHospital}
      />

      <main className="flex-1 relative bg-[#e8e0d5]">
        <HospitalMap
          hospitals={filteredHospitals}
          selectedHospital={selectedHospital}
          onSelectHospital={selectHospital}
        />

        {/* Attribution */}
        <div className="absolute bottom-2 right-2 text-[11px] text-ink-faint bg-white/90 px-2 py-1 rounded">
          Data:{' '}
          <a
            href="https://en.wikipedia.org/wiki/List_of_hospitals_in_Ohio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            Wikipedia
          </a>
        </div>
      </main>
    </div>
  );
}
