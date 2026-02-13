"use client";

import { MapPin, Search, ShieldCheck } from "lucide-react";

export function HowItWorks() {
  const steps = [
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
  ];

  return (
    <section className="py-24 bg-secondary/5 text-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, Rapide & Efficace</h2>
          <p className="opacity-50">Trouver vos médicaments n'a jamais été aussi facile grâce à nos services intégrés.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
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
  );
}
