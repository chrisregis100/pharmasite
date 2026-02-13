"use client";

import { Pharmacy } from "@/app/lib/data";
import { AnimatePresence } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { PharmacyCard } from "./PharmacyCard";

interface PharmacyListProps {
  pharmacies: Pharmacy[];
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => void;
  isMobile: boolean;
  onPharmacyClick: (pharmacy: Pharmacy) => void;
  onReset: () => void;
  pageSize: number;
}

export function PharmacyList({
  pharmacies,
  loading,
  hasMore,
  loadingMore,
  loadMore,
  isMobile,
  onPharmacyClick,
  onReset,
  pageSize
}: PharmacyListProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && isMobile) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, isMobile, loadMore]);

  if (loading && pharmacies.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-background text-secondary">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Pharmacies à proximité</h2>
            <p className="opacity-50">Découvrez les pharmacies disponibles autour de vous actuellement.</p>
          </div>
          <div className="opacity-30 font-medium">
            {loading ? "Chargement..." : `${pharmacies.length} résultats affichés`}
          </div>
        </div>

        {pharmacies.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 opacity-20" />
            </div>
            <h3 className="text-2xl font-bold">Aucune pharmacie trouvée</h3>
            <p className="opacity-50 max-w-md mx-auto mt-2">Nous n'avons trouvé aucune pharmacie correspondant à vos critères de recherche. Essayez d'ajuster vos filtres.</p>
            <button 
              onClick={onReset}
              className="mt-8 text-primary font-bold hover:underline"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {pharmacies.map((pharmacy, index) => (
                  <PharmacyCard 
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    index={index}
                    pageSize={pageSize}
                    onClick={onPharmacyClick}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div ref={observerTarget} className="w-full py-12 flex flex-col items-center justify-center gap-6">
              {loadingMore ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm opacity-50 font-medium">Chargement des pharmacies suivantes...</p>
                </div>
              ) : (
                <>
                  {!isMobile && hasMore && (
                    <button 
                      onClick={loadMore}
                      className="group relative bg-white dark:bg-card border border-border px-10 py-4 rounded-2xl font-bold text-secondary hover:text-primary transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 flex items-center gap-3 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative z-10">Voir plus de pharmacies</span>
                      <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                  
                  {!hasMore && (
                    <p className="text-sm opacity-30 font-medium italic">Toutes les pharmacies ont été chargées.</p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
