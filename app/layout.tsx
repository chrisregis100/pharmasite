import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PharmaBénin | Moteur de recherche des pharmacies de garde",
  description: "Trouvez rapidement la pharmacie de garde la plus proche au Bénin. Localisation, horaires et services de toutes les pharmacies du territoire.",
  keywords: ["pharmacie de garde", "Bénin", "santé", "Cotonou", "Porto-Novo", "médicaments", "recherche pharmacie"],
  openGraph: {
    title: "PharmaBénin | Votre santé, notre priorité",
    description: "Recherchez toutes les pharmacies du Bénin en un clic.",
    type: "website",
    locale: "fr_BJ",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <footer className="py-8 bg-secondary text-white/70 text-sm border-t border-white/10 mt-auto">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} PharmaBénin. Tous droits réservés.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-primary transition-colors">À propos</a>
                <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
