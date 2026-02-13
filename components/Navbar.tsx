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
      <nav className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-white/40">
        <a href="/" className="hover:text-primary transition-colors text-white">Accueil</a>
        <a href="/admin" className="hover:text-primary transition-colors">Admin</a>
        <a href="#" className="hover:text-primary transition-colors">Urgences</a>
      </nav>
      <button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-5 py-2 rounded-full transition-all flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" />
        Zone Membre
      </button>
    </nav>
  );
}
