export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  onDuty: boolean;
  location: {
    lat: number;
    lng: number;
  };
  image: string;
  hours: string;
  services: string[];
}

export const pharmacies: Pharmacy[] = [
  {
    id: "1",
    name: "Pharmacie de l'Étoile",
    address: "Avenue Steinmetz, Cotonou",
    city: "Cotonou",
    phone: "+229 21 31 22 22",
    onDuty: true,
    location: { lat: 6.3667, lng: 2.4333 },
    image: "/pharmacies/etoile.jpg",
    hours: "24h/24 (Garde)",
    services: ["Vente de médicaments", "Conseils santé", "Parapharmacie"]
  },
  {
    id: "2",
    name: "Pharmacie Les Cocotiers",
    address: "Quartier Haie Vive, Cotonou",
    city: "Cotonou",
    phone: "+229 21 30 15 15",
    onDuty: false,
    location: { lat: 6.3551, lng: 2.3994 },
    image: "/pharmacies/cocotiers.jpg",
    hours: "08:00 - 22:00",
    services: ["Vente de médicaments", "Tests de glycémie", "Livraison à domicile"]
  },
  {
    id: "3",
    name: "Pharmacie Saint Jean",
    address: "Place Lénine, Cotonou",
    city: "Cotonou",
    phone: "+229 21 32 45 67",
    onDuty: true,
    location: { lat: 6.3712, lng: 2.4215 },
    image: "/pharmacies/st-jean.jpg",
    hours: "24h/24 (Garde)",
    services: ["Vente de médicaments", "Ordonnances en ligne"]
  },
  {
    id: "4",
    name: "Pharmacie Ganhi",
    address: "Boulevard de la Marina, Cotonou",
    city: "Cotonou",
    phone: "+229 21 31 09 87",
    onDuty: false,
    location: { lat: 6.3533, lng: 2.4288 },
    image: "/pharmacies/ganhi.jpg",
    hours: "08:00 - 20:00",
    services: ["Vente de médicaments", "Beauté & Bien-être"]
  },
  {
    id: "5",
    name: "Pharmacie de Porto-Novo",
    address: "Grand Marché, Porto-Novo",
    city: "Porto-Novo",
    phone: "+229 20 21 44 44",
    onDuty: true,
    location: { lat: 6.4969, lng: 2.6289 },
    image: "/pharmacies/p-novo.jpg",
    hours: "24h/24 (Garde)",
    services: ["Pharmacie de garde", "Médicaments essentiels"]
  },
  {
    id: "6",
    name: "Pharmacie Bio Parakou",
    address: "Quartier Zongo, Parakou",
    city: "Parakou",
    phone: "+229 23 61 00 11",
    onDuty: false,
    location: { lat: 9.3372, lng: 2.6303 },
    image: "/pharmacies/parakou.jpg",
    hours: "08:00 - 21:00",
    services: ["Produits Bio", "Conseils nutrition"]
  }
];
