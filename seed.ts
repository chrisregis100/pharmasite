import { supabase } from './app/lib/supabase';
import data24h from './data_24h.json';
import dataLittoral from './data_littoral.json';
import dataOuemePlateau from './data_oueme_plateau.json';

export async function seedDatabase() {
  console.log('Starting seeding...');

  const allData = [
    ...dataLittoral.map(p => ({ ...p, is_24h: false })),
    ...dataOuemePlateau.map(p => ({ ...p, is_24h: false })),
    ...data24h.map(p => ({ ...p, is_24h: true }))
  ];

  const { data, error } = await supabase
    .from('pharmacies_garde')
    .insert(allData);

  if (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }

  console.log('Seeding successful!');
  return { success: true };
}

// Ajouter cet appel pour l'exécution en ligne de commande
seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
