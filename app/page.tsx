"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Clock, HeartPulse, MapPin, Navigation, Phone, Search, ShieldCheck, X } from "lucide-react";
import { useMemo, useState } from "react";
import { pharmacies, Pharmacy } from "./lib/data";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Toutes les villes");
  const [onlyOnDuty, setOnlyOnDuty] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  const cities = ["Toutes les villes", ...Array.from(new Set(pharmacies.map(p => p.city)))];

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === "Toutes les villes" || p.city === selectedCity;
      const matchesDuty = !onlyOnDuty || p.onDuty;
      return matchesSearch && matchesCity && matchesDuty;
    });
  }, [searchTerm, selectedCity, onlyOnDuty]);

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
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="h-14 md:h-16 px-6 bg-transparent text-white/80 focus:outline-none text-lg cursor-pointer"
                >
                  {cities.map(city => (
                    <option key={city} value={city} className="bg-secondary text-white">{city}</option>
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-2">Pharmacies à proximité</h2>
              <p className="text-secondary/50">Découvrez les pharmacies disponibles autour de vous actuellement.</p>
            </div>
            <div className="text-secondary/30 font-medium">
              {filteredPharmacies.length} résultats trouvés
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPharmacies.map((pharmacy, index) => (
                <motion.div
                  key={pharmacy.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group bg-white dark:bg-card rounded-[2rem] border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer"
                  onClick={() => setSelectedPharmacy(pharmacy)}
                >
                  <div className="h-48 bg-secondary/5 relative overflow-hidden">
                    {/* Placeholder image representation */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-medical/10 text-primary/20">
                      <HeartPulse className="w-20 h-20" />
                    </div>
                    {pharmacy.onDuty && (
                      <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        DE GARDE
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">{pharmacy.name}</h3>
                        <p className="text-secondary/50 flex items-center gap-1 text-sm">
                          <MapPin className="w-3.5 h-3.5" />
                          {pharmacy.address}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 py-2">
                       {pharmacy.services.slice(0, 2).map(s => (
                         <span key={s} className="text-[10px] uppercase tracking-wider font-bold bg-secondary/5 text-secondary/60 px-2.5 py-1 rounded-md">
                           {s}
                         </span>
                       ))}
                    </div>

                    <div className="pt-4 border-t border-secondary/5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-secondary/80 text-sm">{pharmacy.phone}</span>
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

          {filteredPharmacies.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-secondary/20" />
              </div>
              <h3 className="text-2xl font-bold text-secondary">Aucune pharmacie trouvée</h3>
              <p className="text-secondary/50 max-w-md mx-auto mt-2">Nous n'avons trouvé aucune pharmacie correspondant à vos critères de recherche. Essayez d'ajuster vos filtres.</p>
              <button 
                onClick={() => {setSearchTerm(""); setSelectedCity("Toutes les villes"); setOnlyOnDuty(false);}}
                className="mt-8 text-primary font-bold hover:underline"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-secondary mb-4">Simple, Rapide & Efficace</h2>
            <p className="text-secondary/50">Trouver vos médicaments n'a jamais été aussi facile grâce à nos services intégrés.</p>
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
                <h3 className="text-xl font-bold text-secondary mb-3">{step.title}</h3>
                <p className="text-secondary/50 leading-relaxed">{step.desc}</p>
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
              <button className="bg-white text-primary font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Appeler le SAMU
              </button>
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
              className="bg-white dark:bg-card w-full max-w-4xl rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row h-full max-h-[800px]"
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
                  <h4 className="text-xl font-bold text-secondary mb-2">Localisation GPS</h4>
                  <p className="text-secondary/40 text-sm">Carte interactive bientôt disponible pour guider votre trajet en temps réel.</p>
                  <div className="mt-8 flex gap-4 w-full">
                    <div className="bg-white/80 p-4 rounded-2xl flex-grow text-left">
                      <p className="text-[10px] text-secondary/40 uppercase font-black">Coordonnées</p>
                      <p className="text-xs font-mono">{selectedPharmacy.location.lat.toFixed(4)}, {selectedPharmacy.location.lng.toFixed(4)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                <div className="mb-8">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${selectedPharmacy.onDuty ? 'bg-primary/10 text-primary' : 'bg-secondary/5 text-secondary/50'}`}>
                    {selectedPharmacy.onDuty ? 'De garde actuellement' : 'Fermé / Non garde'}
                  </span>
                  <h2 className="text-3xl font-bold text-secondary mb-2">{selectedPharmacy.name}</h2>
                  <p className="text-secondary/50 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {selectedPharmacy.address}, {selectedPharmacy.city}
                  </p>
                </div>

                <div className="space-y-6 flex-grow">
                  <div className="bg-secondary/5 p-6 rounded-[1.5rem] space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-secondary/40 uppercase font-black tracking-widest">Horaires d'ouverture</p>
                        <p className="font-bold text-secondary">{selectedPharmacy.hours}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-secondary/40 uppercase font-black tracking-widest">Contact Direct</p>
                        <p className="font-bold text-secondary leading-none">{selectedPharmacy.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-secondary mb-3">Services Disponibles</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPharmacy.services.map(service => (
                        <span key={service} className="px-4 py-2 bg-secondary/5 rounded-full text-sm font-medium text-secondary/70">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button className="flex-grow bg-primary hover:bg-emerald-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    <Navigation className="w-5 h-5" />
                    Y aller maintenant
                  </button>
                  <button className="w-14 h-14 bg-secondary/5 hover:bg-secondary/10 rounded-2xl flex items-center justify-center transition-all">
                    <HeartPulse className="w-6 h-6 text-secondary/30" />
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
