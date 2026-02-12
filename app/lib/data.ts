export interface Pharmacy {
  id: string;
  name: string;
  neighborhood: string;
  region: string;
  phone: string;
  is_24h: boolean;
  onDuty: boolean;
  start_date?: string;
  end_date?: string;
  group_name?: string;
  location?: {
    lat: number;
    lng: number;
  };
  image?: string;
  hours?: string;
  services?: string[];
}

import { supabase } from './supabase';

export async function getPharmacies() {
  const { data, error } = await supabase
    .from('pharmacies_garde')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching pharmacies:', error);
    return [];
  }

  return data.map((p: any) => ({
    ...p,
    onDuty: true, // For now, we assume all in this table are on duty during the dates
  })) as Pharmacy[];
}
