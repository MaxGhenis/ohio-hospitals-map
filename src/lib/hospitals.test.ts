import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { filterHospitals, getRegionLabel, getRegionOptions } from './hospitals';
import { getCoordinates } from './geocode';
import type { Hospital, HospitalRaw } from '@/types/hospital';

let rawHospitals: HospitalRaw[];
let hospitals: Hospital[];

beforeAll(() => {
  const data = readFileSync(join(process.cwd(), 'public/data/hospitals.json'), 'utf-8');
  rawHospitals = JSON.parse(data);
  hospitals = rawHospitals.map((h, i) => ({
    id: `hospital-${i}`,
    name: h.name,
    city: h.city,
    county: h.county,
    coordinates: getCoordinates(h.city, h.county, i),
  }));
});

describe('Hospital Data', () => {
  it('should have at least 200 hospitals', () => {
    expect(hospitals.length).toBeGreaterThanOrEqual(200);
  });

  it('should include OhioHealth Pickerington Methodist Hospital', () => {
    const pickerington = hospitals.find(h =>
      h.name.toLowerCase().includes('pickerington')
    );
    expect(pickerington).toBeDefined();
    expect(pickerington!.name).toBe('OhioHealth Pickerington Methodist Hospital');
    expect(pickerington!.city).toBe('Pickerington');
    expect(pickerington!.county).toBe('Fairfield');
  });

  it('should include Cleveland Clinic', () => {
    const clevelandClinic = hospitals.find(h => h.name === 'Cleveland Clinic');
    expect(clevelandClinic).toBeDefined();
    expect(clevelandClinic!.city).toBe('Cleveland');
  });

  it('should include OSU Wexner Medical Center', () => {
    const wexner = hospitals.find(h => h.name.includes('Wexner'));
    expect(wexner).toBeDefined();
    expect(wexner!.city).toBe('Columbus');
  });

  it('should have valid coordinates for all hospitals', () => {
    hospitals.forEach(hospital => {
      expect(hospital.coordinates).toHaveLength(2);
      const [lng, lat] = hospital.coordinates;
      // Ohio bounding box
      expect(lng).toBeGreaterThan(-85);
      expect(lng).toBeLessThan(-80);
      expect(lat).toBeGreaterThan(38);
      expect(lat).toBeLessThan(43);
    });
  });

  it('should have required fields for all hospitals', () => {
    hospitals.forEach(hospital => {
      expect(hospital.id).toBeDefined();
      expect(hospital.name).toBeDefined();
      expect(hospital.city).toBeDefined();
      expect(hospital.county).toBeDefined();
      expect(hospital.coordinates).toBeDefined();
    });
  });
});

describe('filterHospitals', () => {
  it('should return all hospitals when no filter applied', () => {
    const filtered = filterHospitals(hospitals, '', 'all');
    expect(filtered.length).toBe(hospitals.length);
  });

  it('should filter by search term in name', () => {
    const filtered = filterHospitals(hospitals, 'cleveland clinic', 'all');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(h => {
      expect(h.name.toLowerCase()).toContain('cleveland');
    });
  });

  it('should filter by search term in city', () => {
    const filtered = filterHospitals(hospitals, 'columbus', 'all');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(h => {
      expect(
        h.city.toLowerCase().includes('columbus') ||
        h.name.toLowerCase().includes('columbus')
      ).toBe(true);
    });
  });

  it('should filter by region', () => {
    const clevelandHospitals = filterHospitals(hospitals, '', 'cleveland');
    expect(clevelandHospitals.length).toBeGreaterThan(0);
    clevelandHospitals.forEach(h => {
      expect(['Cuyahoga', 'Lake', 'Geauga', 'Lorain', 'Medina', 'Summit', 'Portage'])
        .toContain(h.county);
    });
  });

  it('should combine search and region filters', () => {
    const filtered = filterHospitals(hospitals, 'children', 'cleveland');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(h => {
      expect(h.name.toLowerCase()).toContain('children');
      expect(['Cuyahoga', 'Lake', 'Geauga', 'Lorain', 'Medina', 'Summit', 'Portage'])
        .toContain(h.county);
    });
  });

  it('should return empty array when no matches', () => {
    const filtered = filterHospitals(hospitals, 'xyznonexistent123', 'all');
    expect(filtered).toHaveLength(0);
  });
});

describe('getRegionLabel', () => {
  it('should return correct labels', () => {
    expect(getRegionLabel('all')).toBe('All Ohio');
    expect(getRegionLabel('cleveland')).toBe('Cleveland Area');
    expect(getRegionLabel('columbus')).toBe('Columbus Area');
    expect(getRegionLabel('cincinnati')).toBe('Cincinnati Area');
  });
});

describe('getRegionOptions', () => {
  it('should return all region options', () => {
    const options = getRegionOptions();
    expect(options.length).toBe(6);
    expect(options.map(o => o.value)).toContain('all');
    expect(options.map(o => o.value)).toContain('cleveland');
    expect(options.map(o => o.value)).toContain('columbus');
  });
});

describe('getCoordinates', () => {
  it('should return coordinates for known cities', () => {
    const coords = getCoordinates('Cleveland', 'Cuyahoga', 0);
    expect(coords[0]).toBeCloseTo(-81.69, 1);
    expect(coords[1]).toBeCloseTo(41.50, 1);
  });

  it('should fall back to county coordinates', () => {
    const coords = getCoordinates('UnknownCity', 'Cuyahoga', 0);
    expect(coords[0]).toBeCloseTo(-81.68, 1);
    expect(coords[1]).toBeCloseTo(41.48, 1);
  });

  it('should add jitter to prevent overlapping', () => {
    const coords1 = getCoordinates('Cleveland', 'Cuyahoga', 0);
    const coords2 = getCoordinates('Cleveland', 'Cuyahoga', 1);
    // Should be close but not identical
    expect(coords1[0]).not.toBe(coords2[0]);
    expect(coords1[1]).not.toBe(coords2[1]);
    // But should be within a small radius
    expect(Math.abs(coords1[0] - coords2[0])).toBeLessThan(0.02);
    expect(Math.abs(coords1[1] - coords2[1])).toBeLessThan(0.02);
  });
});
