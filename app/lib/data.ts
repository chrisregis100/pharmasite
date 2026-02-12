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

export async function getPharmacies(page: number = 0, pageSize: number = 12) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from('pharmacies_garde')
    .select('*')
    .order('name')
    .range(from, to);

  if (error) {
    console.error('Error fetching pharmacies:', error);
    return [];
  }



  return data.map((p: any) => ({
    ...p,
    onDuty: true,
  })) as Pharmacy[];
}

export async function searchPharmacies(query: string) {
  const { data, error } = await supabase
    .from('pharmacies_garde')
    .select('*')
    .order(query);

  if (error) {
    console.error('Error fetching pharmacies:', error);
    return [];
  }

  return data.map((p: any) => ({
    ...p,
    onDuty: true,
  })) as Pharmacy[];
}