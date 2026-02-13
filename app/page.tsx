"use client";

import { EmergencySection } from "@/components/EmergencySection";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { PharmacyList } from "@/components/PharmacyList";
import { PharmacyModal } from "@/components/PharmacyModal";
import { useCallback, useEffect, useState } from "react";
import { getAllCities, getAllRegions, getPharmacies, Pharmacy } from "./lib/data";

export default function Home() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Toutes les régions");
  const [selectedCity, setSelectedCity] = useState("Toutes les villes");
  const [onlyOnDuty, setOnlyOnDuty] = useState(false);
  const [regions, setRegions] = useState<string[]>(["Toutes les régions"]);
  const [cities, setCities] = useState<string[]>(["Toutes les villes"]);
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

  // Charger toutes les régions au montage
  useEffect(() => {
    async function fetchFilterData() {
      const allRegions = await getAllRegions();
      setRegions(["Toutes les régions", ...allRegions]);
    }
    fetchFilterData();
  }, []);

  // Mettre à jour les villes quand la région change
  useEffect(() => {
    async function fetchCities() {
      const allCities = await getAllCities(selectedRegion === "Toutes les régions" ? undefined : selectedRegion);
      setCities(["Toutes les villes", ...allCities]);
      setSelectedCity("Toutes les villes"); // Reset city when region changes
    }
    fetchCities();
  }, [selectedRegion]);

  // Chargement des pharmacies avec filtres côté serveur
  const fetchPharmacies = useCallback(async (pageNum: number, isMore: boolean = false) => {
    if (isMore) setLoadingMore(true);
    else setLoading(true);

    const data = await getPharmacies(pageNum, PAGE_SIZE, {
      searchTerm,
      region: selectedRegion === "Toutes les régions" ? undefined : selectedRegion,
      city: selectedCity === "Toutes les villes" ? undefined : selectedCity,
      onlyOnDuty
    });

    if (isMore) {
      setPharmacies(prev => [...prev, ...data]);
      setLoadingMore(false);
    } else {
      setPharmacies(data);
      setLoading(false);
    }
    
    setHasMore(data.length === PAGE_SIZE);
    setPage(pageNum);
  }, [searchTerm, selectedRegion, selectedCity, onlyOnDuty]);

  // Recharger quand les filtres changent
  useEffect(() => {
    fetchPharmacies(0);
  }, [selectedRegion, selectedCity, onlyOnDuty]);

  // Fonction pour déclencher la recherche textuelle manuellement ou via debouncing
  const handleSearch = () => {
    fetchPharmacies(0);
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchPharmacies(page + 1, true);
  };

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
        pharmacies={pharmacies}
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
