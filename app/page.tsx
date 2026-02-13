"use client";

import { EmergencySection } from "@/components/EmergencySection";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { PharmacyList } from "@/components/PharmacyList";
import { PharmacyModal } from "@/components/PharmacyModal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getPharmacies, Pharmacy } from "./lib/data";

export default function Home() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Toutes les régions");
  const [selectedCity, setSelectedCity] = useState("Toutes les villes");
  const [onlyOnDuty, setOnlyOnDuty] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const PAGE_SIZE = 6;

  // Détection du mode mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Chargement initial ou changement de filtres (région, ville, garde)
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      setPage(0);
      const data = await getPharmacies(0, PAGE_SIZE);
      setPharmacies(data);
      setHasMore(data.length === PAGE_SIZE);
      setLoading(false);
    }
    loadInitialData();
  }, [selectedRegion, selectedCity, onlyOnDuty]);

  // Fonction pour charger la page suivante
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    const newData = await getPharmacies(nextPage, PAGE_SIZE);
    
    if (newData.length < PAGE_SIZE) {
      setHasMore(false);
    }
    
    setPharmacies(prev => [...prev, ...newData]);
    setPage(nextPage);
    setLoadingMore(false);
  }, [page, hasMore, loadingMore]);

  const regions = useMemo(() => 
    ["Toutes les régions", ...Array.from(new Set(pharmacies.map(p => p.region)))],
    [pharmacies]
  );

  const cities = useMemo(() => {
    if (selectedRegion === "Toutes les régions") {
      return ["Toutes les villes"];
    }
    const regionCities = pharmacies
      .filter(p => p.region === selectedRegion)
      .map(p => p.city)
      .filter(Boolean);
    return ["Toutes les villes", ...Array.from(new Set(regionCities))];
  }, [pharmacies, selectedRegion]);

  const filteredBySearch = useMemo(() => {
    return pharmacies.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (p.neighborhood && p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (p.city && p.city.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRegion = selectedRegion === "Toutes les régions" || p.region === selectedRegion;
      const matchesCity = selectedCity === "Toutes les villes" || p.city === selectedCity;
      const matchesDuty = !onlyOnDuty || p.onDuty;
      return matchesSearch && matchesRegion && matchesCity && matchesDuty;
    });
  }, [searchTerm, pharmacies, selectedRegion, selectedCity, onlyOnDuty]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedRegion("Toutes les régions");
    setSelectedCity("Toutes les villes");
    setOnlyOnDuty(false);
  };

  return (
    <div className="min-h-screen">
      <header className="relative bg-secondary overflow-hidden">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-medical/20 rounded-full blur-3xl opacity-50" />
        
        <div className="container mx-auto px-6 py-8">
          <Navbar />
          <Hero 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            regions={regions}
            cities={cities}
            onlyOnDuty={onlyOnDuty}
            setOnlyOnDuty={setOnlyOnDuty}
          />
        </div>
      </header>

      <PharmacyList 
        pharmacies={filteredBySearch}
        loading={loading}
        hasMore={hasMore}
        loadingMore={loadingMore}
        loadMore={loadMore}
        isMobile={isMobile}
        onPharmacyClick={setSelectedPharmacy}
        onReset={handleReset}
        pageSize={PAGE_SIZE}
      />

      <HowItWorks />
      
      <EmergencySection />

      <PharmacyModal 
        pharmacy={selectedPharmacy}
        onClose={() => setSelectedPharmacy(null)}
      />
    </div>
  );
}
