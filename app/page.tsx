"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Clock, HeartPulse, MapPin, Navigation, Phone, Search, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getPharmacies, Pharmacy } from "./lib/data";

export default function Home() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Toutes les régions");
  const [onlyOnDuty, setOnlyOnDuty] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const PAGE_SIZE = 6;

  // Détection du mode mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Chargement initial ou changement de filtres
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      setPage(0);
      const data = await getPharmacies(0, PAGE_SIZE);
      setPharmacies(data);
      setHasMore(data.length === PAGE_SIZE);
      setLoading(false);
    }
    loadInitialData();
  }, [selectedRegion, onlyOnDuty]);

  // Fonction pour charger la page suivante
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    const newData = await getPharmacies(nextPage, PAGE_SIZE);
    
    if (newData.length < PAGE_SIZE) {
      setHasMore(false);
    }
    
    setPharmacies(prev => [...prev, ...newData]);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const regions = ["Toutes les régions", ...Array.from(new Set(pharmacies.map(p => p.region)))];

  const filteredBySearch = useMemo(() => {
    return pharmacies.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm, pharmacies]);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // L'observer ne déclenche loadMore automatiquement QUE sur mobile
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && isMobile) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, isMobile]);

  return (
    <div className="min-h-screen">
      {/* Header / Hero Section */}
      <header className="relative bg-secondary overflow-hidden py-16 md:py-24">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-medical/20 rounded-full blur-3xl opacity-50" />
        
        <div className="container mx-auto px-6 relative z-10">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <HeartPulse className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Pharma<span className="text-primary">Bénin</span></span>
            </div>
            <div className="hidden md:flex gap-8 text-white/80 font-medium">
              <a href="#" className="hover:text-primary transition-colors">Rechercher</a>
              <a href="#" className="hover:text-primary transition-colors">Urgences</a>
              <a href="#" className="hover:text-primary transition-colors">Blog Santé</a>
            </div>
            <button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-5 py-2 rounded-full transition-all flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Zone Membre
            </button>
          </nav>

          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white leading-tight"
            >
              Trouvez votre pharmacie <br />
              <span className="text-primary italic">en un clic</span>, partout au Bénin.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Recherchez toutes les pharmacies ouvertes ou de garde à proximité de chez vous. Rapide, fiable et sécurisé.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12 bg-white/10 backdrop-blur-xl p-2 rounded-2xl md:rounded-[2rem] border border-white/20 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Nom de la pharmacie, quartier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-14 md:h-16 pl-12 pr-4 bg-transparent text-white placeholder:text-white/30 focus:outline-none text-lg"
                  />
                </div>
                <div className="h-0.5 md:h-10 md:w-0.5 bg-white/10 self-center hidden md:block" />
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="h-14 md:h-16 px-6 bg-transparent text-white/80 focus:outline-none text-lg cursor-pointer"
                >
                  {regions.map(region => (
                    <option key={region} value={region} className="bg-secondary text-white">{region}</option>
                  ))}
                </select>
                <button className="h-14 md:h-16 px-8 bg-primary hover:bg-emerald-400 text-white font-bold rounded-xl md:rounded-3xl transition-all flex items-center justify-center gap-2 group">
                  <span>Rechercher</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <label className="flex items-center gap-2 text-white/70 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={onlyOnDuty}
                  onChange={(e) => setOnlyOnDuty(e.target.checked)}
                  className="w-5 h-5 accent-primary bg-white/10 border-white/10 rounded cursor-pointer" 
                />
                <span className="group-hover:text-white transition-colors">Afficher uniquement les pharmacies de garde</span>
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20 bg-background text-secondary">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Pharmacies à proximité</h2>
              <p className="opacity-50">Découvrez les pharmacies disponibles autour de vous actuellement.</p>
            </div>
            <div className="opacity-30 font-medium">
              {loading ? "Chargement..." : `${filteredBySearch.length} résultats affichés`}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredBySearch.map((pharmacy, index) => (
                  <motion.div
                    key={pharmacy.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: (index % PAGE_SIZE) * 0.05 }}
                    className="group bg-white dark:bg-card rounded-[2rem] border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer shadow-sm"
                    onClick={() => setSelectedPharmacy(pharmacy)}
                  >
                    <div className="h-48 bg-secondary/5 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-medical/10 text-primary/20">
                        <HeartPulse className="w-20 h-20" />
                      </div>
                      {pharmacy.onDuty && (
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          DE GARDE
                        </div>
                      )}
                      {pharmacy.is_24h && (
                        <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                          <Clock className="w-3 h-3" />
                          24h/7j
                        </div>
                      )}
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{pharmacy.name}</h3>
                          <p className="opacity-50 flex items-center gap-1 text-sm">
                            <MapPin className="w-3.5 h-3.5" />
                            {pharmacy.neighborhood}
                          </p>
                          <p className="opacity-30 text-[10px] uppercase font-bold mt-1">{pharmacy.region}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 py-2">
                        {pharmacy.group_name && (
                          <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                            {pharmacy.group_name}
                          </span>
                        )}
                        {pharmacy.is_24h && (
                          <span className="text-[10px] uppercase tracking-wider font-bold bg-secondary/10 text-secondary px-2.5 py-1 rounded-md">
                            Permanent
                          </span>
                        )}
                      </div>

                      <div className="pt-4 border-t border-secondary/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Phone className="w-4 h-4" />
                          </div>
                          <span className="font-semibold opacity-80 text-sm">{pharmacy.phone}</span>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                          <Navigation className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Sentinel element for Infinite Scroll (Mobile) / Load More (Desktop) */}
          <div ref={observerTarget} className="w-full py-12 flex flex-col items-center justify-center gap-6">
            {loadingMore ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm opacity-50 font-medium">Chargement des pharmacies suivantes...</p>
              </div>
            ) : (
              <>
                {!isMobile && hasMore && filteredBySearch.length > 0 && (
                  <button 
                    onClick={loadMore}
                    className="group relative bg-white dark:bg-card border border-border px-10 py-4 rounded-2xl font-bold text-secondary hover:text-primary transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 flex items-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10">Voir plus de pharmacies</span>
                    <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                
                {!hasMore && filteredBySearch.length > 0 && (
                  <p className="text-sm opacity-30 font-medium italic">Toutes les pharmacies ont été chargées.</p>
                )}
              </>
            )}
          </div>

          {!loading && filteredBySearch.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 opacity-20" />
              </div>
              <h3 className="text-2xl font-bold">Aucune pharmacie trouvée</h3>
              <p className="opacity-50 max-w-md mx-auto mt-2">Nous n'avons trouvé aucune pharmacie correspondant à vos critères de recherche. Essayez d'ajuster vos filtres.</p>
              <button 
                onClick={() => {setSearchTerm(""); setSelectedRegion("Toutes les régions"); setOnlyOnDuty(false);}}
                className="mt-8 text-primary font-bold hover:underline"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-secondary/5 text-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Rapide & Efficace</h2>
            <p className="opacity-50">Trouver vos médicaments n'a jamais été aussi facile grâce à nos services intégrés.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Search, 
                title: "Recherchez", 
                desc: "Entrez le nom d'une pharmacie ou votre quartier pour voir les options disponibles." 
              },
              { 
                icon: MapPin, 
                title: "Localisez", 
                desc: "Visualisez la position exacte et obtenez l'itinéraire le plus court." 
              },
              { 
                icon: ShieldCheck, 
                title: "Vérifiez", 
                desc: "Assurez-vous que la pharmacie est bien de garde avant de vous déplacer." 
              }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-secondary/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="opacity-50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center md:text-left space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white">Une urgence ? <br />Appelez le 112</h2>
              <p className="text-white/80 text-lg max-w-md">Pour toute assistance médicale immédiate au Bénin, contactez les services de secours officiels.</p>
            </div>
            
            <div className="relative z-10 flex gap-4">
              <a href="tel:112" className="bg-white text-primary font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Appeler le 112
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modal / Details Drawer */}
      <AnimatePresence>
        {selectedPharmacy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPharmacy(null)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-card w-full max-w-4xl rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row h-full max-h-[800px] text-secondary"
            >
              <button 
                onClick={() => setSelectedPharmacy(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-white md:text-secondary" />
              </button>
              
              <div className="w-full md:w-1/2 bg-secondary/5 relative min-h-[300px]">
                {/* Map placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6">
                    <MapPin className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Localisation GPS</h4>
                  <p className="opacity-40 text-sm">Carte interactive bientôt disponible pour guider votre trajet en temps réel.</p>
                  <div className="mt-8 flex gap-4 w-full">
                    <div className="bg-white/80 p-4 rounded-2xl flex-grow text-left">
                      <p className="text-[10px] opacity-40 uppercase font-black">Région</p>
                      <p className="text-xs font-mono">{selectedPharmacy.region}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                <div className="mb-8">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${selectedPharmacy.onDuty ? 'bg-primary/10 text-primary' : 'bg-secondary/5 opacity-50'}`}>
                    {selectedPharmacy.onDuty ? 'De garde actuellement' : 'Fermé / Non garde'}
                  </span>
                  <h2 className="text-3xl font-bold mb-2">{selectedPharmacy.name}</h2>
                  <p className="opacity-50 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {selectedPharmacy.neighborhood}, {selectedPharmacy.region}
                  </p>
                </div>

                <div className="space-y-6 flex-grow">
                  <div className="bg-secondary/5 p-6 rounded-[1.5rem] space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] opacity-40 uppercase font-black tracking-widest">Type de service</p>
                        <p className="font-bold">{selectedPharmacy.is_24h ? "Ouvert 24h/24 et 7j/7" : "De garde (Période limitée)"}</p>
                        {selectedPharmacy.start_date && (
                          <p className="text-xs opacity-50">Du {selectedPharmacy.start_date} au {selectedPharmacy.end_date}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] opacity-40 uppercase font-black tracking-widest">Contact Direct</p>
                        <p className="font-bold leading-none">{selectedPharmacy.phone}</p>
                      </div>
                    </div>
                  </div>

                  {selectedPharmacy.group_name && (
                    <div>
                      <h4 className="font-bold mb-3">Groupe de Garde</h4>
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {selectedPharmacy.group_name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-12 flex gap-4">
                  <a 
                    href={`tel:${selectedPharmacy.phone.split('/')[0].trim()}`}
                    className="flex-grow bg-primary hover:bg-emerald-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Appeler maintenant
                  </a>
                  <button className="w-14 h-14 bg-secondary/5 hover:bg-secondary/10 rounded-2xl flex items-center justify-center transition-all">
                    <HeartPulse className="w-6 h-6 opacity-30" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
