"use client";

import { HeartPulse, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="mb-16">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <HeartPulse className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Pharma<span className="text-primary">Bénin</span></span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-white/40">
            <a href="/" className="hover:text-primary transition-colors text-white">Accueil</a>
            {/* <a href="/admin" className="hover:text-primary transition-colors">Admin</a> */}
            <a href="#" className="hover:text-primary transition-colors">Urgences</a>
          </nav>
          <button onClick={()=> router.push("/admin")} className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-5 py-2 rounded-full transition-all flex items-center gap-2">
            Connexion
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-secondary/95 backdrop-blur-lg border-b border-white/10 p-6 z-50 animate-in fade-in slide-in-from-top-5">
          <nav className="flex flex-col gap-6 text-center">
            <a href="/" className="text-white font-bold text-lg hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Accueil</a>
            <a href="#" className="text-white/60 font-bold text-lg hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Urgences</a>
            <button 
              onClick={() => {
                router.push("/admin");
                setIsMenuOpen(false);
              }} 
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all w-full"
            >
              Connexion
            </button>
          </nav>
        </div>
      )}
    </nav>
  );
}
