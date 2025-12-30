export interface Hospital {
  id: string;
  name: string;
  city: string;
  county: string;
  coordinates: [number, number]; // [lng, lat]
}

export interface HospitalRaw {
  name: string;
  city: string;
  county: string;
}

export type RegionFilter = 'all' | 'cleveland' | 'columbus' | 'cincinnati' | 'dayton' | 'toledo';

export interface FilterState {
  search: string;
  region: RegionFilter;
}
