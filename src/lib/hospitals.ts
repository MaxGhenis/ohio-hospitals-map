import { Hospital, HospitalRaw, RegionFilter } from '@/types/hospital';
import { getCoordinates } from './geocode';

// Region definitions by county
const REGIONS: Record<RegionFilter, string[]> = {
  all: [],
  cleveland: ['Cuyahoga', 'Lake', 'Geauga', 'Lorain', 'Medina', 'Summit', 'Portage'],
  columbus: ['Franklin', 'Delaware', 'Licking', 'Fairfield', 'Pickaway', 'Madison', 'Union'],
  cincinnati: ['Hamilton', 'Butler', 'Warren', 'Clermont', 'Brown'],
  dayton: ['Montgomery', 'Greene', 'Miami', 'Clark', 'Preble'],
  toledo: ['Lucas', 'Wood', 'Ottawa', 'Sandusky', 'Fulton'],
};

// Get the base path for the application
function getBasePath(): string {
  // Check if we're in a browser and if the path includes the repo name
  if (typeof window !== 'undefined' && window.location.pathname.includes('/ohio-hospitals-map')) {
    return '/ohio-hospitals-map';
  }
  return '';
}

/**
 * Load and process hospital data
 */
export async function loadHospitals(): Promise<Hospital[]> {
  const basePath = getBasePath();
  const response = await fetch(`${basePath}/data/hospitals.json`);
  const data: HospitalRaw[] = await response.json();

  return data.map((hospital, index) => ({
    id: `hospital-${index}`,
    name: hospital.name,
    city: hospital.city,
    county: hospital.county,
    coordinates: getCoordinates(hospital.city, hospital.county, index),
  }));
}

/**
 * Filter hospitals by search query and region
 */
export function filterHospitals(
  hospitals: Hospital[],
  search: string,
  region: RegionFilter
): Hospital[] {
  const searchLower = search.toLowerCase().trim();

  return hospitals.filter((hospital) => {
    // Check region filter
    if (region !== 'all') {
      const regionCounties = REGIONS[region];
      if (!regionCounties.includes(hospital.county)) {
        return false;
      }
    }

    // Check search filter
    if (searchLower) {
      return (
        hospital.name.toLowerCase().includes(searchLower) ||
        hospital.city.toLowerCase().includes(searchLower) ||
        hospital.county.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });
}

/**
 * Get region label for display
 */
export function getRegionLabel(region: RegionFilter): string {
  const labels: Record<RegionFilter, string> = {
    all: 'All Ohio',
    cleveland: 'Cleveland Area',
    columbus: 'Columbus Area',
    cincinnati: 'Cincinnati Area',
    dayton: 'Dayton Area',
    toledo: 'Toledo Area',
  };
  return labels[region];
}

/**
 * Get all region options
 */
export function getRegionOptions(): { value: RegionFilter; label: string }[] {
  return (Object.keys(REGIONS) as RegionFilter[]).map((region) => ({
    value: region,
    label: getRegionLabel(region),
  }));
}
