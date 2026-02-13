"use client";

import { Pharmacy } from "@/app/lib/data";
import { motion } from "framer-motion";
import { Clock, HeartPulse, MapPin, Navigation, Phone } from "lucide-react";

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  index: number;
  pageSize: number;
  onClick: (pharmacy: Pharmacy) => void;
}

export function PharmacyCard({ pharmacy, index, pageSize, onClick }: PharmacyCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: (index % pageSize) * 0.05 }}
      className="group bg-white dark:bg-card rounded-[2rem] border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer shadow-sm"
      onClick={() => onClick(pharmacy)}
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
  );
}
