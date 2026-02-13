"use client";

import { Pharmacy } from "@/app/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, HeartPulse, MapPin, Phone, X } from "lucide-react";

interface PharmacyModalProps {
  pharmacy: Pharmacy | null;
  onClose: () => void;
}

export function PharmacyModal({ pharmacy, onClose }: PharmacyModalProps) {
  return (
    <AnimatePresence>
      {pharmacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-card w-full max-w-4xl rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row h-full max-h-[800px] text-secondary"
          >
            <button 
              onClick={onClose}
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
                    <p className="text-xs font-mono">{pharmacy.region}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
              <div className="mb-8">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${pharmacy.onDuty ? 'bg-primary/10 text-primary' : 'bg-secondary/5 opacity-50'}`}>
                  {pharmacy.onDuty ? 'De garde actuellement' : 'Fermé / Non garde'}
                </span>
                <h2 className="text-3xl font-bold mb-2">{pharmacy.name}</h2>
                <p className="opacity-50 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {pharmacy.neighborhood}, {pharmacy.region}
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
                      <p className="font-bold">{pharmacy.is_24h ? "Ouvert 24h/24 et 7j/7" : "De garde (Période limitée)"}</p>
                      {pharmacy.start_date && (
                        <p className="text-xs opacity-50">Du {pharmacy.start_date} au {pharmacy.end_date}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] opacity-40 uppercase font-black tracking-widest">Contact Direct</p>
                      <p className="font-bold leading-none">{pharmacy.phone}</p>
                    </div>
                  </div>
                </div>

                {pharmacy.group_name && (
                  <div>
                    <h4 className="font-bold mb-3">Groupe de Garde</h4>
                    <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {pharmacy.group_name}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-12 flex gap-4">
                <a 
                  href={`tel:${pharmacy.phone.split('/')[0].trim()}`}
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
  );
}
