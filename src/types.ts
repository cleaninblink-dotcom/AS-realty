export interface Property {
  id: number | string;
  propertyNumber: string; // '01', '02', '03', '04', '05', '06', '07'
  name: string; // 'Property 01', etc.
  title: string; // alias for name
  subtitle?: string;
  status: 'Available' | 'Under Discussion' | 'Sold';
  ratePerAcre: string; // e.g. '₹25 L / Acre', '₹22 L / Acre', etc.
  rateValue?: number;
  totalLand: string; // '70 Acres', '6.60 Acres', etc.
  acresValue?: number;
  areaDisplay: string; // '70 Acres', '6.60 Acres', etc.
  totalPrice: string; // e.g. '₹17.50 Crore'
  totalPriceShort: string; // '₹17.50 Cr'
  location: string; // e.g. 'Juna Pani', '35 km from Zero Mile'
  distanceKm: number;
  zeroMileDistance?: string; // '35 km', '58 km', etc.
  roadAccess?: string; // 'Tar road touch', 'Cement road touch', 'Highway touch', etc.
  waterSource?: string; // 'Yes' | 'No' | 'Nearby'
  type: string; // 'Agricultural Land', 'Highway Touch Land 🛣️', etc.
  specialFeature?: string;
  price: string;
  price_value: number; // numeric value in Rupees for sorting
  imageUrl: string;
  heroImage: string; // alias for imageUrl
  gallery?: string[];
  features?: string[];
  amenities?: string[];
  sqft?: number;
  bathrooms?: number;
  reraId?: string;
  possession?: string;
  description?: string;
  isFeatured?: boolean;
  bhk: string; // e.g. '5 Acres', '6.67 Acres', etc.
  locality?: string;
  city?: string;
}

export interface FilterState {
  priceRange: string; // 'all' | 'under-50l' | '50l-1cr' | 'above-1cr'
  feature: string; // 'all' | 'lake-touch' | 'highway-touch' | 'flexible' | 'agricultural'
  distance: string; // 'all' | 'under-35' | '35-50' | 'above-50'
  searchQuery: string;
}

export interface BookingFormData {
  fullName: string;
  phone: string;
  propertyName: string;
  date: string;
  timeSlot: string;
  visitType: 'Private Site Visit' | 'Virtual Video Walkthrough' | 'Office Consultation';
  notes?: string;
}


