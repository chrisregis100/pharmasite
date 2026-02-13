"use client";

import { Phone } from "lucide-react";

export function EmergencySection() {
  return (
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
  );
}
