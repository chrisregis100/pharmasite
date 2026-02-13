"use client";

import { HeartPulse, ShieldCheck } from "lucide-react";

export function Navbar() {
  return (
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
  );
}
