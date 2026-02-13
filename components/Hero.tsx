"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

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
        className="mt-8 md:mt-12 bg-white p-2 rounded-2xl md:rounded-full shadow-2xl max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Nom de la pharmacie, quartier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 md:h-14 pl-14 pr-4 bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none text-base md:text-lg"
            />
          </div>
          <div className="h-0.5 md:h-10 md:w-px bg-gray-100 self-center hidden md:block" />
          
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative md:min-w-[150px]">
              <select 
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedCity("Toutes les villes");
                }}
                className="w-full h-12 md:h-14 px-4 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none text-gray-700 focus:outline-none text-sm md:text-base cursor-pointer hover:bg-gray-50 transition-colors appearance-none"
              >
                {regions.map((region, index) => (
                  <option key={index+1} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="h-0.5 md:h-10 md:w-px bg-gray-100 self-center hidden md:block" />
            
            <div className="relative md:min-w-[150px]">
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={selectedRegion === "Toutes les régions"}
                className="w-full h-12 md:h-14 px-4 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none text-gray-700 focus:outline-none text-sm md:text-base cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors appearance-none"
              >
                {cities.map((city, index) => (
                  <option key={index+1} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="h-12 md:h-14 w-full md:w-auto px-8 bg-primary hover:bg-emerald-600 text-white font-bold rounded-xl md:rounded-full transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-primary/30">
            <span>Rechercher</span>
          </button>
        </div>
      </motion.div>

    </div>
  );
}
