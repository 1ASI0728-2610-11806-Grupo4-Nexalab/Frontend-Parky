export interface DBUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  reputation: number;
}

export interface DBGarage {
  id: string;
  owner_id: string;
  address: string;
  district: string;
  location: any; // PostGIS Point
  is_covered: boolean;
  has_electric_charger: boolean;
  camera_enabled: boolean;
  height_limit_mts?: number;
}

export interface DBParkingSpot {
  id: string;
  garage_id: string;
  spot_label: string;
  default_price_per_hour: number;
  is_active: boolean;
}

export interface DBVehicle {
  id: string;
  owner_id: string;
  brand: string;
  model: string;
  color?: string;
  plate: string;
}

export interface DBReservation {
  id: string;
  driver_id: string;
  parking_spot_id: string;
  vehicle_id: string;
  status: 'pending' | 'waiting_payment' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  booking_slot: string; // TSRANGE
  duration_minutes: number;
  total_amount: number;
}
