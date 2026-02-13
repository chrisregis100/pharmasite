"use client";

import { motion } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";

interface HeroProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  regions: string[];
  cities: string[];
  onlyOnDuty: boolean;
  setOnlyOnDuty: (value: boolean) => void;
}

export function Hero({ 
  searchTerm, 
  setSearchTerm, 
  selectedRegion, 
  setSelectedRegion, 
  selectedCity,
  setSelectedCity,
  regions,
  cities,
  onlyOnDuty,
  setOnlyOnDuty 
}: HeroProps) {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-6 px-6 relative z-10 py-16 md:py-24">
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
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedCity("Toutes les villes");
            }}
            className="h-14 md:h-16 px-4 bg-transparent text-white/80 focus:outline-none text-base cursor-pointer max-w-[150px]"
          >
            {regions.map((region, index) => (
              <option key={index+1} value={region} className="bg-secondary text-white">{region}</option>
            ))}
          </select>

          <div className="h-0.5 md:h-10 md:w-0.5 bg-white/10 self-center hidden md:block" />
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={selectedRegion === "Toutes les régions"}
            className="h-14 md:h-16 px-4 bg-transparent text-white/80 focus:outline-none text-base cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed max-w-[150px]"
          >
            {cities.map((city, index) => (
              <option key={index+1} value={city} className="bg-secondary text-white">{city}</option>
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
  );
}
