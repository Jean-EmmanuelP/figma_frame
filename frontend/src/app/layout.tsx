import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Figma Frame Extractor",
  description: "Une interface minimaliste pour extraire et télécharger les frames de vos fichiers Figma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} dark`}>
      <body className="font-inter antialiased">
        <ReduxProvider>
          <div className="min-h-screen bg-[#0A0A0A] text-[#EAEAEA]">
            {children}
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
