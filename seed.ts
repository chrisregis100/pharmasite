import { supabase } from './app/lib/supabase';
import data24h from './data_24h.json';
import dataAtlantique from './data_atlantique.json';
import dataCotonouExtra from './data_cotonou_extra.json';
import dataLittoral from './data_littoral.json';
import dataNord from './data_nord.json';
import dataOueme24hExtra from './data_oueme_24h_extra.json';
import dataOuemePlateau from './data_oueme_plateau.json';

export async function seedDatabase() {
  console.log('Starting seeding...');

  const allData = [
    ...dataLittoral.map(p => ({ ...p, is_24h: false })),
    ...dataOuemePlateau.map(p => ({ ...p, is_24h: false })),
    ...data24h.map(p => ({ ...p, is_24h: true })),
    ...dataCotonouExtra.map(p => ({ ...p, is_24h: false })),
    ...dataAtlantique.map(p => ({ ...p, is_24h: false })),
    ...dataNord.map(p => ({ ...p, is_24h: false })),
    ...dataOueme24hExtra.map(p => ({ ...p, is_24h: true }))
  ];

  // Nettoyer la table avant d'insérer les nouvelles données structurées
  const { error: deleteError } = await supabase
    .from('pharmacies_garde')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Supprime tout

  if (deleteError) {
    console.error('Error clearing database:', deleteError);
    return;
  }

  const { data, error } = await supabase
    .from('pharmacies_garde')
    .insert(allData)
    .select();

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
