'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Hospital, RegionFilter, FilterState } from '@/types/hospital';
import { loadHospitals, filterHospitals } from '@/lib/hospitals';

export function useHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    region: 'all',
  });
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // Load hospitals on mount
  useEffect(() => {
    loadHospitals()
      .then(setHospitals)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  // Filter hospitals based on current filters
  const filteredHospitals = useMemo(() => {
    return filterHospitals(hospitals, filters.search, filters.region);
  }, [hospitals, filters]);

  // Update search
  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  // Update region filter
  const setRegion = useCallback((region: RegionFilter) => {
    setFilters((prev) => ({ ...prev, region }));
  }, []);

  // Select a hospital
  const selectHospital = useCallback((hospital: Hospital | null) => {
    setSelectedHospital(hospital);
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({ search: '', region: 'all' });
  }, []);

  return {
    hospitals,
    filteredHospitals,
    isLoading,
    error,
    filters,
    selectedHospital,
    setSearch,
    setRegion,
    selectHospital,
    clearFilters,
  };
}
