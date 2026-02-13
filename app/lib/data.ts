export interface Pharmacy {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
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

export async function getPharmacies(
  page: number = 0, 
  pageSize: number = 6, 
  filters?: {
    searchTerm?: string;
    region?: string;
    city?: string;
    onlyOnDuty?: boolean;
  }
) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('pharmacies_garde')
    .select('*')
    .order('name');

  if (filters?.searchTerm) {
    // Utilisation de textSearch pour une recherche performante sur le champ fts
    query = query.textSearch('fts', filters.searchTerm.trim().split(/\s+/).join(' & '));
  }

  if (filters?.region && filters.region !== "Toutes les régions") {
    query = query.eq('region', filters.region);
  }

  if (filters?.city && filters.city !== "Toutes les villes") {
    query = query.eq('city', filters.city);
  }

  if (filters?.onlyOnDuty) {
    query = query.eq('is_24h', true); // Ou votre logique de garde actuelle
  }

  const { data, error } = await query.range(from, to);

  if (error) {
    console.error('Error fetching pharmacies:', error);
    return [];
  }

  return data.map((p: any) => ({
    ...p,
    onDuty: p.is_24h || true, // Logique à affiner selon vos besoins
  })) as Pharmacy[];
}

export async function getAllRegions(): Promise<string[]> {
  const { data, error } = await supabase
    .from('pharmacies_garde')
    .select('region');

  if (error) {
    console.error('Error fetching regions:', error);
    return [];
  }

  const regions = Array.from(new Set(data.map(p => p.region))).filter(Boolean).sort();
  return ["Toutes les régions", ...regions];
}

export async function getAllCities(region?: string): Promise<string[]> {
  let query = supabase
    .from('pharmacies_garde')
    .select('city');

  if (region && region !== "Toutes les régions") {
    query = query.eq('region', region);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  const cities = Array.from(new Set(data.map(p => p.city))).filter(Boolean).sort();
  return ["Toutes les villes", ...cities];
}

export async function createPharmacy(pharmacy: Omit<Pharmacy, 'id' | 'onDuty'>) {
  const { data, error } = await supabase
    .from('pharmacies_garde')
    .insert([pharmacy])
    .select()
    .single();

  if (error) {
    console.error('Error creating pharmacy:', error);
    throw error;
  }
  return data;
}

export async function updatePharmacy(id: string, updates: Partial<Pharmacy>) {
  const { data, error } = await supabase
    .from('pharmacies_garde')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating pharmacy:', error);
    throw error;
  }
  return data;
}

export async function deletePharmacy(id: string) {
  const { error } = await supabase
    .from('pharmacies_garde')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting pharmacy:', error);
    throw error;
  }
  return true;
}

export async function getAdminPharmacies() {
  const { data, error } = await supabase
    .from('pharmacies_garde')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching admin pharmacies:', error);
    return [];
  }

  return data as Pharmacy[];
}

export async function getAdminStats() {
  const { data, error } = await supabase
    .from('pharmacies_garde')
    .select('region, city, is_24h');

  if (error) {
    console.error('Error fetching admin stats:', error);
    return { total: 0, count24h: 0, regions: 0, cities: 0 };
  }

  const regions = new Set(data.filter(p => p.region).map(p => p.region)).size;
  const cities = new Set(data.filter(p => p.city).map(p => p.city)).size;
  const count24h = data.filter(p => p.is_24h).length;

  return {
    total: data.length,
    count24h,
    regions,
    cities
  };
}