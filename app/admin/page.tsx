"use client";

import { Pharmacy, createPharmacy, deletePharmacy, getAdminPharmacies, getAdminStats, getAllRegions, updatePharmacy } from "@/app/lib/data";
import { supabase } from "@/app/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Activity, Building2, Check, Globe2, LogOut, MapPin, Pencil, Phone, Plus, Search, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function AdminPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, count24h: 0, regions: 0, cities: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const router = useRouter();
  
  // Data for form dropdowns
  const [regions, setRegions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    neighborhood: "",
    city: "",
    region: "",
    phone: "",
    is_24h: false,
  });

  useEffect(() => {
    checkAuth();
    loadData();
    loadRegions();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
    } else {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function loadData() {
    setLoading(true);
    const [pharmacyData, statsData] = await Promise.all([
      getAdminPharmacies(),
      getAdminStats()
    ]);
    setPharmacies(pharmacyData);
    setStats(statsData);
    setLoading(false);
  }

  async function loadPharmacies() {
    const data = await getAdminPharmacies();
    setPharmacies(data);
    const statsData = await getAdminStats();
    setStats(statsData);
  }

  async function loadRegions() {
    const data = await getAllRegions();
    setRegions(data.filter(r => r !== "Toutes les régions"));
  }

  const statCards = [
    { label: "Total Pharmacies", value: stats.total, icon: Building2, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Services 24h/24", value: stats.count24h, icon: Activity, color: "text-primary", bg: "bg-primary/5" },
    { label: "Régions Couvertes", value: stats.regions, icon: Globe2, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Villes Répertoriées", value: stats.cities, icon: MapPin, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.region?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pharmacies, searchTerm]);

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette pharmacie ?")) {
      try {
        await deletePharmacy(id);
        setPharmacies(pharmacies.filter(p => p.id !== id));
      } catch (error) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPharmacy) {
        await updatePharmacy(editingPharmacy.id, formData);
      } else {
        await createPharmacy(formData);
      }
      setIsModalOpen(false);
      setEditingPharmacy(null);
      setFormData({ name: "", neighborhood: "", city: "", region: "", phone: "", is_24h: false });
      loadPharmacies();
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const openEditModal = (pharmacy: Pharmacy) => {
    setEditingPharmacy(pharmacy);
    setFormData({
      name: pharmacy.name,
      neighborhood: pharmacy.neighborhood,
      city: pharmacy.city,
      region: pharmacy.region,
      phone: pharmacy.phone,
      is_24h: pharmacy.is_24h,
    });
    setIsModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-secondary px-6 py-8">
        <Navbar />
        <div className="container mx-auto mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg border border-primary/20">Dashboard</span>
                <h1 className="text-3xl font-bold text-white">Gestion des Pharmacies</h1>
              </div>
              <p className="text-white/60">Administrez la base de données des pharmacies de garde au Bénin.</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-6 py-3 rounded-2xl transition-all flex items-center gap-2 border border-white/10"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
              <button 
                onClick={() => {
                  setEditingPharmacy(null);
                  setFormData({ name: "", neighborhood: "", city: "", region: "", phone: "", is_24h: false });
                  setIsModalOpen(true);
                }}
                className="bg-primary hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <Plus className="w-5 h-5" />
                Ajouter une pharmacie
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8 pb-20">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-secondary/5 border border-secondary/5 flex items-center gap-5 group hover:-translate-y-1 transition-all">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-secondary/30 tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold text-secondary">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-secondary/5 overflow-hidden border border-secondary/5">
          <div className="p-8 border-b border-secondary/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/30" />
              <input 
                type="text" 
                placeholder="Rechercher une pharmacie, ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-secondary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="text-sm text-secondary/40 font-medium">
              {filteredPharmacies.length} pharmacies trouvées
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/5 text-secondary/40 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-8 py-4">Pharmacie</th>
                  <th className="px-8 py-4">Localisation</th>
                  <th className="px-8 py-4">Contact</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredPharmacies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-secondary/40">
                      Aucune pharmacie trouvée dans la base de données.
                    </td>
                  </tr>
                ) : (
                  filteredPharmacies.map((pharmacy) => (
                    <tr key={pharmacy.id} className="hover:bg-secondary/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-secondary">{pharmacy.name}</p>
                            <p className="text-xs text-secondary/40">{pharmacy.neighborhood}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-secondary/60">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{pharmacy.city}, {pharmacy.region}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-secondary/60">
                          <Phone className="w-4 h-4 text-primary" />
                          <span>{pharmacy.phone}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${pharmacy.is_24h ? 'bg-primary/10 text-primary' : 'bg-secondary/5 text-secondary/40'}`}>
                          {pharmacy.is_24h ? "24h/24" : "Garde"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEditModal(pharmacy)}
                            className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-all"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(pharmacy.id)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Ajout/Modif */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary/5 transition-all"
            >
              <X className="w-6 h-6 text-secondary/40" />
            </button>
            
            <form onSubmit={handleSubmit} className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-secondary mb-8">
                {editingPharmacy ? "Modifier la pharmacie" : "Ajouter une pharmacie"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-black text-secondary/30 tracking-widest mb-2 block">Nom de la pharmacie</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 bg-secondary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                    placeholder="Ex: Pharmacie de l'Amitié"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] uppercase font-black text-secondary/30 tracking-widest mb-2 block">Ville</label>
                  <input 
                    required
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-5 py-4 bg-secondary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                    placeholder="Ex: Cotonou"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-secondary/30 tracking-widest mb-2 block">Région</label>
                  <select 
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full px-5 py-4 bg-secondary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-secondary appearance-none"
                  >
                    <option value="">Sélectionner une région</option>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-black text-secondary/30 tracking-widest mb-2 block">Quartier / Adresse</label>
                  <input 
                    required
                    type="text" 
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                    className="w-full px-5 py-4 bg-secondary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                    placeholder="Ex: Akpakpa, face au marché"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-secondary/30 tracking-widest mb-2 block">Téléphone</label>
                  <input 
                    required
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-5 py-4 bg-secondary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-secondary font-mono"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>

                <div className="flex items-end pb-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-12 h-6 rounded-full transition-all relative ${formData.is_24h ? 'bg-primary' : 'bg-secondary/10'}`}>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={formData.is_24h}
                        onChange={(e) => setFormData({...formData, is_24h: e.target.checked})}
                      />
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.is_24h ? 'left-7' : 'left-1'}`} />
                    </div>
                    <span className="text-sm font-bold text-secondary/60 group-hover:text-secondary transition-colors">Ouverte 24h/24</span>
                  </label>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-grow bg-secondary/5 hover:bg-secondary/10 text-secondary font-bold py-4 rounded-2xl transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-grow bg-primary hover:bg-emerald-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {editingPharmacy ? "Mettre à jour" : "Enregistrer la pharmacie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
