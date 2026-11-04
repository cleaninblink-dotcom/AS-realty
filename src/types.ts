export interface Property {
  id: number | string;
  propertyNumber: string; // '01', '02', '03', '04', '05', '06', '07'
  name: string; // 'Property 01', etc.
  title: string; // alias for name
  subtitle?: string;
  status: 'Available' | 'Under Discussion' | 'Sold';
  ratePerAcre: string; // e.g. '₹18 Lakh / Acre', '₹19 Lakh / Acre', etc.
  rateValue?: number;
  totalLand: string; // '5 Acres', '6.67 Acres', "As per buyer's requirement"
  areaDisplay: string; // '5 Acres', '6.67 Acres', 'Flexible', '1.75 Acres'
  totalPrice: string; // '₹90 Lakh', '₹1.2663 Crore', 'Depends on land area', '₹1.80 Crore Total', '₹42 Lakh'
  totalPriceShort: string; // '₹90 Lakh', '₹1.2663 Cr', 'Depends on area', '₹1.80 Cr', '₹42 Lakh'
  location: string; // '32 KM from Nagpur', '60 KM from Nagpur', etc.
  distanceKm: number;
  type: string; // 'Agricultural Land', 'Lake Touch Property 🌊', etc.
  specialFeature?: string; // 'Lake Touch Property 🌊', 'Highway Touch Land 🛣️', 'Flexible Land Availability'
  price: string; // Display rate/price
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


