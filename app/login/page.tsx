"use client";

import { supabase } from "@/app/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Identifiants invalides ou erreur de connexion.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <div className="container mx-auto px-6 py-8">
        <Navbar />
      </div>

      <div className="flex-grow flex items-center justify-center p-6 pb-24">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-medical/10 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-2">Espace Admin</h1>
              <p className="text-white/40">Connectez-vous pour gérer les pharmacies de garde au Bénin.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-white/40 tracking-widest ml-4">Email Professionnel</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@pharmabenin.bj"
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-white placeholder:text-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-white/40 tracking-widest ml-4">Mot de passe</label>
                <div className="relative">
                  <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-white placeholder:text-white/10"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-bold text-center">
                  {error}
                </div>
              )}

              <button 
                disabled={loading}
                type="submit"
                className="w-full bg-primary hover:bg-emerald-400 disabled:bg-primary/50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <p className="text-center mt-8 text-white/20 text-xs font-medium">
            &copy; 2026 PharmaBénin - Accès sécurisé réservé aux administrateurs.
          </p>
        </div>
      </div>
    </div>
  );
}
